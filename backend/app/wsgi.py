import os

from app import create_app



FLASK_ENV = os.environ.get("FLASK_ENV", "dev")


if FLASK_ENV == "prod":
    from app.config import ProdConfig
    app = create_app(config_class=ProdConfig)
elif FLASK_ENV == "test":
    from app.config import TestConfig
    app = create_app(config_class=TestConfig)
else:
    from app.config import DevConfig
    app = create_app(config_class=DevConfig)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
