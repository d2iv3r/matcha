"""Profile business logic."""

from __future__ import annotations

from app.models.profile_model import ProfileModel
from app.models.user_model import UserModel
from app.utils.app_error import ForbiddenError, NotFoundError


class ProfileService:
    """Service class for profile-related operations."""

    RATING_LEVELS = ["Ghost", "Rising", "Popular", "Elite", "Iconic"]

    @staticmethod
    def complete_profile(profile_data: dict) -> ProfileModel:
        """
        complete a user's profile with the provided data. This includes validating the user, processing profile pictures, calculating age, and saving the profile information.
        Args:
            profile_data: Dict containing the profile information to update
        Returns:
            The updated ProfileModel instance after saving the profile information
        Raises:
            NotFoundError: If the user associated with the profile data is not found
            ForbiddenError: If the user is not active and therefore cannot complete their profile
            BadRequestError: If the avatar is missing or if saving the profile information fails
        """
        user = UserModel.get_user_by_id(profile_data.get("user_id"))
        if not user:
            raise NotFoundError("User", profile_data.get("user_id"))

        print(f"Completing profile for user_id: {profile_data.get('user_id')}, username: {user.username}")
        if user.is_active is False:
            raise ForbiddenError("Only verified users can update profile")

        print(f"Resolved avatar URL: {profile_data.get('avatar')}")
        print(f"Resolved pictures URLs: {profile_data.get('pictures')}")
        print("creating profile ------------:")
        profile = ProfileModel(**profile_data).create()
        print(f"Profile created successfully for user_id: {profile_data.get('user_id')}")
        UserModel.mark_profile_complete(profile_data.get("user_id"))
        print(f"Profile marked as complete for user_id: {profile_data.get('user_id')}")
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
    def get_profile_by_user_id(user_id: int, requester_id: int | None = None) -> ProfileModel:
        """
        get the profile information for a user by their user ID.
        Args:
            user_id: The ID of the user whose profile information is being retrieved
            requester_id: The ID of the user requesting the profile
        Returns:
            The ProfileModel instance containing the profile information
        Raises:
            NotFoundError: If no profile is found
            ForbiddenError: If there is a block
        """
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
        """
        get the profile information for a user by their username. This retrieves the profile data associated with the specified username and returns it.
        Args:
            username: The username of the user whose profile information is being retrieved
            requester_id: The ID of the user requesting the profile
        Returns:
            The ProfileModel instance containing the profile information for the specified username
        Raises:
            NotFoundError: If no profile is found for the specified username
            ForbiddenError: If there is a block between the users
        """
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
        """
        Return a list of profiles filtered by the opposite gender of the caller and ordered
        by geographical proximity using latitude/longitude.
        Args:
            user_id: The ID of the currently authenticated user (the getter)
            limit:   Maximum number of profiles to return
            offset:  Pagination offset
        Returns:
            List of ProfileModel instances sorted by ascending distance
        Raises:
            NotFoundError: If the caller has no profile (cannot determine gender/location)
        """
        caller_profile = ProfileModel.get_my_profile_by_user_id(user_id)
        if not caller_profile:
            raise NotFoundError("Profile", user_id)

        gender_map = {"male": "female", "female": "male"}
        opposite_gender = gender_map.get((caller_profile.gender or "").lower(), "female")

        latitude = caller_profile.latitude or 0.0
        longitude = caller_profile.longitude or 0.0
        interests = caller_profile.interests or []

        return ProfileModel.get_profiles_list(
            user_id=user_id,
            gender=opposite_gender,
            latitude=latitude,
            longitude=longitude,
            interests=interests,
            limit=limit,
            offset=offset,
        )

    @staticmethod
    def update_profile_fields(user_id: int, profile_data: dict) -> ProfileModel:
        profile = ProfileModel.update_profile_by_user_id(
            user_id=user_id,
            gender=profile_data.get("gender"),
            bio=profile_data.get("bio"),
            interests=profile_data.get("interests"),
            avatar=profile_data.get("avatar"),
            pictures=profile_data.get("pictures"),
        )
        if not profile:
            raise NotFoundError("Profile", user_id)
        return profile

    @staticmethod
    def search_profiles(user_id: int, filters: dict) -> list[ProfileModel]:
        caller_profile = ProfileModel.get_my_profile_by_user_id(user_id)
        if not caller_profile:
            raise NotFoundError("Profile", user_id)

        gender_map = {"male": "female", "female": "male"}
        opposite_gender = gender_map.get((caller_profile.gender or "").lower(), "female")

        latitude = caller_profile.latitude or 0.0
        longitude = caller_profile.longitude or 0.0

        return ProfileModel.search_profiles(
            user_id=user_id,
            gender=opposite_gender,
            latitude=latitude,
            longitude=longitude,
            first_name=filters.get("first_name"),
            last_name=filters.get("last_name"),
            city=filters.get("city"),
            min_age=filters.get("min_age"),
            max_age=filters.get("max_age"),
            rating=filters.get("rating"),
            interests=filters.get("interests"),
            limit=filters.get("limit", 20),
            offset=filters.get("offset", 0),
        )



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
