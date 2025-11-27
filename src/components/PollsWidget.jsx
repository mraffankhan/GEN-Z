import React, { useEffect, useState } from 'react'
import { BarChart2, Lock, ShieldAlert } from 'lucide-react'
import { checkTextSafety } from '../lib/moderation/geminiTextCheck'
import { updateTrustScore, TRUST_ACTIONS } from '../lib/trust/updateTrustScore'
import { supabase } from '../lib/supabase'
import { useUser } from '../context/UserContext'
import { Link } from 'react-router-dom'

const PollsWidget = () => {
    const { user, profile } = useUser()
    const isApproved = profile?.verification_status === 'approved'
    const canVote = isApproved

    const [pollQuestion, setPollQuestion] = useState('Best spot to study on campus?')
    const [isSafe, setIsSafe] = useState(true)
    const [trustScore, setTrustScore] = useState(500)

    useEffect(() => {
        const verifyPoll = async () => {
            const result = await checkTextSafety(pollQuestion)
            if (!result.safe) {
                setIsSafe(false)
                setPollQuestion("Poll Hidden: Content Flagged by AI")
            }
        }
        verifyPoll()

        if (profile) {
            setTrustScore(profile.trust_score || 500)
        }
    }, [profile, pollQuestion])

    const isRestricted = trustScore < 300

    const handleVote = async () => {
        if (!canVote || !user) {
            alert("You must be verified to vote.")
            return
        }
        if (isRestricted) {
            alert("Restricted Mode: Cannot vote.")
            return
        }

        await updateTrustScore(user.id, TRUST_ACTIONS.POLL_VOTE)
        alert("Voted! (+5 Trust Score)")
    }

    if (!isApproved) {
        return (
            <div className="w-full max-w-md mt-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="text-center flex flex-col items-center">
                        <BarChart2 className="text-gray-400 w-10 h-10 mb-3" />
                        <p className="text-gray-600 font-bold text-lg">Polls Locked</p>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1 mb-3">
                            <Lock className="w-3 h-3" /> Verify to unlock
                        </p>
                        <Link to="/verify/upload" className="px-4 py-2 bg-neon-green text-black rounded-lg font-bold text-xs">
                            Verify Now
                        </Link>
                    </div>
                </div>
                {/* Blurred Content Behind */}
                <h2 className="text-xl font-cyber text-neon-green mb-4 opacity-20">Daily Poll</h2>
                <div className="space-y-3 opacity-20">
                    <div className="h-12 bg-gray-100 rounded-xl"></div>
                    <div className="h-12 bg-gray-100 rounded-xl"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-md mt-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <BarChart2 className="text-neon-green w-6 h-6" />
                <h2 className="text-xl font-cyber text-neon-green tracking-tight">Daily Poll</h2>
            </div>

            <p className={`mb-6 font-bold text-lg ${isSafe ? 'text-gray-900' : 'text-red-500 flex items-center gap-2'}`}>
                {!isSafe && <ShieldAlert className="w-5 h-5" />}
                {pollQuestion}
            </p>

            {isSafe && (
                <div className="space-y-3">
                    {['Library 4th Floor', 'Student Center', 'Coffee Shop', 'My Dorm'].map((option, index) => (
                        <button
                            key={index}
                            onClick={handleVote}
                            disabled={!canVote || isRestricted}
                            className={`w-full text-left p-4 rounded-xl border transition-all flex justify-between items-center
                ${canVote && !isRestricted
                                    ? 'border-gray-100 hover:border-neon-green hover:bg-neon-green/5 text-gray-700'
                                    : 'border-gray-100 text-gray-400 cursor-not-allowed bg-gray-50'
                                }`}
                        >
                            {option}
                            {(!canVote || isRestricted) && <Lock className="w-4 h-4 opacity-50" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default PollsWidget
