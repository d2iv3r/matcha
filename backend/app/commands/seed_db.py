"""
This module defines CLI commands for seeding the database with mock data.
"""

import logging
import click
from flask import current_app
from app.db.queries.users_queries import SEED_USERS
from app.db.queries.profile_queries import SEED_PROFILES, COUNT_PROFILES

logger = logging.getLogger(__name__)


@click.command("seed-db")
@click.option("--count", default=40, type=int, help="Number of mock users to generate (default: 40)",)
@click.option("--force", is_flag=True, help="Force seeding even if database is not empty")
def seed_db(count, force):
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

        # Check if profiles already exist
        if not force:
            result = current_app.db_manager.fetch_one(COUNT_PROFILES)
            if result and result['count'] > 0:
                click.secho(f"Database already contains {result['count']} profiles.", fg="yellow")
                if not click.confirm("Do you want to continue seeding?"):
                    click.echo("Seeding cancelled.")
                    return

        click.echo(f"Seeding database with {count} mock users...")
        seeder = DataSeeder(count=count)
        users = seeder.generate_users()
        if not users:
            click.secho("No users were generated", fg="red")
            return
            
        returned_users = current_app.db_manager.execute_values_returning(SEED_USERS, users)
        user_ids = [row['id'] for row in returned_users]
        click.secho(f"Created {len(user_ids)} users", fg="green")

        profiles = seeder.generates_profiles(user_ids)
        if not profiles:
            click.secho("No profiles were generated", fg="yellow")
            return
        profiles_rows = current_app.db_manager.execute_many(SEED_PROFILES, profiles)
        click.secho(f"Created {profiles_rows} profiles", fg="green")
        click.secho("Seeding completed successfully!", fg="green", bold=True)
        click.echo("-" * 50)
        click.echo("Summary:")
        click.echo(f"  Users created: {len(user_ids)}")
        click.echo(f"  Profiles created: {profiles_rows}")

    except click.BadParameter as e:
        click.secho(f"Invalid parameter: {e.message}", fg="red")
        raise SystemExit(1)
    except Exception as e:
        click.secho(f"Seeding failed: {str(e)}", fg="red")
        logger.exception("[CLI] Seeding error:")
        raise SystemExit(1)