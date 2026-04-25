"""Controller for notification endpoints."""

from flask import request
from flask_jwt_extended import get_jwt_identity

from app.services.notifications_service import NotificationsService
from app.utils.app_error import NotFoundError
from app.utils.response import success


class NotificationsController:
    """Controller for notification endpoints."""

    @staticmethod
    def get_notifications():
        user_id = int(get_jwt_identity())

        limit = request.args.get("limit", 20, type=int)
        offset = request.args.get("offset", 0, type=int)

        if limit < 1 or limit > 100:
            limit = 20
        if offset < 0:
            offset = 0

        notifications = NotificationsService.get_user_notifications(user_id, limit=limit, offset=offset)
        data = {
            "notifications": [item.to_dict() for item in notifications],
            "count": len(notifications),
        }
        return success(message="Notifications retrieved successfully", data=data)

    @staticmethod
    def mark_notification_read(notification_id: int):
        user_id = int(get_jwt_identity())

        notification = NotificationsService.mark_notification_read(user_id, notification_id)
        if not notification:
            raise NotFoundError("Notification", notification_id)

        return success(message="Notification marked as read", data={"notification": notification.to_dict()})
