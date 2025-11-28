-- Create cosmetics_items table
CREATE TABLE IF NOT EXISTS cosmetics_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'border', 'badge', 'glow', 'avatar_frame'
  price INTEGER NOT NULL,
  icon TEXT NOT NULL, -- Lucide icon name
  color TEXT, -- Tailwind color class or hex
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE cosmetics_items ENABLE ROW LEVEL SECURITY;

-- Policy: Public read access
DROP POLICY IF EXISTS "Public read access" ON cosmetics_items;
CREATE POLICY "Public read access" ON cosmetics_items
  FOR SELECT USING (true);

-- Create owned_cosmetics table
CREATE TABLE IF NOT EXISTS owned_cosmetics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  item_id UUID REFERENCES cosmetics_items(id) NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, item_id) -- Prevent duplicate purchases
);

-- Enable RLS
ALTER TABLE owned_cosmetics ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own items
DROP POLICY IF EXISTS "Users can view own items" ON owned_cosmetics;
CREATE POLICY "Users can view own items" ON owned_cosmetics
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own items (for purchase)
DROP POLICY IF EXISTS "Users can insert own items" ON owned_cosmetics;
CREATE POLICY "Users can insert own items" ON owned_cosmetics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update profiles policies to allow coin updates
-- Ensure the user can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Seed some initial data if table is empty
INSERT INTO cosmetics_items (name, type, price, icon, color)
SELECT 'Neon Blue Border', 'border', 100, 'Square', 'text-blue-500'
WHERE NOT EXISTS (SELECT 1 FROM cosmetics_items WHERE name = 'Neon Blue Border');

INSERT INTO cosmetics_items (name, type, price, icon, color)
SELECT 'Gold Badge', 'badge', 500, 'Award', 'text-yellow-500'
WHERE NOT EXISTS (SELECT 1 FROM cosmetics_items WHERE name = 'Gold Badge');

INSERT INTO cosmetics_items (name, type, price, icon, color)
SELECT 'Purple Glow', 'glow', 300, 'Zap', 'text-purple-500'
WHERE NOT EXISTS (SELECT 1 FROM cosmetics_items WHERE name = 'Purple Glow');
