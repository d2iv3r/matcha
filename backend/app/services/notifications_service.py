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
    def mark_all_read(user_id: int) -> None:
        NotificationModel.mark_all_read(user_id)

    @staticmethod
    def send_notification(
        user_id: int,
        notification_type: str,
        actor_id: int | None = None,
        message: str | None = None,
        data: dict | None = None,
        entity_id: int | None = None,
    ) -> NotificationModel | None:
        try:
            notification = NotificationModel.create(
                user_id=user_id,
                notification_type=notification_type,
                actor_id=actor_id,
                message=message,
                data=data,
                entity_id=entity_id,
            )
            if notification is None:
                return None

            payload = notification.to_dict()
            socketio.start_background_task(
                socketio.emit,
                "notification",
                payload,
                room=f"user_{user_id}"
            )
            return notification
        except Exception as exc:
            import logging
            logging.getLogger(__name__).error(f"[Notifications] Failed to send notification: {exc}")
            return None
