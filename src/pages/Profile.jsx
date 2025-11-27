import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Shield, Star, Crown, AlertTriangle, User } from 'lucide-react'
import { Link } from 'react-router-dom'

const Profile = () => {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        const fakeUserId = '00000000-0000-0000-0000-000000000000'
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', fakeUserId)
            .single()

        if (error) {
            console.warn("Profile fetch error:", error.message)
            // Fallback for demo if DB is incomplete
            setProfile({
                trust_score: 500,
                ai_name: 'Anonymous',
                ai_college: 'Unknown',
                verification_status: 'pending',
                rewards: 0,
                infractions: 0
            })
        } else if (data) {
            setProfile(data)
        }
        setLoading(false)
    }

    if (loading) return <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">Loading Profile...</div>
    if (!profile) return <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">Profile not found</div>

    const { trust_score = 500, ai_name, ai_college, verification_status } = profile

    const isRestricted = trust_score < 300
    const isGold = trust_score >= 800
    const isOG = trust_score >= 900

    // Calculate percentage for progress bar (0 to 1000)
    const scorePercent = (trust_score / 1000) * 100

    return (
        <div className="min-h-screen bg-dark-bg text-white p-4 pb-20">
            <div className="max-w-md mx-auto">
                <h1 className="text-3xl font-cyber text-neon-green mb-8 text-center">My Profile</h1>

                {/* User Card */}
                <div className={`bg-card-bg p-6 rounded-3xl border ${isGold ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)]' : 'border-white/10'} relative overflow-hidden mb-8`}>
                    {isOG && (
                        <div className="absolute top-0 right-0 bg-neon-purple text-white text-xs font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1">
                            <Crown className="w-3 h-3" /> OG MEMBER
                        </div>
                    )}

                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center border-2 border-white/20">
                            <User className="w-10 h-10 text-gray-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{ai_name || 'Anonymous Student'}</h2>
                            <p className="text-gray-400 text-sm">{ai_college || 'Unknown College'}</p>
                            <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs">
                                <span className={`w-2 h-2 rounded-full ${verification_status === 'approved' ? 'bg-neon-green' : 'bg-gray-500'}`}></span>
                                <span className="uppercase">{verification_status || 'Unverified'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Trust Score Section */}
                    <div className="mb-2">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Trust Score</span>
                            <span className={`text-2xl font-cyber ${isRestricted ? 'text-red-500' : 'text-neon-green'}`}>
                                {trust_score}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-4 bg-black/50 rounded-full overflow-hidden border border-white/10 relative">
                            <div
                                className={`h-full transition-all duration-1000 ease-out ${isRestricted ? 'bg-red-500' : 'bg-gradient-to-r from-neon-green to-neon-purple'}`}
                                style={{ width: `${scorePercent}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 mt-1 font-mono">
                            <span>0 (Banned)</span>
                            <span>1000 (Legend)</span>
                        </div>
                    </div>

                    {isRestricted && (
                        <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded-xl flex items-start gap-3 text-red-400 text-sm">
                            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold">Restricted Mode</p>
                                <p>Your trust score is too low. Posting and voting are disabled.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-card-bg p-4 rounded-2xl border border-white/10 text-center">
                        <div className="text-neon-purple text-2xl font-bold mb-1">{profile.rewards || 0}</div>
                        <div className="text-gray-500 text-xs uppercase tracking-wider">Rewards</div>
                    </div>
                    <div className="bg-card-bg p-4 rounded-2xl border border-white/10 text-center">
                        <div className="text-red-400 text-2xl font-bold mb-1">{profile.infractions || 0}</div>
                        <div className="text-gray-500 text-xs uppercase tracking-wider">Infractions</div>
                    </div>
                </div>

                <Link to="/" className="block w-full bg-white/5 hover:bg-white/10 text-center py-3 rounded-xl text-white font-bold transition-colors">
                    Back to Home
                </Link>
            </div>
        </div>
    )
}

export default Profile
