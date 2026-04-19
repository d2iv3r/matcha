"""Controller for profile-related operations."""

import json

from flask import jsonify, request, g
from flask_jwt_extended import get_jwt_identity
from pydantic import ValidationError

from app.schemas.profile_schemas import UpdateProfileSchema
from app.services.profile_service import ProfileService
from app.services.profile_views_service import ProfileViewsService
from app.services.profile_likes_service import ProfileLikesService
from app.utils.app_error import AppError


class ProfileController:
    """Controller for profile endpoints."""

    @staticmethod
    def _normalize_rating(value):
        return ProfileService._normalize_rating(value)

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
            
            # Include view statistics for own profile
            view_count = ProfileViewsService.get_profile_view_count(user_id)
            recent_viewers = ProfileViewsService.get_profile_viewers(user_id, limit=5)
            
            payload["profile_views"] = {
                "total_views": view_count,
                "recent_viewers": recent_viewers,
            }
            
            # Include like statistics for own profile
            like_count = ProfileLikesService.get_profile_like_count(user_id)
            recent_likers = ProfileLikesService.get_profile_likers(user_id, limit=5)
            
            payload["profile_likes"] = {
                "total_likes": like_count,
                "recent_likers": recent_likers,
            }
            
            return jsonify(payload), 200
        except AppError as e:
            return jsonify({"success": False, "error": e.message}), e.status_code

    @staticmethod
    def get_profile_by_username(username: str):
        """Get a specific user's profile by username and record the view."""
        try:
            viewer_id = int(get_jwt_identity())
            user = ProfileService.get_user_by_username(username)
            if not user:
                return jsonify({"success": False, "error": "User not found"}), 404
            
            user_id = user["id"]
            if viewer_id != user_id:
                ProfileViewsService.record_profile_view(user_id, viewer_id)
            
            payload = ProfileService.get_profile_by_user_id(user_id)
            
            # Format the output specifically as requested
            user_data = payload.get("user", {})
            profile_data = payload.get("profile", {}) or {}
            
            result = {
                "username": user_data.get("username"),
                "first_name": user_data.get("first_name"),
                "last_name": user_data.get("last_name"),
                "age": profile_data.get("age"),
                "location": profile_data.get("location"),
                "rating": ProfileController._normalize_rating(profile_data.get("rating")),
                "bio": profile_data.get("bio"),
                "interests": profile_data.get("interests"),
                "avatar": profile_data.get("avatar"),
                "pictures": profile_data.get("pictures")
            }
            return jsonify(result), 200
        except AppError as e:
            return jsonify({"success": False, "error": e.message}), e.status_code
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

    @staticmethod
    def get_profile_by_user_id(user_id: int):
        """Get a specific user's profile and record the view."""
        try:
            # Get viewer_id from JWT
            viewer_id = int(get_jwt_identity())
            
            # Don't record self-views
            if viewer_id != user_id:
                ProfileViewsService.record_profile_view(user_id, viewer_id)
            
            payload = ProfileService.get_profile_by_user_id(user_id)
            return jsonify(payload), 200
        except AppError as e:
            return jsonify({"success": False, "error": e.message}), e.status_code
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

    @staticmethod
    def get_profiles_list():
        try:
            limit = int(request.args.get("limit", 20))
            offset = int(request.args.get("offset", 0))
            profiles = ProfileService.get_profiles_list(limit=limit, offset=offset)
            
            # Filter profiles to match the requested format {username, age, location, rating}
            filtered_profiles = []
            for p in profiles:
                filtered_profiles.append({
                    "username": p.get("username"),
                    "age": p.get("age"),
                    "location": p.get("location"),
                    "rating": ProfileController._normalize_rating(p.get("rating"))
                })
                
            return jsonify({"profiles": filtered_profiles, "count": len(filtered_profiles)}), 200
        except AppError as e:
            return jsonify({"success": False, "error": e.message}), e.status_code