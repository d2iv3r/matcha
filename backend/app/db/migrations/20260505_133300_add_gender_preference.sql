-- Add gender_preference to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender_preference VARCHAR(50) DEFAULT 'all' CHECK (gender_preference IN ('male', 'female', 'other', 'all'));
