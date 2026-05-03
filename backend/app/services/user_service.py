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
    def update_password(user_id: int, current_password: str, new_password: str) -> None:
        from app.utils.utils import verify_password, hash_password
        from app.utils.app_error import BadRequestError

        user = UserModel.get_user_by_id(user_id)
        if not user:
            raise NotFoundError("User", user_id)
        
        if not verify_password(current_password, user.password_hash):
            raise BadRequestError("Incorrect current password")

        if not UserModel.update_password(user_id, hash_password(new_password)):
            raise BadRequestError("Failed to update password")