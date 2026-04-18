"""Profile-related SQL query constants."""

GET_PROFILE_BY_USER_ID = """
SELECT user_id, gender, age, date_of_birth, location, bio, interests, avatar, pictures
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
