"""Profile business logic."""

from __future__ import annotations

import json
from datetime import date
from typing import Any, Dict

from app.models.profile_model import ProfileModel
from app.models.user_model import UserModel
from app.utils.app_error import ForbiddenError, NotFoundError


class ProfileService:
    """Service class for profile-related operations."""

    @staticmethod
    def _serialize_profile(profile: Dict[str, Any]) -> Dict[str, Any]:
        date_of_birth = profile.get("date_of_birth")
        if isinstance(date_of_birth, date):
            date_of_birth = date_of_birth.isoformat()

        interests = profile.get("interests")
        if isinstance(interests, str):
            try:
                interests = json.loads(interests)
            except json.JSONDecodeError:
                interests = [interests]

        return {
            "user_id": profile.get("user_id"),
            "gender": profile.get("gender"),
            "age": profile.get("age"),
            "date_of_birth": date_of_birth,
            "location": profile.get("location"),
            "bio": profile.get("bio"),
            "interests": interests,
            "avatar_url": profile.get("avatar_url"),
        }

    @staticmethod
    def update_profile(
        user_id: int,
        *,
        gender: str,
        age: int,
        date_of_birth,
        location: str,
        bio: str,
        interests,
        avatar_url: str,
    ) -> Dict[str, Any]:
        user = UserModel.get_by_id(user_id)
        if not user:
            raise NotFoundError("User", user_id)

        if not user.get("is_active", False):
            raise ForbiddenError("Only verified users can update profile")

        profile = ProfileModel.upsert(
            user_id=user_id,
            gender=gender,
            age=age,
            date_of_birth=date_of_birth,
            location=location,
            bio=bio,
            interests=interests,
            avatar_url=avatar_url,
        )
        if not profile:
            raise RuntimeError("Failed to update profile")

        UserModel.mark_profile_complete(user_id)

        return ProfileService._serialize_profile(profile)

    @staticmethod
    def get_profile_by_user_id(user_id: int) -> Dict[str, Any]:
        user_with_profile = UserModel.get_with_profile_by_id(user_id)
        if not user_with_profile:
            raise NotFoundError("User", user_id)

        user_payload = {
            "id": user_with_profile.get("id"),
            "username": user_with_profile.get("username"),
            "email": user_with_profile.get("email"),
            "is_active": user_with_profile.get("is_active"),
            "is_profile_complete": user_with_profile.get("is_profile_complete", False),
        }

        if user_with_profile.get("profile_user_id") is None:
            return {"user": user_payload, "profile": None}

        profile_payload = {
            "user_id": user_with_profile.get("profile_user_id"),
            "gender": user_with_profile.get("gender"),
            "age": user_with_profile.get("age"),
            "date_of_birth": user_with_profile.get("date_of_birth"),
            "location": user_with_profile.get("location"),
            "bio": user_with_profile.get("bio"),
            "interests": user_with_profile.get("interests"),
            "avatar_url": user_with_profile.get("avatar_url"),
        }

        return {"user": user_payload, "profile": ProfileService._serialize_profile(profile_payload)}
