import { supabase } from '../supabase'

/**
 * Fetch recent messages from a category room
 * @param {string} roomId - Category room ID
 * @param {number} limit - Number of messages to fetch (default 30)
 * @returns {Promise<{data: Array, error: Error}>}
 */
export const getCategoryMessages = async (roomId, limit = 30) => {
    const { data, error } = await supabase
        .from('category_messages')
        .select('id, room_id, sender_id, content, created_at')
        .eq('room_id', roomId)
        .order('created_at', { ascending: false })
        .limit(limit)

    // Reverse to get chronological order
    return { data: data ? data.reverse() : null, error }
}

/**
 * Fetch older category messages (pagination)
 * @param {string} roomId - Category room ID
 * @param {string} beforeTimestamp - ISO timestamp
 * @param {number} limit - Number of messages to fetch
 */
export const getOlderCategoryMessages = async (roomId, beforeTimestamp, limit = 30) => {
    const { data, error } = await supabase
        .from('category_messages')
        .select('id, room_id, sender_id, content, created_at')
        .eq('room_id', roomId)
        .lt('created_at', beforeTimestamp)
        .order('created_at', { ascending: false })
        .limit(limit)

    return { data: data ? data.reverse() : null, error }
}

/**
 * Fetch DM messages between two users
 * @param {string} userId - Current user ID
 * @param {string} targetUserId - Target user ID
 * @param {number} limit - Number of messages to fetch (default 30)
 */
export const getDMMessages = async (userId, targetUserId, limit = 30) => {
    const { data, error } = await supabase
        .from('direct_messages')
        .select('id, sender_id, receiver_id, content, created_at, is_read')
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${targetUserId}),and(sender_id.eq.${targetUserId},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: false })
        .limit(limit)

    return { data: data ? data.reverse() : null, error }
}

/**
 * Fetch older DM messages (pagination)
 */
export const getOlderDMMessages = async (userId, targetUserId, beforeTimestamp, limit = 30) => {
    const { data, error } = await supabase
        .from('direct_messages')
        .select('id, sender_id, receiver_id, content, created_at, is_read')
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${targetUserId}),and(sender_id.eq.${targetUserId},receiver_id.eq.${userId})`)
        .lt('created_at', beforeTimestamp)
        .order('created_at', { ascending: false })
        .limit(limit)

    return { data: data ? data.reverse() : null, error }
}

/**
 * Batch fetch profiles by user IDs
 * @param {Array<string>} userIds - Array of user IDs
 */
export const fetchProfilesBatch = async (userIds) => {
    if (!userIds || userIds.length === 0) {
        return { data: [], error: null }
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url')
        .in('id', userIds)

    // Convert to map for O(1) lookups
    const profileMap = {}
    if (data) {
        data.forEach(profile => {
            profileMap[profile.id] = profile
        })
    }

    return { data: profileMap, error }
}

/**
 * Insert a new category message
 */
export const sendCategoryMessage = async (roomId, senderId, content) => {
    const { data, error } = await supabase
        .from('category_messages')
        .insert({
            room_id: roomId,
            sender_id: senderId,
            content: content,
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        })
        .select()
        .single()

    return { data, error }
}

/**
 * Insert a new DM message
 */
export const sendDMMessage = async (senderId, receiverId, content) => {
    const { data, error } = await supabase
        .from('direct_messages')
        .insert({
            sender_id: senderId,
            receiver_id: receiverId,
            content: content
        })
        .select()
        .single()

    return { data, error }
}
