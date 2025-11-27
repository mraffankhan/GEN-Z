import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { ShieldAlert, Check, X, User } from 'lucide-react'

const AdminVerification = () => {
    const [profiles, setProfiles] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchProfiles = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) console.error('Error fetching profiles:', error)
        else setProfiles(data || [])
        setLoading(false)
    }

    useEffect(() => {
        fetchProfiles()
    }, [])

    const updateStatus = async (userId, newStatus) => {
        const { error } = await supabase
            .from('profiles')
            .update({ verification_status: newStatus })
            .eq('id', userId)

        if (error) {
            alert('Error updating status')
        } else {
            // Optimistic update
            setProfiles(profiles.map(p =>
                p.id === userId ? { ...p, verification_status: newStatus } : p
            ))
        }
    }

    return (
        <div className="min-h-screen bg-dark-bg text-white p-8">
            <div className="flex items-center gap-3 mb-8">
                <ShieldAlert className="text-neon-purple w-8 h-8" />
                <h1 className="text-3xl font-cyber text-neon-purple tracking-tight">Admin Verification Panel</h1>
            </div>

            {loading ? (
                <p className="text-gray-500 animate-pulse">Loading profiles...</p>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-white/10">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-gray-400 bg-white/5">
                                <th className="p-4 font-medium">User ID</th>
                                <th className="p-4 font-medium">ID Image</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profiles.map(profile => (
                                <tr key={profile.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-mono text-sm text-gray-500">{profile.id.slice(0, 8)}...</td>
                                    <td className="p-4">
                                        {profile.id_image_url ? (
                                            <a href={profile.id_image_url} target="_blank" rel="noopener noreferrer">
                                                <img
                                                    src={profile.id_image_url}
                                                    alt="ID"
                                                    className="h-16 w-24 object-cover rounded-lg border border-white/20 hover:scale-150 transition-transform origin-left shadow-lg"
                                                />
                                            </a>
                                        ) : (
                                            <div className="h-16 w-24 bg-gray-800 rounded-lg flex items-center justify-center border border-white/10">
                                                <User className="text-gray-600 w-6 h-6" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                      ${profile.verification_status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                                profile.verification_status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                                    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
                                            {profile.verification_status || 'pending'}
                                        </span>
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        <button
                                            onClick={() => updateStatus(profile.id, 'approved')}
                                            className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50 p-2 rounded-lg transition-colors"
                                            title="Approve"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => updateStatus(profile.id, 'rejected')}
                                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 p-2 rounded-lg transition-colors"
                                            title="Reject"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default AdminVerification
