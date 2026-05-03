"""Controller for profile-related operations."""

import json

from flask import request, g
from flask_jwt_extended import get_jwt_identity

from app.schemas.profile_schemas import CreateProfileSchema
from app.schemas.accounts_requests_schemas import UpdateAccountProfileSchema, UpdateProfileMediaSchema, UpdateSecuritySettingsSchema
from app.services.profile_service import ProfileService
from app.services.user_service import UserService
from app.services.profile_views_service import ProfileViewsService
from app.services.profile_likes_service import ProfileLikesService
from app.utils.response import success


class ProfileController:
    """Controller for profile endpoints."""

    @staticmethod
    def complete_profile():
        """complete profile fields for authenticated verified user."""

        user_id = int(get_jwt_identity())
        raw_payload = request.get_json(silent=True)
        if raw_payload is None:
            raw_payload = request.form.to_dict(flat=True)
        avatar = request.files.get("avatar")
        pictures = request.files.getlist("pictures")
        raw_payload["user_id"] = user_id
        raw_payload["avatar"] = avatar
        raw_payload["pictures"] = pictures
        raw_payload["interests"] = request.form.getlist("interests")
        print(f"-->> data before validation == {raw_payload}")
        payload = CreateProfileSchema.model_validate(raw_payload)
        data = payload.model_dump()
        print(f"-->> data after validation == {data}")
        profile = ProfileService.complete_profile(data)
        print('-------------')
        if not profile:
            return {"status": "error", "message": "Profile already exists or could not be created."}, 400

        data = profile.to_dict()
        return success(
            message="Profile Completed successfully",
            data={"profile": data}
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
        profile = ProfileService.get_profile_by_username(username, requester_id=viewer_id)
        is_match = False
        if viewer_id != profile.user_id:
            ProfileViewsService.record_profile_view(profile.user_id, viewer_id)
            is_match = ProfileLikesService.is_mutual_like(viewer_id, profile.user_id)
        data = {}
        data["profile"] = profile.to_dict()
        data["is_match"] = is_match
        data["is_liked"] = ProfileLikesService.has_liked_profile(profile.user_id, viewer_id)

        return success(data)

    @staticmethod
    def get_profile_by_user_id(user_id: int):
        """Get a specific user's profile and record the view."""
        viewer_id = int(get_jwt_identity())
        if viewer_id != user_id:
            ProfileViewsService.record_profile_view(user_id, viewer_id)

        payload = ProfileService.get_profile_by_user_id(user_id, requester_id=viewer_id)
        if isinstance(payload, dict):
            base_profile = payload.get("profile") or payload.get("user") or {}
        else:
            base_profile = payload.profile.model_dump(exclude_none=True)
        response_payload = {
            "user": base_profile,
            "profile": base_profile,
            "is_match": viewer_id != user_id and ProfileLikesService.is_mutual_like(viewer_id, user_id),
            "is_liked": ProfileLikesService.has_liked_profile(user_id, viewer_id)
        }
        return success(response_payload, 200)

    @staticmethod
    def get_profiles_list():
        """Return opposite-gender profiles ordered by proximity to the authenticated user."""
        viewer_id = int(get_jwt_identity())
        limit = int(request.args.get("limit", 20))
        offset = int(request.args.get("offset", 0))
        profiles = ProfileService.get_profiles_list(user_id=viewer_id, limit=limit, offset=offset)
        result = []
        for p in profiles:
            entry = p.to_dict()
            entry["is_liked"] = (
                p.user_id is not None
                and ProfileLikesService.has_liked_profile(p.user_id, viewer_id)
            )
            entry["is_match"] = (
                p.user_id is not None
                and ProfileLikesService.is_mutual_like(viewer_id, p.user_id)
            )
            distance_km = getattr(p, "distance_km", None)
            if distance_km is not None:
                entry["distance_km"] = round(float(distance_km), 1)
            entry["shared_tags_count"] = getattr(p, "shared_tags_count", 0)
            result.append(entry)

        return success({"profiles": result, "count": len(result)}, 200)

    @staticmethod
    def update_my_profile():
        user_id = int(get_jwt_identity())

        raw_payload = request.get_json(silent=True)
        if raw_payload is None:
            raw_payload = request.form.to_dict(flat=True)
        if raw_payload is None:
            raw_payload = {}

        if "interests" not in raw_payload and request.form:
            interests = request.form.getlist("interests")
            if interests or "interests" in request.form:
                raw_payload["interests"] = interests

        payload = UpdateAccountProfileSchema.model_validate(raw_payload)
        data = payload.model_dump(exclude_none=True)
        print(f"-->> data after validation == {data}")

        user_fields = {}
        for key in ("first_name", "last_name", "email"):
            if key in data:
                user_fields[key] = data.pop(key)

        if user_fields:
            UserService.update_account_fields(user_id=user_id, **user_fields)

        if data:
            ProfileService.update_profile_fields(user_id, data)
        return success(message="Profile updated successfully", data={})

    @staticmethod
    def update_profile_media():
        user_id = int(get_jwt_identity())

        raw_payload = {}
        avatar = request.files.get("avatar")
        if avatar is not None:
            raw_payload["avatar"] = avatar

        pictures = request.files.getlist("pictures")
        existing_pictures = request.form.getlist("pictures")
        if pictures or existing_pictures:
            raw_payload["pictures"] = pictures + existing_pictures

        payload = UpdateProfileMediaSchema.model_validate(raw_payload)
        data = payload.model_dump(exclude_none=True)
        print(f"-->> media data after validation == {data}")

        if data:
            ProfileService.update_profile_fields(user_id, data)
        return success(message="Profile media updated successfully", data={})

    @staticmethod
    def update_security_settings():
        user_id = int(get_jwt_identity())
        raw_payload = request.get_json(silent=True)
        if raw_payload is None:
            raw_payload = request.form.to_dict(flat=True)
        if not raw_payload:
            raw_payload = {}

        payload = UpdateSecuritySettingsSchema.model_validate(raw_payload)
        UserService.update_password(
            user_id=user_id,
            current_password=payload.current_password,
            new_password=payload.new_password
        )
        return success(message="Password updated successfully", data={})

    @staticmethod
    def search_profiles():
        """Advanced search for profiles."""
        viewer_id = int(get_jwt_identity())
        
        limit = request.args.get("limit", 20, type=int)
        offset = request.args.get("offset", 0, type=int)
        first_name = request.args.get("first_name")
        last_name = request.args.get("last_name")
        city = request.args.get("city")
        min_age = request.args.get("min_age", type=int)
        max_age = request.args.get("max_age", type=int)
        rating = request.args.get("rating")
        interests = request.args.getlist("interests")

        filters = {
            "first_name": first_name,
            "last_name": last_name,
            "city": city,
            "min_age": min_age,
            "max_age": max_age,
            "rating": rating,
            "interests": interests if interests else None,
            "limit": limit,
            "offset": offset,
        }

        profiles = ProfileService.search_profiles(user_id=viewer_id, filters=filters)
        
        result = []
        for p in profiles:
            entry = p.to_dict()
            entry["is_liked"] = (
                p.user_id is not None
                and ProfileLikesService.has_liked_profile(p.user_id, viewer_id)
            )
            entry["is_match"] = (
                p.user_id is not None
                and ProfileLikesService.is_mutual_like(viewer_id, p.user_id)
            )
            distance_km = getattr(p, "distance_km", None)
            if distance_km is not None:
                entry["distance_km"] = round(float(distance_km), 1)
            result.append(entry)

        return success(message="Profiles retrieved successfully", data={"profiles": result, "count": len(result)})