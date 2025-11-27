import React, { useState } from 'react'
import { MessageSquare, Lock, Flame, Plus, Send, ShieldAlert } from 'lucide-react'
import { checkTextSafety } from '../lib/moderation/geminiTextCheck'

const ConfessionsFeed = ({ status }) => {
    const isApproved = status === 'approved'
    const canPost = isApproved

    const [newConfession, setNewConfession] = useState('')
    const [isChecking, setIsChecking] = useState(false)
    const [error, setError] = useState(null)
    const [showInput, setShowInput] = useState(false)

    const mockConfessions = [
        { id: 1, content: "I actually miss 8am classes... said no one ever.", time: "2h ago", likes: 45 },
        { id: 2, content: "The coffee machine in the library is my only friend during finals.", time: "4h ago", likes: 120 },
        { id: 3, content: "Why is the wifi always down when I have a deadline?", time: "5h ago", likes: 89 },
    ]

    const handlePost = async () => {
        if (!newConfession.trim()) return

        setIsChecking(true)
        setError(null)

        const result = await checkTextSafety(newConfession)

        setIsChecking(false)

        if (result.safe) {
            alert("Confession posted! (Mock)")
            setNewConfession('')
            setShowInput(false)
        } else {
            setError(result.reason)
        }
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
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2
            ${canPost
                            ? 'bg-neon-purple text-white hover:bg-purple-600 shadow-[0_0_15px_rgba(176,75,255,0.4)]'
                            : 'bg-transparent border border-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                    title={!canPost ? "Verify to unlock posting" : "Post a confession"}
                >
                    {!canPost ? <Lock className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {!canPost ? 'Locked' : 'New'}
                </button>
            </div>

            {/* New Confession Input */}
            {showInput && (
                <div className="mb-6 bg-card-bg p-4 rounded-2xl border border-neon-purple/50 animate-in fade-in slide-in-from-top-4">
                    <textarea
                        value={newConfession}
                        onChange={(e) => setNewConfession(e.target.value)}
                        placeholder="What's on your mind? (Anon)"
                        className="w-full bg-black/50 text-white p-3 rounded-xl border border-white/10 focus:border-neon-purple focus:outline-none resize-none h-24 mb-3"
                    />

                    {error && (
                        <div className="mb-3 p-3 bg-red-900/20 border border-red-500/50 rounded-xl flex items-center gap-2 text-red-400 text-sm">
                            <ShieldAlert className="w-4 h-4" />
                            <span>Blocked: {error}</span>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            onClick={handlePost}
                            disabled={isChecking || !newConfession.trim()}
                            className="bg-white text-black px-4 py-2 rounded-lg font-bold hover:bg-neon-purple hover:text-white transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {isChecking ? 'Checking AI...' : <><Send className="w-4 h-4" /> Post</>}
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {mockConfessions.map(confession => (
                    <div key={confession.id} className="bg-card-bg p-5 rounded-2xl border border-white/5 backdrop-blur-sm hover:border-white/10 transition-colors">
                        <p className="text-gray-200 mb-4 text-base leading-relaxed">"{confession.content}"</p>
                        <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
                            <span>{confession.time}</span>
                            <div className="flex items-center gap-1.5 text-neon-green">
                                <Flame className="w-4 h-4" />
                                <span>{confession.likes}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {!isApproved && (
                <div className="text-center mt-6 text-sm text-gray-500 flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4 text-neon-purple" />
                    <span><span className="text-neon-purple font-bold">Verify your ID</span> to post anonymously.</span>
                </div>
            )}
        </div>
    )
}

export default ConfessionsFeed
