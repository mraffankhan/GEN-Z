-- Add columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS coins integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS cosmetics jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS active_border text DEFAULT null,
ADD COLUMN IF NOT EXISTS active_badge text DEFAULT null,
ADD COLUMN IF NOT EXISTS premium_level integer DEFAULT 0;

-- Create cosmetics_store table
CREATE TABLE IF NOT EXISTS cosmetics_store (
    id bigint PRIMARY KEY,
    name text NOT NULL,
    type text NOT NULL, -- "border", "badge", "name-glow"
    price integer NOT NULL,
    color text,
    icon text,
    created_at timestamp with time zone DEFAULT now()
);

-- Insert default items
INSERT INTO cosmetics_store (id, name, type, price, color, icon) VALUES
(1, 'Gold Profile Border', 'border', 200, 'text-yellow-400 border-yellow-400', 'Crown'),
(2, 'Neon Purple Border', 'border', 150, 'text-neon-purple border-neon-purple', 'Zap'),
(3, 'OG Badge', 'badge', 500, 'bg-neon-purple text-white', 'Star'),
(4, 'Verified Glow', 'name-glow', 300, 'shadow-neon-green', 'ShieldCheck'),
(5, 'Cyber Spark Badge', 'badge', 180, 'bg-blue-500 text-white', 'Zap')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on cosmetics_store
ALTER TABLE cosmetics_store ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read cosmetics_store
CREATE POLICY "Everyone can view store" ON cosmetics_store
    FOR SELECT USING (true);
