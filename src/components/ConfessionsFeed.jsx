import React, { useState, useEffect } from 'react'
import { MessageSquare, Lock, Plus, Send, ShieldAlert, User, Tag as TagIcon } from 'lucide-react'
import { checkTextSafety } from '../lib/moderation/geminiTextCheck'
import { updateTrustScore, TRUST_ACTIONS } from '../lib/trust/updateTrustScore'
import { supabase } from '../lib/supabase'
import { useUser } from '../context/UserContext'
import { Link } from 'react-router-dom'

const ConfessionsFeed = () => {
    const { user, profile } = useUser()
    const isApproved = profile?.verification_status === 'approved'
    const canPost = isApproved

    const [confessions, setConfessions] = useState([])
    const [newConfession, setNewConfession] = useState('')
    const [tag, setTag] = useState('')
    const [isChecking, setIsChecking] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showInput, setShowInput] = useState(false)
    const [trustScore, setTrustScore] = useState(500)

    // Fetch trust score on mount
    useEffect(() => {
        if (profile) {
            setTrustScore(profile.trust_score || 500)
        }
    }, [profile])

    const isRestricted = trustScore < 300

    // Fetch confessions from database
    useEffect(() => {
        fetchConfessions()

        // Setup real-time subscription
        const channel = supabase
            .channel('confessions')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'confessions' },
                (payload) => {
                    console.log('New confession:', payload.new)
                    // Add new confession to top of list
                    setConfessions(prev => [payload.new, ...prev])
                }
            )
            .subscribe()

        // Cleanup subscription on unmount
        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const fetchConfessions = async () => {
        try {
            const { data, error } = await supabase
                .from('confessions')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error

            setConfessions(data || [])
        } catch (error) {
            console.error('Failed to fetch confessions:', error)
        } finally {
            setLoading(false)
        }
    }

    const handlePost = async () => {
        if (!newConfession.trim() || !user) return
        if (!isApproved) {
            alert("You must be verified to post.")
            return
        }
        if (isRestricted) {
            setError("Restricted Mode: Trust Score too low.")
            return
        }

        setIsChecking(true)
        setError(null)

        const result = await checkTextSafety(newConfession)

        setIsChecking(false)

        if (result.safe) {
            try {
                // Prepare confession data
                const confessionData = {
                    user_id: user.id,
                    content: newConfession.trim(),
                    created_at: new Date().toISOString()
                }

                // Add tag if provided
                if (tag.trim()) {
                    confessionData.tag = tag.trim()
                }

                // Insert into database
                const { error: insertError } = await supabase
                    .from('confessions')
                    .insert(confessionData)

                if (insertError) {
                    // Fallback: Try without tag if column is missing
                    if (insertError.code === 'PGRST204' && confessionData.tag) {
                        console.warn("⚠️ 'tag' column missing in confessions table. Posting without tag...")
                        delete confessionData.tag

                        const { error: retryError } = await supabase
                            .from('confessions')
                            .insert(confessionData)

                        if (retryError) throw retryError
                    } else {
                        throw insertError
                    }
                }

                // Update trust score for good behavior
                await updateTrustScore(user.id, TRUST_ACTIONS.CONFESSION_UPVOTED)

                // Reset form
                setNewConfession('')
                setTag('')
                setShowInput(false)
            } catch (error) {
                console.error('Failed to post confession:', error)
                alert('Failed to post confession. Please try again.')
            }
        } else {
            setError(result.reason)
            await updateTrustScore(user.id, TRUST_ACTIONS.AI_TOXIC_MESSAGE)
        }
    }

    const formatTimeAgo = (timestamp) => {
        const now = new Date()
        const created = new Date(timestamp)
        const seconds = Math.floor((now - created) / 1000)

        if (seconds < 60) return 'Just now'
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
        return `${Math.floor(seconds / 86400)}d ago`
    }

    return (
        <div className="w-full max-w-md mt-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <MessageSquare className="text-neon-purple w-6 h-6" />
                    <h2 className="text-xl font-cyber text-neon-purple tracking-tight">Campus Confessions</h2>
                </div>
                <button
                    disabled={!canPost}
                    onClick={() => setShowInput(!showInput)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm
            ${canPost
                            ? 'bg-neon-purple text-white hover:bg-purple-600'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                    title={!canPost ? "Verify to unlock posting" : "Post a confession"}
                >
                    {!canPost ? <Lock className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {!canPost ? 'Locked' : 'New'}
                </button>
            </div>

            {/* New Confession Input */}
            {showInput && (
                <div className="mb-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-top-4">
                    <textarea
                        value={newConfession}
                        onChange={(e) => setNewConfession(e.target.value)}
                        placeholder="What's on your mind? (Anonymous)"
                        className="w-full bg-gray-50 text-gray-900 p-3 rounded-xl border border-gray-200 focus:border-neon-purple focus:outline-none resize-none h-24 mb-3"
                    />

                    <input
                        type="text"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        placeholder="Tag (optional)"
                        className="w-full bg-gray-50 text-gray-900 p-2 rounded-lg border border-gray-200 focus:border-neon-purple focus:outline-none mb-3 text-sm"
                    />

                    {error && (
                        <div className="mb-3 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm">
                            <ShieldAlert className="w-4 h-4" />
                            <span>Blocked: {error}</span>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            onClick={handlePost}
                            disabled={isChecking || !newConfession.trim()}
                            className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-neon-purple transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {isChecking ? 'Checking AI...' : <><Send className="w-4 h-4" /> Post</>}
                        </button>
                    </div>
                </div>
            )}

            {/* Confessions Feed */}
            {loading ? (
                <div className="text-center text-gray-400 py-8">Loading confessions...</div>
            ) : confessions.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No confessions yet. Be the first to share!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {confessions.map(confession => (
                        <div
                            key={confession.id}
                            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all animate-in fade-in slide-in-from-top-2"
                        >
                            {/* Header */}
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                    <User className="w-4 h-4 text-gray-400" />
                                </div>
                                <span className="text-sm font-bold text-gray-900">Anonymous</span>
                                {confession.tag && (
                                    <div className="ml-auto flex items-center gap-1 px-2 py-1 rounded-full bg-neon-purple bg-opacity-10 text-neon-purple text-xs font-bold">
                                        <TagIcon className="w-3 h-3" />
                                        {confession.tag}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <p className="text-gray-800 mb-3 text-base leading-relaxed">"{confession.content}"</p>

                            {/* Footer */}
                            <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
                                <span>{formatTimeAgo(confession.created_at)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!isApproved && (
                <div className="text-center mt-6 text-sm text-gray-500 flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4 text-neon-purple" />
                    <span>
                        <Link to="/verify/upload" className="text-neon-purple font-bold hover:underline">Verify your ID</Link> to post anonymously.
                    </span>
                </div>
            )}
        </div>
    )
}

export default ConfessionsFeed
