"""Profile likes business logic."""

from __future__ import annotations

from app.models.profile_likes_model import ProfileLikesModel


class ProfileLikesService:
    """Service class for profile likes-related operations."""

    @staticmethod
    def record_profile_like(profile_user_id: int, liker_user_id: int) -> None:
        """Record that a user liked a profile.
        
        Args:
            profile_user_id: ID of the profile being liked
            liker_user_id: ID of the user liking the profile
        """
        is_match_already = ProfileLikesService.has_liked_profile(liker_user_id, profile_user_id)
        ProfileLikesModel.record_like(profile_user_id, liker_user_id)
        
        from app.services.notifications_service import NotificationsService
        from app.models.profile_model import ProfileModel
        
        # Fetch actor info
        actor_profile = ProfileModel.get_my_profile_by_user_id(liker_user_id)
        actor_data = {
            "username": actor_profile.username if actor_profile else "Unknown",
            "avatar": actor_profile.avatar if actor_profile else None
        }

        if is_match_already:
            # Fetch target info for the mutual match notification
            target_profile = ProfileModel.get_my_profile_by_user_id(profile_user_id)
            target_data = {
                "username": target_profile.username if target_profile else "Unknown",
                "avatar": target_profile.avatar if target_profile else None
            }

            # Send MATCH notification to both users
            NotificationsService.send_notification(
                user_id=profile_user_id,
                notification_type="MATCH",
                actor_id=liker_user_id,
                message=f"You matched with {actor_data['username']}!",
                data=actor_data,
                entity_id=liker_user_id
            )
            NotificationsService.send_notification(
                user_id=liker_user_id,
                notification_type="MATCH",
                actor_id=profile_user_id,
                message=f"You matched with {target_data['username']}!",
                data=target_data,
                entity_id=profile_user_id
            )
        else:
            NotificationsService.send_notification(
                user_id=profile_user_id,
                notification_type="LIKE",
                actor_id=liker_user_id,
                message=f"{actor_data['username']} liked your profile",
                data=actor_data,
                entity_id=liker_user_id
            )

        from app.services.profile_service import ProfileService
        ProfileService.update_profile_rating(profile_user_id)

    @staticmethod
    def remove_profile_like(profile_user_id: int, liker_user_id: int) -> None:
        """Remove a like for a user's profile.
        
        Args:
            profile_user_id: ID of the profile being unliked
            liker_user_id: ID of the user unliking the profile
        """
        ProfileLikesModel.remove_like(profile_user_id, liker_user_id)
        
        from app.services.notifications_service import NotificationsService
        from app.models.profile_model import ProfileModel
        
        # Fetch actor info
        actor_profile = ProfileModel.get_my_profile_by_user_id(liker_user_id)
        actor_data = {
            "username": actor_profile.username if actor_profile else "Unknown",
            "avatar": actor_profile.avatar if actor_profile else None
        }

        NotificationsService.send_notification(
            user_id=profile_user_id,
            notification_type="UNLIKE",
            actor_id=liker_user_id,
            message=f"{actor_data['username']} unliked your profile",
            data=actor_data,
            entity_id=liker_user_id
        )

        from app.services.profile_service import ProfileService
        ProfileService.update_profile_rating(profile_user_id)

    @staticmethod
    def remove_mutual_likes(user1_id: int, user2_id: int) -> None:
        """Remove likes in both directions between two users.
        
        Args:
            user1_id: ID of the first user
            user2_id: ID of the second user
        """
        ProfileLikesModel.remove_mutual_likes(user1_id, user2_id)

    @staticmethod
    def get_profile_like_count(user_id: int) -> int:
        """Get the total number of times a user's profile has been liked.
        
        Args:
            user_id: ID of the profile owner
            
        Returns:
            Integer count of profile likes
        """
        return ProfileLikesModel.get_likes_count(user_id)

    @staticmethod
    def get_profile_likers(user_id: int, limit: int = 10) -> list[dict]:
        """Get list of recent users who liked the profile.
        
        Args:
            user_id: ID of the profile owner
            limit: Maximum number of likers to return (default 10)
            
        Returns:
            List of liker dictionaries including username, age, location, and avatar
        """
        likers = ProfileLikesModel.get_recent_likes(user_id, limit=limit)
        if not likers:
            return []
        data = []
        for liker in likers:
            data.append(liker.to_dict())
        return data

    @staticmethod
    def get_matches(user_id: int, limit: int = 10) -> list[dict]:
        """Get list of users who have a mutual match with the user.
        
        Args:
            user_id: ID of the user
            limit: Maximum number of matches to return (default 10)
            
        Returns:
            List of match dictionaries
        """
        matches = ProfileLikesModel.get_matches(user_id, limit=limit)
        if not matches:
            return []
        data = []
        for match in matches:
            data.append(match.to_dict())
        return data

    @staticmethod
    def has_liked_profile(profile_user_id: int, liker_user_id: int) -> bool:
        """Return True if liker_user_id has liked profile_user_id."""
        return ProfileLikesModel.has_like(profile_user_id, liker_user_id)

    @staticmethod
    def is_mutual_like(user_id: int, other_user_id: int) -> bool:
        """Return True if both users have liked each other's profile."""
        user_liked_other = ProfileLikesService.has_liked_profile(other_user_id, user_id)
        other_liked_user = ProfileLikesService.has_liked_profile(user_id, other_user_id)
        return user_liked_other and other_liked_user
