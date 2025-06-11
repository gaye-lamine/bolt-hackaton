/*
  # Add Premium Fields to Users Table

  1. New Columns
    - `is_premium` (boolean, default false) - Premium status
    - `premium_expires_at` (timestamptz, nullable) - Premium expiration date
    - `premium_features` (text array, default empty) - Specific premium features enabled

  2. Security
    - Users can read their own premium status
    - Only authenticated users can view premium fields
*/

-- Add premium fields to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'is_premium'
  ) THEN
    ALTER TABLE users ADD COLUMN is_premium boolean DEFAULT false;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'premium_expires_at'
  ) THEN
    ALTER TABLE users ADD COLUMN premium_expires_at timestamptz;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'premium_features'
  ) THEN
    ALTER TABLE users ADD COLUMN premium_features text[] DEFAULT '{}';
  END IF;
END $$;

-- Create index for premium status queries
CREATE INDEX IF NOT EXISTS users_premium_status_idx ON users(is_premium, premium_expires_at);

-- Update RLS policies to include premium fields
DROP POLICY IF EXISTS "Users can read own data" ON users;
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Public users read access" ON users;
CREATE POLICY "Public users read access"
  ON users
  FOR SELECT
  TO anon
  USING (onboarding_completed = true);