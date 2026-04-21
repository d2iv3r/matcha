"""Profile likes table data access model."""

from __future__ import annotations

from typing import Any, Dict

from app.db.queries.profile_likes_queries import (
    RECORD_PROFILE_LIKE,
    GET_PROFILE_LIKES_COUNT,
    GET_PROFILE_RECENT_LIKES,
    HAS_PROFILE_LIKE,
)
from app.models.base_model import BaseModel


class ProfileLikesModel(BaseModel):
    """Model for `profile_likes` table operations."""

    profile_user_id: int | None = None
    liker_user_id: int | None = None
    liker_username: str | None = None
    age: int | None = None
    location: str | None = None
    avatar: str | None = None
    has_like: bool | None = None

    def __init__(self, **kwargs):
        for field_name in self.__class__.__annotations__:
            setattr(self, field_name, kwargs.get(field_name))

    @classmethod
    def _from_row(cls, row: Dict[str, Any] | None) -> "ProfileLikesModel" | None:
        if not row:
            return None
        return cls(**row)

    @classmethod
    def _from_rows(cls, rows: list[Dict[str, Any]]) -> list["ProfileLikesModel"]:
        return [cls(**row) for row in rows]

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
    def get_recent_likes(cls, profile_user_id: int, limit: int = 10) -> list["ProfileLikesModel"]:
        """Get recent profile likers with information."""
        return cls._from_rows(cls.db_manager().fetch_all(GET_PROFILE_RECENT_LIKES, (profile_user_id, limit)))

    @classmethod
    def has_like(cls, profile_user_id: int, liker_user_id: int) -> bool:
        """Return True if liker_user_id already liked profile_user_id."""
        result = cls.db_manager().fetch_one(HAS_PROFILE_LIKE, (profile_user_id, liker_user_id))
        return bool(result and result.get("has_like", False))
