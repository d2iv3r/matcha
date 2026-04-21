"""User business logic."""

from __future__ import annotations

from typing import TYPE_CHECKING, List

from app.models.user_model import UserModel
from app.schemas.user_schemas import UserSchema

if TYPE_CHECKING:
    from app.schemas.auth_requests_schemas import RegistrationSchema


# class UserService:
#     """Service class for user-related operations."""

#     @staticmethod
#     def _to_user_schema(user: UserModel | None) -> UserSchema | None:
#         if user is None:
#             return None
#         return UserSchema.model_validate(vars(user))

#     @staticmethod
#     def create_user(user_data: RegistrationSchema) -> UserSchema | None:
#         return UserService._to_user_schema(UserModel.create(user_data))

#     @staticmethod
#     def get_user_by_id(user_id: int) -> UserSchema | None:
#         return UserService._to_user_schema(UserModel.get_by_id(user_id))

#     @staticmethod
#     def get_user_by_username(username: str) -> UserSchema | None:
#         return UserService._to_user_schema(UserModel.get_by_username(username))

#     @staticmethod
#     def get_all_users(limit: int = 100, offset: int = 0) -> List[UserSchema]:
#         return [UserSchema.model_validate(vars(user)) for user in UserModel.get_all(limit=limit, offset=offset)]

#     @staticmethod
#     def update_user(user_id: int, **kwargs) -> UserSchema | None:
#         return None

#     @staticmethod
#     def update_password(user_id: int, password_hash: str) -> UserSchema | None:
#         return UserService._to_user_schema(UserModel.update_password(user_id, password_hash))

#     @staticmethod
#     def activate_user(user_id: int) -> UserSchema | None:
#         return UserService._to_user_schema(UserModel.activate_by_id(user_id))

#     @staticmethod
#     def delete_user(user_id: int) -> bool:
#         return UserModel.delete_soft(user_id)

#     @staticmethod
#     def search_users(query: str, limit: int = 20) -> List[UserSchema]:
#         return [UserSchema.model_validate(vars(user)) for user in UserModel.search(query=query, limit=limit)]