"""Mock data seeding logic for the application."""

import logging
import random
import urllib.request
import urllib.parse
import json
from concurrent.futures import ThreadPoolExecutor, as_completed

try:
    from faker import Faker
except ImportError:
    raise ImportError(
        "Faker is required for seeding. Install it with: pip install faker"
    )

logger = logging.getLogger(__name__)
fake = Faker()

# Age brackets: (label, min_age, max_age or None)
AGE_BRACKETS = [
    ("18-25",  18, 25),
    ("26-35",  26, 35),
    ("36-45",  36, 45),
    ("46plus", 46, None),
]

# Pexels search descriptors per bracket
BRACKET_LABEL = {
    "18-25":  "young adult",
    "26-35":  "adult",
    "36-45":  "middle aged",
    "46plus": "mature",
}

# How many avatar photos to fetch per pool group
POOL_SIZE = 80

# Max users fetched from randomuser.me per gender (API max is 5000)
RANDOMUSER_FETCH_MAX = 500


def _bracket_for_age(age: int) -> str:
    for label, lo, hi in AGE_BRACKETS:
        if hi is None:
            if age >= lo:
                return label
        elif lo <= age <= hi:
            return label
    return "46plus"


class DataSeeder:
    """Seed mock users into the database.

    Strategy
    --------
    1. Fetch up to RANDOMUSER_FETCH_MAX users per gender from randomuser.me
       (two concurrent requests).
    2. Bucket the raw results by age bracket (18-25 / 26-35 / 36-45 / 46+).
    3. Concurrently fetch avatar pools from Pexels — one request per
       (gender × age_bracket) combination = 8 requests total.
    4. Pick exactly the required number of users from each bucket,
       distributed evenly across all 8 groups.
    5. Assign avatars round-robin from the matching pool.

    This reduces Pexels API calls from N (one per user) to 8 (one per group).
    """

    INTERESTS = [
        "Food & Cooking", "Coffee", "Moroccan Tea", "Nightlife", "Gaming",
        "Anime", "Fitness", "Football", "Swimming", "Camping", "Music",
        "Movies", "Photography", "Reading", "Painting & Art", "Karaoke",
        "Theater", "Travel", "Adventure", "Fashion", "Learning", "Romance",
    ]
    RATING = ["Ghost", "Rising", "Popular", "Elite", "Iconic"]

    USER_DATA_URL = "https://randomuser.me/api/"
    PEXELS_SEARCH_URL = "https://api.pexels.com/v1/search"

    def __init__(
        self,
        count: int = 100,
        users_password: str = None,
        pexels_api_key: str = None,
    ):
        """
        Args:
            count: Total users to seed (split 50 % male / 50 % female).
            users_password: Pre-hashed password shared by all mock users.
            pexels_api_key: Pexels API key.
        """
        if users_password is None:
            raise ValueError("users_password is required")
        if pexels_api_key is None:
            raise ValueError("pexels_api_key is required")

        self.count = count
        self.users_password = users_password
        self.pexels_api_key = pexels_api_key

        # Populated during get_mock_users()
        # avatar_pools[(gender, bracket)] = [url, ...]
        self._avatar_pools: dict[tuple[str, str], list[str]] = {}
        self._pool_cursors: dict[tuple[str, str], int] = {}

    # ------------------------------------------------------------------
    # Internal HTTP helper
    # ------------------------------------------------------------------

    def _http_get(self, url: str, headers: dict) -> dict:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode())

    # ------------------------------------------------------------------
    # Step 1 – Fetch raw user data from randomuser.me
    # ------------------------------------------------------------------

    def _fetch_raw_users(self, gender: str) -> list[dict]:
        """Fetch up to RANDOMUSER_FETCH_MAX users of *gender* in one call."""
        url = (
            f"{self.USER_DATA_URL}"
            f"?gender={gender}&results={RANDOMUSER_FETCH_MAX}"
        )
        try:
            data = self._http_get(url, {
                "User-Agent": "Mozilla/5.0 (compatible; MatchaSeeder/1.0)",
            })
            return data.get("results", [])
        except Exception as exc:
            logger.error(f"[SEED] randomuser.me error ({gender}): {exc}")
            return []

    def _fetch_all_raw_users(self) -> dict[str, dict[str, list[dict]]]:
        """
        Fetch male + female users concurrently, then bucket by age bracket.

        Returns
        -------
        {
            "male":   {"18-25": [...], "26-35": [...], ...},
            "female": {"18-25": [...], "26-35": [...], ...},
        }
        """
        with ThreadPoolExecutor(max_workers=2) as ex:
            male_fut   = ex.submit(self._fetch_raw_users, "male")
            female_fut = ex.submit(self._fetch_raw_users, "female")
            males   = male_fut.result()
            females = female_fut.result()

        buckets: dict[str, dict[str, list[dict]]] = {
            "male":   {b: [] for b, *_ in AGE_BRACKETS},
            "female": {b: [] for b, *_ in AGE_BRACKETS},
        }
        for user in males:
            buckets["male"][_bracket_for_age(user["dob"]["age"])].append(user)
        for user in females:
            buckets["female"][_bracket_for_age(user["dob"]["age"])].append(user)

        return buckets

    # ------------------------------------------------------------------
    # Step 2 – Fetch avatar pools from Pexels
    # ------------------------------------------------------------------

    def _fetch_avatar_pool(self, gender: str, bracket: str) -> tuple[tuple, list[str]]:
        """Fetch POOL_SIZE portrait photos for (gender, bracket) from Pexels."""
        age_label = BRACKET_LABEL[bracket]
        query = urllib.parse.quote(
            f"{age_label} {gender} portrait profile photo"
        )
        url = (
            f"{self.PEXELS_SEARCH_URL}"
            f"?query={query}&orientation=portrait&per_page={POOL_SIZE}"
        )
        headers = {
            "Authorization": self.pexels_api_key,
            "User-Agent": "Mozilla/5.0 (compatible; MatchaSeeder/1.0)",
        }
        key = (gender, bracket)
        try:
            data = self._http_get(url, headers)
            urls = [p["src"]["large"] for p in data.get("photos", []) if p.get("src")]
            logger.info(f"[SEED] Pool {key}: {len(urls)} photos")
            return key, urls
        except Exception as exc:
            logger.warning(f"[SEED] Pexels pool failed {key}: {exc}")
            return key, []

    def _build_avatar_pools(self) -> None:
        """Fetch all 8 (gender × bracket) avatar pools concurrently."""
        tasks = [
            (gender, bracket)
            for gender in ("male", "female")
            for bracket, *_ in AGE_BRACKETS
        ]
        with ThreadPoolExecutor(max_workers=len(tasks)) as ex:
            futures = {ex.submit(self._fetch_avatar_pool, g, b): (g, b)
                       for g, b in tasks}
            for fut in as_completed(futures):
                key, urls = fut.result()
                self._avatar_pools[key] = urls
                self._pool_cursors[key] = 0

    def _pick_avatar(self, gender: str, bracket: str) -> str:
        """Pick an avatar from the matching pool without reusing it."""
        key = (gender, bracket)
        pool = self._avatar_pools.get(key, [])

        if not pool:
            # Fallback: any bracket of the same gender
            for b, *_ in AGE_BRACKETS:
                alt = self._avatar_pools.get((gender, b), [])
                if alt:
                    pool = alt
                    break

        if not pool:
            return ""

        return pool.pop()

    # ------------------------------------------------------------------
    # Step 3 – Assemble final user tuples
    # ------------------------------------------------------------------

    def _select_users_from_buckets(
        self,
        buckets: dict[str, dict[str, list[dict]]],
    ) -> list[dict]:
        """
        Pick *count/2* users per gender, distributed evenly across the
        4 age brackets.  If a bucket is short, remaining slots are filled
        from the next bucket.
        """
        per_gender    = self.count // 2
        per_bracket   = per_gender // len(AGE_BRACKETS)  # ideal per bracket

        selected: list[dict] = []

        for gender in ("male", "female"):
            remaining = per_gender
            bracket_labels = [b for b, *_ in AGE_BRACKETS]

            for i, bracket in enumerate(bracket_labels):
                pool = buckets[gender][bracket]
                random.shuffle(pool)
                # Last bracket takes whatever is left
                need = remaining if i == len(bracket_labels) - 1 else per_bracket
                need = min(need, len(pool))
                selected.extend(pool[:need])
                remaining -= need
                if remaining <= 0:
                    break

        return selected

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def get_mock_users(self) -> list[tuple]:
        """
        Return a list of row-tuples ready for bulk DB insertion.

        Column order:
            username, first_name, last_name, email,
            password_hash, is_active, is_profile_complete,
            gender, age, date_of_birth,
            city, country, ip_address,
            latitude, longitude, bio,
            interests, avatar, pictures, rating
        """
        logger.info(f"[SEED] Fetching raw users from randomuser.me …")
        buckets = self._fetch_all_raw_users()

        total_available = sum(
            len(v) for g in buckets.values() for v in g.values()
        )
        logger.info(f"[SEED] {total_available} raw users fetched; building avatar pools …")

        self._build_avatar_pools()

        users = self._select_users_from_buckets(buckets)
        logger.info(f"[SEED] Assembling {len(users)} user records …")

        seen_usernames = set()
        seen_emails = set()
        rows: list[tuple] = []

        for u in users:
            username = u["login"]["username"]
            email = u["email"]

            if username in seen_usernames or email in seen_emails:
                continue
            
            seen_usernames.add(username)
            seen_emails.add(email)

            age     = u["dob"]["age"]
            gender  = u["gender"]
            bracket = _bracket_for_age(age)
            avatar  = self._pick_avatar(gender, bracket)
            if gender == "male":
                gender_preference = random.choices(["female", "male", "all"], weights=[0.80, 0.10, 0.10], k=1)[0]
            else:
                gender_preference = random.choices(["male", "female", "all"], weights=[0.80, 0.10, 0.10], k=1)[0]

            city    = u["location"]["city"]
            country = u["location"]["country"]

            rows.append((
                u["login"]["username"],
                u["name"]["first"],
                u["name"]["last"],
                u["email"],
                self.users_password,
                True,   # is_active
                True,   # is_profile_complete
                gender,
                age,
                u["dob"]["date"],
                gender_preference,
                city,
                country,
                None,   # ip_address (unknown at seed time)
                u["location"]["coordinates"]["latitude"],
                u["location"]["coordinates"]["longitude"],
                fake.text(max_nb_chars=200),
                random.sample(self.INTERESTS, k=random.randint(3, 8)),
                avatar,
                [],     # pictures
                random.choice(self.RATING),
            ))

        return rows
