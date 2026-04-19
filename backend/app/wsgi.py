"""WSGI entry point for the application."""

import os
import sys
import logging

# Configure logging - reduce verbosity from noisy libraries
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Suppress verbose loggers from libraries
logging.getLogger('watchdog').setLevel(logging.WARNING)
logging.getLogger('asyncio').setLevel(logging.WARNING)
logging.getLogger('werkzeug').setLevel(logging.WARNING)

logger = logging.getLogger(__name__)

try:
    from app import create_app
    from app.config import DevConfig, ProdConfig, TestConfig
except ImportError as e:
    logger.error(f"[WSGI] Failed to import app modules: {e}", exc_info=True)
    sys.exit(1)

FLASK_ENV = os.environ.get("FLASK_ENV", "dev")

try:
    if FLASK_ENV == "prod":
        app = create_app(config_class=ProdConfig)
        logger.info("[WSGI] App created in production mode")
    elif FLASK_ENV == "test":
        app = create_app(config_class=TestConfig)
        logger.info("[WSGI] App created in test mode")
    else:
        app = create_app(config_class=DevConfig)
        logger.info("[WSGI] App created in development mode")
except Exception as e:
    logger.error(f"[WSGI] Failed to create app: {e}", exc_info=True)
    app = None
    sys.exit(1)

if __name__ == "__main__":
    if app is None:
        logger.error("[WSGI] Failed to initialize app")
        sys.exit(1)
    app.run(host="0.0.0.0", port=5000)
