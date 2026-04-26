"""Notification routes."""

from flask import Blueprint
from flask_jwt_extended import jwt_required

from app.controllers.notifications_controller import NotificationsController


notifications_bp = Blueprint("notifications", __name__, url_prefix="/api/v1/notifications")

notifications_bp.add_url_rule("/", view_func=jwt_required()(NotificationsController.get_notifications), methods=["GET"])
notifications_bp.add_url_rule(
    "/<int:notification_id>/read",
    view_func=jwt_required()(NotificationsController.mark_notification_read),
    methods=["PATCH"],
)
notifications_bp.add_url_rule(
    "/read-all",
    view_func=jwt_required()(NotificationsController.mark_all_read),
    methods=["PATCH"],
)
