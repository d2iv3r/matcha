"""Profile likes table data access model."""

from __future__ import annotations

from typing import Any, Dict

from app.db.queries.profile_likes_queries import (
    RECORD_PROFILE_LIKE,
    GET_PROFILE_LIKES_COUNT,
    GET_PROFILE_RECENT_LIKES,
)
from app.models.base_model import BaseModel


class ProfileLikesModel(BaseModel):
    """Model for `profile_likes` table operations."""

    @classmethod
    def record_like(cls, profile_user_id: int, liker_user_id: int) -> bool:
        """Record a profile like. Returns True if newly recorded, False if already existed."""
        try:
            cls.db_manager().execute(
                RECORD_PROFILE_LIKE,
                (profile_user_id, liker_user_id),
            )
            return True
        except Exception:
            return False

    @classmethod
    def get_likes_count(cls, profile_user_id: int) -> int:
        """Get the total number of likes for a profile."""
        result = cls.db_manager().fetch_one(GET_PROFILE_LIKES_COUNT, (profile_user_id,))
        return result.get("count", 0) if result else 0

    @classmethod
    def get_recent_likes(cls, profile_user_id: int, limit: int = 10) -> list[Dict[str, Any]]:
        """Get recent profile likers with information."""
        return cls.db_manager().fetch_all(GET_PROFILE_RECENT_LIKES, (profile_user_id, limit))
