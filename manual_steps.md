# Manual Steps Required

1.  **Database Setup**:
    - Open your Supabase SQL Editor.
    - Run the contents of `database_setup.sql` (specifically the `direct_messages` table creation section if you haven't already).

2.  **Environment Variables**:
    - Ensure `.env` contains:
        - `VITE_SUPABASE_URL`
        - `VITE_SUPABASE_ANON_KEY`
        - `VITE_GEMINI_API_KEY`

3.  **Cron Job (Optional)**:
    - To automatically clear expired chats, set up a cron job or scheduled task to run:
      `node src/scripts/clearExpiredChats.js`
      every 30 minutes or 1 hour.

4.  **Verification**:
    - Follow the steps in `tests/e2e_plan.md` to verify the application manually.
