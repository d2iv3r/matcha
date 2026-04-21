"""Password reset token data access model."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, Optional

from app.db.queries import (
    GET_PASSWORD_RESET_TOKEN_BY_HASH,
    DELETE_PASSWORD_RESET_TOKEN_BY_ID,
    STORE_PASSWORD_RESET_TOKEN,
)
from app.models.base_model import BaseModel


class PasswordResetTokenModel(BaseModel):
    """Model for `password_reset_tokens` table operations."""

    id: int | None = None
    user_id: int | None = None
    token_hash: str | None = None
    expires_at: datetime | None = None
    used_at: datetime | None = None
    created_at: datetime | None = None

    def __init__(self, **kwargs):
        for field_name in self.__class__.__annotations__:
            setattr(self, field_name, kwargs.get(field_name))

    @classmethod
    def _from_row(cls, row: Optional[Dict[str, Any]]) -> Optional["PasswordResetTokenModel"]:
        if not row:
            return None
        return cls(**row)

    @classmethod
    def store_token(
        cls,
        user_id: int,
        token_hash: str,
        expires_at: datetime,
    ) -> Optional["PasswordResetTokenModel"]:
        return cls._from_row(
            cls.db_manager().execute_returning(
                STORE_PASSWORD_RESET_TOKEN,
                (user_id, token_hash, expires_at),
            )
        )

    @classmethod
    def get_by_token_hash(cls, token_hash: str) -> Optional["PasswordResetTokenModel"]:
        return cls._from_row(cls.db_manager().fetch_one(GET_PASSWORD_RESET_TOKEN_BY_HASH, (token_hash,)))

    @classmethod
    def delete_by_id(cls, token_id: int) -> bool:
        affected_rows = cls.db_manager().execute(DELETE_PASSWORD_RESET_TOKEN_BY_ID, (token_id,))
        return affected_rows > 0