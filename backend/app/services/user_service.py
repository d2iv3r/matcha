"""User business logic."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any, Dict, List, Optional

from app.models.user_model import UserModel

if TYPE_CHECKING:
    from app.schemas.auth_schemas import RegistrationSchema


class UserService:
    """Service class for user-related operations."""

    @staticmethod
    def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
        return UserModel.get_by_email(email)

    @staticmethod
    def create_user(user_data: RegistrationSchema) -> Optional[Dict[str, Any]]:
        return UserModel.create(user_data)

    @staticmethod
    def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
        return UserModel.get_by_id(user_id)

    @staticmethod
    def get_user_by_username(username: str) -> Optional[Dict[str, Any]]:
        return UserModel.get_by_username(username)

    @staticmethod
    def get_all_users(limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
        return UserModel.get_all(limit=limit, offset=offset)

    @staticmethod
    def update_user(user_id: int, **kwargs) -> Optional[Dict[str, Any]]:
        return None

    @staticmethod
    def update_password(user_id: int, password_hash: str) -> Optional[Dict[str, Any]]:
        return UserModel.update_password(user_id, password_hash)

    @staticmethod
    def activate_user(user_id: int) -> Optional[Dict[str, Any]]:
        return UserModel.activate(user_id)

    @staticmethod
    def delete_user(user_id: int) -> bool:
        return UserModel.delete_soft(user_id)

    @staticmethod
    def search_users(query: str, limit: int = 20) -> List[Dict[str, Any]]:
        return UserModel.search(query=query, limit=limit)