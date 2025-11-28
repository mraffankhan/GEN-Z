import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, MoreVertical } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useUser } from '../context/UserContext'
import { Virtuoso } from 'react-virtuoso'
import MessageBubble from '../modules/youth-connect/MessageBubble'
import InitialsAvatar from '../components/InitialsAvatar'
import SkeletonMessage from '../components/skeletons/SkeletonMessage'
import { getDMMessages, getOlderDMMessages, fetchProfilesBatch, sendDMMessage } from '../lib/queries/messages'

const DMRoom = () => {
    const { userId: targetUserId } = useParams()
    const navigate = useNavigate()
    const { user } = useUser()

    // Use refs for mutable data
    const messagesRef = useRef([])
    const profilesRef = useRef({})
    const channelRef = useRef(null)
    const virtuosoRef = useRef(null)

    // Minimal state for UI
    const [messageVersion, setMessageVersion] = useState(0)
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [firstItemIndex, setFirstItemIndex] = useState(10000)

    // Stable profile resolution
    const resolveProfiles = useCallback(async (userIds) => {
        const missingIds = userIds.filter(id => !profilesRef.current[id])
        if (missingIds.length === 0) return

        const { data } = await fetchProfilesBatch(missingIds)
        if (data) {
            Object.assign(profilesRef.current, data)
        }
    }, [])

    // Fetch target profile initially
    useEffect(() => {
        if (!targetUserId) return

        const fetchTargetProfile = async () => {
            const { data } = await fetchProfilesBatch([targetUserId])
            if (data) {
                profilesRef.current = { ...profilesRef.current, ...data }
                setMessageVersion(v => v + 1)
            }
        }

        fetchTargetProfile()
    }, [targetUserId])

    // Initial messages fetch
    useEffect(() => {
        if (!user || !targetUserId) return

        const fetchInitialMessages = async () => {
            setLoading(true)

            const { data, error } = await getDMMessages(user.id, targetUserId, 30)

            if (data && !error) {
                messagesRef.current = data

                const userIds = [...new Set(data.map(m => m.sender_id))]
                await resolveProfiles(userIds)

                setMessageVersion(v => v + 1)
            }

            setLoading(false)
        }

        fetchInitialMessages()
    }, [user, targetUserId, resolveProfiles])

    // WebSocket subscription
    useEffect(() => {
        if (!user || !targetUserId) return

        const handleNewMessage = async (payload) => {
            const newMsg = payload.new

            // Only add if from target user
            if (newMsg.sender_id === targetUserId) {
                messagesRef.current = [...messagesRef.current, newMsg]
                await resolveProfiles([newMsg.sender_id])
                setMessageVersion(v => v + 1)
            }
        }

        const channel = supabase
            .channel(`dm:${user.id}-${targetUserId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'direct_messages',
                filter: `receiver_id=eq.${user.id}`
            }, handleNewMessage)
            .subscribe()

        channelRef.current = channel

        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current)
                channelRef.current = null
            }
        }
    }, [user, targetUserId, resolveProfiles])

    // Load more
    const loadMore = useCallback(async () => {
        const messages = messagesRef.current
        if (messages.length === 0 || !user) return

        const oldestMessage = messages[0]
        const { data } = await getOlderDMMessages(
            user.id,
            targetUserId,
            oldestMessage.created_at,
            30
        )

        if (data && data.length > 0) {
            const userIds = [...new Set(data.map(m => m.sender_id))]
            await resolveProfiles(userIds)

            messagesRef.current = [...data, ...messages]
            setFirstItemIndex(prev => prev - data.length)
            setMessageVersion(v => v + 1)

            return data.length
        }
        return 0
    }, [user, targetUserId, resolveProfiles])

    // Send message
    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage.trim() || !user) return

        const content = newMessage.trim()
        setNewMessage('')

        const optimisticMsg = {
            id: `temp-${Date.now()}`,
            sender_id: user.id,
            receiver_id: targetUserId,
            content: content,
            created_at: new Date().toISOString()
        }

        messagesRef.current = [...messagesRef.current, optimisticMsg]
        setMessageVersion(v => v + 1)

        const { error } = await sendDMMessage(user.id, targetUserId, content)

        if (error) {
            console.error("Failed to send:", error)
            messagesRef.current = messagesRef.current.filter(m => m.id !== optimisticMsg.id)
            setMessageVersion(v => v + 1)
            setNewMessage(content)
        }
    }

    const itemContent = useCallback((index, message) => {
        return (
            <div className="px-4 py-1">
                <MessageBubble
                    message={message}
                    isMe={message.sender_id === user?.id}
                    profile={profilesRef.current[message.sender_id]}
                    onProfileClick={(id) => navigate(`/profile/${id}`)}
                />
            </div>
        )
    }, [user, navigate, messageVersion])

    const targetProfile = profilesRef.current[targetUserId]

    return (
        <div className="fixed inset-0 z-50 flex flex-col h-full w-full bg-white text-gray-900">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shadow-sm z-20">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/dms')} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>

                    {targetProfile ? (
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/profile/${targetUserId}`)}>
                            <InitialsAvatar
                                name={targetProfile.display_name || targetProfile.username}
                                size={36}
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
                        <div className="flex items-center gap-3 animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-gray-200" />
                            <div className="w-24 h-4 bg-gray-200 rounded" />
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
                    <div className="p-4 space-y-4">
                        <SkeletonMessage />
                        <SkeletonMessage isMe={true} />
                        <SkeletonMessage />
                    </div>
                ) : (
                    <Virtuoso
                        ref={virtuosoRef}
                        style={{ height: '100%' }}
                        data={messagesRef.current}
                        firstItemIndex={firstItemIndex}
                        initialTopMostItemIndex={messagesRef.current.length - 1}
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
