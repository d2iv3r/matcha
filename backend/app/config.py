import os
from dotenv import load_dotenv

# Load environment variables from .env (safe for dev)
load_dotenv()

class BaseConfig:
    SECRET_KEY = os.environ.get("SECRET_KEY", "default_secret_key")


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