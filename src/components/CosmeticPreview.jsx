import React from 'react'
import { User } from 'lucide-react'
import * as Icons from 'lucide-react'

const CosmeticPreview = ({ activeBorder, activeBadge, activeGlow }) => {
    // Map DB strings to Tailwind classes (simplified for demo)
    const getBorderClass = (borderName) => {
        if (borderName === 'Gold Profile Border') return 'border-4 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]'
        if (borderName === 'Neon Purple Border') return 'border-4 border-neon-purple shadow-[0_0_15px_rgba(168,85,247,0.5)]'
        return 'border-2 border-gray-200'
    }

    const getBadgeIcon = (badgeName) => {
        if (badgeName === 'OG Badge') return Icons.Crown
        if (badgeName === 'Cyber Spark Badge') return Icons.Zap
        return null
    }

    const BadgeIcon = activeBadge ? getBadgeIcon(activeBadge) : null

    return (
        <div className="flex flex-col items-center justify-center py-8">
            <div className="relative">
                <div className={`w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden transition-all duration-300 ${getBorderClass(activeBorder)}`}>
                    <User className="w-12 h-12 text-gray-400" />
                </div>

                {activeBadge && (
                    <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-md border border-gray-100">
                        {BadgeIcon && <BadgeIcon className="w-5 h-5 text-neon-purple fill-current" />}
                    </div>
                )}
            </div>

            <div className={`mt-4 font-bold text-lg text-gray-900 px-4 py-1 rounded-full transition-all duration-300 ${activeGlow === 'Verified Glow' ? 'shadow-[0_0_15px_rgba(16,255,132,0.4)] bg-white border border-neon-green/30' : ''}`}>
                Student Name
            </div>
        </div>
    )
}

export default CosmeticPreview
