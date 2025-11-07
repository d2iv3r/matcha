import os

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "default_secret_key")


class DevConfig(Config):
    DEBUG = True


class ProdConfig(Config):
    DEBUG = False


class TestConfig(Config):
    TESTING = True