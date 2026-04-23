"""Profile-related SQL query constants."""

SEED_PROFILES = """
INSERT INTO profiles (
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
	avatar,
	pictures,
	rating
)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s::TEXT[], %s, %s::TEXT[], %s)
ON CONFLICT DO NOTHING;
"""

CREATE_PROFILE = """
INSERT INTO profiles (user_id, gender, age, date_of_birth, city, country, ip_address, latitude, longitude, bio, interests, avatar, pictures)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s::TEXT[], %s, %s::TEXT[])
ON CONFLICT (user_id) DO NOTHING
RETURNING user_id, gender, age, date_of_birth, city, country, ip_address, latitude, longitude, bio, interests, avatar, pictures
"""

GET_MY_PROFILE_BY_USER_ID = """
SELECT u.username, u.first_name, u.last_name, u.email,
	p.user_id, p.gender, p.age, p.date_of_birth, p.city, p.country, p.ip_address, p.latitude, p.longitude, p.bio, p.interests, p.avatar, p.pictures, p.rating
FROM users u
JOIN profiles p ON p.user_id = u.id
WHERE u.id = %s
LIMIT 1
"""

GET_PROFILE_BY_USERNAME = """
SELECT u.first_name, u.last_name, u.username,
	p.user_id, p.gender, p.age, p.date_of_birth, p.city, p.country, p.bio, p.interests, p.avatar, p.pictures, p.rating
FROM users u
JOIN profiles p ON p.user_id = u.id
WHERE u.username = %s
LIMIT 1
"""

GET_PROFILES_LIST = """
SELECT
    u.username,
    u.first_name,
    u.last_name,
    p.user_id,
    p.gender,
    p.age,
    p.date_of_birth,
    p.city,
    p.country,
    p.bio,
    p.interests,
    p.avatar,
    p.pictures,
    p.rating,
    p.latitude,
    p.longitude,
    (6371 * acos(
        GREATEST(-1, LEAST(1,
            cos(radians(%s)) * cos(radians(p.latitude)) *
            cos(radians(p.longitude) - radians(%s)) +
            sin(radians(%s)) * sin(radians(p.latitude))
        ))
    )) AS distance_km
FROM users u
JOIN profiles p ON p.user_id = u.id
WHERE u.id != %s
  AND p.gender = %s
  AND p.latitude IS NOT NULL
  AND p.longitude IS NOT NULL
ORDER BY distance_km ASC
LIMIT %s OFFSET %s
"""

UPDATE_PROFILE_BY_USER_ID = """
UPDATE profiles
SET gender = COALESCE(%s, gender),
    bio = COALESCE(%s, bio),
    interests = COALESCE(%s::TEXT[], interests),
    avatar = COALESCE(%s, avatar),
    pictures = COALESCE(%s::TEXT[], pictures)
WHERE user_id = %s
RETURNING user_id, gender, age, date_of_birth, city, country, ip_address, latitude, longitude, bio, interests, avatar, pictures, rating
"""


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

