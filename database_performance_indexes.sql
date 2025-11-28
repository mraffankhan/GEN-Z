-- Performance Optimization: Database Indexes
-- Run this in Supabase SQL Editor

-- Index for category messages queries
CREATE INDEX IF NOT EXISTS idx_category_messages_room_time 
ON category_messages(room_id, created_at DESC);

-- Indexes for DM queries (both directions)
CREATE INDEX IF NOT EXISTS idx_dm_messages_sender_receiver_time
ON direct_messages(sender_id, receiver_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_dm_messages_receiver_sender_time
ON direct_messages(receiver_id, sender_id, created_at DESC);

-- Profile username search optimization
CREATE INDEX IF NOT EXISTS idx_profiles_username
ON profiles(username);

CREATE INDEX IF NOT EXISTS idx_profiles_display_name
ON profiles(display_name);

-- Analyze tables for query planner
ANALYZE category_messages;
ANALYZE direct_messages;
ANALYZE profiles;
