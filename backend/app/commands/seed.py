"""Mock data seeding logic for the application."""

from calendar import c
import logging
from re import L
from typing import Dict, Any, List, Optional
import random

from app.utils import hash_password

try:
    from faker import Faker
except ImportError:
    raise ImportError(
        "Faker is required for seeding. Install it with: pip install faker"
    )


logger = logging.getLogger(__name__)
fake = Faker()

class DataSeeder:
    """Class responsible for seeding mock data into the database."""

    # Mock data constants
    GENDERS = ["male", "female"]
    TEMP_PASSWORD = hash_password("Password123!")
    INTERESTS = [
        "Food & Cooking",
        "Coffee",
        "Moroccan Tea",
        "Nightlife",
        "Gaming",
        "Anime",
        "Fitness",
        "Football",
        "Swimming",
        "Camping",
        "Music",
        "Movies",
        "Photography",
        "Reading",
        "Painting & Art",
        "Karaoke",
        "Theater",
        "Travel",
        "Adventure",
        "Fashion",
        "Learning",
        "Romance",
    ]
    RATING = ["Ghost", "Rising", "Popular", "Elite", "Iconic"]

    def __init__(self, count: int = 10):
        """
        Initialize the DataSeeder.

        Args:
            count: Number of mock users to generate
        """
        self.count = count
        self.created_users: List[Dict[str, Any]] = []

    def generate_mock_user(self) -> tuple:
        """
        Generate a single mock user with registration data.

        Returns:
            Tuple containing user registration data
            (
                username, first_name, last_name, email, password, is_active, is_profile_complete
            )
        """
        return (
            fake.user_name(),
            fake.first_name(),
            fake.last_name(),
            fake.email(),
            self.TEMP_PASSWORD,
            True,
            True
        )

    def generate_mock_profile(self, user_id: int) -> tuple:
        """
        Generate a single mock profile for a user.

        Args:
            user_id: ID of the user to create profile for

        Returns:
            Tuple containing profile data
            (
                user_id,
                gender,
                age,
                date_of_birth,
                city,
                country,
                ip_address,
                latitude,
                longitude,
                bio,
                interests,
                avatar_url,
                pictures,
                rating,
            )
        """
        import datetime
        date_of_birth = fake.date_of_birth(minimum_age=18, maximum_age=70)
        age = (datetime.date.today() - date_of_birth).days // 365
        gender = random.choice(self.GENDERS)
        from flask import current_app

        gender_path = "men" if gender == "male" else "women"
        backend_url = current_app.config.get("BACKEND_URL", "").rstrip("/")
        if backend_url:
            avatar_url = f"{backend_url}/static/media/avatars/seed_{user_id}.jpg"
        else:
            avatar_url = f"https://randomuser.me/api/portraits/{gender_path}/{random.randint(1, 99)}.jpg"
        interests = random.sample(self.INTERESTS, k=random.randint(3, 8))
        formatted_interests = "{" + ",".join(
            f'"{item.replace("\"", "\\\"")}"' if (" " in item or "," in item) else item
            for item in interests
        ) + "}"

        return (
            user_id,
            gender,
            age,
            date_of_birth.isoformat(),
            fake.city(),
            fake.country(),
            fake.ipv4(),
            float(fake.latitude()),
            float(fake.longitude()),
            fake.text(max_nb_chars=200),
            formatted_interests,
            avatar_url,
            [],  # pictures
            random.choice(self.RATING),
        )

    def generate_users(self) -> List[tuple]:
        """
        Generate mock users.

        Returns:
            List of users
        """
        logger.info(f"[SEED] Starting to seed {self.count} mock users...")

        users_data = []
        for i in range(self.count):
            try:
                user_data = self.generate_mock_user()
                users_data.append(user_data)
            except Exception as e:
                logger.error(
                    f"[SEED] Error creating user {i + 1}/{self.count}: {str(e)}"
                )
        return users_data

    def generates_profiles(self, user_ids: List[int]) -> Optional[List[tuple]]:
        """
        generates mock profiles for users.

        Returns:
            List of generated profile data
        """
        if not user_ids:
            logger.warning(
                "[SEED] No user IDs available to create profiles for. "
                "Ensure users were inserted first."
            )
            return None

        profiles_data = []
        for user_id in user_ids:
            try:
                profile_data = self.generate_mock_profile(user_id)
                profiles_data.append(profile_data)
            except Exception as e:
                logger.error(
                    f"[SEED] Error creating profile for user id {user_id}: {str(e)}"
                )
        return profiles_data
