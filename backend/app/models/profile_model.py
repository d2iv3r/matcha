"""Profile table data access model."""

from __future__ import annotations

from typing import Any, Dict, Optional

from psycopg2.extras import Json

from app.db.queries import (
    CREATE_PROFILE,
    GET_MY_PROFILE_BY_USER_ID,
    GET_PROFILE_BY_USERNAME,
    GET_PROFILES_LIST,
    UPDATE_PROFILE_BY_USER_ID,
    UPDATE_PROFILE_RATING,
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
    is_online: bool = False
    last_connection: Any | None = None
    gender: str | None = None
    gender_preference: str | None = "all"
    age: int | None = None
    date_of_birth: Any | None = None
    city: str | None = None
    country: str | None = None
    ip_address: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    distance_km: float | None = None
    shared_tags_count: int | None = None
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
                    self.gender_preference,
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
        return {
            "user_id": getattr(self, "user_id", None),
            "username": getattr(self, "username", None),
            "first_name": getattr(self, "first_name", None),
            "last_name": getattr(self, "last_name", None),
            "email": getattr(self, "email", None),
            "is_online": getattr(self, "is_online", None),
            "last_connection": getattr(self, "last_connection", None).isoformat() if getattr(self, "last_connection", None) else None,
            "gender": getattr(self, "gender", None),
            "gender_preference": getattr(self, "gender_preference", None),
            "age": getattr(self, "age", None),
            "date_of_birth": getattr(self, "date_of_birth", None).isoformat() if getattr(self, "date_of_birth", None) else None,
            "city": getattr(self, "city", None),
            "country": getattr(self, "country", None),
            "distance_km": getattr(self, "distance_km", None),
            "shared_tags_count": getattr(self, "shared_tags_count", 0),
            "bio": getattr(self, "bio", None),
            "interests": getattr(self, "interests", []),
            "avatar": getattr(self, "avatar", None),
            "pictures": getattr(self, "pictures", []),
            "rating": getattr(self, "rating", None),
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
        interests: list[str],
        limit: int = 20,
        offset: int = 0,
    ) -> list["ProfileModel"]:
        """Return profiles of `gender` ordered by distance, tags, rating."""
        rows = cls.db_manager().fetch_all(
            GET_PROFILES_LIST,
            (latitude, longitude, latitude, interests, user_id, gender, gender, user_id, user_id, limit, offset),
        )
        return cls.from_rows(rows)

    @classmethod
    def update_profile_by_user_id(
        cls,
        user_id: int,
        gender: str | None = None,
        gender_preference: str | None = None,
        bio: str | None = None,
        interests: Any | None = None,
        avatar: str | None = None,
        pictures: Any | None = None,
    ) -> Optional["ProfileModel"]:
        row = cls.db_manager().execute_returning(
            UPDATE_PROFILE_BY_USER_ID,
            (gender, gender_preference, bio, interests, avatar, pictures, user_id),
        )
        return cls.from_row(row)

    @classmethod
    def update_rating(cls, user_id: int, rating: str) -> None:
        """Update a profile's rating."""
        cls.db_manager().execute(UPDATE_PROFILE_RATING, (rating, user_id))

    @classmethod
    def search_profiles(
        cls,
        user_id: int,
        gender: str,
        latitude: float,
        longitude: float,
        first_name: str | None = None,
        last_name: str | None = None,
        city: str | None = None,
        min_age: int | None = None,
        max_age: int | None = None,
        rating: str | None = None,
        interests: list[str] | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> list["ProfileModel"]:
        query = """
            SELECT
                u.username, u.first_name, u.last_name, u.is_online, u.last_connection,
                p.user_id, p.gender, p.age, p.date_of_birth, p.city, p.country,
                p.bio, p.interests, p.avatar, p.pictures, p.rating, p.latitude, p.longitude,
                (6371 * acos(
                    GREATEST(-1, LEAST(1,
                        cos(radians(%s)) * cos(radians(p.latitude)) *
                        cos(radians(p.longitude) - radians(%s)) +
                        sin(radians(%s)) * sin(radians(p.latitude))
                    ))
                )) AS distance_km
            FROM users u
            JOIN profiles p ON p.user_id = u.id
            WHERE u.id != %s
                AND (
                    (%s = 'all') OR (p.gender = %s)
                )
                AND p.latitude IS NOT NULL
                AND p.longitude IS NOT NULL
                AND u.id NOT IN (SELECT blocked_id FROM blocks WHERE blocker_id = %s)
                AND u.id NOT IN (SELECT blocker_id FROM blocks WHERE blocked_id = %s)
        """
        params = [latitude, longitude, latitude, user_id, gender, gender, user_id, user_id]

        if first_name:
            query += " AND u.first_name ILIKE %s"
            params.append(f"%{first_name}%")
        if last_name:
            query += " AND u.last_name ILIKE %s"
            params.append(f"%{last_name}%")
        if city:
            query += " AND p.city ILIKE %s"
            params.append(f"%{city}%")
        if min_age is not None:
            query += " AND p.age >= %s"
            params.append(min_age)
        if max_age is not None:
            query += " AND p.age <= %s"
            params.append(max_age)
        if rating:
            query += " AND p.rating = %s"
            params.append(rating)
        if interests:
            query += " AND p.interests && %s::TEXT[]"
            params.append(interests)

        query += " ORDER BY distance_km ASC LIMIT %s OFFSET %s"
        params.extend([limit, offset])

        rows = cls.db_manager().fetch_all(query, tuple(params))
        return cls.from_rows(rows)
