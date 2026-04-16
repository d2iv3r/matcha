-- Initial raw SQL migration for Matcha backend

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(150) UNIQUE NOT NULL,
    first_name VARCHAR(150),
    last_name VARCHAR(150),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    is_profile_complete BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bio VARCHAR(500),
    gender VARCHAR(50) CHECK (gender IN ('male', 'female')),
    age INTEGER,
    date_of_birth DATE,
    location VARCHAR(255),
    interests TEXT,
    avatar_url VARCHAR(255)
);
