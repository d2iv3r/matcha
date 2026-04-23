"""Controller for profile likes operations."""

from __future__ import print_function
from flask import request
from flask_jwt_extended import get_jwt_identity

from app.services.profile_likes_service import ProfileLikesService
from app.services.profile_service import ProfileService
from app.utils.app_error import BadRequestError, NotFoundError
from app.utils.response import success


class ProfileLikesController:
    """Controller for profile likes endpoints."""

    INVALID_PROFILE_USER_ID_ERROR = "Invalid profile_user_id"

    @staticmethod
    def record_profile_like(username: str | None = None):
        """Record a like for a user's profile."""
        liker_id = int(get_jwt_identity())

        if not username:
            raise BadRequestError("Username is required in the URL path")
        profile = ProfileService.get_profile_by_username(username)
        if not profile:
            raise NotFoundError("Profile", username)
        if profile.user_id == liker_id:
            raise BadRequestError("Cannot record self-likes")

        ProfileLikesService.record_profile_like(profile.user_id, liker_id)
        return success(message="Profile like recorded", data={})

    @staticmethod
    def remove_profile_like(username: str):
        """Remove a like for a user's profile."""
        liker_id = int(get_jwt_identity())

        if not username:
            raise BadRequestError("Username is required in the URL path")
        profile = ProfileService.get_profile_by_username(username)
        if not profile:
            raise NotFoundError("Profile", username)
        if profile.user_id == liker_id:
            raise BadRequestError("Cannot remove self-likes")

        ProfileLikesService.remove_profile_like(profile.user_id, liker_id)
        return success(message="Profile like removed", data={})

    @staticmethod
    def get_profile_likers():
        """Get the list of users who liked a profile."""
        profile_user_id = int(get_jwt_identity())

        limit = request.args.get("limit", 10, type=int)
        if limit < 1 or limit > 100:
            limit = 10

        likers_data = ProfileLikesService.get_profile_likers(profile_user_id, limit=limit)
        data = {}
        for liker in likers_data:
            is_match = ProfileLikesService.is_mutual_like(profile_user_id, liker.get("id"))
            liker["is_match"] = is_match
        data["likers"] = likers_data
        data["count"] = len(likers_data)

        return success(
            message="Profile likers retrieved successfully",
            data=data
        )

    @staticmethod
    def get_like_count():
        """Get the total like count for a user's profile."""
        profile_user_id = int(get_jwt_identity())
        like_count = ProfileLikesService.get_profile_like_count(profile_user_id)

        return success({"like_count": like_count}, 200)
