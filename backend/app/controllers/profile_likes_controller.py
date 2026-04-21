"""Controller for profile likes operations."""

from flask import request
from flask_jwt_extended import get_jwt_identity

from app.services.profile_likes_service import ProfileLikesService
from app.utils.app_error import BadRequestError, NotFoundError
from app.utils.response import success


class ProfileLikesController:
    """Controller for profile likes endpoints."""

    INVALID_PROFILE_USER_ID_ERROR = "Invalid profile_user_id"

    @staticmethod
    def record_profile_like(username: str | None = None):
        """Record a like for a user's profile."""
        liker_id = int(get_jwt_identity())

        if username:
            from app.services.profile_service import ProfileService

            user = ProfileService.get_user_by_username(username)
            if not user:
                raise NotFoundError("User", username)
            profile_user_id = user["id"] if isinstance(user, dict) else user.id
        else:
            payload = request.get_json(silent=True) or {}
            liked_user_id = payload.get("liked_user_id")
            if liked_user_id is None:
                raise BadRequestError("liked_user_id is required")
            try:
                profile_user_id = int(liked_user_id)
            except (TypeError, ValueError) as exc:
                raise BadRequestError(ProfileLikesController.INVALID_PROFILE_USER_ID_ERROR) from exc

        if liker_id == profile_user_id:
            raise BadRequestError("Cannot record self-likes")

        ProfileLikesService.record_profile_like(profile_user_id, liker_id)
        return success({"message": "Profile like recorded"}, 200)

    @staticmethod
    def remove_profile_like(username: str):
        """Remove a like for a user's profile."""
        liker_id = int(get_jwt_identity())
        from app.services.profile_service import ProfileService

        user = ProfileService.get_user_by_username(username)
        if not user:
            raise NotFoundError("User", username)
        profile_user_id = user["id"] if isinstance(user, dict) else user.id

        if liker_id == profile_user_id:
            raise BadRequestError("Cannot remove self-likes")

        from app.services.profile_likes_service import ProfileLikesService
        return success({"message": "Profile like removed"}, 200)

    @staticmethod
    def get_profile_likers():
        """Get the list of users who liked a profile."""
        profile_user_id = int(get_jwt_identity())

        limit = request.args.get("limit", 10, type=int)
        if limit < 1 or limit > 100:
            limit = 10

        likers = ProfileLikesService.get_profile_likers(profile_user_id, limit=limit)

        return success({
            "likers": [liker.model_dump(exclude_none=True) if hasattr(liker, "model_dump") else liker for liker in likers],
            "count": len(likers),
        }, 200)

    @staticmethod
    def get_like_count():
        """Get the total like count for a user's profile."""
        profile_user_id = int(get_jwt_identity())
        like_count = ProfileLikesService.get_profile_like_count(profile_user_id)

        return success({"like_count": like_count}, 200)
