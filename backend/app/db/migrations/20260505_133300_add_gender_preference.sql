-- Add gender_preference to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender_preference VARCHAR(50) DEFAULT 'all' CHECK (gender_preference IN ('male', 'female', 'all'));

-- Add is_location_approved to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_location_approved BOOLEAN DEFAULT FALSE;
