"""Profile data validation schemas."""

from datetime import date
from typing import List

from pydantic import BaseModel, Field


class UpdateProfileSchema(BaseModel):
    """Schema for updating user profile info."""

    gender: str = Field(..., pattern=r"^(male|female)$")
    age: int = Field(..., ge=0, le=120)
    date_of_birth: date
    location: str = Field(..., min_length=1, max_length=255)
    bio: str = Field(default="", max_length=500)
    interests: List[str] = Field(..., min_length=1)
    avatar_url: str = Field(..., min_length=1, max_length=255)
