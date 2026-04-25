"""Notification business logic."""

from __future__ import annotations

from app.models.notification_model import NotificationModel


class NotificationsService:
    """Service class for notification operations."""

    @staticmethod
    def get_user_notifications(user_id: int, limit: int = 20, offset: int = 0) -> list[NotificationModel]:
        return NotificationModel.get_by_user_id(user_id, limit=limit, offset=offset)

    @staticmethod
    def mark_notification_read(user_id: int, notification_id: int) -> NotificationModel | None:
        return NotificationModel.mark_read(user_id, notification_id)
