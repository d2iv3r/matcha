"""Profile views table data access model."""

from __future__ import annotations

from typing import Any, Dict, Optional

from app.db.queries.profile_views_queries import (
    RECORD_PROFILE_VIEW,
    GET_PROFILE_VIEWS_COUNT,
    GET_PROFILE_RECENT_VIEWS,
)
from app.models.base_model import BaseModel


class ProfileViewsModel(BaseModel):
    """Model for `profile_views` table operations."""

    profile_user_id: int | None = None
    viewer_user_id: int | None = None
    viewer_username: str | None = None
    age: int | None = None
    location: str | None = None
    avatar: str | None = None

    def __init__(self, **kwargs):
        for field_name in self.__class__.__annotations__:
            setattr(self, field_name, kwargs.get(field_name))

    @classmethod
    def _from_row(cls, row: Dict[str, Any] | None) -> "ProfileViewsModel" | None:
        if not row:
            return None
        return cls(**row)

    @classmethod
    def _from_rows(cls, rows: list[Dict[str, Any]]) -> list["ProfileViewsModel"]:
        return [cls(**row) for row in rows]

    @classmethod
    def record_view(cls, profile_user_id: int, viewer_user_id: int) -> bool:
        """Record a profile view. Returns True if newly recorded, False if already existed."""
        try:
            cls.db_manager().execute(
                RECORD_PROFILE_VIEW,
                (profile_user_id, viewer_user_id),
            )
            return True
        except Exception:
            return False

    @classmethod
    def get_views_count(cls, profile_user_id: int) -> int:
        """Get the total number of views for a profile."""
        result = cls.db_manager().fetch_one(GET_PROFILE_VIEWS_COUNT, (profile_user_id,))
        return result.get("count", 0) if result else 0

    @classmethod
    def get_recent_views(cls, profile_user_id: int, limit: int = 10) -> list["ProfileViewsModel"]:
        """Get recent profile views with viewer information."""
        return cls._from_rows(cls.db_manager().fetch_all(GET_PROFILE_RECENT_VIEWS, (profile_user_id, limit)))
