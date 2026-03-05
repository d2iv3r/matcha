"""Utility functions for the application."""

import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Optional


def hash_password(password: str) -> str:
    """
    Hash a password using SHA-256 with a salt.
    
    Args:
        password: Plain text password
        
    Returns:
        Hashed password with salt
    """
    salt = secrets.token_hex(16)
    pwd_hash = hashlib.sha256((password + salt).encode()).hexdigest()
    return f"{salt}${pwd_hash}"


def verify_password(password: str, hashed_password: str) -> bool:
    """
    Verify a password against a hashed password.
    
    Args:
        password: Plain text password
        hashed_password: Hashed password with salt
        
    Returns:
        True if password matches, False otherwise
    """
    try:
        salt, pwd_hash = hashed_password.split('$')
        verify_hash = hashlib.sha256((password + salt).encode()).hexdigest()
        return pwd_hash == verify_hash
    except (ValueError, AttributeError):
        return False


def generate_token(length: int = 32) -> str:
    """
    Generate a random token.
    
    Args:
        length: Length of the token
        
    Returns:
        Random token string
    """
    return secrets.token_urlsafe(length)


def format_datetime(dt: Optional[datetime] = None) -> str:
    """
    Format datetime to ISO format.
    
    Args:
        dt: Datetime object (defaults to now)
        
    Returns:
        ISO formatted datetime string
    """
    if dt is None:
        dt = datetime.utcnow()
    return dt.isoformat()
