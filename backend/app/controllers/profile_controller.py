"""Controller for profile-related operations."""

from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity
from pydantic import ValidationError

from app.schemas.profile_schemas import UpdateProfileSchema
from app.services.profile_service import ProfileService
from app.utils.app_error import AppError


class ProfileController:
    """Controller for profile endpoints."""

    @staticmethod
    def update_profile():
        """Update profile fields for authenticated verified user."""
        try:
            user_id = int(get_jwt_identity())
            payload = UpdateProfileSchema.model_validate(request.get_json())

            profile = ProfileService.update_profile(
                user_id,
                gender=payload.gender,
                age=payload.age,
                date_of_birth=payload.date_of_birth,
                location=payload.location,
                interests=payload.interests,
                avatar_url=payload.avatar_url,
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
            user_id = int(get_jwt_identity())
            payload = ProfileService.get_profile_by_user_id(user_id)
            return jsonify(payload), 200
        except AppError as e:
            return jsonify({"success": False, "error": e.message}), e.status_code
