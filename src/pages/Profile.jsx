import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MoreHorizontal } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { supabase } from '../lib/supabase'

// Components
import ProfileHeader from '../components/profile/ProfileHeader'
import DetailsCard from '../components/profile/DetailsCard'
import ActionRow from '../components/profile/ActionRow'
import EditProfileModal from '../components/profile/EditProfileModal'
import MoreMenu from '../components/profile/MoreMenu'

const Profile = () => {
    const { user, profile, loading, refreshProfile } = useUser()
    const navigate = useNavigate()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut()
            navigate('/login')
        } catch (error) {
            console.error('Error logging out:', error)
        }
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Check out my profile!',
                url: window.location.href
            }).catch(console.error)
        } else {
            // Fallback
            navigator.clipboard.writeText(window.location.href)
            alert('Profile link copied to clipboard!')
        }
    }

    if (loading) return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>
    if (!profile) return <div className="min-h-screen bg-white flex items-center justify-center">Profile not found</div>

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-gray-900 pb-24">

            {/* 1. Ultra-minimal Top Bar */}
            <div className="sticky top-0 z-40 bg-[#FAFAFA]/80 backdrop-blur-md px-4 py-3 flex justify-between items-center">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-900" />
                </button>
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <MoreHorizontal className="w-6 h-6 text-gray-900" />
                </button>
            </div>

            <div className="max-w-md mx-auto px-4 space-y-8 pt-2">

                {/* 2. Centered Profile Header */}
                <div className="space-y-6">
                    <ProfileHeader profile={profile} />

                    {/* Action Buttons */}
                    <ActionRow
                        isMe={true}
                        onEdit={() => setIsEditModalOpen(true)}
                    />
                </div>

                {/* 3. Details Card (About + Interests) */}
                <DetailsCard profile={profile} />

                {/* Edit Modal */}
                <EditProfileModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    profile={profile}
                    onUpdate={refreshProfile}
                />

                {/* More Menu (Bottom Sheet) */}
                <MoreMenu
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                    isMe={true}
                    onEdit={() => setIsEditModalOpen(true)}
                    onLogout={handleLogout}
                    onShare={handleShare}
                />

            </div>
        </div>
    )
}

export default Profile
