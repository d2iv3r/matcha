"""Users feature package."""

from flask import Blueprint

users_bp = Blueprint('users', __name__, url_prefix='/api/users')

from app.api.v1.users import routes

__all__ = ['users_bp']
