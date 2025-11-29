import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MoreHorizontal, CheckCircle } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { supabase } from '../lib/supabase'

// Components
import ProfileHeader from '../components/profile/ProfileHeader'
import DetailsCard from '../components/profile/DetailsCard'
import ActionRow from '../components/profile/ActionRow'
import EditProfileModal from '../components/profile/EditProfileModal'
import MoreMenu from '../components/profile/MoreMenu'
import AddJob from '../components/admin/AddJob'
import ManageJobs from '../components/admin/ManageJobs'
import LogoutModal from '../components/ui/LogoutModal'
import { ShieldCheck, Plus, List } from 'lucide-react'

const Profile = () => {
    const { user, profile, loading, refreshProfile, logout } = useUser()
    const navigate = useNavigate()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [activeAdminTab, setActiveAdminTab] = useState(null)
    const [jobToEdit, setJobToEdit] = useState(null)

    // Logout State
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
    const [toast, setToast] = useState(null)

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true)
    }

    const confirmLogout = async () => {
        try {
            // Use context logout to ensure local state is cleared
            await logout()
        } catch (error) {
            console.error('Error logging out:', error)
        } finally {
            // Always perform client-side cleanup
            setToast({ type: 'success', message: 'Logged out successfully' })
            setIsLogoutModalOpen(false)

            // Short delay to show toast before redirecting
            setTimeout(() => {
                navigate('/auth/login', { replace: true })
            }, 1000)
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
        <div className="min-h-screen bg-[#FAFAFA] text-gray-900 pb-24 relative">
            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border bg-white text-green-700 border-green-100">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">{toast.message}</span>
                    </div>
                </div>
            )}

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

                    {/* Admin Panel */}
                    {profile?.is_admin && (
                        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <ShieldCheck className="w-5 h-5 text-neon-purple" />
                                <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setActiveAdminTab('add'); setJobToEdit(null); }}
                                    className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${activeAdminTab === 'add' ? 'bg-black text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                                >
                                    <Plus className="w-4 h-4" />
                                    Post Job
                                </button>
                                <button
                                    onClick={() => setActiveAdminTab('manage')}
                                    className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${activeAdminTab === 'manage' ? 'bg-black text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                                >
                                    <List className="w-4 h-4" />
                                    Manage Jobs
                                </button>
                            </div>

                            {activeAdminTab === 'add' && (
                                <div className="mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <AddJob
                                        onClose={() => setActiveAdminTab(null)}
                                        jobToEdit={jobToEdit}
                                        onJobAdded={() => {
                                            setActiveAdminTab('manage')
                                            setJobToEdit(null)
                                        }}
                                    />
                                </div>
                            )}

                            {activeAdminTab === 'manage' && (
                                <div className="mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <ManageJobs
                                        onEdit={(job) => {
                                            setJobToEdit(job)
                                            setActiveAdminTab('add')
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    )}
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
                    onLogout={handleLogoutClick}
                    onShare={handleShare}
                />

                {/* Logout Modal */}
                <LogoutModal
                    isOpen={isLogoutModalOpen}
                    onClose={() => setIsLogoutModalOpen(false)}
                    onConfirm={confirmLogout}
                />

            </div>
        </div>
    )
}

export default Profile
