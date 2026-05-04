-- Add online status fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_connection TIMESTAMPTZ DEFAULT NOW();

-- Add index for performance if we need to query online users
CREATE INDEX IF NOT EXISTS idx_users_is_online ON users(is_online);
