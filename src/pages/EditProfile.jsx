import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useUser } from '../context/UserContext'

const EditProfile = () => {
    const { user, profile, refreshProfile } = useUser()
    const navigate = useNavigate()
    const [displayName, setDisplayName] = useState(profile?.display_name || '')
    const [bio, setBio] = useState(profile?.bio || '')
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        if (!user) return

        setSaving(true)
        try {
            const updateData = {
                display_name: displayName.trim() || null,
                bio: bio.trim() || null
            }

            const { error } = await supabase
                .from('profiles')
                .update(updateData)
                .eq('id', user.id)

            if (error) {
                // Fallback: Try updating only display_name if bio column is missing
                if (error.code === 'PGRST204' && updateData.bio !== undefined) {
                    console.warn("⚠️ 'bio' or 'display_name' columns missing. Trying with available columns...")

                    // Try just display_name
                    const { error: retryError } = await supabase
                        .from('profiles')
                        .update({ display_name: updateData.display_name })
                        .eq('id', user.id)

                    if (retryError) throw retryError

                    alert('Profile updated (bio not saved - column missing in database)')
                } else {
                    throw error
                }
            }

            await refreshProfile()
            navigate('/profile')
        } catch (error) {
            console.error('Failed to update profile:', error)
            alert('Failed to save changes. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-4 pb-20">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate('/profile')}
                        className="p-2 rounded-full bg-white border border-gray-100 shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-cyber text-neon-purple">Edit Profile</h1>
                    <div className="w-9"></div> {/* Spacer */}
                </div>

                {/* Form */}
                <div className="space-y-4">
                    {/* Display Name */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Display Name
                        </label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-neon-purple focus:outline-none focus:ring-2 focus:ring-neon-purple focus:ring-opacity-20 transition-all"
                            maxLength={50}
                        />
                        <p className="text-xs text-gray-400 mt-2">{displayName.length}/50 characters</p>
                    </div>

                    {/* Bio */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Bio (Optional)
                        </label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us about yourself..."
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-neon-purple focus:outline-none focus:ring-2 focus:ring-neon-purple focus:ring-opacity-20 transition-all resize-none"
                            rows={4}
                            maxLength={200}
                        />
                        <p className="text-xs text-gray-400 mt-2">{bio.length}/200 characters</p>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-3 rounded-xl bg-neon-purple text-white font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-200"
                    >
                        <Save className="w-5 h-5" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditProfile
