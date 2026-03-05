"""create users table

Revision ID: 610e082572a3
Revises:
Create Date: 2025-11-11 11:06:05.062099

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '610e082572a3'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("""
        CREATE TABLE IF NOT EXISTS users (
               id SERIAL PRIMARY KEY,
               username VARCHAR(50) UNIQUE NOT NULL,
               email VARCHAR(100) UNIQUE NOT NULL,
               hashed_password VARCHAR(255) NOT NULL,
               created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
               updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
            );
    """)


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("DROP TABLE IF EXISTS users;")
