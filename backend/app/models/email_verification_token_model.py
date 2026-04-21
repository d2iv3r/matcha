"""Email verification token data access model."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, Optional

from app.db.queries import (
    DELETE_EMAIL_VERIFICATION_TOKEN_BY_ID,
    GET_EMAIL_VERIFICATION_TOKEN_BY_HASH,
    STORE_EMAIL_VERIFICATION_TOKEN,
)
from app.models.base_model import BaseModel


class EmailVerificationTokenModel(BaseModel):
    """Model for `email_verification_tokens` table operations."""

    id: int | None = None
    user_id: int | None = None
    token_hash: str | None = None
    expires_at: datetime | None = None
    verified_at: datetime | None = None
    created_at: datetime | None = None

    def __init__(self, **kwargs):
        for field_name in self.__class__.__annotations__:
            setattr(self, field_name, kwargs.get(field_name))

    @classmethod
    def _from_row(cls, row: Optional[Dict[str, Any]]) -> Optional["EmailVerificationTokenModel"]:
        if not row:
            return None
        return cls(**row)

    @classmethod
    def store_token(
        cls,
        user_id: int,
        token_hash: str,
        expires_at: datetime,
    ) -> Optional["EmailVerificationTokenModel"]:
        return cls._from_row(
            cls.db_manager().execute_returning(
                STORE_EMAIL_VERIFICATION_TOKEN,
                (user_id, token_hash, expires_at),
            )
        )

    @classmethod
    def get_by_token_hash(cls, token_hash: str) -> Optional["EmailVerificationTokenModel"]:
        return cls._from_row(cls.db_manager().fetch_one(GET_EMAIL_VERIFICATION_TOKEN_BY_HASH, (token_hash,)))

    @classmethod
    def mark_used(cls, token_id: int) -> Optional["EmailVerificationTokenModel"]:
        return cls._from_row(cls.db_manager().execute_returning(DELETE_EMAIL_VERIFICATION_TOKEN_BY_ID, (token_id,)))

    @classmethod
    def delete_by_id(cls, token_id: int) -> bool:
        affected_rows = cls.db_manager().execute(DELETE_EMAIL_VERIFICATION_TOKEN_BY_ID, (token_id,))
        return affected_rows > 0