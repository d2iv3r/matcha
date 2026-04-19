"""Profile business logic."""

from __future__ import annotations

import ast
import json
from datetime import date
from collections.abc import Iterable
from typing import Any, Dict, Optional

from app.models.profile_model import ProfileModel
from app.models.user_model import UserModel
from app.services.profile_likes_service import ProfileLikesService
from app.services.profile_views_service import ProfileViewsService
from app.utils.app_error import BadRequestError, ForbiddenError, NotFoundError
from app.utils.profile_media import save_profile_picture


class ProfileService:
    """Service class for profile-related operations."""

    RATING_LEVELS = ["Ghost", "Rising", "Popular", "Elite", "Iconic"]

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
    def _parse_list_field(value: Any) -> list[str]:
        if value is None:
            return []

        if isinstance(value, list):
            return [str(item) for item in value if item not in (None, "")]

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

            try:
                parsed = ast.literal_eval(text)
                if isinstance(parsed, list):
                    return [str(item) for item in parsed if item not in (None, "")]
            except (ValueError, SyntaxError):
                pass

            if text.startswith("{") and text.endswith("}"):
                inner = text[1:-1].strip()
                if not inner:
                    return []
                return [part.strip().strip('"').strip("'") for part in inner.split(",") if part.strip()]

            return [part.strip() for part in text.split(",") if part.strip()]

        if isinstance(value, Iterable):
            return [str(item) for item in value if item not in (None, "")]

        return [str(value)]

    @staticmethod
    def _serialize_profile(profile: Dict[str, Any]) -> Dict[str, Any]:
        date_of_birth = profile.get("date_of_birth")
        if isinstance(date_of_birth, date):
            date_of_birth = date_of_birth.isoformat()

        interests = ProfileService._parse_list_field(profile.get("interests"))
        pictures = ProfileService._parse_list_field(profile.get("pictures"))

        return {
            "user_id": profile.get("user_id"),
            "gender": profile.get("gender"),
            "date_of_birth": date_of_birth,
            "location": profile.get("location"),
            "bio": profile.get("bio"),
            "rating": ProfileService._normalize_rating(profile.get("rating")),
            "interests": interests,
            "avatar": profile.get("avatar"),
            "pictures": pictures,
        }

    @staticmethod
    def _normalize_rating(value: Any) -> str:
        if isinstance(value, str) and value in ProfileService.RATING_LEVELS:
            return value

        if isinstance(value, (int, float)):
            score = int(value)
            if score <= 19:
                return "Ghost"
            if score <= 39:
                return "Rising"
            if score <= 59:
                return "Popular"
            if score <= 79:
                return "Elite"
            return "Iconic"

        return "Ghost"

    @staticmethod
    def get_rating_for_user(user_id: int) -> str:
        likes_count = ProfileLikesService.get_profile_like_count(user_id)
        views_count = ProfileViewsService.get_profile_view_count(user_id)
        score = likes_count + views_count
        return ProfileService._normalize_rating(score)

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
            "rating": ProfileService.get_rating_for_user(user_id),
            "interests": user_with_profile.get("interests"),
            "avatar": user_with_profile.get("avatar"),
            "pictures": user_with_profile.get("pictures"),
        }

        return {"user": user_payload, "profile": ProfileService._serialize_profile(profile_payload)}

    @staticmethod
    def get_profiles_list(limit: int = 20, offset: int = 0) -> list[Dict[str, Any]]:
        profiles_with_users = ProfileModel.get_profiles_list(limit=limit, offset=offset)
        result = []
        for item in profiles_with_users:
            user_id = item.get("id")
            result.append({
                "username": item.get("username"),
                "first_name": item.get("first_name"),
                "last_name": item.get("last_name"),
                "gender": item.get("gender"),
                "age": item.get("age"),
                "date_of_birth": item.get("date_of_birth").isoformat() if item.get("date_of_birth") else None,
                "location": item.get("location"),
                "rating": ProfileService.get_rating_for_user(user_id) if user_id is not None else "Ghost",
                "interests": ProfileService._parse_list_field(item.get("interests")),
                "avatar": item.get("avatar"),
                "pictures": ProfileService._parse_list_field(item.get("pictures")),
            })
        return result