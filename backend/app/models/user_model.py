"""User table data access model."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any, Dict, List, Optional

from app.db.queries.users_queries import (
    CREATE_USER,
    DELETE_USER_SOFT,
    GET_ALL_USERS,
    GET_USER_BY_EMAIL,
    GET_USER_BY_ID,
    GET_USER_BY_USERNAME,
    GET_USER_WITH_PROFILE_BY_ID,
    MARK_PROFILE_COMPLETE,
    SEARCH_USERS,
    UPDATE_USER_PASSWORD_BY_ID,
)
from app.models.base_model import BaseModel

if TYPE_CHECKING:
    from app.schemas.auth_schemas import RegistrationSchema


class UserModel(BaseModel):
    """Model for `users` table operations."""

    @classmethod
    def get_by_email(cls, email: str) -> Optional[Dict[str, Any]]:
        return cls.db_manager().fetch_one(GET_USER_BY_EMAIL, (email,))

    @classmethod
    def create(cls, user_data: RegistrationSchema) -> Optional[Dict[str, Any]]:
        return cls.db_manager().execute_returning(
            CREATE_USER,
            (
                user_data.username,
                user_data.first_name,
                user_data.last_name,
                user_data.email,
                user_data.password,
                False,
                False,
            ),
        )

    @classmethod
    def get_by_id(cls, user_id: int) -> Optional[Dict[str, Any]]:
        return cls.db_manager().fetch_one(GET_USER_BY_ID, (user_id,))

    @classmethod
    def get_by_username(cls, username: str) -> Optional[Dict[str, Any]]:
        return cls.db_manager().fetch_one(GET_USER_BY_USERNAME, (username,))

    @classmethod
    def get_all(cls, limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
        return cls.db_manager().fetch_all(GET_ALL_USERS, (limit, offset))

    @classmethod
    def delete_soft(cls, user_id: int) -> bool:
        affected_rows = cls.db_manager().execute(DELETE_USER_SOFT, (user_id,))
        return affected_rows > 0

    @classmethod
    def search(cls, query: str, limit: int = 20) -> List[Dict[str, Any]]:
        like_query = f"%{query}%"
        return cls.db_manager().fetch_all(SEARCH_USERS, (like_query, like_query, limit))

    @classmethod
    def mark_profile_complete(cls, user_id: int) -> bool:
        affected_rows = cls.db_manager().execute(MARK_PROFILE_COMPLETE, (user_id,))
        return affected_rows > 0

    @classmethod
    def get_with_profile_by_id(cls, user_id: int) -> Optional[Dict[str, Any]]:
        return cls.db_manager().fetch_one(GET_USER_WITH_PROFILE_BY_ID, (user_id,))

    @classmethod
    def update_password(cls, user_id: int, password_hash: str) -> Optional[Dict[str, Any]]:
        return cls.db_manager().execute_returning(UPDATE_USER_PASSWORD_BY_ID, (password_hash, user_id))