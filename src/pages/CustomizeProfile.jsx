import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

import CosmeticPreview from '../components/CosmeticPreview'
import { ArrowLeft, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const CustomizeProfile = () => {
    const { user, refreshProfile } = useUser()
    const [localUser, setLocalUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('border') // border, badge, name-glow

    useEffect(() => {
        if (user) fetchData()
    }, [user])

    const fetchData = async () => {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (data) setLocalUser(data)
        setLoading(false)
    }

    const handleEquip = async (type, itemName) => {
        if (!localUser || !user) return

        // Optimistic update
        const updates = {}
        if (type === 'border') updates.active_border = itemName
        if (type === 'badge') updates.active_badge = itemName
        if (type === 'name-glow') updates.active_name_glow = itemName

        setLocalUser({ ...localUser, ...updates })

        await supabase.from('profiles').update(updates).eq('id', user.id)
        refreshProfile()
    }

    if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>

    const cosmetics = Array.isArray(localUser?.cosmetics) ? localUser.cosmetics : []
    const filteredItems = cosmetics.filter(item => item.type === activeTab)

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-4">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <Link to="/profile" className="p-2 rounded-full bg-white border border-gray-100 shadow-sm">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <h1 className="text-xl font-cyber text-neon-purple">Customize Look</h1>
                    <div className="w-9"></div> {/* Spacer */}
                </div>

                {/* Preview */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
                    <CosmeticPreview
                        activeBorder={localUser?.active_border}
                        activeBadge={localUser?.active_badge}
                        activeGlow={localUser?.active_name_glow}
                        cosmetics={localUser?.cosmetics || {}}
                    />
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-white rounded-xl border border-gray-100 mb-6">
                    {['border', 'badge', 'name-glow'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg capitalize transition-all
                ${activeTab === tab ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            {tab.replace('-', ' ')}
                        </button>
                    ))}
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Default/None Option */}
                    <button
                        onClick={() => handleEquip(activeTab, null)}
                        className={`p-4 rounded-xl border text-left transition-all
              ${!localUser?.[`active_${activeTab.replace('-', '_')}`]
                                ? 'border-neon-green bg-neon-green/5 ring-1 ring-neon-green'
                                : 'border-gray-100 bg-white'}`}
                    >
                        <span className="font-bold text-sm block">None</span>
                        <span className="text-xs text-gray-400">Default look</span>
                    </button>

                    {filteredItems.map(item => {
                        const isActive = localUser?.[`active_${activeTab.replace('-', '_')}`] === item.name
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleEquip(activeTab, item.name)}
                                className={`p-4 rounded-xl border text-left transition-all relative
                  ${isActive
                                        ? 'border-neon-green bg-neon-green/5 ring-1 ring-neon-green'
                                        : 'border-gray-100 bg-white'}`}
                            >
                                <span className="font-bold text-sm block">{item.name}</span>
                                <span className="text-xs text-gray-400 capitalize">{item.color.split(' ')[0].replace('text-', '')}</span>
                                {isActive && <div className="absolute top-2 right-2 text-neon-green"><Check className="w-4 h-4" /></div>}
                            </button>
                        )
                    })}
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-400 text-sm mb-4">You don't own any {activeTab.replace('-', ' ')}s yet.</p>
                        <Link to="/store" className="inline-block px-6 py-2 bg-neon-purple text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-200">
                            Go to Store
                        </Link>
                    </div>
                )}
            </div>

        </div>
    )
}

export default CustomizeProfile
