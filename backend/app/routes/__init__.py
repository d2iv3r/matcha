"""Application routes package."""

from .api_routes import api_bp
from .auth_routes import auth_bp
from .docs_routes import docs_bp
from .profile_routes import profile_bp
from .accounts_route import accounts_bp
from .notifications_routes import notifications_bp

__all__ = ["api_bp", "auth_bp", "docs_bp", "profile_bp", "accounts_bp", "notifications_bp"]