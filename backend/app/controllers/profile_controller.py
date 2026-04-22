"""Controller for profile-related operations."""

import json

from flask import request, g
from flask_jwt_extended import get_jwt_identity

from app.schemas.profile_schemas import CreateProfileSchema
from app.services.profile_service import ProfileService
from app.services.profile_views_service import ProfileViewsService
from app.services.profile_likes_service import ProfileLikesService
from app.utils.response import success


class ProfileController:
    """Controller for profile endpoints."""

    @staticmethod
    def complete_profile():
        """complete profile fields for authenticated verified user."""
        if hasattr(g, 'current_user') and g.current_user:
            user_id = g.current_user['id']
        else:
            user_id = int(get_jwt_identity())

        raw_payload = request.get_json(silent=True)
        if raw_payload is None:
            raw_payload = request.form.to_dict(flat=True)
        avatar = request.files.get("avatar")
        pictures = request.files.getlist("pictures")
        raw_payload["user_id"] = user_id
        raw_payload["avatar"] = avatar
        raw_payload["pictures"] = pictures
        raw_payload["interersts"] = request.form.getlist("interests")
        payload = CreateProfileSchema.model_validate(raw_payload)
        data = payload.model_dump()
        print(f"Received profile completion request with payload: {data}")
        profile = ProfileService.complete_profile(data)

        return success(
            message="Profile Completed successfully",
            data={}
        )

    @staticmethod
    def get_my_profile():
        if hasattr(g, 'current_user') and g.current_user:
            user_id = g.current_user['id']
        else:
            user_id = int(get_jwt_identity())

        profile = ProfileService.get_my_profile_by_user_id(user_id)
        # view_count = ProfileViewsService.get_profile_view_count(user_id)
        # recent_viewers = ProfileViewsService.get_profile_viewers(user_id, limit=5)
        data = {}
        data['profile'] = profile.to_dict()
        # payload["profile_views"] = {
        #     "total_views": view_count,
        #     "recent_viewers": [viewer.model_dump(exclude_none=True) if hasattr(viewer, "model_dump") else viewer for viewer in recent_viewers],
        # }

        # like_count = ProfileLikesService.get_profile_like_count(user_id)
        # recent_likers = ProfileLikesService.get_profile_likers(user_id, limit=5)

        # payload["profile_likes"] = {
        #     "total_likes": like_count,
        #     "recent_likers": [liker.model_dump(exclude_none=True) if hasattr(liker, "model_dump") else liker for liker in recent_likers],
        # }

        return success(data=data)

    @staticmethod
    def get_profile_by_username(username: str):
        """Get a specific user's profile by username and record the view."""
        viewer_id = int(get_jwt_identity())
        profile = ProfileService.get_profile_by_username(username)
        is_match = False
        if viewer_id != profile.id:
            ProfileViewsService.record_profile_view(profile.id, viewer_id)
            is_match = ProfileLikesService.is_mutual_like(viewer_id, profile.id)
        data = {}
        data["profile"] = profile.to_dict()
        data["is_match"] = is_match

        return success(data)

    @staticmethod
    def get_profile_by_user_id(user_id: int):
        """Get a specific user's profile and record the view."""
        viewer_id = int(get_jwt_identity())
        if viewer_id != user_id:
            ProfileViewsService.record_profile_view(user_id, viewer_id)

        payload = ProfileService.get_profile_by_user_id(user_id)
        if isinstance(payload, dict):
            base_profile = payload.get("profile") or payload.get("user") or {}
        else:
            base_profile = payload.profile.model_dump(exclude_none=True)
        response_payload = {
            "user": base_profile,
            "profile": base_profile,
            "is_match": viewer_id != user_id and ProfileLikesService.is_mutual_like(viewer_id, user_id),
        }
        return success(response_payload, 200)

    @staticmethod
    def get_profiles_list():
        viewer_id = int(get_jwt_identity())
        limit = int(request.args.get("limit", 20))
        offset = int(request.args.get("offset", 0))
        profiles = ProfileService.get_profiles_list(limit=limit, offset=offset)

        filtered_profiles = []
        for p in profiles:
            if isinstance(p, dict):
                profile_user_id = p.get("user_id")
                username = p.get("username")
                age = p.get("age")
                location = p.get("location")
                rating = p.get("rating")
            else:
                profile_user_id = p.user_id
                username = p.username
                age = p.age
                location = p.location
                rating = p.rating
            is_match = (
                profile_user_id is not None
                and profile_user_id != viewer_id
                and ProfileLikesService.is_mutual_like(viewer_id, profile_user_id)
            )
            filtered_profiles.append({
                "username": username,
                "age": age,
                "location": location,
                "rating": ProfileController._normalize_rating(rating),
                "is_match": is_match,
            })

        return success({"profiles": filtered_profiles, "count": len(filtered_profiles)}, 200)