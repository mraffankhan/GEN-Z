import React from 'react'
import { ShoppingBag, Edit } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import ProfileStats from '../components/ProfileStats'
import LogoutButton from '../components/LogoutButton'
import BaseCard from '../components/BaseCard'
import BaseButton from '../components/BaseButton'
import CosmeticAvatar from '../components/Avatar/CosmeticAvatar'
import CosmeticName from '../components/Text/CosmeticName'

const Profile = () => {
    const { user, profile, loading } = useUser()

    if (loading) return <div className="min-h-screen bg-bg text-text-primary flex items-center justify-center">Loading Profile...</div>
    if (!profile) return <div className="min-h-screen bg-bg text-text-primary flex items-center justify-center">Profile not found</div>

    const {
        display_name,
        trust_score = 500,
        coins = 0,
        verification_status,
        active_border,
        active_badge,
        bio,
        cosmetics = {}
    } = profile

    const isVerified = verification_status === 'approved'

    return (
        <div className="min-h-screen bg-bg text-text-primary p-4 pb-24">
            <div className="max-w-md mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-primary tracking-tight">My Profile</h1>
                    <Link to="/store" className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-primary shadow-sm">
                        <ShoppingBag className="w-5 h-5" />
                    </Link>
                </div>

                {/* Avatar & Info Card */}
                <BaseCard className="text-center bg-white">
                    <div className="flex flex-col items-center mb-6">
                        {/* Avatar */}
                        <div className="mb-4">
                            <CosmeticAvatar
                                src={profile.avatar_url}
                                alt={profile.username}
                                size="2xl"
                                activeBadge={active_badge}
                                activeBorder={active_border}
                                cosmetics={cosmetics}
                                isVerified={isVerified}
                            />
                        </div>

                        {/* Name & Email */}
                        <h2 className="text-2xl font-bold text-text-primary mb-1">
                            <CosmeticName
                                name={display_name || 'Set your name'}
                                cosmetics={cosmetics}
                            />
                        </h2>
                        <p className="text-sm text-text-secondary mb-3">{user?.email}</p>

                        {/* Bio */}
                        {bio && (
                            <p className="text-sm text-text-secondary max-w-xs">{bio}</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <Link to="/profile/edit" className="w-full">
                            <BaseButton variant="secondary" fullWidth className="text-sm py-2.5">
                                <Edit className="w-4 h-4" />
                                Edit Profile
                            </BaseButton>
                        </Link>
                        <Link to="/profile/customize" className="w-full">
                            <BaseButton variant="outline" fullWidth className="text-sm py-2.5">
                                <ShoppingBag className="w-4 h-4" />
                                Customize
                            </BaseButton>
                        </Link>
                    </div>
                </BaseCard>

                {/* Stats */}
                <ProfileStats trustScore={trust_score} coins={coins} />

                {/* Logout Button */}
                <LogoutButton />

                {/* Back to Home */}
                <Link
                    to="/"
                    className="block w-full text-center py-3 text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    )
}

export default Profile
