"""Controller for profile-related operations."""

import json

from flask import jsonify, request, g
from flask_jwt_extended import get_jwt_identity
from pydantic import ValidationError

from app.schemas.profile_schemas import UpdateProfileSchema
from app.services.profile_service import ProfileService
from app.utils.app_error import AppError


class ProfileController:
    """Controller for profile endpoints."""

    @staticmethod
    def _parse_list_field(value):
        if value is None:
            return None

        if isinstance(value, list):
            return value

        if isinstance(value, str):
            text = value.strip()
            if not text:
                return []

            try:
                parsed = json.loads(text)
                if isinstance(parsed, list):
                    return parsed
            except json.JSONDecodeError:
                pass

            return [item.strip() for item in text.split(",") if item.strip()]

        return [value]

    @staticmethod
    def complete_profile():
        """Update profile fields for authenticated verified user."""
        try:
            # Get user_id from context if available (set by middleware), otherwise from JWT
            if hasattr(g, 'current_user') and g.current_user:
                user_id = g.current_user['id']
            else:
                # Fallback to JWT for cases where middleware wasn't applied (e.g., tests)
                user_id = int(get_jwt_identity())
            
            raw_payload = request.get_json(silent=True)
            if raw_payload is None:
                raw_payload = request.form.to_dict(flat=True)

            if raw_payload.get("interests") is not None:
                raw_payload["interests"] = ProfileController._parse_list_field(raw_payload.get("interests"))

            avatar = request.files.get("avatar")
            pictures = request.files.getlist("pictures")

            raw_payload["avatar"] = avatar
            raw_payload["pictures"] = pictures

            payload = UpdateProfileSchema.model_validate(raw_payload)

            profile = ProfileService.update_profile(
                user_id,
                gender=payload.gender,
                date_of_birth=payload.date_of_birth,
                location=payload.location,
                bio=payload.bio,
                interests=payload.interests,
                avatar=payload.avatar,
                pictures=payload.pictures,
            )
            return jsonify({"success": True, "message": "Profile updated successfully", "profile": profile}), 200
        except AppError as e:
            error_payload = {"success": False, "error": e.message}
            if getattr(e, "details", None) is not None:
                error_payload["errors"] = e.details
            return jsonify(error_payload), e.status_code
        except ValidationError as e:
            return jsonify({"success": False, "errors": e.errors()}), 400
        except Exception as e:
            return jsonify({"success": False, "errors": [str(e)]}), 500

    @staticmethod
    def get_profile():
        try:
            # Get user_id from context if available (set by middleware), otherwise from JWT
            if hasattr(g, 'current_user') and g.current_user:
                user_id = g.current_user['id']
            else:
                # Fallback to JWT for cases where middleware wasn't applied (e.g., tests)
                user_id = int(get_jwt_identity())
            
            payload = ProfileService.get_profile_by_user_id(user_id)
            return jsonify(payload), 200
        except AppError as e:
            return jsonify({"success": False, "error": e.message}), e.status_code
