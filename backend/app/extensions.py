"""Application extensions registration"""

from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_caching import Cache
from flask_cors import CORS
from flask_migrate import Migrate

db = SQLAlchemy()
jwt = JWTManager()
limiter = Limiter(key_func=get_remote_address)
cache = Cache()
migrate = Migrate()
cors = CORS()

def register_extensions(app:Flask) -> None:
    """Initialize Flask extensions with proper configuration."""
    db.init_app(app)

    jwt.init_app(app)

    limiter.init_app(app)

    cache.init_app(app)

    cors.init_app(app, resources={
        r"/api/*": {"origins": app.config.get('CORS_ORIGINS', '*')}
    })