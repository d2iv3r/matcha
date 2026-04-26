"""Chat business logic."""

from __future__ import annotations

from app.services.notifications_service import NotificationsService


class ChatService:
    """Service class for chat and messaging operations."""

    @staticmethod
    def send_message(sender_id: int, receiver_id: int, message_content: str, message_id: int) -> None:
        """Send a message and trigger a notification.
        
        Args:
            sender_id: ID of the user sending the message
            receiver_id: ID of the user receiving the message
            message_content: The text content of the message
            message_id: The ID of the created message entity
        """
        # DB operations for message creation would go here
        
        from app.models.profile_model import ProfileModel
        # Fetch actor info
        actor_profile = ProfileModel.get_my_profile_by_user_id(sender_id)
        actor_data = {
            "username": actor_profile.username if actor_profile else "Unknown",
            "avatar": actor_profile.avatar if actor_profile else None
        }

        # Trigger real-time MESSAGE notification
        NotificationsService.send_notification(
            user_id=receiver_id,
            notification_type="MESSAGE",
            actor_id=sender_id,
            message=f"New message from {actor_data['username']}",
            data={
                **actor_data,
                "content": message_content
            },
            entity_id=message_id
        )
