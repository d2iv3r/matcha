-- Consolidated raw SQL schema for Matcha backend

CREATE TABLE IF NOT EXISTS users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(150) UNIQUE NOT NULL,
    first_name VARCHAR(150),
    last_name VARCHAR(150),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    is_profile_complete BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bio VARCHAR(500),
    gender VARCHAR(50) CHECK (gender IN ('male', 'female')),
    age INTEGER,
    date_of_birth DATE,
    city VARCHAR(100),
    country VARCHAR(100),
    ip_address INET,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    interests TEXT[] DEFAULT '{}',
    rating VARCHAR(50) DEFAULT 'Ghost' CHECK (rating IN ('Ghost', 'Rising', 'Popular', 'Elite', 'Iconic')),
    avatar VARCHAR(255),
    pictures TEXT[] DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS profile_views (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    profile_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    viewer_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(profile_user_id, viewer_user_id)
);

CREATE INDEX IF NOT EXISTS idx_profile_views_profile_user ON profile_views(profile_user_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewer_user ON profile_views(viewer_user_id);

CREATE TABLE IF NOT EXISTS profile_likes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    profile_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    liker_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    liked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(profile_user_id, liker_user_id)
);

CREATE INDEX IF NOT EXISTS idx_profile_likes_profile_user ON profile_likes(profile_user_id);
CREATE INDEX IF NOT EXISTS idx_profile_likes_liker_user ON profile_likes(liker_user_id);

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    message VARCHAR(500),
    data JSONB,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
