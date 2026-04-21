"""Controller for profile views operations."""

from flask import request
from flask_jwt_extended import get_jwt_identity

from app.services.profile_views_service import ProfileViewsService
from app.utils.app_error import BadRequestError, NotFoundError
from app.utils.response import success


class ProfileViewsController:
    """Controller for profile view endpoints."""

    INVALID_PROFILE_USER_ID_ERROR = "Invalid profile_user_id"

    @staticmethod
    def record_profile_viewer(username: str | None = None):
        """Record a view of a user's profile."""
        viewer_id = int(get_jwt_identity())

        if username:
            from app.services.profile_service import ProfileService

            user = ProfileService.get_user_by_username(username)
            if not user:
                raise NotFoundError("User", username)
            profile_user_id = user["id"] if isinstance(user, dict) else user.id
        else:
            payload = request.get_json(silent=True) or {}
            viewed_user_id = payload.get("viewed_user_id")
            if viewed_user_id is None:
                raise BadRequestError("viewed_user_id is required")
            try:
                profile_user_id = int(viewed_user_id)
            except (TypeError, ValueError) as exc:
                raise BadRequestError(ProfileViewsController.INVALID_PROFILE_USER_ID_ERROR) from exc

        if viewer_id == profile_user_id:
            raise BadRequestError("Cannot record self-views")
        ProfileViewsService.record_profile_view(profile_user_id, viewer_id)

        return success({"message": "Profile view recorded"}, 200)

    @staticmethod
    def get_profile_viewers():
        """Get the list of users who viewed a profile."""
        profile_user_id = int(get_jwt_identity())

        limit = request.args.get("limit", 10, type=int)
        if limit < 1 or limit > 100:
            limit = 10

        viewers = ProfileViewsService.get_profile_viewers(profile_user_id, limit=limit)

        return success({
            "viewers": [viewer.model_dump(exclude_none=True) if hasattr(viewer, "model_dump") else viewer for viewer in viewers],
            "count": len(viewers),
        }, 200)

    @staticmethod
    def get_view_count():
        """Get the total view count for a user's profile."""
        profile_user_id = int(get_jwt_identity())
        view_count = ProfileViewsService.get_profile_view_count(profile_user_id)

        return success({"view_count": view_count}, 200)
