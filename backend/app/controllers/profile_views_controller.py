"""Controller for profile views operations."""

from flask import request
from flask_jwt_extended import get_jwt_identity

from app.services.profile_views_service import ProfileViewsService
from app.utils.response import success
from app.services.profile_likes_service import ProfileLikesService


class ProfileViewsController:
    """Controller for profile view endpoints."""

    @staticmethod
    def get_profile_viewers():
        """Get the list of users who viewed a profile."""
        profile_user_id = int(get_jwt_identity())

        limit = request.args.get("limit", 10, type=int)
        if limit < 1 or limit > 100:
            limit = 10
        viewers_data = ProfileViewsService.get_profile_viewers(profile_user_id, limit=limit)
        data = {}
        for viewer in viewers_data:
            viewer_id = viewer.get("viewer_id")
            if viewer_id:
                viewer["is_match"] = ProfileLikesService.is_mutual_like(profile_user_id, viewer_id)
                viewer["is_liked"] = ProfileLikesService.has_liked_profile(viewer_id, profile_user_id)
            else:
                viewer["is_match"] = False
                viewer["is_liked"] = False
        data["viewers"] = viewers_data
        data["count"] = len(viewers_data)

        return success(
            message="Profile viewers retrieved successfully",
            data=data
        )