"""Notifications table data access model."""

from __future__ import annotations

import json
from typing import Any, Dict

from app.db.queries.notifications_queries import (
    CREATE_NOTIFICATION,
    GET_USER_NOTIFICATIONS,
    MARK_NOTIFICATION_READ,
    MARK_ALL_NOTIFICATIONS_READ,
    CHECK_UNREAD_MESSAGE_NOTIFICATION,
)
from app.models.base_model import BaseModel


class NotificationModel(BaseModel):
    """Model for `notifications` table operations."""

    id: int | None = None
    user_id: int | None = None
    actor_id: int | None = None
    type: str | None = None
    message: str | None = None
    data: Any | None = None
    entity_id: int | None = None
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
    def create(
        cls,
        user_id: int,
        notification_type: str,
        actor_id: int | None = None,
        message: str | None = None,
        data: Any | None = None,
        entity_id: int | None = None,
    ) -> "NotificationModel" | None:
        # Manually serialize data to JSON string to avoid psycopg2 adaptation issues
        json_data = json.dumps(data) if data is not None else None
        
        row = cls.db_manager().execute_returning(
            CREATE_NOTIFICATION,
            (user_id, actor_id, notification_type, message, json_data, entity_id),
        )
        return cls.from_row(row)

    @classmethod
    def mark_read(cls, user_id: int, notification_id: int) -> "NotificationModel" | None:
        row = cls.db_manager().execute_returning(
            MARK_NOTIFICATION_READ,
            (notification_id, user_id),
        )
        return cls.from_row(row)

    @classmethod
    def mark_all_read(cls, user_id: int) -> None:
        cls.db_manager().execute(
            MARK_ALL_NOTIFICATIONS_READ,
            (user_id,),
            commit=True,
        )

    @classmethod
    def has_unread_message_notification(cls, user_id: int, actor_id: int) -> bool:
        row = cls.db_manager().fetch_one(
            CHECK_UNREAD_MESSAGE_NOTIFICATION,
            (user_id, actor_id)
        )
        return row is not None

    def to_dict(self) -> Dict[str, Any]:
        # Ensure data is a dict (in case it was returned as a JSON string)
        data_payload = self.data
        if isinstance(data_payload, str):
            try:
                data_payload = json.loads(data_payload)
            except Exception:
                pass

        return {
            "id": self.id,
            "user_id": self.user_id,
            "actor_id": self.actor_id,
            "type": self.type,
            "message": self.message,
            "data": data_payload,
            "entity_id": self.entity_id,
            "is_read": self.is_read,
            "created_at": self.created_at.isoformat() if hasattr(self.created_at, 'isoformat') else self.created_at,
        }
