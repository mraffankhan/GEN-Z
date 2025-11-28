import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MessageSquare, Search, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useUser } from '../context/UserContext'
import AvatarRenderer from '../components/Avatar/AvatarRenderer'


const DMsPage = () => {
    const { user } = useUser()
    const navigate = useNavigate()
    const [conversations, setConversations] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        if (!user) return

        const fetchConversations = async () => {
            setLoading(true)

            // 1. Get all messages where I am sender or receiver
            const { data: messages, error } = await supabase
                .from('direct_messages')
                .select('sender_id, receiver_id, content, created_at, is_read')
                .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
                .order('created_at', { ascending: false })

            if (messages) {
                // 2. Extract unique user IDs I've chatted with
                const userMap = new Map()

                messages.forEach(msg => {
                    const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id
                    if (!userMap.has(otherId)) {
                        userMap.set(otherId, {
                            userId: otherId,
                            lastMessage: msg.content,
                            timestamp: msg.created_at,
                            isRead: msg.is_read || msg.sender_id === user.id // Read if I sent it or marked read
                        })
                    }
                })

                const uniqueUserIds = Array.from(userMap.keys())

                if (uniqueUserIds.length > 0) {
                    // 3. Fetch profiles for these users
                    const { data: profiles } = await supabase
                        .from('profiles')
                        .select('*')
                        .in('id', uniqueUserIds)

                    if (profiles) {
                        // Merge profile data with conversation data
                        const fullConversations = uniqueUserIds.map(id => {
                            const profile = profiles.find(p => p.id === id)
                            const conv = userMap.get(id)
                            return { ...conv, profile }
                        }).filter(c => c.profile) // Filter out if profile not found

                        setConversations(fullConversations)
                    }
                }
            }
            setLoading(false)
        }

        fetchConversations()
    }, [user])

    const filteredConversations = conversations.filter(c =>
        c.profile?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.profile?.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-white text-gray-900 pb-20">
            {/* Header */}
            <div className="px-4 py-6 bg-white sticky top-0 z-10">
                <h1 className="text-2xl font-bold mb-4">Messages</h1>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-100 text-gray-900 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                </div>
            </div>

            {/* List */}
            <div className="px-4 space-y-2">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                ) : filteredConversations.length > 0 ? (
                    filteredConversations.map(conv => (
                        <Link
                            key={conv.userId}
                            to={`/dms/${conv.userId}`}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                        >
                            <div className="relative">
                                <AvatarRenderer
                                    profile={conv.profile}
                                    size="md"
                                />
                                {/* Online Status (Mock) */}
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="font-bold text-sm text-gray-900 truncate">
                                        {conv.profile.display_name || conv.profile.username}
                                    </h3>
                                    <span className="text-xs text-gray-400 flex-shrink-0">
                                        {new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className={`text-sm truncate ${conv.isRead ? 'text-gray-500' : 'text-gray-900 font-semibold'}`}>
                                    {conv.lastMessage}
                                </p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">No messages yet</h3>
                        <p className="text-sm text-gray-500">Start a conversation from a profile!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DMsPage
