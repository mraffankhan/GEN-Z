-- Remove college and gamification columns
ALTER TABLE profiles
DROP COLUMN IF EXISTS year,
DROP COLUMN IF EXISTS department,
DROP COLUMN IF EXISTS branch,
DROP COLUMN IF EXISTS college,
DROP COLUMN IF EXISTS campus,
DROP COLUMN IF EXISTS trust_score,
DROP COLUMN IF EXISTS coins,
DROP COLUMN IF EXISTS cosmetics;

-- Add new profile fields
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS skills text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS instagram_url text,
ADD COLUMN IF NOT EXISTS linkedin_url text,
ADD COLUMN IF NOT EXISTS github_url text,
ADD COLUMN IF NOT EXISTS portfolio_url text;
