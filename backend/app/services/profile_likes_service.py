"""Profile likes business logic."""

from __future__ import annotations

from typing import Any, Dict

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
        ProfileLikesModel.record_like(profile_user_id, liker_user_id)

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
    def get_profile_likers(user_id: int, limit: int = 10) -> list[Dict[str, Any]]:
        """Get list of recent users who liked the profile.
        
        Args:
            user_id: ID of the profile owner
            limit: Maximum number of likers to return (default 10)
            
        Returns:
            List of liker dictionaries including username, age, location, and avatar
        """
        likers = ProfileLikesModel.get_recent_likes(user_id, limit=limit)
        result = []
        for liker in likers:
            result.append({
                "liker_username": liker.get("liker_username"),
                "age": liker.get("age"),
                "location": liker.get("location"),
                "avatar": liker.get("avatar"),
            })
        return result
