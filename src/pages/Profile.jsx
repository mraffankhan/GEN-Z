import React from 'react'
import { User, Edit, ShoppingBag, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { useUser } from '../context/UserContext'
import ProfileStats from '../components/ProfileStats'
import LogoutButton from '../components/LogoutButton'

const Profile = () => {
    const { user, profile, loading } = useUser()

    if (loading) return <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">Loading Profile...</div>
    if (!profile) return <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">Profile not found</div>

    const {
        display_name,
        trust_score = 500,
        coins = 0,
        verification_status,
        active_border,
        active_badge,
        bio
    } = profile

    // Helper for border styles
    const getBorderClass = (borderName) => {
        if (borderName === 'Gold Profile Border') return 'border-4 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]'
        if (borderName === 'Neon Purple Border') return 'border-4 border-neon-purple shadow-[0_0_15px_rgba(168,85,247,0.5)]'
        return 'border-4 border-gray-200'
    }

    // Helper for badge icon
    const getBadgeIcon = (badgeName) => {
        if (badgeName === 'OG Badge') return Icons.Crown
        if (badgeName === 'Cyber Spark Badge') return Icons.Zap
        return null
    }
    const BadgeIcon = active_badge ? getBadgeIcon(active_badge) : null

    const isVerified = verification_status === 'approved'

    return (
        <div className="min-h-screen bg-white text-gray-900 p-4 pb-20">
            <div className="max-w-md mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-cyber text-neon-purple">My Profile</h1>
                    <Link to="/store" className="p-2 bg-gray-50 rounded-full border border-gray-100 shadow-sm text-neon-purple">
                        <ShoppingBag className="w-5 h-5" />
                    </Link>
                </div>

                {/* Avatar & Info Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex flex-col items-center text-center mb-6">
                        {/* Avatar */}
                        <div className="relative mb-4">
                            <div className={`w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden transition-all ${getBorderClass(active_border)}`}>
                                <User className="w-12 h-12 text-gray-400" />
                            </div>
                            {/* Verified Badge */}
                            {isVerified && (
                                <div className="absolute -top-1 -right-1 bg-neon-green p-1.5 rounded-full shadow-md border-2 border-white">
                                    <ShieldCheck className="w-4 h-4 text-white fill-current" />
                                </div>
                            )}
                            {/* Active Badge */}
                            {active_badge && BadgeIcon && (
                                <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-md border border-gray-100">
                                    <BadgeIcon className="w-4 h-4 text-neon-purple fill-current" />
                                </div>
                            )}
                        </div>

                        {/* Name & Email */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">
                            {display_name || 'Set your name'}
                        </h2>
                        <p className="text-sm text-gray-500 mb-3">{user?.email}</p>

                        {/* Bio */}
                        {bio && (
                            <p className="text-sm text-gray-600 max-w-xs">{bio}</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <Link
                            to="/profile/edit"
                            className="py-2.5 rounded-xl bg-neon-purple text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors shadow-lg shadow-purple-200"
                        >
                            <Edit className="w-4 h-4" />
                            Edit Profile
                        </Link>
                        <Link
                            to="/profile/customize"
                            className="py-2.5 rounded-xl bg-gray-900 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-neon-purple transition-colors"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Customize
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <ProfileStats trustScore={trust_score} coins={coins} />

                {/* Logout Button */}
                <LogoutButton />

                {/* Back to Home */}
                <Link
                    to="/"
                    className="block w-full bg-gray-50 hover:bg-gray-100 text-center py-3 rounded-xl text-gray-900 font-bold transition-colors border border-gray-100"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    )
}

export default Profile
