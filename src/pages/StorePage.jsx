import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

import StoreCard from '../components/StoreCard'
import { Coins, ArrowLeft, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const StorePage = () => {
    const { user, profile, refreshProfile } = useUser()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)



    useEffect(() => {
        if (isApproved) {
            fetchData()
        } else {
            setLoading(false)
        }
    }, [isApproved])

    const fetchData = async () => {
        const { data: storeItems } = await supabase.from('cosmetics_store').select('*')
        if (storeItems) setItems(storeItems)
        setLoading(false)
    }

    const handleBuy = async (item) => {
        if (!profile || !user) return
        if (profile.coins < item.price) {
            alert("Not enough coins!")
            return
        }

        const confirmBuy = window.confirm(`Buy ${item.name} for ${item.price} coins?`)
        if (!confirmBuy) return

        const newCoins = profile.coins - item.price

        // Ensure cosmetics is an array
        const currentCosmetics = Array.isArray(profile.cosmetics) ? profile.cosmetics : []
        const newCosmetics = [...currentCosmetics, item]

        // Optimistic update (Context will refresh anyway)
        const { error } = await supabase
            .from('profiles')
            .update({
                coins: newCoins,
                cosmetics: newCosmetics
            })
            .eq('id', user.id)

        if (error) {
            console.error("Purchase failed:", error)
            alert("Purchase failed. Please try again.")
        } else {
            alert(`Successfully purchased ${item.name}!`)
            refreshProfile() // Update global context
        }
    }

    if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading Store...</div>

    if (!isApproved) {
        return (
            <div className="min-h-screen bg-gray-50 text-gray-900 p-4 flex flex-col items-center justify-center text-center">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-sm w-full">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-8 h-8 text-gray-400" />
                    </div>
                    <h1 className="text-2xl font-cyber text-gray-900 mb-2">Store Locked</h1>
                    <p className="text-gray-500 mb-8">Verify your student ID to access exclusive cosmetics and badges.</p>
                    <Link to="/verify/upload" className="block w-full py-3 bg-neon-purple text-white rounded-xl font-bold shadow-lg shadow-purple-200">
                        Verify Now
                    </Link>
                    <Link to="/" className="block mt-4 text-sm text-gray-400 font-bold">
                        Go Back Home
                    </Link>
                </div>

            </div>
        )
    }

    const ownedItemIds = Array.isArray(profile?.cosmetics) ? profile.cosmetics.map(c => c.id) : []

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

                {/* Store Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {items.map(item => (
                        <StoreCard
                            key={item.id}
                            item={item}
                            userCoins={profile?.coins || 0}
                            onBuy={handleBuy}
                            isOwned={ownedItemIds.includes(item.id)}
                        />
                    ))}
                </div>

                {items.length === 0 && (
                    <div className="text-center text-gray-400 mt-10">
                        <p>Store is empty. Run the migration script!</p>
                    </div>
                )}
            </div>

        </div>
    )
}

export default StorePage
