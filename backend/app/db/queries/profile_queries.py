"""Profile-related SQL query constants."""

SEED_PROFILES = """
INSERT INTO profiles (user_id, gender, age, date_of_birth, location, bio, interests, avatar, pictures, rating)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
ON CONFLICT DO NOTHING;
"""

CREATE_PROFILE = """
INSERT INTO profiles (user_id, gender, age, date_of_birth, city, country, ip_address, latitude, longitude, bio, interests, avatar, pictures)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
ON CONFLICT (user_id) DO NOTHING
RETURNING user_id, gender, age, date_of_birth, city, country, ip_address, latitude, longitude, bio, interests, avatar, pictures
"""

GET_MY_PROFILE_BY_USER_ID = """
SELECT u.id, u.username, u.first_name, u.last_name, u.email,
	p.gender, p.age, p.date_of_birth, p.city, p.country, p.ip_address, p.latitude, p.longitude, p.bio, p.interests, p.avatar, p.pictures, p.rating
FROM users u
JOIN profiles p ON p.user_id = u.id
WHERE u.id = %s
LIMIT 1
"""

GET_PROFILE_BY_USERNAME = """
SELECT u.id, u.username, u.first_name, u.last_name,
	p.gender, p.age, p.date_of_birth, p.location, p.bio, p.interests, p.avatar, p.pictures, p.rating
FROM users u
JOIN profiles p ON p.user_id = u.id
WHERE u.username = %s
LIMIT 1
"""

# GET_PROFILES_WITH_USERS = """
# SELECT u.id, u.username, u.first_name, u.last_name,
# 	p.gender, p.age, p.date_of_birth, p.location, p.interests, p.avatar, p.pictures, p.rating
# FROM users u
# JOIN profiles p ON p.user_id = u.id
# ORDER BY u.id ASC
# LIMIT %s OFFSET %s
# """


# UPSERT_PROFILE = """
# INSERT INTO profiles (user_id, gender, age, date_of_birth, location, bio, interests, avatar, pictures)
# VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
# ON CONFLICT (user_id)
# DO UPDATE SET
# 	gender = EXCLUDED.gender,
# 	age = EXCLUDED.age,
# 	date_of_birth = EXCLUDED.date_of_birth,
# 	location = EXCLUDED.location,
# 	bio = EXCLUDED.bio,
# 	interests = EXCLUDED.interests,
# 	avatar = EXCLUDED.avatar,
# 	pictures = EXCLUDED.pictures
# RETURNING user_id, gender, age, date_of_birth, location, bio, interests, avatar, pictures
# """

