-- Add Trust Score columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS trust_score INTEGER DEFAULT 500,
ADD COLUMN IF NOT EXISTS infractions INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rewards INTEGER DEFAULT 0;

-- Add constraint to keep trust_score between 0 and 1000 (optional but good practice)
-- ALTER TABLE profiles ADD CONSTRAINT trust_score_range CHECK (trust_score >= 0 AND trust_score <= 1000);
