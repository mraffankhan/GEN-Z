-- Add AI Verification columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS ai_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_name TEXT,
ADD COLUMN IF NOT EXISTS ai_college TEXT,
ADD COLUMN IF NOT EXISTS ai_issues JSONB DEFAULT '[]'::jsonb;

-- Ensure verification_status can handle 'rejected' if not already (it's text so it's fine)
-- But good to document the states: 'not_submitted', 'pending', 'approved', 'rejected'
