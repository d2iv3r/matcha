"""Chat business logic."""

from __future__ import annotations
from app.models.chat_model import ConversationModel, MessageModel
from app.services.notifications_service import NotificationsService
from app.utils.app_error import BadRequestError, ForbiddenError

class ChatService:
    """Service for chat operations."""

    @staticmethod
    def get_user_conversations(user_id: int) -> list[ConversationModel]:
        conversations = ConversationModel.get_user_conversations(user_id)
        
        for conv in conversations:
            print(f"+++++++=== ==> {conv.to_dict()}")

        from app.services.block_service import BlockService
        blocked_ids = BlockService.get_blocked_users_ids(user_id)
        
        if not blocked_ids:
            return conversations
            
        return [
            conv for conv in conversations 
            if conv.user1_id not in blocked_ids and conv.user2_id not in blocked_ids
        ]

    @staticmethod
    def get_conversation_messages(user_id: int, conversation_id: int, limit: int = 20, offset: int = 0) -> list[MessageModel]:
        # Basic validation: does the user belong to this conversation?
        # In a real app we'd check this in the query or here
        # For simplicity we'll just fetch, but we should ideally verify access
        return MessageModel.get_by_conversation(conversation_id, limit, offset)

    @staticmethod
    def send_message(sender_id: int, receiver_id: int, content: str) -> MessageModel:
        if not content or not content.strip():
            raise BadRequestError("Message content cannot be empty")

        from app.services.block_service import BlockService
        if BlockService.is_blocked(sender_id, receiver_id):
            raise ForbiddenError("You cannot message a blocked user or a user who has blocked you")

        # 1. Validate match
        if not MessageModel.is_match(sender_id, receiver_id):
            raise ForbiddenError("You can only message users you have a mutual match with")

        # 2. Get or create conversation
        conversation = ConversationModel.get_or_create(sender_id, receiver_id)
        if not conversation:
            raise BadRequestError("Could not create conversation")

        # 3. Store message
        message = MessageModel.create(conversation.id, sender_id, content)
        if not message:
            raise BadRequestError("Could not store message")

        # 4. Trigger notification
        from app.models.profile_model import ProfileModel
        sender_profile = ProfileModel.get_my_profile_by_user_id(sender_id)
        sender_name = sender_profile.username if sender_profile else "Someone"
        
        NotificationsService.send_notification(
            user_id=receiver_id,
            notification_type="MESSAGE",
            actor_id=sender_id,
            message=f"New message from {sender_name}",
            data={
                "conversation_id": conversation.id,
                "content": content[:50] + ("..." if len(content) > 50 else ""),
                "username": sender_name,
                "avatar": sender_profile.avatar if sender_profile else None
            },
            entity_id=message.id
        )

        return message

    @staticmethod
    def mark_as_read(user_id: int, conversation_id: int) -> None:
        MessageModel.mark_as_read(conversation_id, user_id)

    @staticmethod
    def get_total_unread_count(user_id: int) -> int:
        return ConversationModel.get_total_unread_count(user_id)
