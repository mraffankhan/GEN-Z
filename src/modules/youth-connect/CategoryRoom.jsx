import React, { useState, useEffect, useRef, useCallback, memo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, Info } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useUser } from '../../context/UserContext'
import { Virtuoso } from 'react-virtuoso'
import MessageBubble from './MessageBubble'
import CategoryTabs from './CategoryTabs'
import SkeletonMessage from '../../components/skeletons/SkeletonMessage'
import { getCategoryMessages, getOlderCategoryMessages, fetchProfilesBatch, sendCategoryMessage } from '../../lib/queries/messages'

// --- Memoized Header ---
const Header = memo(({ categoryName, onBack, onInfo }) => (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shadow-sm h-[60px]">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors">
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
        <button onClick={onInfo} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
            <Info className="w-6 h-6 text-gray-500" />
        </button>
    </div>
))
Header.displayName = 'Header'

// --- Memoized Input Bar ---
const InputBar = memo(({ value, onChange, onSubmit, disabled }) => (
    <form onSubmit={onSubmit} className="p-3 bg-white border-t border-gray-100 pb-safe">
        <div className="flex items-center gap-2">
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder="Type a message..."
                className="flex-grow bg-[#F8F8FA] text-black px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-purple/20 transition-all placeholder-gray-400 text-base border border-gray-100"
                autoFocus
            />
            <button
                type="submit"
                disabled={disabled}
                className="p-3 bg-neon-green rounded-xl text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-400 shadow-md shadow-green-200 transition-all active:scale-95 flex-shrink-0"
            >
                <Send className="w-5 h-5" />
            </button>
        </div>
    </form>
))
InputBar.displayName = 'InputBar'

const CategoryRoom = () => {
    const { categoryId } = useParams()
    const navigate = useNavigate()
    const { user } = useUser()

    // Refs
    const messagesRef = useRef([])
    const profilesRef = useRef({})
    const channelRef = useRef(null)
    const virtuosoRef = useRef(null)

    // State
    const [messageVersion, setMessageVersion] = useState(0)
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [firstItemIndex, setFirstItemIndex] = useState(10000)

    const categoryName = categoryId?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

    // Stable profile resolution
    const resolveProfiles = useCallback(async (userIds) => {
        const missingIds = userIds.filter(id => !profilesRef.current[id])
        if (missingIds.length === 0) return

        const { data } = await fetchProfilesBatch(missingIds)
        if (data) {
            Object.assign(profilesRef.current, data)
        }
    }, [])

    // Initial fetch
    useEffect(() => {
        if (!categoryId) return

        const fetchInitialMessages = async () => {
            setLoading(true)
            const { data, error } = await getCategoryMessages(categoryId, 30)

            if (data && !error) {
                messagesRef.current = data
                const userIds = [...new Set(data.map(m => m.sender_id))]
                await resolveProfiles(userIds)
                setMessageVersion(v => v + 1)
            }
            setLoading(false)
        }

        fetchInitialMessages()
    }, [categoryId, resolveProfiles])

    // WebSocket
    useEffect(() => {
        if (!categoryId || !user) return

        const handleNewMessage = async (payload) => {
            const newMsg = payload.new
            messagesRef.current = [...messagesRef.current, newMsg]
            await resolveProfiles([newMsg.sender_id])
            setMessageVersion(v => v + 1)
        }

        const channel = supabase
            .channel(`room:${categoryId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'category_messages',
                filter: `room_id=eq.${categoryId}`
            }, handleNewMessage)
            .subscribe()

        channelRef.current = channel

        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current)
                channelRef.current = null
            }
        }
    }, [categoryId, user, resolveProfiles])

    // Load more
    const loadMore = useCallback(async () => {
        const messages = messagesRef.current
        if (messages.length === 0) return

        const oldestMessage = messages[0]
        const { data } = await getOlderCategoryMessages(
            categoryId,
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
    }, [categoryId, resolveProfiles])

    // Send message
    const handleSendMessage = useCallback(async (e) => {
        e.preventDefault()
        if (!newMessage.trim() || !user) return

        const content = newMessage.trim()
        setNewMessage('')

        const optimisticMsg = {
            id: `temp-${Date.now()}`,
            room_id: categoryId,
            sender_id: user.id,
            content: content,
            created_at: new Date().toISOString()
        }

        messagesRef.current = [...messagesRef.current, optimisticMsg]
        setMessageVersion(v => v + 1)

        const { error } = await sendCategoryMessage(categoryId, user.id, content)

        if (error) {
            console.error("Failed to send:", error)
            messagesRef.current = messagesRef.current.filter(m => m.id !== optimisticMsg.id)
            setMessageVersion(v => v + 1)
            setNewMessage(content)
        }
    }, [newMessage, user, categoryId])

    // Item Content
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

    // Handlers
    const handleBack = useCallback(() => navigate('/youth-connect'), [navigate])
    const handleInfo = useCallback(() => navigate(`/youth-connect/info/${categoryId}`), [navigate, categoryId])
    const handleInputChange = useCallback((e) => setNewMessage(e.target.value), [])

    return (
        <div className="flex flex-col h-full fixed inset-0 bg-white">

            {/* FIXED TOP BAR */}
            <div className="sticky top-0 z-50 bg-white">
                <Header
                    categoryName={categoryName}
                    onBack={handleBack}
                    onInfo={handleInfo}
                />
            </div>

            {/* FIXED CATEGORY TABS BELOW HEADER */}
            <div className="sticky top-[50px] z-40 bg-white border-b border-gray-100">
                <CategoryTabs />
            </div>

            {/* SCROLL ONLY THIS AREA */}
            <div className="flex-1 overflow-y-auto bg-[#F8F8FA]">
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

            {/* FIXED BOTTOM INPUT */}
            <div className="sticky bottom-0 z-40 bg-white">
                <InputBar
                    value={newMessage}
                    onChange={handleInputChange}
                    onSubmit={handleSendMessage}
                    disabled={!newMessage.trim()}
                />
            </div>

        </div>
    )
}

export default CategoryRoom
