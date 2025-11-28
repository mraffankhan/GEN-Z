import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, Info, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useUser } from '../../context/UserContext'
import CosmeticAvatar from '../../components/Avatar/CosmeticAvatar'
import CosmeticName from '../../components/Text/CosmeticName'

const CategoryRoom = () => {
    const { categoryId } = useParams()
    const navigate = useNavigate()
    const { user } = useUser()

    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [hasMore, setHasMore] = useState(true)

    const messagesEndRef = useRef(null)
    const scrollContainerRef = useRef(null)
    const subscriptionRef = useRef(null)

    const categoryName = categoryId?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

    // Initial Fetch (Last 50 messages)
    useEffect(() => {
        const fetchInitialMessages = async () => {
            setLoading(true)
            const { data, error } = await supabase
                .from('category_messages')
                .select('*, profiles(username, avatar_url, display_name, active_badge, active_border, cosmetics, verification_status)')
                .eq('room_id', categoryId)
                .order('created_at', { ascending: false }) // Fetch newest first for pagination
                .limit(50)

            if (data) {
                setMessages(data.reverse()) // Reverse to show oldest -> newest
                if (data.length < 50) setHasMore(false)
            }
            setLoading(false)
            scrollToBottom(false)
        }

        fetchInitialMessages()

        // Realtime Subscription
        const channel = supabase
            .channel(`room:${categoryId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'category_messages',
                filter: `room_id=eq.${categoryId}`
            }, async (payload) => {
                // Fetch full message details including profile
                const { data } = await supabase
                    .from('category_messages')
                    .select('*, profiles(username, avatar_url, display_name, active_badge, active_border, cosmetics, verification_status)')
                    .eq('id', payload.new.id)
                    .single()

                if (data) {
                    setMessages(prev => [...prev, data])
                    scrollToBottom(true)
                }
            })
            .subscribe()

        subscriptionRef.current = channel

        return () => {
            supabase.removeChannel(channel)
        }
    }, [categoryId])

    // Scroll to bottom helper
    const scrollToBottom = (smooth = true) => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
        }
    }

    // Load More on Scroll Up
    const handleScroll = async (e) => {
        const { scrollTop } = e.currentTarget
        if (scrollTop === 0 && hasMore && !loadingMore && !loading) {
            setLoadingMore(true)
            const oldestMessage = messages[0]
            if (!oldestMessage) return

            const { data } = await supabase
                .from('category_messages')
                .select('*, profiles(username, avatar_url, display_name, active_badge, active_border, cosmetics, verification_status)')
                .eq('room_id', categoryId)
                .lt('created_at', oldestMessage.created_at)
                .order('created_at', { ascending: false })
                .limit(50)

            if (data && data.length > 0) {
                const currentScrollHeight = scrollContainerRef.current.scrollHeight
                setMessages(prev => [...data.reverse(), ...prev])

                // Maintain scroll position
                requestAnimationFrame(() => {
                    if (scrollContainerRef.current) {
                        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight - currentScrollHeight
                    }
                })
            } else {
                setHasMore(false)
            }
            setLoadingMore(false)
        }
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage.trim() || !user) return

        const content = newMessage.trim()
        setNewMessage('') // Optimistic clear

        const { error } = await supabase
            .from('category_messages')
            .insert([
                {
                    room_id: categoryId,
                    sender_id: user.id,
                    content: content
                }
            ])

        if (error) {
            console.error("Failed to send:", error)
            setNewMessage(content) // Restore on error
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex flex-col h-full w-full bg-[#F7F8FA] text-text-primary">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shadow-sm z-20">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/youth-connect')} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-text-primary" />
                    </button>
                    <div>
                        <h2 className="font-bold text-lg text-text-primary leading-tight">{categoryName}</h2>
                        <div className="flex items-center gap-1.5 text-xs text-green-500 font-medium">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span>Online</span>
                        </div>
                    </div>
                </div>
                <button onClick={() => navigate(`/youth-connect/info/${categoryId}`)} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                    <Info className="w-6 h-6 text-text-secondary" />
                </button>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#EFE7DD] bg-opacity-30" // Subtle tint
                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/subtle-white-feathers.png")' }} // Optional texture
            >
                {loadingMore && (
                    <div className="flex justify-center py-2">
                        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                    </div>
                )}

                {messages.map((msg, index) => {
                    const isMe = msg.sender_id === user?.id

                    return (
                        <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1 duration-200`}>
                            <div className={`flex items-end gap-2 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                {/* Cosmetic Avatar */}
                                <CosmeticAvatar
                                    src={msg.profiles?.avatar_url}
                                    alt={msg.profiles?.username}
                                    size="sm"
                                    activeBadge={msg.profiles?.active_badge}
                                    activeBorder={msg.profiles?.active_border}
                                    cosmetics={msg.profiles?.cosmetics || {}}
                                    isVerified={msg.profiles?.verification_status === 'approved'}
                                    onClick={() => navigate(`/profile/${msg.sender_id}`)}
                                    className="flex-shrink-0"
                                />

                                <div className="flex flex-col min-w-0">
                                    {/* Sender Name - Above Bubble */}
                                    <div className={`text-[11px] font-semibold mb-1 px-1 truncate ${isMe ? 'text-right text-gray-500' : 'text-left text-gray-600'}`}>
                                        <CosmeticName
                                            name={msg.profiles?.display_name || msg.profiles?.username || 'User'}
                                            cosmetics={msg.profiles?.cosmetics || {}}
                                        />
                                    </div>

                                    {/* Bubble */}
                                    <div className={`px-4 py-2 rounded-2xl text-[15px] shadow-sm relative break-words ${isMe
                                        ? 'bg-[#3B82F6] text-white rounded-tr-none'
                                        : 'bg-[#FFFFFF] text-gray-900 rounded-tl-none'
                                        }`}>
                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                        <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 pb-safe z-20">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-grow bg-[#F1F3F5] text-text-primary px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder-gray-400 text-base"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-3 bg-primary rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-hover shadow-md shadow-primary/20 transition-all active:scale-95 flex-shrink-0"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CategoryRoom
