"""User business logic."""

from __future__ import annotations

from app.models.user_model import UserModel
from app.utils.app_error import ConflictError, NotFoundError


class UserService:
    """Service class for user-related operations."""

    @staticmethod
    def update_account_fields(
        user_id: int,
        first_name: str | None = None,
        last_name: str | None = None,
        email: str | None = None,
    ) -> UserModel:
        if email:
            existing_user = UserModel.get_user_by_email(email)
            if existing_user and int(existing_user.id) != int(user_id):
                raise ConflictError("Email already in use")

        user = UserModel.update_user_by_id(
            user_id=user_id,
            first_name=first_name,
            last_name=last_name,
            email=email,
        )
        if not user:
            raise NotFoundError("User", user_id)
        return user

    @staticmethod
    def get_user_by_id(user_id: int) -> UserModel:
        user = UserModel.get_user_by_id(user_id)
        if not user:
            raise NotFoundError("User", user_id)
        return user