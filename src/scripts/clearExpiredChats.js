import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY; // Ideally use SERVICE_ROLE key for deletions if RLS blocks anon

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing environment variables.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function clearExpired() {
    console.log('🧹 Starting Ephemeral Chat Cleanup...');

    const now = new Date().toISOString();

    // Delete messages where expires_at < NOW()
    const { error, count } = await supabase
        .from('category_messages')
        .delete({ count: 'exact' })
        .lt('expires_at', now);

    if (error) {
        console.error('❌ Error deleting expired messages:', error);
    } else {
        console.log(`✅ Successfully deleted ${count !== null ? count : 'unknown number of'} expired messages.`);
    }
}

clearExpired();
