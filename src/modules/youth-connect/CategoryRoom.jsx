import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, Info, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useUser } from '../../context/UserContext'
import { Virtuoso } from 'react-virtuoso'
import MessageBubble from './MessageBubble'
import AvatarRenderer from '../../components/Avatar/AvatarRenderer'

const CategoryRoom = () => {
    const { categoryId } = useParams()
    const navigate = useNavigate()
    const { user } = useUser()

    const [messages, setMessages] = useState([])
    const [profiles, setProfiles] = useState({}) // Cache: { userId: profileData }
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [firstItemIndex, setFirstItemIndex] = useState(10000) // Start high for prepend support

    const virtuosoRef = useRef(null)
    const subscriptionRef = useRef(null)

    const categoryName = categoryId?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

    // 1. Profile Caching Helper
    const resolveProfiles = useCallback(async (userIds) => {
        const missingIds = userIds.filter(id => !profiles[id])
        if (missingIds.length === 0) return

        const { data } = await supabase
            .from('profiles')
            .select('id, username, avatar_url, display_name, active_badge, active_border, cosmetics')
            .in('id', missingIds)

        if (data) {
            setProfiles(prev => {
                const newProfiles = { ...prev }
                data.forEach(p => newProfiles[p.id] = p)
                return newProfiles
            })
        }
    }, [profiles])

    // 2. Initial Fetch
    useEffect(() => {
        const fetchInitialMessages = async () => {
            setLoading(true)
            const { data, error } = await supabase
                .from('category_messages')
                .select('*') // No joins!
                .eq('room_id', categoryId)
                .order('created_at', { ascending: false })
                .limit(50)

            if (data) {
                const reversed = data.reverse()
                setMessages(reversed)

                // Extract User IDs and fetch profiles
                const userIds = [...new Set(reversed.map(m => m.sender_id))]
                resolveProfiles(userIds)
            }
            setLoading(false)
        }

        fetchInitialMessages()

        // 3. Realtime Subscription (One listener only)
        const channel = supabase
            .channel(`room:${categoryId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'category_messages',
                filter: `room_id=eq.${categoryId}`
            }, (payload) => {
                const newMsg = payload.new
                setMessages(prev => [...prev, newMsg])

                // Check if we need to fetch this user's profile
                resolveProfiles([newMsg.sender_id])
            })
            .subscribe()

        subscriptionRef.current = channel

        return () => {
            supabase.removeChannel(channel)
        }
    }, [categoryId, resolveProfiles])

    // 4. Load More (Prepend)
    const loadMore = useCallback(async () => {
        const oldestMessage = messages[0]
        if (!oldestMessage) return

        const { data } = await supabase
            .from('category_messages')
            .select('*')
            .eq('room_id', categoryId)
            .lt('created_at', oldestMessage.created_at)
            .order('created_at', { ascending: false })
            .limit(50)

        if (data && data.length > 0) {
            const reversed = data.reverse()
            const userIds = [...new Set(reversed.map(m => m.sender_id))]
            resolveProfiles(userIds)

            // Prepend messages and adjust index to maintain position
            setFirstItemIndex(prev => prev - reversed.length)
            setMessages(prev => [...reversed, ...prev])
            return reversed.length
        }
        return 0
    }, [messages, categoryId, resolveProfiles])

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage.trim() || !user) return

        const content = newMessage.trim()
        setNewMessage('') // Optimistic clear

        // Optimistic UI Update (Optional, but makes it feel instant)
        const optimisticMsg = {
            id: `temp-${Date.now()}`,
            room_id: categoryId,
            sender_id: user.id,
            content: content,
            created_at: new Date().toISOString()
        }
        setMessages(prev => [...prev, optimisticMsg])

        const { error } = await supabase
            .from('category_messages')
            .insert([
                {
                    room_id: categoryId,
                    sender_id: user.id,
                    content: content,
                    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
                }
            ])

        if (error) {
            console.error("Failed to send:", error)
            setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id)) // Revert on error
            setNewMessage(content)
        }
    }

    // Memoize item content for Virtuoso
    const itemContent = useCallback((index, message) => {
        return (
            <div className="px-4 py-1">
                <MessageBubble
                    message={message}
                    isMe={message.sender_id === user?.id}
                    profile={profiles[message.sender_id]}
                    onProfileClick={(id) => navigate(`/profile/${id}`)}
                />
            </div>
        )
    }, [profiles, user, navigate])

    // Get current user profile for header
    const userProfile = profiles[user?.id] || user?.user_metadata || {}

    return (
        <div className="fixed inset-0 z-50 flex flex-col h-full w-full bg-white text-black">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shadow-sm z-20">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/youth-connect')} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-black" />
                    </button>
                    <div>
                        <h2 className="font-bold text-lg text-black leading-tight">{categoryName}</h2>
                        <div className="flex items-center gap-1.5 text-xs text-neon-green font-medium">
                            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></span>
                            <span>Online</span>
                        </div>
                    </div>
                </div>
                <button onClick={() => navigate(`/youth-connect/info/${categoryId}`)} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                    <Info className="w-6 h-6 text-gray-500" />
                </button>
            </div>

            {/* Messages Area (Virtualized) */}
            <div
                className="flex-1 bg-[#F8F8FA]"
                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/subtle-white-feathers.png")' }}
            >
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 text-neon-purple animate-spin" />
                    </div>
                ) : (
                    <Virtuoso
                        ref={virtuosoRef}
                        style={{ height: '100%' }}
                        data={messages}
                        firstItemIndex={firstItemIndex}
                        initialTopMostItemIndex={messages.length - 1}
                        startReached={loadMore}
                        itemContent={itemContent}
                        followOutput={'auto'}
                        alignToBottom
                    />
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 pb-safe z-20">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-grow bg-[#F8F8FA] text-black px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-purple/20 transition-all placeholder-gray-400 text-base border border-gray-100"
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-3 bg-neon-green rounded-xl text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-400 shadow-md shadow-green-200 transition-all active:scale-95 flex-shrink-0"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CategoryRoom
