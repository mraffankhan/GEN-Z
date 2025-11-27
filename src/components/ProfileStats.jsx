import React from 'react'
import { Coins, Trophy, TrendingUp } from 'lucide-react'

const ProfileStats = ({ trustScore, coins, level }) => {
    const getLevel = (score) => {
        if (score >= 800) return 'Elite'
        if (score >= 600) return 'Trusted'
        if (score >= 400) return 'Active'
        return 'Newbie'
    }

    return (
        <div className="grid grid-cols-3 gap-3">
            {/* Trust Score */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                <TrendingUp className="w-5 h-5 text-neon-purple mx-auto mb-2" />
                <div className="text-xl font-bold text-gray-900 mb-1">{trustScore}</div>
                <div className="text-gray-400 text-xs uppercase tracking-wider font-bold">Trust</div>
            </div>

            {/* Coins */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                <Coins className="w-5 h-5 text-neon-green mx-auto mb-2" />
                <div className="text-xl font-bold text-gray-900 mb-1">{coins}</div>
                <div className="text-gray-400 text-xs uppercase tracking-wider font-bold">Coins</div>
            </div>

            {/* Level */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                <Trophy className="w-5 h-5 text-neon-purple mx-auto mb-2" />
                <div className="text-xl font-bold text-gray-900 mb-1">{level || getLevel(trustScore)}</div>
                <div className="text-gray-400 text-xs uppercase tracking-wider font-bold">Level</div>
            </div>
        </div>
    )
}

export default ProfileStats
