"""Helpers for storing and validating uploaded profile images."""

from __future__ import annotations

from pathlib import Path
from uuid import uuid4

from flask import current_app
from werkzeug.utils import secure_filename

from app.utils.app_error import BadRequestError

ALLOWED_PROFILE_PICTURE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}


def _static_root() -> Path:
    return Path(current_app.static_folder or (Path(current_app.root_path) / "static"))


def _upload_directory(user_id: int, picture_type: str = "avatar") -> Path:
    if picture_type == "avatar":
        subdir = current_app.config.get("PROFILE_AVATARS_UPLOAD_SUBDIR", Path("uploads") / "avatars")
    elif picture_type == "picture":
        subdir = current_app.config.get("PROFILE_PICTURES_UPLOAD_SUBDIR", Path("uploads") / "pictures")
    else:
        raise ValueError(f"Invalid picture_type: {picture_type}. Must be 'avatar' or 'picture'.")
    return _static_root() / Path(subdir) / str(user_id)


def save_profile_picture(file_storage, *, user_id: int, picture_type: str = "avatar") -> str:
    """Persist an uploaded image and return its public static URL."""
    filename = secure_filename(getattr(file_storage, "filename", ""))
    if not filename:
        raise BadRequestError("avatar_file is required")

    if getattr(file_storage, "mimetype", "") and not file_storage.mimetype.startswith("image/"):
        raise BadRequestError("avatar_file must be an image")

    suffix = Path(filename).suffix.lower()
    if suffix not in ALLOWED_PROFILE_PICTURE_EXTENSIONS:
        raise BadRequestError("Unsupported avatar_file format")

    upload_dir = _upload_directory(user_id, picture_type)
    upload_dir.mkdir(parents=True, exist_ok=True)

    stored_name = f"{uuid4().hex}{suffix}"
    file_path = upload_dir / stored_name
    file_storage.save(file_path)

    relative_path = file_path.relative_to(_static_root())
    return f"/static/{relative_path.as_posix()}"