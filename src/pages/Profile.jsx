import React from 'react'
import { Edit } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'

import LogoutButton from '../components/LogoutButton'
import BaseCard from '../components/BaseCard'
import BaseButton from '../components/BaseButton'
import AvatarRenderer from '../components/Avatar/AvatarRenderer'

const Profile = () => {
    const { user, profile, loading } = useUser()

    if (loading) return <div className="min-h-screen bg-bg text-text-primary flex items-center justify-center">Loading Profile...</div>
    if (!profile) return <div className="min-h-screen bg-bg text-text-primary flex items-center justify-center">Profile not found</div>

    const {
        display_name,
        bio
    } = profile

    return (
        <div className="min-h-screen bg-bg text-text-primary p-4 pb-24">
            <div className="max-w-md mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-primary tracking-tight">My Profile</h1>
                </div>

                {/* Avatar & Info Card */}
                <BaseCard className="text-center bg-white">
                    <div className="flex flex-col items-center mb-6">
                        {/* Avatar */}
                        <div className="mb-4">
                            <AvatarRenderer
                                profile={profile}
                                size="2xl"
                            />
                        </div>

                        {/* Name & Email */}
                        <h2 className="text-2xl font-bold text-text-primary mb-1">
                            {display_name || 'Set your name'}
                        </h2>
                        <p className="text-sm text-text-secondary mb-3">{user?.email}</p>

                        {/* Bio */}
                        {bio && (
                            <p className="text-sm text-text-secondary max-w-xs">{bio}</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full">
                        <Link to="/profile/edit" className="w-full">
                            <BaseButton variant="secondary" fullWidth className="text-sm py-2.5">
                                <Edit className="w-4 h-4" />
                                Edit Profile
                            </BaseButton>
                        </Link>
                    </div>
                </BaseCard>

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
