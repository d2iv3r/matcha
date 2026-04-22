"""Profile table data access model."""

from __future__ import annotations

from typing import Any, Dict, Optional

from psycopg2.extras import Json

from app.db.queries import (
    CREATE_PROFILE,
    GET_MY_PROFILE_BY_USER_ID,
    GET_PROFILE_BY_USERNAME,
    # GET_PROFILES_WITH_USERS,
)
from app.models.base_model import BaseModel


class ProfileModel(BaseModel):
    """Model for `profiles` table operations."""

    id: int | None = None
    username: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    gender: str | None = None
    age: int | None = None
    date_of_birth: Any | None = None
    city: str | None = None
    country: str | None = None
    ip_address: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    bio: str | None = None
    interests: Any | None = None
    avatar: str | None = None
    pictures: Any | None = None
    rating: str | None = None


    def create(self) -> Optional["ProfileModel"]:
        interests = self.interests
        pictures = Json(self.pictures) if isinstance(self.pictures, (list, dict)) else self.pictures
        row = self.db_manager().execute_returning(
                CREATE_PROFILE,
                (
                    self.id,
                    self.gender,
                    self.age,
                    self.date_of_birth,
                    self.city,
                    self.country,
                    self.ip_address,
                    self.latitude,
                    self.longitude,
                    self.bio,
                    interests,
                    self.avatar,
                    pictures,
                ),
            )
        if row is None:
            return None
        return self.from_row(row)
    
    @classmethod
    def get_my_profile_by_user_id(cls, user_id: int) -> Optional["ProfileModel"]:
        return cls.from_row(cls.db_manager().fetch_one(GET_MY_PROFILE_BY_USER_ID, (user_id,)))


    def to_dict(self) -> Dict[str, Any]:
        return {
            "user_id": self.id,
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "gender": self.gender,
            "age": self.age,
            "date_of_birth": self.date_of_birth,
            "city": self.city,
            "country": self.country,
            # "ip_address": self.ip_address,
            # "latitude": self.latitude,
            # "longitude": self.longitude,
            "bio": self.bio,
            "interests": self.interests,
            "avatar": self.avatar,
            "pictures": self.pictures,
            "rating": self.rating,
        }

    @classmethod
    def get_profile_by_username(cls, username: str) -> Optional["ProfileModel"]:
        return cls.from_row(cls.db_manager().fetch_one(GET_PROFILE_BY_USERNAME, (username,)))
    
    # @classmethod
    # def get_profiles_list(cls, limit: int = 20, offset: int = 0) -> list[UserProfileProjectionModel]:
    #     return cls._projection_from_rows(cls.db_manager().fetch_all(GET_PROFILES_WITH_USERS, (limit, offset)))

    
