"""Notification business logic."""

from __future__ import annotations

from app.extensions import socketio
from app.models.notification_model import NotificationModel


class NotificationsService:
    """Service class for notification operations."""

    @staticmethod
    def get_user_notifications(user_id: int, limit: int = 20, offset: int = 0) -> list[NotificationModel]:
        return NotificationModel.get_by_user_id(user_id, limit=limit, offset=offset)

    @staticmethod
    def mark_notification_read(user_id: int, notification_id: int) -> NotificationModel | None:
        return NotificationModel.mark_read(user_id, notification_id)

    @staticmethod
    def send_notification(
        user_id: int,
        notification_type: str,
        message: str | None = None,
        data: dict | None = None,
    ) -> NotificationModel | None:
        notification = NotificationModel.create(
            user_id=user_id,
            notification_type=notification_type,
            message=message,
            data=data,
        )
        if notification is None:
            return None

        payload = notification.to_dict()
        socketio.emit("notification", payload, room=f"user:{user_id}")
        return notification
