"""
This module defines CLI commands for seeding the database with mock data.
"""

import logging
import click
from flask import current_app
from app.utils.utils import hash_password
from app.db.queries import SEED_MOCK_USERS_AND_PROFILES, COUNT_USERS

logger = logging.getLogger(__name__)


@click.command("seed-db")
@click.option("--count", default=100, type=int, help="Number of mock users to generate (default: 40)",)
def seed_db(count):
    """
    Seed the database with mock data.

    Examples:
        flask seed                    # Create 10 users with profiles
        flask seed --count 20         # Create 20 users with profiles
    """
    from app.commands.seed import DataSeeder

    try:
        if count <= 0:
            raise click.BadParameter("count must be greater than 0", param_hint="--count")

        result = current_app.db_manager.fetch_one(COUNT_USERS)
        if result and result['count'] > 0:
            click.secho(f"Database already contains {result['count']} users.", fg="yellow")

        click.echo(f"Seeding database with {count // 2} males and {count // 2} females.")
        password_hash = hash_password(current_app.config["MOCK_USERS_PASS"])
        male_seeder = DataSeeder(count=count // 2, gender="male", users_password=password_hash, pexels_api_key=current_app.config["PEXELS_API_KEY"])
        female_seeder = DataSeeder(count=count // 2, gender="female", users_password=password_hash, pexels_api_key=current_app.config["PEXELS_API_KEY"])
        male_users_data = male_seeder.get_mock_users()
        female_users_data = female_seeder.get_mock_users()
        users_rows = current_app.db_manager.execute_values_returning(
            SEED_MOCK_USERS_AND_PROFILES, male_users_data + female_users_data)
        click.secho("Seeding completed successfully!", fg="green", bold=True)
        click.echo("-" * 50)
        click.echo("Summary:")
        click.echo(f"  Users created: {users_rows}")

    except click.BadParameter as e:
        click.secho(f"Invalid parameter: {e.message}", fg="red")
        raise SystemExit(1)
    except Exception as e:
        click.secho(f"Seeding failed: {str(e)}", fg="red")
        logger.exception("[CLI] Seeding error:")
        raise SystemExit(1)