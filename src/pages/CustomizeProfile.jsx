import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

import CosmeticPreview from '../components/CosmeticPreview'
import { ArrowLeft, Check, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useCosmetics } from '../context/CosmeticsContext'

const CustomizeProfile = () => {
    const { user, refreshProfile } = useUser()
    const { getCosmetic } = useCosmetics() // Helper to get item details by ID

    const [localUser, setLocalUser] = useState(null)
    const [ownedItems, setOwnedItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('border') // border, badge, glow

    useEffect(() => {
        if (user) fetchData()
    }, [user])

    const fetchData = async () => {
        try {
            // 1. Fetch Profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (profileError) throw profileError
            setLocalUser(profileData)

            // 2. Fetch Owned Items with details
            const { data: ownedData, error: ownedError } = await supabase
                .from('owned_cosmetics')
                .select(`
                    item_id,
                    cosmetics_items (
                        id,
                        name,
                        type,
                        icon,
                        color,
                        price
                    )
                `)
                .eq('user_id', user.id)

            if (ownedError) throw ownedError

            // Flatten structure
            const items = ownedData.map(o => o.cosmetics_items).filter(Boolean)
            setOwnedItems(items)

        } catch (error) {
            console.error("Error fetching customize data:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleEquip = async (type, item) => {
        if (!localUser || !user) return

        // Optimistic update
        const updates = {}
        const itemId = item ? item.id : null

        if (type === 'border') updates.active_border = itemId
        if (type === 'badge') updates.active_badge = itemId

        if (type === 'glow') {
            const currentCosmetics = localUser.cosmetics || {}
            updates.cosmetics = {
                ...currentCosmetics,
                active_glow_id: itemId,
                glow_color: item ? item.color : null // Fallback
            }
        }

        setLocalUser(prev => ({
            ...prev,
            ...updates,
            cosmetics: updates.cosmetics ? updates.cosmetics : prev.cosmetics
        }))

        await supabase.from('profiles').update(updates).eq('id', user.id)
        refreshProfile()
    }

    if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="animate-spin text-neon-purple" /></div>

    const filteredItems = ownedItems.filter(item => item.type === activeTab)

    // Determine active item ID
    const getActiveId = (type) => {
        if (type === 'border') return localUser?.active_border
        if (type === 'badge') return localUser?.active_badge
        if (type === 'glow') return localUser?.cosmetics?.active_glow_id
        return null
    }

    const activeId = getActiveId(activeTab)

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
                        activeGlow={localUser?.cosmetics?.active_glow_id} // Pass ID
                        cosmetics={localUser?.cosmetics || {}}
                    />
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-white rounded-xl border border-gray-100 mb-6">
                    {['border', 'badge', 'glow'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg capitalize transition-all
                ${activeTab === tab ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Default/None Option */}
                    <button
                        onClick={() => handleEquip(activeTab, null)}
                        className={`p-4 rounded-xl border text-left transition-all
              ${!activeId
                                ? 'border-neon-green bg-neon-green/5 ring-1 ring-neon-green'
                                : 'border-gray-100 bg-white'}`}
                    >
                        <span className="font-bold text-sm block">None</span>
                        <span className="text-xs text-gray-400">Default look</span>
                    </button>

                    {filteredItems.map(item => {
                        const isActive = activeId === item.id
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleEquip(activeTab, item)}
                                className={`p-4 rounded-xl border text-left transition-all relative
                  ${isActive
                                        ? 'border-neon-green bg-neon-green/5 ring-1 ring-neon-green'
                                        : 'border-gray-100 bg-white'}`}
                            >
                                <span className="font-bold text-sm block">{item.name}</span>
                                <span className="text-xs text-gray-400 capitalize">{item.color ? 'Color' : 'Item'}</span>
                                {isActive && <div className="absolute top-2 right-2 text-neon-green"><Check className="w-4 h-4" /></div>}
                            </button>
                        )
                    })}
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-400 text-sm mb-4">You don't own any {activeTab}s yet.</p>
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
