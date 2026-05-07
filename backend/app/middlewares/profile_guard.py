"""Profile completion access guard."""

from __future__ import annotations

from functools import wraps
from typing import Callable, TypeVar

from flask import jsonify
from flask_jwt_extended import get_jwt_identity

from app.models import UserModel

F = TypeVar("F", bound=Callable)


def profile_completion_required(view_func: F) -> F:
    """Block access unless the current user has completed their profile."""

    @wraps(view_func)
    def wrapper(*args, **kwargs):
        identity = get_jwt_identity()
        if identity is None:
            return jsonify({"success": False, "error": "Authentication required"}), 401

        user = UserModel.get_user_by_id(int(identity))
        if not user:
            return jsonify({"success": False, "error": "User not found"}), 404

        is_profile_complete = (
            user.get("is_profile_complete", False)
            if isinstance(user, dict)
            else bool(getattr(user, "is_profile_complete", False))
        )

        if not is_profile_complete:
            return jsonify(
                {
                    "success": False,
                    "error": "Profile completion required",
                    "message": "Complete your profile at /api/v1/account/complete-profile to continue",
                }
            ), 403

        return view_func(*args, **kwargs)

    return wrapper
