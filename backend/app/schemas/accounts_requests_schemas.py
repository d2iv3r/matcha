"""Profile data validation schemas."""

from datetime import date
from typing import Any, List, Optional

from pydantic import BaseModel, Field
from pydantic import ConfigDict, field_validator, model_validator


class CompleteProfileSchema(BaseModel):
    """Schema for updating user profile info."""

    model_config = ConfigDict(arbitrary_types_allowed=True)

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
