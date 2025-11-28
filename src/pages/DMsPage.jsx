import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Loader2, MessageSquarePlus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useUser } from '../context/UserContext'
import { debounce } from 'lodash'

// Components
import RecentChatItem from '../components/dms/RecentChatItem'
import SearchResultItem from '../components/dms/SearchResultItem'
import SkeletonChatItem from '../components/skeletons/SkeletonChatItem'
import PageHeader from '../components/PageHeader'

const DMsPage = () => {
    const { user } = useUser()
    const navigate = useNavigate()

    // State
    const [recentChats, setRecentChats] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [loadingChats, setLoadingChats] = useState(true)
    const [loadingSearch, setLoadingSearch] = useState(false)

    // 1. Fetch Recent Chats
    const fetchRecentChats = useCallback(async () => {
        if (!user) return

        try {
            // Fetch messages where I am sender or receiver
            // Limit to 200 to get a good history without over-fetching
            const { data: messages, error } = await supabase
                .from('direct_messages')
                .select('sender_id, receiver_id, content, created_at, is_read')
                .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
                .order('created_at', { ascending: false })
                .limit(200)

            if (messages) {
                const chatMap = new Map()

                messages.forEach(msg => {
                    const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id

                    // Only keep the latest message for each user
                    if (!chatMap.has(otherId)) {
                        chatMap.set(otherId, {
                            userId: otherId,
                            lastMessage: msg.content,
                            timestamp: msg.created_at,
                            isRead: msg.is_read || msg.sender_id === user.id, // Read if I sent it
                            isMe: msg.sender_id === user.id
                        })
                    }
                })

                const uniqueUserIds = Array.from(chatMap.keys())

                if (uniqueUserIds.length > 0) {
                    // Fetch profiles
                    const { data: profiles } = await supabase
                        .from('profiles')
                        .select('id, username, display_name, avatar_url')
                        .in('id', uniqueUserIds)

                    if (profiles) {
                        const chats = uniqueUserIds.map(id => {
                            const profile = profiles.find(p => p.id === id)
                            const chatData = chatMap.get(id)
                            return { ...chatData, profile }
                        }).filter(c => c.profile) // Ensure profile exists

                        setRecentChats(chats)
                    }
                } else {
                    setRecentChats([])
                }
            }
        } catch (error) {
            console.error("Error fetching chats:", error)
        } finally {
            setLoadingChats(false)
        }
    }, [user])

    useEffect(() => {
        fetchRecentChats()

        // Realtime Subscription for new messages
        if (!user) return

        const channel = supabase
            .channel('dms_list_updates')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'direct_messages',
                filter: `receiver_id=eq.${user.id}`
            }, () => {
                // Refresh list on new message
                fetchRecentChats()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [user, fetchRecentChats])

    // 2. Search Users (Debounced)
    const performSearch = useCallback(
        debounce(async (query) => {
            if (!query.trim()) {
                setSearchResults([])
                setLoadingSearch(false)
                return
            }

            setLoadingSearch(true)
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id, username, display_name, avatar_url')
                    .neq('id', user?.id) // Exclude self
                    .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
                    .limit(20)

                if (data) setSearchResults(data)
            } catch (error) {
                console.error("Search error:", error)
            } finally {
                setLoadingSearch(false)
            }
        }, 300),
        [user]
    )

    useEffect(() => {
        performSearch(searchQuery)
        return () => performSearch.cancel()
    }, [searchQuery, performSearch])

    return (
        <div className="min-h-screen bg-white text-gray-900 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
                <div className="px-4 py-4">
                    <h1 className="text-2xl font-bold tracking-tight mb-4">Messages</h1>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search people..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-100 text-gray-900 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-gray-500 text-[15px]"
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white">
                {searchQuery.trim() ? (
                    // Search Results
                    <div>
                        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Search Results</h2>
                        </div>
                        {loadingSearch ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                            </div>
                        ) : searchResults.length > 0 ? (
                            searchResults.map(profile => (
                                <SearchResultItem
                                    key={profile.id}
                                    profile={profile}
                                    onClick={() => navigate(`/dms/${profile.id}`)}
                                />
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-400">
                                <p>No users found</p>
                            </div>
                        )}
                    </div>
                ) : (
                    // Recent Chats
                    <div>
                        {loadingChats ? (
                            <>
                                <SkeletonChatItem />
                                <SkeletonChatItem />
                                <SkeletonChatItem />
                                <SkeletonChatItem />
                            </>
                        ) : recentChats.length > 0 ? (
                            recentChats.map(chat => (
                                <RecentChatItem
                                    key={chat.userId}
                                    conversation={chat}
                                    onClick={() => navigate(`/dms/${chat.userId}`)}
                                />
                            ))
                        ) : (
                            <div className="text-center py-16 px-4">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageSquarePlus className="w-8 h-8 text-gray-300" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">No messages yet</h3>
                                <p className="text-sm text-gray-500">Search for a user to start chatting!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default DMsPage
