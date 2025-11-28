import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageSquare, Briefcase, Award, MapPin, Globe, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import BaseCard from '../components/BaseCard'
import BaseButton from '../components/BaseButton'
import PageHeader from '../components/PageHeader'
import { useUser } from '../context/UserContext'
import AvatarRenderer from '../components/Avatar/AvatarRenderer'
import CosmeticName from '../components/Text/CosmeticName'

const PublicProfile = () => {
    const { userId } = useParams()
    const navigate = useNavigate()
    const { user: currentUser } = useUser()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

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

    if (loading) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4">
                <p className="text-text-secondary mb-4">User not found.</p>
                <BaseButton onClick={() => navigate(-1)}>Go Back</BaseButton>
            </div>
        )
    }

    const isMe = currentUser?.id === profile.id

    return (
        <div className="min-h-screen bg-bg text-text-primary pb-24">
            <div className="px-4 pt-6">
                <PageHeader title="Profile" showBack={true} />
            </div>

            <div className="px-4 space-y-6">
                {/* Profile Header */}
                <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                        <AvatarRenderer
                            profile={profile}
                            size="2xl"
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary">
                        <CosmeticName
                            name={profile.display_name || profile.username || 'Anonymous'}
                            cosmetics={profile.cosmetics || {}}
                        />
                    </h1>
                    <p className="text-text-secondary">@{profile.username || 'user'}</p>
                    {profile.bio && (
                        <p className="mt-2 text-sm text-text-secondary max-w-xs">{profile.bio}</p>
                    )}

                    {!isMe && (
                        <div className="mt-6 w-full max-w-xs">
                            <button
                                onClick={() => navigate(`/dms/${profile.id}`)}
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
                            >
                                <MessageSquare className="w-5 h-5" />
                                Message
                            </button>
                        </div>
                    )}
                </div>

                {/* Stats / Info */}
                <div className="grid grid-cols-2 gap-4">
                    <BaseCard className="text-center py-4">
                        <div className="text-2xl font-bold text-primary">{profile.trust_score || 500}</div>
                        <div className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Trust Score</div>
                    </BaseCard>
                    <BaseCard className="text-center py-4">
                        <div className="text-2xl font-bold text-primary">{profile.coins || 0}</div>
                        <div className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Coins</div>
                    </BaseCard>
                </div>

                {/* Details */}
                <BaseCard className="space-y-4">
                    <h3 className="font-bold text-lg">About</h3>

                    {profile.college && (
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <Briefcase className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-text-secondary text-xs">College</p>
                                <p className="font-medium">{profile.college}</p>
                            </div>
                        </div>
                    )}

                    {profile.location && (
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                <MapPin className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-text-secondary text-xs">Location</p>
                                <p className="font-medium">{profile.location}</p>
                            </div>
                        </div>
                    )}

                    {/* Placeholder for Skills/Projects if they exist in DB later */}
                </BaseCard>
            </div>
        </div>
    )
}

export default PublicProfile
