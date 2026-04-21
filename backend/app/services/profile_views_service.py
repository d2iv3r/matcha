"""Profile views business logic."""

from __future__ import annotations

from app.models.profile_views_model import ProfileViewsModel


class ProfileViewsService:
    """Service class for profile view-related operations."""

    @staticmethod
    def record_profile_view(profile_user_id: int, viewer_user_id: int) -> None:
        """Record that a user viewed a profile.
        
        Args:
            profile_user_id: ID of the profile being viewed
            viewer_user_id: ID of the user viewing the profile
        """
        ProfileViewsModel.record_view(profile_user_id, viewer_user_id)

    @staticmethod
    def get_profile_view_count(user_id: int) -> int:
        """Get the total number of times a user's profile has been viewed.
        
        Args:
            user_id: ID of the profile owner
            
        Returns:
            Integer count of profile views
        """
        return ProfileViewsModel.get_views_count(user_id)

    # @staticmethod
    # def get_profile_viewers(user_id: int, limit: int = 10) -> list[ProfileViewerSchema]:
    #     """Get list of recent users who viewed the profile.
        
    #     Args:
    #         user_id: ID of the profile owner
    #         limit: Maximum number of viewers to return (default 10)
            
    #     Returns:
    #         List of viewer dictionaries with username, age, location, and avatar
    #     """
    #     viewers = ProfileViewsModel.get_recent_views(user_id, limit=limit)
    #     result: list[ProfileViewerSchema] = []
    #     for viewer in viewers:
    #         result.append(
    #             ProfileViewerSchema(
    #                 viewer_username=viewer.viewer_username,
    #                 age=viewer.age,
    #                 location=viewer.location,
    #                 avatar=viewer.avatar,
    #             )
    #         )
    #     return result
