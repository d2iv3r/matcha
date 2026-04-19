"""Controller for profile views operations."""

from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity

from app.services.profile_views_service import ProfileViewsService
from app.utils.app_error import AppError


class ProfileViewsController:
    """Controller for profile view endpoints."""

    @staticmethod
    def record_profile_viewer(username: str | None = None):
        """Record a view of a user's profile."""
        try:
            viewer_id = int(get_jwt_identity())

            if username:
                from app.services.profile_service import ProfileService

                user = ProfileService.get_user_by_username(username)
                if not user:
                    return jsonify({"success": False, "error": "User not found"}), 404
                profile_user_id = user["id"]
            else:
                payload = request.get_json(silent=True) or {}
                viewed_user_id = payload.get("viewed_user_id")
                if viewed_user_id is None:
                    return jsonify({"success": False, "error": "viewed_user_id is required"}), 400
                profile_user_id = int(viewed_user_id)

            if viewer_id == profile_user_id:
                return (
                    jsonify({"success": False, "error": "Cannot record self-views"}),
                    400,
                )
            ProfileViewsService.record_profile_view(profile_user_id, viewer_id)
            
            return (
                jsonify({"success": True, "message": "Profile view recorded"}),
                200,
            )
        except ValueError as e:
            return jsonify({"success": False, "error": "Invalid profile_user_id"}), 400
        except AppError as e:
            return jsonify({"success": False, "error": e.message}), e.status_code
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

    @staticmethod
    def get_profile_viewers():
        """Get the list of users who viewed a profile."""
        try:
            profile_user_id = int(get_jwt_identity())
            
            limit = request.args.get("limit", 10, type=int)
            if limit < 1 or limit > 100:
                limit = 10
            
            viewers = ProfileViewsService.get_profile_viewers(profile_user_id, limit=limit)
            
            return (
                jsonify({
                    "success": True,
                    "viewers": viewers,
                    "count": len(viewers),
                }),
                200,
            )
        except ValueError as e:
            return jsonify({"success": False, "error": "Invalid profile_user_id"}), 400
        except AppError as e:
            return jsonify({"success": False, "error": e.message}), e.status_code
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

    @staticmethod
    def get_view_count():
        """Get the total view count for a user's profile."""
        try:
            profile_user_id = int(get_jwt_identity())
            
            view_count = ProfileViewsService.get_profile_view_count(profile_user_id)
            
            return (
                jsonify({
                    "success": True,
                    "view_count": view_count,
                }),
                200,
            )
        except ValueError as e:
            return jsonify({"success": False, "error": "Invalid profile_user_id"}), 400
        except AppError as e:
            return jsonify({"success": False, "error": e.message}), e.status_code
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500
