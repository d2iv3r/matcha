"""Authentication feature package."""

from flask import Blueprint

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

from . import routes

__all__ = ['auth_bp']
