-- Add is_admin to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create jobs table if it doesn't exist
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Explicitly add ALL columns to ensure they exist even if table was created before
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS mode TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS stipend TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS apply_link TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id);

-- Enable RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Policies
-- Drop existing policies to avoid conflicts/duplication
DROP POLICY IF EXISTS "Public jobs are viewable by everyone" ON jobs;
DROP POLICY IF EXISTS "Admins can insert jobs" ON jobs;
DROP POLICY IF EXISTS "Admins can update jobs" ON jobs;
DROP POLICY IF EXISTS "Admins can delete jobs" ON jobs;

-- Read: Everyone
CREATE POLICY "Public jobs are viewable by everyone" ON jobs
  FOR SELECT USING (true);

-- Insert: Admins only
CREATE POLICY "Admins can insert jobs" ON jobs
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true)
  );

-- Update: Admins only
CREATE POLICY "Admins can update jobs" ON jobs
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true)
  );

-- Delete: Admins only
CREATE POLICY "Admins can delete jobs" ON jobs
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true)
  );
