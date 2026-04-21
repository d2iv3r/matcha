"""User table data access model."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any, Dict, List, Optional

from app.db.queries import (
    IS_EMAIL_EXISTING,
    IS_USERNAME_EXISTING,
    CREATE_USER,
    GET_USER_BY_ID,
    GET_USER_BY_EMAIL,
    GET_USER_BY_USERNAME,
    ACTIVATE_USER_BY_ID,
    MARK_PROFILE_COMPLETE,
    UPDATE_USER_PASSWORD_BY_ID,
)
from app.models.base_model import BaseModel


class UserModel(BaseModel):
    """Model for `users` table operations."""

    id: int | None = None
    username: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    password_hash: str | None = None
    is_active: bool = False
    is_profile_complete: bool = False

    def __init__(
        self,
        username: str | None = None,
        first_name: str | None = None,
        last_name: str | None = None,
        email: str | None = None,
        password_hash: str | None = None,
        **kwargs,
    ):
        self.username = username if username is not None else kwargs.get("username")
        self.first_name = first_name if first_name is not None else kwargs.get("first_name")
        self.last_name = last_name if last_name is not None else kwargs.get("last_name")
        self.email = email if email is not None else kwargs.get("email")
        self.password_hash = password_hash if password_hash is not None else kwargs.get("password_hash")

        for field_name in self.__class__.__annotations__:
            if field_name not in self.__dict__:
                setattr(self, field_name, kwargs.get(field_name))

    @staticmethod
    def is_email_existing(email: str) -> bool:
        return UserModel.db_manager().fetch_one(IS_EMAIL_EXISTING, (email,)) is not None

    @staticmethod
    def is_username_existing(username: str) -> bool:
        return UserModel.db_manager().fetch_one(IS_USERNAME_EXISTING, (username,)) is not None

    @classmethod
    def _from_row(cls, row: Optional[Dict[str, Any]]) -> Optional["UserModel"]:
        if not row:
            return None
        return cls(**row)

    @classmethod
    def _from_rows(cls, rows: List[Dict[str, Any]]) -> List["UserModel"]:
        return [cls(**row) for row in rows]

    def create_user(self) -> Optional["UserModel"]:
        return self.__class__._from_row(
            self.db_manager().execute_returning(
                CREATE_USER,
                (
                    self.username,
                    self.first_name,
                    self.last_name,
                    self.email,
                    self.password_hash,
                ),
            )
        )
    
    @classmethod
    def get_user_by_email(cls, email: str) -> Optional["UserModel"]:
        return cls._from_row(cls.db_manager().fetch_one(GET_USER_BY_EMAIL, (email,)))

    @classmethod
    def get_user_by_username(cls, username: str) -> Optional["UserModel"]:
        return cls._from_row(cls.db_manager().fetch_one(GET_USER_BY_USERNAME, (username,)))

    @classmethod
    def get_user_by_id(cls, user_id: int) -> Optional["UserModel"]:
        return cls._from_row(cls.db_manager().fetch_one(GET_USER_BY_ID, (user_id,)))

    @classmethod
    def activate_user_by_id(cls, user_id: int) -> Optional["UserModel"]:
        return cls._from_row(cls.db_manager().execute_returning(ACTIVATE_USER_BY_ID, (user_id,)))

    @classmethod
    def mark_profile_complete(cls, user_id: int) -> bool:
        affected_rows = cls.db_manager().execute(MARK_PROFILE_COMPLETE, (user_id,))
        return affected_rows > 0
    
    @classmethod
    def update_password(cls, user_id: int, password_hash: str) -> bool:
        affected_rows = cls.db_manager().execute(UPDATE_USER_PASSWORD_BY_ID, (password_hash, user_id))
        return affected_rows > 0