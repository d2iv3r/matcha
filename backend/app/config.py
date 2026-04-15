import os
from dotenv import load_dotenv

# Load environment variables from .env (safe for dev)
load_dotenv()

class BaseConfig:
    SECRET_KEY = os.environ.get("SECRET_KEY", "default_secret_key")
    FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")
    MAIL_SERVER = os.environ.get("MAIL_SERVER")
    MAIL_PORT = int(os.environ.get("MAIL_PORT", 587))
    MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")
    MAIL_USE_TLS = os.environ.get("MAIL_USE_TLS", "true").lower() == "true"
    MAIL_USE_SSL = os.environ.get("MAIL_USE_SSL", "false").lower() == "true"
    MAIL_DEFAULT_SENDER = os.environ.get("MAIL_DEFAULT_SENDER") or os.environ.get("MAIL_USERNAME")


class DevConfig(BaseConfig):
    DEBUG = True
    DB_POOL_MIN_CONN = 2
    DB_POOL_MAX_CONN = 5
    DATABASE_URL = os.environ.get("DATABASE_URL")
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class ProdConfig(BaseConfig):
    DEBUG = False
    DB_POOL_MIN_CONN = 10
    DB_POOL_MAX_CONN = 50
    DATABASE_URL = os.environ.get("DATABASE_URL")
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class TestConfig(BaseConfig):
    TESTING = True
    DB_POOL_MIN = 5
    DB_POOL_MAX = 15
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "sqlite:///:memory:")
    SQLALCHEMY_TRACK_MODIFICATIONS = False