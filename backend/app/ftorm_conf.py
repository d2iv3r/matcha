"""Default configuration values for FTORM initialization."""

import os
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

# Default database configuration (using postgresql)
# For now we support only postgresql, but this can be extended in the future to support other databases like mysql or sqlite.
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/mydatabase")

POOL_MIN_CONNS = int(os.getenv("POOL_MIN_CONNS", 1))
POOL_MAX_CONNS = int(os.getenv("POOL_MAX_CONNS", 10))

# Default list of installed models (empty by default, user should populate this)
INSTALLED_MODELS = [
	"api.v1.users.models",
]

# Default migration directory
MIGRATIONS_DIR = "ftorm/migrations"
