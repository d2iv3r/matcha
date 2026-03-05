"""WSGI entry point for the application."""

import os
from app import create_app


FLASK_ENV = os.environ.get("FLASK_ENV", "dev")


if FLASK_ENV == "prod":
    from app.config import ProdConfig
    try:
        app = create_app(config_class=ProdConfig)
    except Exception as e:
        print("Failed to create app in production mode:", e)
        app = None
elif FLASK_ENV == "test":
    from app.config import TestConfig
    try:
        app = create_app(config_class=TestConfig)
    except Exception as e:
        print("Failed to create app in test mode:", e)
        app = None
else:
    from app.config import DevConfig
    try:
        app = create_app(config_class=DevConfig)
    except Exception as e:
        print("Failed to create app in development mode:", e)
        app = None

if __name__ == "__main__":
    if app is None:
        print("Error: App failed to initialize.")
        exit(1)
    app.run(host="0.0.0.0", port=5000)
