"""Profile data validation schemas."""

from datetime import date
from typing import Any, List, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


class CreateProfileSchema(BaseModel):
    """Schema for creating a new user profile."""

    model_config = ConfigDict(arbitrary_types_allowed=True)

    user_id: int
    gender: str = Field(..., pattern=r"^(male|female)$")
    date_of_birth: date
    city: Optional[str] = None
    country: Optional[str] = None
    ip_address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
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
