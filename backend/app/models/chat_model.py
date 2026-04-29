"""Chat and conversation data access models."""

from __future__ import annotations
from typing import Any, Dict, Optional
from app.models.base_model import BaseModel
from app.db.queries.chat_queries import (
    CREATE_CONVERSATION,
    GET_CONVERSATION,
    GET_USER_CONVERSATIONS,
    CREATE_MESSAGE,
    GET_MESSAGES,
    MARK_MESSAGES_READ,
    CHECK_MUTUAL_LIKE,
    GET_TOTAL_UNREAD_MESSAGES
)

class ConversationModel(BaseModel):
    """Model for `conversations` table operations."""

    id: int | None = None
    user1_id: int | None = None
    user2_id: int | None = None
    created_at: Any | None = None
    
    # Extra fields from joins
    user1_username: str | None = None
    user2_username: str | None = None
    user1_avatar: str | None = None
    user2_avatar: str | None = None
    last_message: str | None = None
    last_message_at: Any | None = None
    unread_count: int = 0

    @classmethod
    def get_or_create(cls, user1_id: int, user2_id: int) -> ConversationModel | None:
        # Sort IDs to maintain consistency if we had used user1 < user2 constraint
        # but since we didn't, we check both ways in the query
        row = cls.db_manager().fetch_one(GET_CONVERSATION, (user1_id, user2_id, user2_id, user1_id))
        if row:
            return cls.from_row(row)
        
        # Ensure user1_id < user2_id for consistent ordering if possible
        u1, u2 = (user1_id, user2_id) if user1_id < user2_id else (user2_id, user1_id)
        row = cls.db_manager().execute_returning(CREATE_CONVERSATION, (u1, u2))
        return cls.from_row(row)

    @classmethod
    def get_user_conversations(cls, user_id: int) -> list[ConversationModel]:
        rows = cls.db_manager().fetch_all(GET_USER_CONVERSATIONS, (user_id, user_id, user_id))
        return cls.from_rows(rows)

    @classmethod
    def get_total_unread_count(cls, user_id: int) -> int:
        row = cls.db_manager().fetch_one(GET_TOTAL_UNREAD_MESSAGES, (user_id, user_id, user_id))
        return row.get("total_unread", 0) if row else 0

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "user1_id": self.user1_id,
            "user2_id": self.user2_id,
            "created_at": self.created_at.isoformat() if hasattr(self.created_at, 'isoformat') else self.created_at,
            "user1_username": self.user1_username,
            "user2_username": self.user2_username,
            "user1_avatar": self.user1_avatar,
            "user2_avatar": self.user2_avatar,
            "last_message": self.last_message,
            "last_message_at": self.last_message_at.isoformat() if hasattr(self.last_message_at, 'isoformat') else self.last_message_at,
            "unread_count": self.unread_count,
        }

class MessageModel(BaseModel):
    """Model for `messages` table operations."""

    id: int | None = None
    conversation_id: int | None = None
    sender_id: int | None = None
    content: str | None = None
    is_read: bool = False
    created_at: Any | None = None

    @classmethod
    def create(cls, conversation_id: int, sender_id: int, content: str) -> MessageModel | None:
        row = cls.db_manager().execute_returning(CREATE_MESSAGE, (conversation_id, sender_id, content))
        return cls.from_row(row)

    @classmethod
    def get_by_conversation(cls, conversation_id: int, limit: int = 20, offset: int = 0) -> list[MessageModel]:
        rows = cls.db_manager().fetch_all(GET_MESSAGES, (conversation_id, limit, offset))
        return cls.from_rows(rows)

    @classmethod
    def mark_as_read(cls, conversation_id: int, reader_id: int) -> None:
        cls.db_manager().execute(MARK_MESSAGES_READ, (conversation_id, reader_id))

    @staticmethod
    def is_match(user1_id: int, user2_id: int) -> bool:
        db = BaseModel.db_manager()
        row = db.fetch_one(CHECK_MUTUAL_LIKE, (user1_id, user2_id, user2_id, user1_id))
        return bool(row and row.get("is_match"))

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "conversation_id": self.conversation_id,
            "sender_id": self.sender_id,
            "content": self.content,
            "is_read": self.is_read,
            "created_at": self.created_at.isoformat() if hasattr(self.created_at, 'isoformat') else self.created_at,
        }
