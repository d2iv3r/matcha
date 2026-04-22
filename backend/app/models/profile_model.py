"""Profile table data access model."""

from __future__ import annotations

from typing import Any, Dict, Optional

from psycopg2.extras import Json

from app.db.queries import (
    CREATE_PROFILE,
    GET_MY_PROFILE_BY_USER_ID,
    GET_PROFILE_BY_USERNAME,
    GET_PROFILES_LIST,
    # GET_PROFILES_WITH_USERS,
)
from app.models.base_model import BaseModel


class ProfileModel(BaseModel):
    """Model for `profiles` table operations."""

    user_id: int | None = None
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
    distance_km: float | None = None
    bio: str | None = None
    interests: Any | None = None
    avatar: str | None = None
    pictures: Any | None = None
    rating: str | None = None


    def create(self) -> Optional["ProfileModel"]:
        row = self.db_manager().execute_returning(
                CREATE_PROFILE,
                (
                    self.user_id,
                    self.gender,
                    self.age,
                    self.date_of_birth,
                    self.city,
                    self.country,
                    self.ip_address,
                    self.latitude,
                    self.longitude,
                    self.bio,
                    self.interests,
                    self.avatar,
                    self.pictures,
                ),
            )
        if row is None:
            return None
        return self.from_row(row)
    
    @classmethod
    def get_my_profile_by_user_id(cls, user_id: int) -> Optional["ProfileModel"]:
        return cls.from_row(cls.db_manager().fetch_one(GET_MY_PROFILE_BY_USER_ID, (user_id,)))

    def to_dict(self) -> dict:
        print("=++++++++++++++++++++")
        print(f"-->> user_id == {self.user_id}")
        return {
            "user_id": self.user_id,
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
            "distance_km": getattr(self, "distance_km", None),
            "bio": self.bio,
            "interests": self.interests,
            "avatar": self.avatar,
            "pictures": self.pictures,
            "rating": self.rating,
        }

    @classmethod
    def get_profile_by_username(cls, username: str) -> Optional["ProfileModel"]:
        return cls.from_row(cls.db_manager().fetch_one(GET_PROFILE_BY_USERNAME, (username,)))

    @classmethod
    def get_profiles_list(
        cls,
        user_id: int,
        gender: str,
        latitude: float,
        longitude: float,
        limit: int = 20,
        offset: int = 0,
    ) -> list["ProfileModel"]:
        """Return profiles of `gender` ordered by distance from (latitude, longitude)."""
        rows = cls.db_manager().fetch_all(
            GET_PROFILES_LIST,
            (latitude, longitude, latitude, user_id, gender, limit, offset),
        )
        return cls.from_rows(rows)

    
