import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env (safe for dev)
load_dotenv()

class BaseConfig:
    SECRET_KEY = os.environ.get("SECRET_KEY", "default_secret_key")
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", SECRET_KEY)
    JWT_TOKEN_LOCATION = ["headers", "cookies"]
    JWT_HEADER_NAME = "Authorization"
    JWT_HEADER_TYPE = "Bearer"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=int(os.environ.get("JWT_ACCESS_TOKEN_MINUTES", 15)))
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=int(os.environ.get("JWT_REFRESH_TOKEN_DAYS", 30)))
    JWT_COOKIE_SECURE = os.environ.get("JWT_COOKIE_SECURE", "false").lower() == "true"
    JWT_COOKIE_SAMESITE = os.environ.get("JWT_COOKIE_SAMESITE", "Lax")
    JWT_COOKIE_CSRF_PROTECT = os.environ.get("JWT_COOKIE_CSRF_PROTECT", "true").lower() == "true"
    JWT_REFRESH_COOKIE_PATH = "/api/auth/refresh"
    JWT_ACCESS_COOKIE_PATH = "/"
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