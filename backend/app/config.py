import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env (safe for dev)
load_dotenv()

class BaseConfig:
    SECRET_KEY = os.environ.get("SECRET_KEY", "default_secret_key")
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", SECRET_KEY)
    JWT_TOKEN_LOCATION = ["cookies", "headers"]
    JWT_HEADER_NAME = "Authorization"
    JWT_HEADER_TYPE = "Bearer"
    JWT_COOKIE_SECURE = os.environ.get("JWT_COOKIE_SECURE", "false").lower() == "true"
    JWT_COOKIE_HTTPONLY = True
    JWT_COOKIE_SAMESITE = os.environ.get("JWT_COOKIE_SAMESITE", "Lax")
    JWT_COOKIE_CSRF_PROTECT = os.environ.get("JWT_COOKIE_CSRF_PROTECT", "false").lower() == "true"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=int(os.environ.get("JWT_ACCESS_TOKEN_MINUTES", 15)))
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=int(os.environ.get("JWT_REFRESH_TOKEN_DAYS", 30)))
    JWT_ACCESS_COOKIE_NAME = "access_token_cookie"
    JWT_REFRESH_COOKIE_NAME = "refresh_token_cookie"
    JWT_ACCESS_COOKIE_PATH = "/"
    JWT_REFRESH_COOKIE_PATH = "/"
    SQL_MIGRATIONS_DIR = os.environ.get("SQL_MIGRATIONS_DIR", "db/migrations")
    FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")
    BACKEND_URL = os.environ.get("BACKEND_URL", "http://localhost:5000")
    PASSWORD_RESET_TOKEN_MAX_AGE = int(os.environ.get("PASSWORD_RESET_TOKEN_MAX_AGE", 3600))
    MAIL_HOST = os.environ.get("MAIL_HOST")
    MAIL_PORT = int(os.environ.get("MAIL_PORT", 587))
    MAIL_USER = os.environ.get("MAIL_USER")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")
    MAIL_USE_TLS = os.environ.get("MAIL_USE_TLS", "true").lower() == "true"
    MAIL_USE_SSL = os.environ.get("MAIL_USE_SSL", "false").lower() == "true"
    MAX_CONTENT_LENGTH = int(os.environ.get("MAX_CONTENT_LENGTH", 32 * 1024 * 1024))
    MEDIA_PATH = os.environ.get("MEDIA_PATH", "static/media")
    AVATARS_UPLOAD_PATH = os.environ.get("AVATARS_UPLOAD_PATH", os.path.join(MEDIA_PATH, "avatars"))
    PICTURES_UPLOAD_PATH = os.environ.get("PICTURES_UPLOAD_PATH", os.path.join(MEDIA_PATH, "pictures"))
    ALLOWED_PICTURE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
    PROFILE_PICTURES_UPLOAD_SUBDIR = os.environ.get(
        "PROFILE_PICTURES_UPLOAD_SUBDIR",
        os.path.join("uploads", "pictures"),
    )
    SOCKETIO_CORS_ORIGINS = os.environ.get("SOCKETIO_CORS_ORIGINS", FRONTEND_URL)
    SOCKETIO_ASYNC_MODE = os.environ.get("SOCKETIO_ASYNC_MODE", "threading")
    SOCKETIO_PING_INTERVAL = int(os.environ.get("SOCKETIO_PING_INTERVAL", 25))
    SOCKETIO_PING_TIMEOUT = int(os.environ.get("SOCKETIO_PING_TIMEOUT", 60))
    SOCKETIO_MAX_HTTP_BUFFER_SIZE = int(
        os.environ.get("SOCKETIO_MAX_HTTP_BUFFER_SIZE", 1000000)
    )

    # 42 Intra OAuth2
    INTRA42_CLIENT_ID = os.environ.get("INTRA42_CLIENT_ID")
    INTRA42_CLIENT_SECRET = os.environ.get("INTRA42_CLIENT_SECRET")
    INTRA42_AUTHORIZE_URL = os.environ.get("INTRA42_AUTHORIZE_URL", "https://api.intra.42.fr/oauth/authorize")
    INTRA42_ACCESS_TOKEN_URL = os.environ.get("INTRA42_ACCESS_TOKEN_URL", "https://api.intra.42.fr/oauth/token")
    INTRA42_USER_INFO_URL = os.environ.get("INTRA42_USER_INFO_URL", "https://api.intra.42.fr/v2/me")
    INTRA42_REDIRECT_URI = os.environ.get("INTRA42_REDIRECT_URI", f"{BACKEND_URL}/api/auth/oauth2/42/callback")


class DevConfig(BaseConfig):
    DEBUG = True
    DB_POOL_MIN_CONN = 2
    DB_POOL_MAX_CONN = 5
    DATABASE_URL = os.environ.get("DATABASE_URL")


class ProdConfig(BaseConfig):
    DEBUG = False
    DB_POOL_MIN_CONN = 10
    DB_POOL_MAX_CONN = 50
    DATABASE_URL = os.environ.get("DATABASE_URL")


class TestConfig(BaseConfig):
    TESTING = True
    DB_POOL_MIN = 5
    DB_POOL_MAX = 15
    DATABASE_URL = ""