"""Profile table data access model."""

from __future__ import annotations

import json
from typing import Any, Dict, Optional

from app.db.queries.profile_queries import GET_PROFILE_BY_USER_ID, UPSERT_PROFILE
from app.models.base_model import BaseModel


class ProfileModel(BaseModel):
    """Model for `profiles` table operations."""

    @classmethod
    def get_by_user_id(cls, user_id: int) -> Optional[Dict[str, Any]]:
        return cls.db_manager().fetch_one(GET_PROFILE_BY_USER_ID, (user_id,))

    @classmethod
    def upsert(
        cls,
        user_id: int,
        gender: str,
        age: int,
        date_of_birth,
        location: str,
        bio: str,
        interests,
        avatar: str,
        pictures,
    ) -> Optional[Dict[str, Any]]:
        return cls.db_manager().execute_returning(
            UPSERT_PROFILE,
            (
                user_id,
                gender,
                age,
                date_of_birth,
                location,
                bio,
                json.dumps(interests),
                avatar,
                json.dumps(pictures),
            ),
        )
