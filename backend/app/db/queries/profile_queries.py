"""Profile-related SQL query constants."""

SEED_PROFILES = """
INSERT INTO profiles (user_id, gender, age, date_of_birth, location, bio, interests, avatar, pictures, rating)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
ON CONFLICT DO NOTHING;
"""

GET_PROFILE_BY_USER_ID = """
SELECT user_id, gender, age, date_of_birth, location, bio, interests, avatar, pictures, rating
FROM profiles
WHERE user_id = %s
LIMIT 1
"""

UPSERT_PROFILE = """
INSERT INTO profiles (user_id, gender, age, date_of_birth, location, bio, interests, avatar, pictures)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
ON CONFLICT (user_id)
DO UPDATE SET
	gender = EXCLUDED.gender,
	age = EXCLUDED.age,
	date_of_birth = EXCLUDED.date_of_birth,
	location = EXCLUDED.location,
	bio = EXCLUDED.bio,
	interests = EXCLUDED.interests,
	avatar = EXCLUDED.avatar,
	pictures = EXCLUDED.pictures
RETURNING user_id, gender, age, date_of_birth, location, bio, interests, avatar, pictures
"""

GET_PROFILES_WITH_USERS = """
SELECT u.id, u.username, u.first_name, u.last_name,
	p.gender, p.age, p.date_of_birth, p.location, p.interests, p.avatar, p.pictures, p.rating
FROM users u
JOIN profiles p ON p.user_id = u.id
ORDER BY u.id ASC
LIMIT %s OFFSET %s
"""
