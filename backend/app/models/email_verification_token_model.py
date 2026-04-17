"""Email verification token data access model."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, Optional

from app.db.queries.auth_queries import (
    GET_EMAIL_VERIFICATION_TOKEN_BY_HASH,
    MARK_EMAIL_VERIFICATION_TOKEN_USED,
    STORE_EMAIL_VERIFICATION_TOKEN,
)
from app.models.base_model import BaseModel


class EmailVerificationTokenModel(BaseModel):
    """Model for `email_verification_tokens` table operations."""

    @classmethod
    def store_token(
        cls,
        user_id: int,
        token_hash: str,
        expires_at: datetime,
    ) -> Optional[Dict[str, Any]]:
        return cls.db_manager().execute_returning(
            STORE_EMAIL_VERIFICATION_TOKEN,
            (user_id, token_hash, expires_at),
        )

    @classmethod
    def get_by_token_hash(cls, token_hash: str) -> Optional[Dict[str, Any]]:
        return cls.db_manager().fetch_one(GET_EMAIL_VERIFICATION_TOKEN_BY_HASH, (token_hash,))

    @classmethod
    def mark_used(cls, token_id: int) -> Optional[Dict[str, Any]]:
        return cls.db_manager().execute_returning(MARK_EMAIL_VERIFICATION_TOKEN_USED, (token_id,))