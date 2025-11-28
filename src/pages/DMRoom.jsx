import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, Info, Loader2, MoreVertical } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useUser } from '../context/UserContext'
import { Virtuoso } from 'react-virtuoso'
import MessageBubble from '../modules/youth-connect/MessageBubble'
import AvatarRenderer from '../components/Avatar/AvatarRenderer'


const DMRoom = () => {
    const { userId: targetUserId } = useParams()
    const navigate = useNavigate()
    const { user } = useUser()

    const [messages, setMessages] = useState([])
    const [profiles, setProfiles] = useState({}) // Cache: { userId: profileData }
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [firstItemIndex, setFirstItemIndex] = useState(10000)

    const virtuosoRef = useRef(null)
    const subscriptionRef = useRef(null)

    // 1. Fetch Target Profile & Cache
    useEffect(() => {
        const fetchTargetProfile = async () => {
            if (!targetUserId) return

            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', targetUserId)
                .single()

            if (data) {
                setProfiles(prev => ({ ...prev, [targetUserId]: data }))
            }
        }

        // Also ensure my own profile is in cache if needed, though context has it usually.
        // We'll rely on the resolveProfiles helper for consistency.
        fetchTargetProfile()
    }, [targetUserId])

    // 2. Profile Caching Helper
    const resolveProfiles = useCallback(async (userIds) => {
        const missingIds = userIds.filter(id => !profiles[id])
        if (missingIds.length === 0) return

        const { data } = await supabase
            .from('profiles')
            .select('id, username, avatar_url, display_name')
            .in('id', missingIds)

        if (data) {
            setProfiles(prev => {
                const newProfiles = { ...prev }
                data.forEach(p => newProfiles[p.id] = p)
                return newProfiles
            })
        }
    }, [profiles])

    // 3. Initial Fetch
    useEffect(() => {
        if (!user || !targetUserId) return

        const fetchInitialMessages = async () => {
            setLoading(true)

            // Fetch messages where (sender=me AND receiver=them) OR (sender=them AND receiver=me)
            const { data, error } = await supabase
                .from('direct_messages')
                .select('*')
                .or(`and(sender_id.eq.${user.id},receiver_id.eq.${targetUserId}),and(sender_id.eq.${targetUserId},receiver_id.eq.${user.id})`)
                .order('created_at', { ascending: false })
                .limit(50)

            if (data) {
                const reversed = data.reverse()
                setMessages(reversed)

                // Ensure profiles are loaded
                const userIds = [...new Set(reversed.map(m => m.sender_id))]
                resolveProfiles(userIds)
            }
            setLoading(false)
        }

        fetchInitialMessages()

        // 4. Realtime Subscription
        const channel = supabase
            .channel(`dm:${user.id}-${targetUserId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'direct_messages',
                filter: `receiver_id=eq.${user.id}` // Listen for messages sent TO me
            }, (payload) => {
                if (payload.new.sender_id === targetUserId) {
                    setMessages(prev => [...prev, payload.new])
                    resolveProfiles([payload.new.sender_id])
                }
            })
            .subscribe()

        subscriptionRef.current = channel

        return () => {
            supabase.removeChannel(channel)
        }
    }, [user, targetUserId, resolveProfiles])

    // 5. Load More (Prepend)
    const loadMore = useCallback(async () => {
        const oldestMessage = messages[0]
        if (!oldestMessage || !user) return

        const { data } = await supabase
            .from('direct_messages')
            .select('*')
            .or(`and(sender_id.eq.${user.id},receiver_id.eq.${targetUserId}),and(sender_id.eq.${targetUserId},receiver_id.eq.${user.id})`)
            .lt('created_at', oldestMessage.created_at)
            .order('created_at', { ascending: false })
            .limit(50)

        if (data && data.length > 0) {
            const reversed = data.reverse()
            const userIds = [...new Set(reversed.map(m => m.sender_id))]
            resolveProfiles(userIds)

            setFirstItemIndex(prev => prev - reversed.length)
            setMessages(prev => [...reversed, ...prev])
            return reversed.length
        }
        return 0
    }, [messages, user, targetUserId, resolveProfiles])

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage.trim() || !user) return

        const content = newMessage.trim()
        setNewMessage('')

        // Optimistic Update
        const optimisticMsg = {
            id: `temp-${Date.now()}`,
            sender_id: user.id,
            receiver_id: targetUserId,
            content: content,
            created_at: new Date().toISOString()
        }
        setMessages(prev => [...prev, optimisticMsg])

        const { error } = await supabase
            .from('direct_messages')
            .insert([
                {
                    sender_id: user.id,
                    receiver_id: targetUserId,
                    content: content
                }
            ])

        if (error) {
            console.error("Failed to send:", error)
            setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id))
            setNewMessage(content)
        }
    }

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

    const targetProfile = profiles[targetUserId]

    return (
        <div className="fixed inset-0 z-50 flex flex-col h-full w-full bg-white text-gray-900">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shadow-sm z-20">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/dms')} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>

                    {targetProfile ? (
                        <div className="flex items-center gap-3" onClick={() => navigate(`/profile/${targetUserId}`)}>
                            <AvatarRenderer
                                profile={targetProfile}
                                size="sm"
                            />
                            <div>
                                <div className="font-bold text-sm text-gray-900 leading-tight">
                                    {targetProfile.display_name || targetProfile.username}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-green-500 font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    <span>Online</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                        </div>
                    )}
                </div>
                <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 bg-gray-50">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
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
                        className="flex-grow bg-gray-100 text-gray-900 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-gray-400 text-base"
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-3 bg-blue-600 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 shadow-md shadow-blue-200 transition-all active:scale-95 flex-shrink-0"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    )
}

export default DMRoom
