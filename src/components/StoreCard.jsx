import React from 'react'
import { ShoppingBag, Lock } from 'lucide-react'
import * as Icons from 'lucide-react'

const StoreCard = ({ item, userCoins, onBuy, isOwned }) => {
    const IconComponent = Icons[item.icon] || Icons.Star
    const canAfford = userCoins >= item.price

    return (
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md">
            <div className={`p-4 rounded-xl mb-3 ${item.type === 'border' ? 'bg-gray-50' : 'bg-gray-50'}`}>
                <IconComponent className={`w-8 h-8 ${item.color.split(' ')[0]}`} />
            </div>

            <h3 className="font-bold text-gray-900 text-sm mb-1">{item.name}</h3>
            <p className="text-xs text-gray-500 capitalize mb-3">{item.type}</p>

            {isOwned ? (
                <button disabled className="w-full py-2 rounded-xl bg-gray-100 text-gray-400 text-xs font-bold cursor-not-allowed">
                    Owned
                </button>
            ) : (
                <button
                    onClick={() => onBuy(item)}
                    disabled={!canAfford}
                    className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors
            ${canAfford
                            ? 'bg-gray-900 text-white hover:bg-neon-purple'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    {canAfford ? <ShoppingBag className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {item.price} Coins
                </button>
            )}
        </div>
    )
}

export default StoreCard
