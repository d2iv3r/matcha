"""Profile views business logic."""

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
        
        from app.services.notifications_service import NotificationsService
        from app.models.profile_model import ProfileModel
        
        actor_profile = ProfileModel.get_my_profile_by_user_id(viewer_user_id)
        actor_data = {
            "username": actor_profile.username if actor_profile else "Unknown",
            "avatar": actor_profile.avatar if actor_profile else None
        }

        from app.models.notification_model import NotificationModel
        if not NotificationModel.has_unread_notification(user_id=profile_user_id, actor_id=viewer_user_id, notification_type="VIEW"):
            NotificationsService.send_notification(
                user_id=profile_user_id,
                notification_type="VIEW",
                actor_id=viewer_user_id,
                message=f"{actor_data['username']} viewed your profile",
                data=actor_data,
                entity_id=viewer_user_id
            )

        from app.services.profile_service import ProfileService
        ProfileService.update_profile_rating(profile_user_id)

    @staticmethod
    def get_profile_view_count(user_id: int) -> int:
        """Get the total number of times a user's profile has been viewed.
        
        Args:
            user_id: ID of the profile owner
            
        Returns:
            Integer count of profile views
        """
        return ProfileViewsModel.get_views_count(user_id)

    @staticmethod
    def get_profile_viewers(user_id: int, limit: int = 10) -> list[dict]:
        """Get list of recent users who viewed the profile.
        
        Args:
            user_id: ID of the profile owner
            limit: Maximum number of viewers to return (default 10)
            
        Returns:
            List of viewer dictionaries with username, age, location, and avatar
        """
        viewers = ProfileViewsModel.get_recent_views(user_id, limit=limit)
        if not viewers:
            return []
        data = []
        for viewer in viewers:
            data.append(viewer.to_dict())
        return data
