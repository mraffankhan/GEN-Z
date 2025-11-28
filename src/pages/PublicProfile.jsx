import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MoreHorizontal, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useUser } from '../context/UserContext'

// Components
import ProfileHeader from '../components/profile/ProfileHeader'
import DetailsCard from '../components/profile/DetailsCard'
import ActionRow from '../components/profile/ActionRow'
import MoreMenu from '../components/profile/MoreMenu'

const PublicProfile = () => {
    const { userId } = useParams()
    const navigate = useNavigate()
    const { user: currentUser } = useUser()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single()

                if (error) throw error
                setProfile(data)
            } catch (error) {
                console.error('Error fetching profile:', error)
            } finally {
                setLoading(false)
            }
        }

        if (userId) {
            fetchProfile()
        }
    }, [userId])

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `Check out ${profile?.display_name}'s profile!`,
                url: window.location.href
            }).catch(console.error)
        } else {
            navigator.clipboard.writeText(window.location.href)
            alert('Profile link copied to clipboard!')
        }
    }

    const handleReport = () => {
        alert('User reported. We will review this profile.')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-gray-900 animate-spin" />
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <p className="text-gray-500 mb-4">User not found.</p>
                <button onClick={() => navigate(-1)} className="text-blue-600 font-medium">Go Back</button>
            </div>
        )
    }

    const isMe = currentUser?.id === profile.id

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
                    {!isMe && (
                        <ActionRow
                            isMe={false}
                            onMessage={() => navigate(`/dms/${profile.id}`)}
                            onConnect={() => { }}
                        />
                    )}
                </div>

                {/* 3. Details Card (About + Interests) */}
                <DetailsCard profile={profile} />

                {/* More Menu */}
                <MoreMenu
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                    isMe={isMe}
                    onShare={handleShare}
                    onReport={handleReport}
                />

            </div>
        </div>
    )
}

export default PublicProfile
