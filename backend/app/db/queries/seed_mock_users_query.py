"""Seed query constants for mock users."""

COUNT_USERS = """
    SELECT count(*) as count FROM users;
"""

# COUNT_PROFILES = "SELECT COUNT(*) as count FROM profiles;"

SEED_MOCK_USERS_AND_PROFILES = """
    WITH input_data (
        username, first_name, last_name, email,
        password_hash, is_active, is_profile_complete,
        gender, age, date_of_birth, gender_preference,
        city, country, ip_address,
        latitude, longitude, bio,
        interests, avatar, pictures, rating
    ) AS (
        VALUES %s
    ),
    inserted_users AS (
        INSERT INTO users (
            username, first_name, last_name, email,
            password_hash, is_active, is_profile_complete
        )
        SELECT 
            username, first_name, last_name, email,
            password_hash, is_active, is_profile_complete
        FROM input_data
        ON CONFLICT (email) DO UPDATE
        SET email = EXCLUDED.email
        RETURNING id, username
    )
    INSERT INTO profiles (
        user_id, gender, age, date_of_birth, gender_preference,
        city, country, ip_address,
        latitude, longitude, bio,
        interests, avatar, pictures, rating, is_location_approved
    )
    SELECT 
        u.id,
        i.gender,
        i.age,
        i.date_of_birth::date,
        i.gender_preference,
        i.city,
        i.country,
        NULLIF(i.ip_address, '')::inet,
        NULLIF(i.latitude, '')::float8,
        NULLIF(i.longitude, '')::float8,
        i.bio,
        i.interests::text[],
        i.avatar,
        i.pictures::text[],
        i.rating,
        TRUE
    FROM inserted_users u
    JOIN input_data i ON u.username = i.username
    ON CONFLICT (user_id) DO NOTHING
    RETURNING user_id;
"""
