"""Helpers for storing and validating uploaded profile images."""

from __future__ import annotations

import os
import uuid

from flask import current_app


def save_image(file, subfolder: str = "avatars") -> str:
    """Save an image file and return its public URL."""

    ext = file.filename.rsplit(".", 1)[1].lower()
    unique_filename = f"{uuid.uuid4().hex}.{ext}"

    media_root = current_app.config.get("MEDIA_PATH") or os.path.join(current_app.static_folder, "media")
    folder_path = os.path.join(media_root, subfolder)
    os.makedirs(folder_path, exist_ok=True)

    # Save the file
    file_path = os.path.join(folder_path, unique_filename)
    file.save(file_path)

    static_url = current_app.static_url_path or "/static"
    backend_url = (current_app.config.get("BACKEND_URL") or "").rstrip("/")
    url_path = f"{static_url}/media/{subfolder}/{unique_filename}"
    url = f"{backend_url}{url_path}" if backend_url else url_path
    return url
