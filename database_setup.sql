-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Update profiles table with missing columns
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS trust_score INTEGER DEFAULT 500;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS coins INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'not_submitted';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS active_border TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS active_badge TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS animation_type TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS glow_color TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS frame_style TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ring_animation TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cosmetics JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS active_name_glow TEXT;

-- Remove old tables
DROP TABLE IF EXISTS polls;
DROP TABLE IF EXISTS poll_votes;
DROP TABLE IF EXISTS confessions;

-- Create Youth Connect tables
DROP TABLE IF EXISTS category_messages;
CREATE TABLE category_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    room_id TEXT NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_DATE + INTERVAL '1 day' + INTERVAL '6 hours') -- 6 AM next day (approx)
);

-- Enable RLS for category_messages
ALTER TABLE category_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON category_messages
    FOR SELECT USING (true);

CREATE POLICY "Authenticated insert access" ON category_messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Create Opportunities tables
DROP TABLE IF EXISTS jobs;
CREATE TABLE jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL, -- 'Full-time', 'Internship', 'Freelance'
    stipend TEXT,
    apply_link TEXT,
    tags TEXT[],
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for jobs
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON jobs
    FOR SELECT USING (true);

-- Create Direct Messages table
DROP TABLE IF EXISTS direct_messages;
CREATE TABLE direct_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sender_id UUID REFERENCES public.profiles(id) NOT NULL,
    receiver_id UUID REFERENCES public.profiles(id) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for direct_messages
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own messages" ON direct_messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert messages" ON direct_messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Only admins should insert jobs (you can adjust this policy)
-- CREATE POLICY "Admin insert access" ON jobs ...
