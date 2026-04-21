"""Profile data validation schemas."""

from datetime import date
from pathlib import Path
from typing import Any, List, Optional

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
    city: str = Field(..., min_length=1, max_length=255)
    country: str = Field(..., min_length=1, max_length=255)
    ip_address: str = Field(..., min_length=1, max_length=45)
    latitude: float
    longitude: float
    bio: str = Field(..., max_length=500)
    interests: str = Field(
        ...,
        min_length=1,
        validation_alias=AliasChoices("interests", "interersts"),
    )
    avatar: Any
    pictures: List[Any]

    @field_validator("avatar")
    @classmethod
    def validate_avatar(cls, value):
        if value is None:
            raise ValueError("avatar is required")
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
                return text
            if text:
                items = [item.strip() for item in text.split(",") if item.strip()]
        else:
            items = [str(value).strip()]

        if not items:
            return "{}"

        formatted_items: list[str] = []
        for item in items:
            escaped = item.replace('"', '\\"')
            if any(char.isspace() for char in escaped) or "," in escaped:
                formatted_items.append(f'"{escaped}"')
            else:
                formatted_items.append(escaped)
        return "{" + ",".join(formatted_items) + "}"

    @model_validator(mode="after")
    def resolve_media(self):
        if self.date_of_birth:
            today = date.today()
            self.age = today.year - self.date_of_birth.year - (
                (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
            )

        if self.avatar is None and not self.pictures:
            return self

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
