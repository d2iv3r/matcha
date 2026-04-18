"""Profile business logic."""

from __future__ import annotations

import json
from datetime import date
from collections.abc import Iterable
from typing import Any, Dict, Optional

from app.models.profile_model import ProfileModel
from app.models.user_model import UserModel
from app.utils.app_error import BadRequestError, ForbiddenError, NotFoundError
from app.utils.profile_media import save_profile_picture


class ProfileService:
    """Service class for profile-related operations."""

    @staticmethod
    def _normalize_list(value: Any) -> list[str]:
        if value is None:
            return []

        if isinstance(value, str):
            text = value.strip()
            if not text:
                return []

            try:
                parsed = json.loads(text)
                if isinstance(parsed, list):
                    return [str(item) for item in parsed if item not in (None, "")]
            except json.JSONDecodeError:
                pass

            return [item.strip() for item in text.split(",") if item.strip()]

        if isinstance(value, Iterable):
            return [str(item) for item in value if item not in (None, "")]

        return [str(value)]

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

        pictures = profile.get("profile_pictures")
        if isinstance(pictures, str):
            try:
                pictures = json.loads(pictures)
            except json.JSONDecodeError:
                pictures = [pictures]

        if pictures is None:
            pictures = []

        return {
            "user_id": profile.get("user_id"),
            "gender": profile.get("gender"),
            "date_of_birth": date_of_birth,
            "location": profile.get("location"),
            "bio": profile.get("bio"),
            "interests": interests,
            "avatar": profile.get("avatar_url"),
            "pictures": pictures,
        }

    @staticmethod
    def _resolve_avatar_url(user_id: int, avatar, resolved_pictures: list[str]) -> str:
        if avatar is not None and getattr(avatar, "filename", ""):
            return save_profile_picture(avatar, user_id=user_id, picture_type="avatar")

        if resolved_pictures:
            return resolved_pictures[0]

        raise BadRequestError("avatar is required")

    @staticmethod
    def update_profile(
        user_id: int,
        *,
        gender: str,
        date_of_birth,
        location: str,
        bio: str,
        interests,
        avatar=None,
        pictures: Optional[list] = None,
    ) -> Dict[str, Any]:
        user = UserModel.get_by_id(user_id)
        if not user:
            raise NotFoundError("User", user_id)

        if not user.get("is_active", False):
            raise ForbiddenError("Only verified users can update profile")

        resolved_pictures: list[str] = []
        for picture in pictures or []:
            if picture is not None and getattr(picture, "filename", ""):
                saved_url = save_profile_picture(picture, user_id=user_id, picture_type="picture")
                resolved_pictures.append(saved_url)
            elif isinstance(picture, str) and picture.strip():
                resolved_pictures.append(picture.strip())

        resolved_avatar_url = ProfileService._resolve_avatar_url(user_id, avatar, resolved_pictures)

        profile = ProfileModel.upsert(
            user_id=user_id,
            gender=gender,
            age=None,
            date_of_birth=date_of_birth,
            location=location,
            bio=bio,
            interests=interests,
            avatar=resolved_avatar_url,
            pictures=resolved_pictures,
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
            "avatar_url": user_with_profile.get("avatar"),
            "profile_pictures": user_with_profile.get("pictures"),
        }

        return {"user": user_payload, "profile": ProfileService._serialize_profile(profile_payload)}
