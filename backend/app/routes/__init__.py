"""Application routes package."""

from .api_routes import api_bp
from .auth_routes import auth_bp
from .docs_routes import docs_bp
from .profile_routes import profile_bp
from .user_routes import users_bp

__all__ = ["api_bp", "auth_bp", "docs_bp", "profile_bp", "users_bp"]