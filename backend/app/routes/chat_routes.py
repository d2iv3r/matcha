"""Chat routes."""

from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.controllers.chat_controller import ChatController

chat_bp = Blueprint("chat", __name__, url_prefix="/api/v1/chat")

chat_bp.add_url_rule("/conversations", view_func=jwt_required()(ChatController.get_conversations), methods=["GET"])
chat_bp.add_url_rule("/conversations/<int:conversation_id>/messages", view_func=jwt_required()(ChatController.get_messages), methods=["GET"])
chat_bp.add_url_rule("/messages", view_func=jwt_required()(ChatController.send_message), methods=["POST"])
chat_bp.add_url_rule("/messages/read", view_func=jwt_required()(ChatController.mark_read), methods=["PATCH"])
chat_bp.add_url_rule("/unread-count", view_func=jwt_required()(ChatController.get_unread_count), methods=["GET"])
