import React, { useEffect, useState } from 'react'
import { BarChart2, Lock, ShieldAlert } from 'lucide-react'
import { checkTextSafety } from '../lib/moderation/geminiTextCheck'
import { updateTrustScore, TRUST_ACTIONS } from '../lib/trust/updateTrustScore'
import { supabase } from '../lib/supabase'

const PollsWidget = ({ status }) => {
    const isApproved = status === 'approved'
    const isLockedCompletely = status === 'not_submitted' || status === 'rejected'
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

        const fetchScore = async () => {
            try {
                const fakeUserId = '00000000-0000-0000-0000-000000000000'
                const { data, error } = await supabase.from('profiles').select('trust_score').eq('id', fakeUserId).single()

                if (error) {
                    console.warn("Trust score fetch failed, defaulting to 500")
                    setTrustScore(500)
                } else if (data) {
                    setTrustScore(data.trust_score)
                }
            } catch (e) {
                setTrustScore(500)
            }
        }
        fetchScore()
    }, [])

    const isRestricted = trustScore < 300

    const handleVote = async () => {
        if (!canVote) return
        if (isRestricted) {
            alert("Restricted Mode: Cannot vote.")
            return
        }

        const fakeUserId = '00000000-0000-0000-0000-000000000000'
        await updateTrustScore(fakeUserId, TRUST_ACTIONS.POLL_VOTE)
        alert("Voted! (+5 Trust Score)")
    }

    if (isLockedCompletely) {
        return (
            <div className="w-full max-w-md mt-8 bg-card-bg p-6 rounded-2xl border border-white/5 relative overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-10">
                    <div className="text-center flex flex-col items-center">
                        <BarChart2 className="text-gray-600 w-10 h-10 mb-3" />
                        <p className="text-gray-400 font-bold text-lg">Polls Locked</p>
                        <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Verify to unlock
                        </p>
                    </div>
                </div>
                {/* Blurred Content Behind */}
                <h2 className="text-xl font-cyber text-neon-green mb-4 opacity-20">Daily Poll</h2>
                <div className="space-y-3 opacity-20">
                    <div className="h-12 bg-gray-800 rounded-xl"></div>
                    <div className="h-12 bg-gray-800 rounded-xl"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-md mt-8 bg-card-bg p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
                <BarChart2 className="text-neon-green w-6 h-6" />
                <h2 className="text-xl font-cyber text-neon-green tracking-tight">Daily Poll</h2>
            </div>

            <p className={`mb-6 font-bold text-lg ${isSafe ? 'text-white' : 'text-red-500 flex items-center gap-2'}`}>
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
                                    ? 'border-white/10 hover:border-neon-green hover:bg-white/5 text-gray-200'
                                    : 'border-white/5 text-gray-600 cursor-not-allowed'
                                }`}
                        >
                            {option}
                            {(!canVote || isRestricted) && <Lock className="w-4 h-4 opacity-50" />}
                        </button>
                    ))}
                </div>
            )}

            {!canVote && (
                <div className="text-center mt-4 text-xs text-yellow-500/80 flex items-center justify-center gap-2 bg-yellow-900/10 p-2 rounded-lg border border-yellow-500/20">
                    <Lock className="w-3 h-3" />
                    Voting is locked while verification is pending.
                </div>
            )}
        </div>
    )
}

export default PollsWidget
