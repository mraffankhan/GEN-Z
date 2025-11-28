import React, { useState, useEffect } from 'react'
import { X, Save, Plus, X as XIcon } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const EditProfileModal = ({ isOpen, onClose, profile, onUpdate }) => {
    const [formData, setFormData] = useState({
        display_name: '',
        username: '',
        bio: '',
        location: '',
        skills: [],
        instagram_url: '',
        linkedin_url: '',
        github_url: '',
        portfolio_url: ''
    })
    const [newSkill, setNewSkill] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (profile) {
            let skills = []
            if (Array.isArray(profile.skills)) {
                skills = profile.skills
            } else if (typeof profile.skills === 'string') {
                try { skills = JSON.parse(profile.skills) } catch (e) { }
            }

            setFormData({
                display_name: profile.display_name || '',
                username: profile.username || '',
                bio: profile.bio || '',
                location: profile.location || '',
                skills: skills,
                instagram_url: profile.instagram_url || '',
                linkedin_url: profile.linkedin_url || '',
                github_url: profile.github_url || '',
                portfolio_url: profile.portfolio_url || ''
            })
        }
    }, [profile])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleAddSkill = (e) => {
        e.preventDefault()
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }))
            setNewSkill('')
        }
    }

    const handleRemoveSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skillToRemove)
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    display_name: formData.display_name,
                    username: formData.username,
                    bio: formData.bio,
                    location: formData.location,
                    skills: formData.skills, // Supabase handles array automatically if column is array type
                    instagram_url: formData.instagram_url,
                    linkedin_url: formData.linkedin_url,
                    github_url: formData.github_url,
                    portfolio_url: formData.portfolio_url
                })
                .eq('id', profile.id)

            if (error) throw error

            onUpdate()
            onClose()
        } catch (error) {
            console.error('Error updating profile:', error)
            alert('Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
                    <h2 className="text-lg font-bold text-gray-900">Edit Profile</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Basic Info</h3>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Display Name</label>
                            <input
                                type="text"
                                name="display_name"
                                value={formData.display_name}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                                placeholder="Your Name"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                                placeholder="username"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm resize-none"
                                placeholder="Tell us about yourself..."
                                maxLength={150}
                            />
                            <p className="text-right text-xs text-gray-400 mt-1">{formData.bio.length}/150</p>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                                placeholder="City, Country"
                            />
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Skills & Interests</h3>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                                placeholder="Add a skill (e.g. Python)"
                                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
                            />
                            <button
                                type="button"
                                onClick={handleAddSkill}
                                className="p-2.5 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {formData.skills.map((skill, index) => (
                                <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                    {skill}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSkill(skill)}
                                        className="hover:text-red-500"
                                    >
                                        <XIcon className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Social Links</h3>

                        <div className="grid grid-cols-1 gap-3">
                            <input
                                type="url"
                                name="instagram_url"
                                value={formData.instagram_url}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                                placeholder="Instagram URL"
                            />
                            <input
                                type="url"
                                name="linkedin_url"
                                value={formData.linkedin_url}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                                placeholder="LinkedIn URL"
                            />
                            <input
                                type="url"
                                name="github_url"
                                value={formData.github_url}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                                placeholder="GitHub URL"
                            />
                            <input
                                type="url"
                                name="portfolio_url"
                                value={formData.portfolio_url}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                                placeholder="Portfolio Website"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-900 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default EditProfileModal
