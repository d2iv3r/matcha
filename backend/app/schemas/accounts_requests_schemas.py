"""Profile data validation schemas."""

from datetime import date
from typing import Any, List, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

from app.schemas.profile_schemas import _validate_image_file
from app.utils.profile_media import save_image
from app.schemas.auth_requests_schemas import EMAIL_PATTERN


class CompleteProfileSchema(BaseModel):
    """Schema for updating user profile info."""

    model_config = ConfigDict(arbitrary_types_allowed=True)

    user_id: int
    gender: str = Field(..., pattern=r"^(male|female)$")
    date_of_birth: date
    location: str = Field(..., min_length=1, max_length=255)
    bio: str = Field(default="", max_length=500)
    interests: List[str] = Field(..., min_length=1)
    avatar: Optional[Any] = None
    pictures: List[Any] = Field(default_factory=list)

    @field_validator("avatar")
    @classmethod
    def validate_avatar(cls, value):
        if value is None:
            return value
        if not getattr(value, "filename", ""):
            raise ValueError("avatar must be an uploaded image file")
        return value

    @field_validator("pictures")
    @classmethod
    def validate_pictures(cls, value):
        if value is None:
            return []
        if not isinstance(value, list):
            raise ValueError("pictures must be a list of uploaded image files")
        for file_item in value:
            if file_item is None:
                continue
            if isinstance(file_item, str):
                if not file_item.strip():
                    continue
                continue
            if not getattr(file_item, "filename", ""):
                raise ValueError("Each picture must be an uploaded image file")
        return value

    @model_validator(mode="after")
    def validate_avatar_required(self):
        if self.avatar is None:
            raise ValueError("avatar is required")
        return self


class UpdateAccountProfileSchema(BaseModel):
    """Schema for updating account and profile fields."""

    model_config = ConfigDict(arbitrary_types_allowed=True)

    first_name: Optional[str] = Field(None, max_length=150)
    last_name: Optional[str] = Field(None, max_length=150)
    email: Optional[str] = Field(None, pattern=EMAIL_PATTERN)
    gender: Optional[str] = Field(None, pattern=r"^(male|female)$")
    bio: Optional[str] = Field(None, max_length=500)
    interests: Optional[List[str]] = None

    @model_validator(mode="before")
    @classmethod
    def require_at_least_one_field(cls, values):
        if not isinstance(values, dict):
            return values
        if not any(key in values for key in cls.model_fields):
            raise ValueError("At least one field must be provided for update")
        return values

    @field_validator("interests", mode="before")
    @classmethod
    def normalize_interests(cls, value):
        if value is None:
            return value
        if isinstance(value, list):
            return [str(item).strip() for item in value if str(item).strip()]
        if isinstance(value, str):
            text = value.strip()
            if text.startswith("{") and text.endswith("}"):
                text = text[1:-1]
            if not text:
                return []
            return [item.strip().strip('"').strip("'") for item in text.split(",") if item.strip()]
        return [str(value).strip()]


class UpdateProfileMediaSchema(BaseModel):
    """Schema for updating profile media."""

    model_config = ConfigDict(arbitrary_types_allowed=True)

    avatar: Optional[Any] = None
    pictures: Optional[List[Any]] = None

    @model_validator(mode="before")
    @classmethod
    def require_at_least_one_field(cls, values):
        if not isinstance(values, dict):
            return values
        if not any(key in values for key in cls.model_fields):
            raise ValueError("At least one field must be provided for update")
        return values

    @field_validator("avatar")
    @classmethod
    def validate_avatar(cls, value):
        if value is None:
            return value
        if isinstance(value, str):
            return value
        _validate_image_file(value, "avatar")
        return value

    @field_validator("pictures")
    @classmethod
    def validate_pictures(cls, value):
        if value is None:
            return value
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
    def resolve_media(self):
        if self.avatar is not None and not isinstance(self.avatar, str):
            self.avatar = save_image(self.avatar, subfolder="avatars")

        if self.pictures is None:
            return self

        resolved_pictures: list[str] = []
        for picture in self.pictures:
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


class UpdateSecuritySettingsSchema(BaseModel):
    """Schema for updating user security settings (password)."""

    model_config = ConfigDict(arbitrary_types_allowed=True)

    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=8)
    password_confirm: str = Field(..., min_length=8)

    @model_validator(mode="after")
    def validate_passwords(self):
        if self.new_password != self.password_confirm:
            raise ValueError("new_password and password_confirm must match")
        if self.current_password == self.new_password:
            raise ValueError("new_password must be different from current_password")
        return self
