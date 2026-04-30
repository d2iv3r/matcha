"""Mock data seeding logic for the application."""

from random import random
import logging
import random


try:
    from faker import Faker
except ImportError:
    raise ImportError(
        "Faker is required for seeding. Install it with: pip install faker"
    )

import urllib.request
import urllib.parse
import json


logger = logging.getLogger(__name__)
fake = Faker()

class DataSeeder:
    """Class responsible for seeding mock data into the database."""

    GENDERS = ["male", "female"]
    INTERESTS = ["Food & Cooking", "Coffee", "Moroccan Tea", "Nightlife", "Gaming", "Anime", "Fitness", "Football", "Swimming", "Camping", "Music", "Movies", "Photography", "Reading", "Painting & Art", "Karaoke", "Theater", "Travel", "Adventure", "Fashion", "Learning", "Romance",]
    RATING = ["Ghost", "Rising", "Popular", "Elite", "Iconic"]

    USER_DATA_URL = "https://randomuser.me/api/"
    PEXELS_SEARCH_URL = "https://api.pexels.com/v1/search"

    def __init__(self, 
        count: int = 10,
        gender: str = "male",
        users_password: str = None,
        pexels_api_key: str = None
    ):
        """
        Initialize the DataSeeder.

        Args:
            count: Number of mock users to generate
            users_password: Password to use for mock users
            pexels_api_key: API key for Pexels
        """
        self.count = count
        self.gender = gender
        if pexels_api_key is None:
            raise ValueError("Pexels API key is required")
        if users_password is None:
            raise ValueError("Users password is required")
        self.users_password = users_password
        self.pexels_api_key = pexels_api_key


    def generate_avatar(self, age: int, gender: str, country: str) -> str:
        """get avatar from pexels based on age, gender and country"""

        query = urllib.parse.quote(f"{age}th {gender} from {country} profile picture")
        orientation = "portrait"
        per_page = 1
        request_url = f"{self.PEXELS_SEARCH_URL}?query={query}&orientation={orientation}&per_page={per_page}"
        headers = {
            "Authorization": self.pexels_api_key,
            "User-Agent": "Mozilla/5.0 (compatible; MatchaSeeder/1.0)",
        }
        try:
            with urllib.request.urlopen(urllib.request.Request(request_url, headers=headers)) as response:
                data = json.loads(response.read().decode())
                if not data.get("photos", []):
                    print("NO PHOTO FOUND FOR QUERY:", query)
                    return ""
                photo = data["photos"][0]
                return photo["src"]["large"]
        except Exception as e:
            print("FAILED QUERY:", query)
            print("ERROR:", str(e))
            return ""

    def generate_mock_users_data(self) -> list[dict]:
        """
        Generate mock users data from randomuser.me API.

        Returns:
            List containing mock users data
        """

        params = f"gender={self.gender}&results={self.count}"
        url = f"{self.USER_DATA_URL}?{params}"
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (compatible; MatchaSeeder/1.0)",
        })
        try:
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read().decode())
                return data.get("results", [])
        except Exception as e:
            logger.error(f"[SEED] RandomUser API error: {str(e)}")
            return []


    def get_mock_users(self) -> list[tuple]:
        """
        Get mock users data from randomuser.me API.
        """
        users_data = self.generate_mock_users_data()
        formatted_data: list[tuple] = []
        for user_data in users_data:
            avatar_url = self.generate_avatar(user_data["dob"]["age"], user_data["gender"], user_data["location"]["country"])
            formatted_data.append((
                user_data["login"]["username"],
                user_data["name"]["first"],
                user_data["name"]["last"],
                user_data["email"],
                self.users_password,
                True,
                True,
                user_data["gender"],
                user_data["dob"]["age"],
                user_data["dob"]["date"],
                user_data["location"]["city"],
                user_data["location"]["country"],
                "",
                user_data["location"]["coordinates"]["latitude"],
                user_data["location"]["coordinates"]["longitude"],
                fake.text(max_nb_chars=200),
                random.sample(self.INTERESTS, k=random.randint(3, 8)),
                avatar_url,
                [],
                random.choice(self.RATING)
            ))

        return formatted_data

