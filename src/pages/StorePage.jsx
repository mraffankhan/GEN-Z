import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

import StoreCard from '../components/StoreCard'
import ConfirmationModal from '../components/ui/ConfirmationModal'
import { Coins, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const StorePage = () => {
    const { user, profile, refreshProfile } = useUser()
    const [items, setItems] = useState([])
    const [ownedItems, setOwnedItems] = useState([])
    const [activeTab, setActiveTab] = useState('store')
    const [loading, setLoading] = useState(true)

    const [modalOpen, setModalOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)

    useEffect(() => {
        if (user) {
            fetchData()
        }
    }, [user])

    const fetchData = async () => {
        setLoading(true)
        try {
            // Fetch store items
            const { data: storeItems, error: storeError } = await supabase
                .from('cosmetics_items')
                .select('*')
                .order('price', { ascending: true })

            if (storeError) throw storeError

            // Fetch owned items
            const { data: owned, error: ownedError } = await supabase
                .from('owned_cosmetics')
                .select('item_id')
                .eq('user_id', user.id)

            if (ownedError) throw ownedError

            setItems(storeItems || [])
            setOwnedItems(owned?.map(o => o.item_id) || [])
        } catch (error) {
            console.error('Error fetching store data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleBuyClick = (item) => {
        if (!profile || !user) return
        if (profile.coins < item.price) {
            alert("Not enough coins!")
            return
        }
        setSelectedItem(item)
        setModalOpen(true)
    }

    const confirmPurchase = async () => {
        if (!selectedItem) return
        setModalOpen(false) // Close modal immediately

        try {
            // 2. Deduct Coins
            const newCoins = profile.coins - selectedItem.price
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ coins: newCoins })
                .eq('id', user.id)

            if (updateError) throw new Error("Failed to deduct coins")

            // 3. Add to Inventory
            const { error: insertError } = await supabase
                .from('owned_cosmetics')
                .insert({
                    user_id: user.id,
                    item_id: selectedItem.id
                })

            if (insertError) {
                // ROLLBACK: Refund coins if insert fails
                await supabase
                    .from('profiles')
                    .update({ coins: profile.coins }) // Restore original coins
                    .eq('id', user.id)
                throw new Error("Failed to add item to inventory. Coins refunded.")
            }

            // 4. Success
            alert(`Successfully purchased ${selectedItem.name}!`)
            refreshProfile() // Update global context (coins)
            fetchData() // Refresh owned items list
        } catch (error) {
            console.error("Purchase failed:", error)
            alert(error.message || "Purchase failed. Please try again.")
        } finally {
            setSelectedItem(null)
        }
    }

    const handleApply = async (item) => {
        if (!user) return

        try {
            const updates = {}
            // Store IDs for strict database linking
            if (item.type === 'border') updates.active_border = item.id
            if (item.type === 'badge') updates.active_badge = item.id

            // For complex types (glow, animation), we might need to update the JSON
            // But for now, let's assume we store the ID in the JSON or specific columns if they existed
            // The prompt asks to update profiles.cosmetics (JSON) fields
            if (item.type === 'glow') {
                const currentCosmetics = profile.cosmetics || {}
                updates.cosmetics = {
                    ...currentCosmetics,
                    active_glow_id: item.id, // Store ID
                    glow_color: item.color // Fallback/Cache for easier rendering if needed, but we should rely on ID
                }
            }

            // Add other types as needed

            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id)

            if (error) throw error

            alert(`Applied ${item.name}!`)
            refreshProfile()
        } catch (error) {
            console.error("Failed to apply item:", error)
            alert("Failed to apply item.")
        }
    }

    if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading Store...</div>

    const filteredItems = activeTab === 'store'
        ? items
        : items.filter(item => ownedItems.includes(item.id))

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-4">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <Link to="/" className="p-2 rounded-full bg-white border border-gray-100 shadow-sm">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <h1 className="text-xl font-cyber text-neon-purple">Cosmetic Store</h1>
                    <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
                        <Coins className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-bold text-sm">{profile?.coins || 0}</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-white rounded-xl mb-6 shadow-sm border border-gray-100">
                    <button
                        onClick={() => setActiveTab('store')}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'store' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Store
                    </button>
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'inventory' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        My Items
                    </button>
                </div>

                {/* Store Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {filteredItems.map(item => {
                        const isOwned = ownedItems.includes(item.id)
                        const isActive =
                            (item.type === 'border' && profile?.active_border === item.color) ||
                            (item.type === 'badge' && profile?.active_badge === item.icon) ||
                            (item.type === 'glow' && profile?.active_name_glow === item.color)

                        return (
                            <StoreCard
                                key={item.id}
                                item={item}
                                userCoins={profile?.coins || 0}
                                onBuy={handleBuyClick}
                                onApply={handleApply}
                                isOwned={isOwned}
                                isActive={isActive}
                            />
                        )
                    })}
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center text-gray-400 mt-10">
                        <p>{activeTab === 'store' ? "Store is empty." : "You don't own any items yet."}</p>
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={confirmPurchase}
                title="Confirm Purchase"
                message={`Are you sure you want to buy ${selectedItem?.name} for ${selectedItem?.price} coins?`}
                confirmText="Buy Now"
            />
        </div>
    )
}

export default StorePage
