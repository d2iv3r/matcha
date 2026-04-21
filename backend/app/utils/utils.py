"""Utility functions for the application."""

import hashlib
import secrets
from datetime import datetime, timezone
from typing import Optional


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    pwd_hash = hashlib.sha256((password + salt).encode()).hexdigest()
    return f"{salt}${pwd_hash}"


def verify_password(password: str, hashed_password: str) -> bool:
    try:
        salt, pwd_hash = hashed_password.split("$")
        verify_hash = hashlib.sha256((password + salt).encode()).hexdigest()
        return pwd_hash == verify_hash
    except (ValueError, AttributeError):
        return False


def generate_token(length: int = 32) -> str:
    return secrets.token_urlsafe(length)

def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def format_datetime(dt: Optional[datetime] = None) -> str:
    if dt is None:
        dt = datetime.now(timezone.utc)
    return dt.isoformat()