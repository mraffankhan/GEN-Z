import React, { useState, useEffect } from 'react'
import { Send, X, ShieldAlert, MessageSquare, Lock } from 'lucide-react'
import { checkTextSafety } from '../lib/moderation/geminiTextCheck'
import { updateTrustScore, TRUST_ACTIONS } from '../lib/trust/updateTrustScore'
import { useUser } from '../context/UserContext'
import { Link } from 'react-router-dom'

const QuickDM = ({ isOpen, onClose }) => {
    const { user, profile } = useUser()
    const [message, setMessage] = useState('')
    const [isChecking, setIsChecking] = useState(false)
    const [error, setError] = useState(null)
    const [trustScore, setTrustScore] = useState(500)

    useEffect(() => {
        if (profile) {
            setTrustScore(profile.trust_score || 500)
        }
    }, [profile])

    const isRestricted = trustScore < 300
    const isApproved = profile?.verification_status === 'approved'

    if (!isOpen) return null

    const handleSend = async () => {
        if (!message.trim() || !user) return
        if (!isApproved) {
            alert("You must be verified to send DMs.")
            return
        }
        if (isRestricted) {
            setError("Restricted Mode: Cannot send DMs.")
            return
        }

        setIsChecking(true)
        setError(null)

        const result = await checkTextSafety(message)

        setIsChecking(false)

        if (result.safe) {
            alert("Message Sent! (+1 Trust Score)")
            await updateTrustScore(user.id, TRUST_ACTIONS.MESSAGE_SENT)
            setMessage('')
            onClose()
        } else {
            setError(result.reason)
            await updateTrustScore(user.id, TRUST_ACTIONS.AI_TOXIC_MESSAGE)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="bg-gray-50 p-4 flex justify-between items-center border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="text-neon-green w-5 h-5" />
                        <h3 className="font-bold text-gray-900">Quick DM</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {!isApproved ? (
                        <div className="text-center py-8">
                            <Lock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-gray-900 mb-2">DMs Locked</h3>
                            <p className="text-gray-500 text-sm mb-6">Verify your student ID to start messaging.</p>
                            <Link to="/verify/upload" className="inline-block px-6 py-2 bg-neon-green text-black rounded-xl font-bold text-sm shadow-lg shadow-green-200" onClick={onClose}>
                                Verify Now
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-2">To: <span className="text-neon-green font-bold">@campus_crush</span></p>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="w-full bg-gray-50 text-gray-900 p-4 rounded-xl border border-gray-200 focus:border-neon-green focus:outline-none resize-none h-32"
                                    autoFocus
                                />
                            </div>

                            {error && (
                                <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm">
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
                                className="w-full bg-neon-green text-white py-3 rounded-xl font-bold hover:bg-green-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-200"
                            >
                                {isChecking ? 'Analyzing Safety...' : <><Send className="w-5 h-5" /> Send Message</>}
                            </button>
                        </>
                    )}
                </div>

            </div>
        </div>
    )
}

export default QuickDM
