"""Notifications table data access model."""

from __future__ import annotations

from typing import Any, Dict

from app.db.queries.notifications_queries import (
    GET_USER_NOTIFICATIONS,
    MARK_NOTIFICATION_READ,
)
from app.models.base_model import BaseModel


class NotificationModel(BaseModel):
    """Model for `notifications` table operations."""

    id: int | None = None
    user_id: int | None = None
    type: str | None = None
    message: str | None = None
    data: Any | None = None
    is_read: bool = False
    created_at: Any | None = None

    def __init__(self, **kwargs):
        for field_name in self.__class__.__annotations__:
            setattr(self, field_name, kwargs.get(field_name))

    @classmethod
    def get_by_user_id(
        cls,
        user_id: int,
        limit: int = 20,
        offset: int = 0,
    ) -> list["NotificationModel"]:
        rows = cls.db_manager().fetch_all(
            GET_USER_NOTIFICATIONS,
            (user_id, limit, offset),
        )
        return cls.from_rows(rows)

    @classmethod
    def mark_read(cls, user_id: int, notification_id: int) -> "NotificationModel" | None:
        row = cls.db_manager().execute_returning(
            MARK_NOTIFICATION_READ,
            (notification_id, user_id),
        )
        return cls.from_row(row)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "type": self.type,
            "message": self.message,
            "data": self.data,
            "is_read": self.is_read,
            "created_at": self.created_at,
        }
