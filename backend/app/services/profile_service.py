"""Profile business logic."""

# from __future__ import annotations

from app.models.profile_model import ProfileModel
from app.models.user_model import UserModel
from app.utils.app_error import ForbiddenError, NotFoundError


class ProfileService:
    """Service class for profile-related operations."""

    RATING_LEVELS = ["Ghost", "Rising", "Popular", "Elite", "Iconic"]

    @staticmethod
    def complete_profile(profile_data: dict) -> ProfileModel:
        """Complete profile."""
        user = UserModel.get_user_by_id(profile_data.get("user_id"))
        if not user:
            raise NotFoundError("User", profile_data.get("user_id"))

        if user.is_active is False:
            raise ForbiddenError("Only verified users can update profile")

        profile = ProfileModel(**profile_data).create()
        UserModel.mark_profile_complete(profile_data.get("user_id"))
        return profile
    
    @staticmethod
    def get_my_profile_by_user_id(user_id: int) -> ProfileModel:
        """Get my profile."""
        my_profile = ProfileModel.get_my_profile_by_user_id(user_id)
        if not my_profile:
            raise NotFoundError("User", user_id)
        return my_profile

    @staticmethod
    def get_profile_by_user_id(user_id: int, requester_id: int | None = None) -> ProfileModel:
        """Get profile by user id."""
        profile = ProfileModel.get_my_profile_by_user_id(user_id)
        if not profile:
            raise NotFoundError("User", user_id)

        if requester_id and requester_id != user_id:
            from app.services.block_service import BlockService
            if BlockService.is_blocked(requester_id, user_id):
                raise ForbiddenError("You have blocked this user or been blocked by them")

        return profile

    @staticmethod
    def get_profile_by_username(username: str, requester_id: int | None = None) -> ProfileModel:
        """Get profile by username."""
        profile = ProfileModel.get_profile_by_username(username)
        if not profile:
            raise NotFoundError("User", username)

        if requester_id:
            from app.services.block_service import BlockService
            if BlockService.is_blocked(requester_id, profile.user_id):
                raise ForbiddenError("You have blocked this user or been blocked by them")

        return profile

    @staticmethod
    def get_profiles_list(user_id: int, limit: int = 20, offset: int = 0) -> list[ProfileModel]:
        """Get suggested profiles list."""
        caller_profile = ProfileModel.get_my_profile_by_user_id(user_id)
        if not caller_profile:
            raise NotFoundError("Profile", user_id)

        gender_preference = caller_profile.gender_preference or "all"
        latitude = caller_profile.latitude or 0.0
        longitude = caller_profile.longitude or 0.0
        interests = caller_profile.interests or []

        return ProfileModel.get_profiles_list(
            user_id=user_id,
            caller_gender=caller_profile.gender or "other",
            gender_preference=gender_preference,
            latitude=latitude,
            longitude=longitude,
            interests=interests,
            limit=limit,
            offset=offset,
        )

    @staticmethod
    def update_profile_fields(user_id: int, profile_data: dict) -> ProfileModel:
        """update profile fields."""
        profile = ProfileModel.update_profile_by_user_id(
            user_id=user_id,
            gender=profile_data.get("gender"),
            gender_preference=profile_data.get("gender_preference"),
            bio=profile_data.get("bio"),
            interests=profile_data.get("interests"),
            avatar=profile_data.get("avatar"),
            pictures=profile_data.get("pictures"),
            city=profile_data.get("city"),
            country=profile_data.get("country"),
            latitude=profile_data.get("latitude"),
            longitude=profile_data.get("longitude"),
            is_location_approved=profile_data.get("is_location_approved"),
        )
        if not profile:
            raise NotFoundError("Profile", user_id)
        return profile

    @staticmethod
    def search_profiles(user_id: int, filters: dict) -> list[ProfileModel]:
        """search profiles."""
        caller_profile = ProfileModel.get_my_profile_by_user_id(user_id)
        if not caller_profile:
            raise NotFoundError("Profile", user_id)

        gender_preference = caller_profile.gender_preference or "all"
        latitude = caller_profile.latitude or 0.0
        longitude = caller_profile.longitude or 0.0

        return ProfileModel.search_profiles(
            user_id=user_id,
            caller_gender=caller_profile.gender or "other",
            gender_preference=gender_preference,
            latitude=latitude,
            longitude=longitude,
            viewer_interests=caller_profile.interests or [],
            first_name=filters.get("first_name"),
            last_name=filters.get("last_name"),
            city=filters.get("city"),
            min_age=filters.get("min_age"),
            max_age=filters.get("max_age"),
            ratings=filters.get("ratings"),
            max_distance=filters.get("max_distance"),
            interests=filters.get("interests"),
            sort_by=filters.get("sort_by", "distance"),
            sort_order=filters.get("sort_order", "asc"),
            limit=filters.get("limit", 20),
            offset=filters.get("offset", 0),
        )

    @staticmethod
    def _normalize_rating(score: int) -> str:
        """Convert a numerical score (likes + views) to a rating level."""
        if score <= 19:
            return "Ghost"
        if score <= 39:
            return "Rising"
        if score <= 59:
            return "Popular"
        if score <= 79:
            return "Elite"
        return "Iconic"

    @staticmethod
    def update_profile_rating(user_id: int) -> str:
        """Calculate and update the profile rating for a user."""
        from app.services.profile_likes_service import ProfileLikesService
        from app.services.profile_views_service import ProfileViewsService

        likes_count = ProfileLikesService.get_profile_like_count(user_id)
        views_count = ProfileViewsService.get_profile_view_count(user_id)
        score = likes_count + views_count

        new_rating = ProfileService._normalize_rating(score)
        ProfileModel.update_rating(user_id, new_rating)
        return new_rating
