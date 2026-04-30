"""Controller for chat endpoints."""

from flask import request
from flask_jwt_extended import get_jwt_identity
from app.services.chat_service import ChatService
from app.utils.response import success

class ChatController:
    """Controller for chat operations."""

    @staticmethod
    def get_conversations():
        user_id = int(get_jwt_identity())
        conversations = ChatService.get_user_conversations(user_id)
        return success(
            data=[c.to_dict() for c in conversations],
            message="Conversations retrieved successfully"
        )

    @staticmethod
    def get_messages(conversation_id: int):
        user_id = int(get_jwt_identity())
        limit = request.args.get("limit", 20, type=int)
        offset = request.args.get("offset", 0, type=int)
        
        messages = ChatService.get_conversation_messages(user_id, conversation_id, limit, offset)
        return success(
            data=[m.to_dict() for m in messages],
            message="Messages retrieved successfully"
        )

    @staticmethod
    def send_message():
        sender_id = int(get_jwt_identity())
        data = request.get_json()
        receiver_id = data.get("receiver_id")
        content = data.get("content")
        
        message = ChatService.send_message(sender_id, receiver_id, content)
        payload = message.to_dict()

        try:
            from app.extensions import socketio
            socketio.emit("new_message", payload, room=f"user_{receiver_id}")
            socketio.emit("new_message", payload, room=f"conversation_{payload['conversation_id']}")
        except Exception as e:
            print(f"Failed to emit socket event: {e}")

        return success(
            data=payload,
            message="Message sent successfully"
        )

    @staticmethod
    def mark_read():
        user_id = int(get_jwt_identity())
        data = request.get_json()
        conversation_id = data.get("conversation_id")
        
        ChatService.mark_as_read(user_id, conversation_id)
        return success(message="Messages marked as read")

    @staticmethod
    def get_unread_count():
        user_id = int(get_jwt_identity())
        count = ChatService.get_total_unread_count(user_id)
        return success(data={"unread_count": count})
