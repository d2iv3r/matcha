"""Profile data validation schemas."""
from datetime import date
from pathlib import Path
from typing import Any, List, Optional

import os
import requests
from flask import current_app, has_app_context
from pydantic import AliasChoices, BaseModel, ConfigDict, Field, field_validator, model_validator

from app.utils.profile_media import save_image


DEFAULT_ALLOWED_PICTURE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}


def _allowed_picture_extensions() -> set[str]:
    if has_app_context():
        return set(current_app.config.get("ALLOWED_PICTURE_EXTENSIONS", DEFAULT_ALLOWED_PICTURE_EXTENSIONS))
    return DEFAULT_ALLOWED_PICTURE_EXTENSIONS

def _max_image_bytes() -> int:
    if has_app_context():
        return int(current_app.config.get("MAX_CONTENT_LENGTH", 8 * 1024 * 1024))
    return 8 * 1024 * 1024


def _get_file_size(file_obj) -> Optional[int]:
    size = getattr(file_obj, "content_length", None)
    if isinstance(size, int) and size > 0:
        return size

    stream = getattr(file_obj, "stream", None)
    if stream is None or not hasattr(stream, "tell") or not hasattr(stream, "seek"):
        return None

    try:
        current_pos = stream.tell()
        stream.seek(0, 2)
        end_pos = stream.tell()
        stream.seek(current_pos)
        return end_pos
    except Exception:
        return None


def _validate_image_file(file_obj, label: str) -> None:
    filename = getattr(file_obj, "filename", "")
    if not filename:
        raise ValueError(f"{label} must be an uploaded image file")

    ext = Path(filename).suffix.lower()
    allowed_extensions = _allowed_picture_extensions()
    if ext not in allowed_extensions:
        allowed = ", ".join(sorted(allowed_extensions))
        raise ValueError(f"{label} must be one of: {allowed}")

    size = _get_file_size(file_obj)
    if size is not None:
        max_bytes = _max_image_bytes()
        if size > max_bytes:
            raise ValueError(f"{label} must be smaller than {max_bytes} bytes")


class CreateProfileSchema(BaseModel):
    """Schema for creating a new user profile."""

    model_config = ConfigDict(arbitrary_types_allowed=True)

    user_id: int
    gender: str = Field(..., pattern=r"^(male|female)$")
    date_of_birth: date
    age: Optional[int] = None
    gender_preference: str = Field(default="all", pattern=r"^(male|female|all)$")
    city: str = Field(..., min_length=1, max_length=255)
    country: str = Field(..., min_length=1, max_length=255)
    ip_address: Optional[str] = Field(None, max_length=45)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    bio: str = Field(..., max_length=500)
    interests: List[str]
    avatar: Any
    pictures: List[Any]

    @field_validator("avatar")
    @classmethod
    def validate_avatar(cls, value):
        if value is None:
            raise ValueError("avatar is required")
        if isinstance(value, str):
            if not value.strip():
                 raise ValueError("avatar URL cannot be empty")
            return value
        _validate_image_file(value, "avatar")
        return value

    @field_validator("pictures")
    @classmethod
    def validate_pictures(cls, value):
        if value is None:
            raise ValueError("pictures are required")
        if not isinstance(value, list):
            raise ValueError("pictures must be a list of uploaded image files")
        for file_item in value:
            if file_item is None:
                continue
            if isinstance(file_item, str):
                if not file_item.strip():
                    continue
                continue
            _validate_image_file(file_item, "picture")
        return value

    @model_validator(mode="after")
    def calculate_and_validate_age(self) -> "CreateProfileSchema":
        """Calculate age from date_of_birth and ensure user is at least 18."""
        today = date.today()
        dob = self.date_of_birth
        age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))

        if age < 18:
            raise ValueError("You must be at least 18 years old to use Matcha")

        self.age = age
        return self

    @model_validator(mode="after")
    def validate_location(self) -> "CreateProfileSchema":
        """Ensure location data is present or fetch it using Nominatim (OpenStreetMap) API."""
        # If latitude and longitude are already provided, we are good
        if self.latitude is not None and self.longitude is not None:
            return self

        # Otherwise, city and country must be present
        if not self.city or not self.country:
            raise ValueError("City and country are required if latitude/longitude are not provided")

        # Fetch from Nominatim (OpenStreetMap) - Free and no API key required
        address = f"{self.city}, {self.country}"
        try:
            # Nominatim requires a descriptive User-Agent
            headers = {"User-Agent": "MatchaApp/1.0 (contact@matcha.com)"}
            url = f"https://nominatim.openstreetmap.org/search?q={address}&format=json&limit=1"
            response = requests.get(url, headers=headers, timeout=5)
            data = response.json()

            if data and len(data) > 0:
                self.latitude = float(data[0]["lat"])
                self.longitude = float(data[0]["lon"])
            else:
                raise ValueError(f"Could not find coordinates for: {address}")
        except Exception as e:
            if isinstance(e, ValueError):
                raise e
            raise ValueError(f"Geocoding service error: {str(e)}")

        return self

    @field_validator("interests", mode="before")
    @classmethod
    def normalize_interests(cls, value):
        if value is None:
            return value

        items: list[str] = []
        if isinstance(value, list):
            items = [str(item).strip() for item in value if str(item).strip()]
        elif isinstance(value, str):
            text = value.strip()
            if text.startswith("{") and text.endswith("}"):
                text = text[1:-1]
            if text:
                items = [item.strip().strip('"').strip("'") for item in text.split(",") if item.strip()]
        else:
            items = [str(value).strip()]

        return items

    @model_validator(mode="after")
    def resolve_media(self):
        if self.avatar is None and not self.pictures:
            return self

        if self.avatar is not None and not isinstance(self.avatar, str):
            self.avatar = save_image(self.avatar, subfolder="avatars")

        resolved_pictures: list[str] = []
        for picture in self.pictures or []:
            if picture is None:
                continue
            if isinstance(picture, str):
                if picture.strip():
                    resolved_pictures.append(picture.strip())
                continue
            if getattr(picture, "filename", ""):
                resolved_pictures.append(save_image(picture, subfolder="pictures"))

        self.pictures = resolved_pictures
        return self
