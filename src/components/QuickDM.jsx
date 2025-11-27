import React, { useState } from 'react'
import { Send, X, ShieldAlert, MessageSquare } from 'lucide-react'
import { checkTextSafety } from '../lib/moderation/geminiTextCheck'

const QuickDM = ({ isOpen, onClose }) => {
    const [message, setMessage] = useState('')
    const [isChecking, setIsChecking] = useState(false)
    const [error, setError] = useState(null)

    if (!isOpen) return null

    const handleSend = async () => {
        if (!message.trim()) return

        setIsChecking(true)
        setError(null)

        const result = await checkTextSafety(message)

        setIsChecking(false)

        if (result.safe) {
            alert("Message Sent! (Mock)")
            setMessage('')
            onClose()
        } else {
            setError(result.reason)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-dark-bg w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="bg-white/5 p-4 flex justify-between items-center border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="text-neon-green w-5 h-5" />
                        <h3 className="font-bold text-white">Quick DM</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="mb-4">
                        <p className="text-sm text-gray-400 mb-2">To: <span className="text-neon-green">@campus_crush</span></p>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="w-full bg-black/50 text-white p-4 rounded-xl border border-white/10 focus:border-neon-green focus:outline-none resize-none h-32"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-900/20 border border-red-500/50 rounded-xl flex items-start gap-3 text-red-400 text-sm">
                            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold">Message Blocked</p>
                                <p>{error}</p>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleSend}
                        disabled={isChecking || !message.trim()}
                        className="w-full bg-neon-green text-black py-3 rounded-xl font-bold hover:bg-green-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isChecking ? 'Analyzing Safety...' : <><Send className="w-5 h-5" /> Send Message</>}
                    </button>
                </div>

            </div>
        </div>
    )
}

export default QuickDM
