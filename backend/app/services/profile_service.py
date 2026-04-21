"""Profile business logic."""

from __future__ import annotations

from app.models.profile_model import ProfileModel
from app.models.user_model import UserModel
from app.utils.app_error import ForbiddenError, NotFoundError
from app.utils.profile_media import save_profile_picture
from app.schemas import CompleteProfileSchema
from datetime import datetime


class ProfileService:
    """Service class for profile-related operations."""

    RATING_LEVELS = ["Ghost", "Rising", "Popular", "Elite", "Iconic"]

    @staticmethod
    def complete_profile(profile_data: CompleteProfileSchema) -> ProfileModel:
        """
        complete a user's profile with the provided data. This includes validating the user, processing profile pictures, calculating age, and saving the profile information.
        Args:
            profile_data: An instance of CompleteProfileSchema containing the profile information to update
        Returns:
            The updated ProfileModel instance after saving the profile information
        Raises:
            NotFoundError: If the user associated with the profile data is not found
            ForbiddenError: If the user is not active and therefore cannot complete their profile
            BadRequestError: If the avatar is missing or if saving the profile information fails
        """
        user = UserModel.get_by_id(profile_data.user_id)
        if not user:
            raise NotFoundError("User", profile_data.user_id)

        if user.is_active is False:
            raise ForbiddenError("Only verified users can update profile")

        resolved_pictures: list[str] = []
        for picture in profile_data.pictures or []:
            if picture is not None and getattr(picture, "filename", ""):
                saved_url = save_profile_picture(picture, user_id=user.id, picture_type="picture")
                resolved_pictures.append(saved_url)
            elif isinstance(picture, str) and picture.strip():
                resolved_pictures.append(picture.strip())

        resolved_avatar_url = ProfileService._resolve_avatar_url(user.id, profile_data.avatar, resolved_pictures)

        if profile_data.date_of_birth:
            today = datetime.now().date()
            age = today.year - profile_data.date_of_birth.year - (
                (today.month, today.day) < (profile_data.date_of_birth.month, profile_data.date_of_birth.day)
            )
        profile = ProfileModel(
            user_id=profile_data.user_id,
            gender=profile_data.gender,
            age=age,
            date_of_birth=profile_data.date_of_birth,
            city=profile_data.city,
            country=profile_data.country,
            ip_address=profile_data.ip_address,
            latitude=profile_data.latitude,
            longitude=profile_data.longitude,
            bio=profile_data.bio,
            interests=profile_data.interests,
            avatar=resolved_avatar_url,
            pictures=resolved_pictures,
        ).create()
        if not profile:
            raise RuntimeError("Failed to complete profile")
        UserModel.mark_profile_complete(profile_data.user_id)
        return profile
    
    @staticmethod
    def get_my_profile_by_user_id(user_id: int) -> ProfileModel:
        """
        get the profile information for the currently authenticated user by their user ID. This retrieves the profile data associated with the user and returns it.
        Args:
            user_id: The ID of the user whose profile information is being retrieved
        Returns:
            The ProfileModel instance containing the profile information for the specified user ID
        Raises:
            NotFoundError: If no profile is found for the specified user ID
        """
        my_profile = ProfileModel.get_my_profile_by_user_id(user_id)
        if not my_profile:
            raise NotFoundError("User", user_id)
        return my_profile

    @staticmethod
    def get_profile_by_username(username: str) -> ProfileModel:
        """
        get the profile information for a user by their username. This retrieves the profile data associated with the specified username and returns it.
        Args:
            username: The username of the user whose profile information is being retrieved
        Returns:
            The ProfileModel instance containing the profile information for the specified username
        Raises:
            NotFoundError: If no profile is found for the specified username
        """
        profile = ProfileModel.get_profile_by_username(username)
        if not profile:
            raise NotFoundError("User", username)
        return profile


    # @staticmethod
    # def _normalize_rating(value: Any) -> str:
    #     if isinstance(value, str) and value in ProfileService.RATING_LEVELS:
    #         return value

    #     if isinstance(value, (int, float)):
    #         score = int(value)
    #         if score <= 19:
    #             return "Ghost"
    #         if score <= 39:
    #             return "Rising"
    #         if score <= 59:
    #             return "Popular"
    #         if score <= 79:
    #             return "Elite"
    #         return "Iconic"

    #     return "Ghost"

    # @staticmethod
    # def get_rating_for_user(user_id: int) -> str:
    #     likes_count = ProfileLikesService.get_profile_like_count(user_id)
    #     views_count = ProfileViewsService.get_profile_view_count(user_id)
    #     score = likes_count + views_count
    #     return ProfileService._normalize_rating(score)

    # @staticmethod
    # def _resolve_avatar_url(user_id: int, avatar, resolved_pictures: list[str]) -> str:
    #     if avatar is not None and getattr(avatar, "filename", ""):
    #         return save_profile_picture(avatar, user_id=user_id, picture_type="avatar")

    #     if resolved_pictures:
    #         return resolved_pictures[0]

    #     raise BadRequestError("avatar is required")
