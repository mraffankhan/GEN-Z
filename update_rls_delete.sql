-- Allow users to delete their own jobs
CREATE POLICY "Users can delete their own jobs" ON jobs
  FOR DELETE USING (
    auth.uid() = created_by OR
    auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true)
  );

-- Note: If "Admins can delete jobs" already exists, it might conflict or be redundant.
-- Supabase policies are OR-ed, so adding this new one is safe and will enable self-deletion.
-- If you want to replace the old one, you can drop it first:
-- DROP POLICY IF EXISTS "Admins can delete jobs" ON jobs;
