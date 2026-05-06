"""Profile-related SQL query constants."""

CREATE_PROFILE = """
INSERT INTO profiles (user_id, gender, age, date_of_birth, gender_preference, city, country, ip_address, latitude, longitude,
                    bio, interests, avatar, pictures, is_location_approved)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
        %s, %s::TEXT[], %s, %s::TEXT[], %s)
ON CONFLICT (user_id) DO NOTHING
RETURNING user_id, gender, age, date_of_birth, gender_preference, city, country, ip_address, latitude, longitude, bio, interests, avatar, pictures, is_location_approved
"""

GET_MY_PROFILE_BY_USER_ID = """
SELECT u.username, u.first_name, u.last_name, u.email, u.is_online, u.last_connection, p.user_id, p.gender, p.age, p.date_of_birth,
    p.gender_preference, p.city, p.country, p.ip_address, p.latitude, p.longitude, p.bio, p.interests, p.avatar, p.pictures, p.rating, p.is_location_approved
FROM users u
JOIN profiles p ON p.user_id = u.id
WHERE u.id = %s
LIMIT 1
"""

GET_PROFILE_BY_USERNAME = """
SELECT u.first_name, u.last_name, u.username, u.is_online, u.last_connection,
	p.user_id, p.gender, p.age, p.date_of_birth, p.gender_preference, p.city, p.country, p.bio, p.interests, p.avatar, p.pictures, p.rating
FROM users u
JOIN profiles p ON p.user_id = u.id
WHERE u.username = %s
LIMIT 1
"""

GET_PROFILES_LIST = """
SELECT u.username, u.first_name, u.last_name, u.is_online, u.last_connection, p.user_id, p.gender, p.age, p.date_of_birth, p.city, p.country, p.bio,
  p.interests, p.avatar, p.pictures, p.rating, p.latitude, p.longitude,
    (6371 * acos(
        GREATEST(-1, LEAST(1,
            cos(radians(%s)) * cos(radians(p.latitude)) *
            cos(radians(p.longitude) - radians(%s)) +
            sin(radians(%s)) * sin(radians(p.latitude))
        ))
    )) AS distance_km,
    (
        SELECT count(*)
        FROM unnest(p.interests) AS i
        JOIN unnest(%s::TEXT[]) AS j ON i = j
    ) AS shared_tags_count
FROM users u
JOIN profiles p ON p.user_id = u.id
WHERE u.id != %s
  AND (
    (%s = 'all') OR (p.gender = %s)
  )
  AND (
    (p.gender_preference = 'all') OR (p.gender_preference = %s)
  )
  AND p.latitude IS NOT NULL
  AND p.longitude IS NOT NULL
  AND u.id NOT IN (SELECT blocked_id FROM blocks WHERE blocker_id = %s)
  AND u.id NOT IN (SELECT blocker_id FROM blocks WHERE blocked_id = %s)
ORDER BY
  distance_km ASC,
  shared_tags_count DESC,
  CASE p.rating
    WHEN 'Iconic' THEN 5
    WHEN 'Elite' THEN 4
    WHEN 'Popular' THEN 3
    WHEN 'Rising' THEN 2
    WHEN 'Ghost' THEN 1
    ELSE 0
  END DESC
LIMIT %s OFFSET %s
"""

SEARCH_PROFILES = """
SELECT
  u.username, u.first_name, u.last_name, u.is_online, u.last_connection,
  p.user_id, p.gender, p.age, p.date_of_birth, p.city, p.country,
  p.bio, p.interests, p.avatar, p.pictures, p.rating, p.latitude, p.longitude,
  (6371 * acos(
      GREATEST(-1, LEAST(1,
          cos(radians(%s)) * cos(radians(p.latitude)) *
          cos(radians(p.longitude) - radians(%s)) +
          sin(radians(%s)) * sin(radians(p.latitude))
      ))
  )) AS distance_km,
  (
      SELECT count(*)
      FROM unnest(p.interests) AS i
      JOIN unnest(%s::TEXT[]) AS j ON i = j
  ) AS shared_tags_count
FROM users u
JOIN profiles p ON p.user_id = u.id
WHERE u.id != %s
  AND (
      (%s = 'all') OR (p.gender = %s)
  )
  AND (
      (p.gender_preference = 'all') OR (p.gender_preference = %s)
  )
  AND p.latitude IS NOT NULL
  AND p.longitude IS NOT NULL
  AND u.id NOT IN (SELECT blocked_id FROM blocks WHERE blocker_id = %s)
  AND u.id NOT IN (SELECT blocker_id FROM blocks WHERE blocked_id = %s)
"""

UPDATE_PROFILE_BY_USER_ID = """
UPDATE profiles
SET gender = COALESCE(%s, gender),
    gender_preference = COALESCE(%s, gender_preference),
    bio = COALESCE(%s, bio),
    interests = COALESCE(%s::TEXT[], interests),
    avatar = COALESCE(%s, avatar),
    pictures = COALESCE(%s::TEXT[], pictures),
    city = COALESCE(%s, city),
    country = COALESCE(%s, country),
    latitude = COALESCE(%s, latitude),
    longitude = COALESCE(%s, longitude),
    is_location_approved = COALESCE(%s, is_location_approved)
WHERE user_id = %s
RETURNING user_id, gender, age, date_of_birth, gender_preference, city, country, ip_address, latitude, longitude, bio, interests, avatar, pictures, rating, is_location_approved
"""

UPDATE_PROFILE_RATING = """
UPDATE profiles
SET rating = %s
WHERE user_id = %s
"""
