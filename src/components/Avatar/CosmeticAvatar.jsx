import React from 'react'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { ShieldCheck } from 'lucide-react'

const CosmeticAvatar = ({
    src,
    alt,
    size = 'md', // sm, md, lg, xl, 2xl
    activeBadge,
    activeBorder,
    cosmetics = {},
    isVerified = false,
    className = '',
    onClick
}) => {

    // Size mapping
    const sizeClasses = {
        xs: 'w-6 h-6',
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
        xl: 'w-24 h-24',
        '2xl': 'w-32 h-32'
    }

    const iconSizes = {
        xs: 'w-2 h-2',
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
        xl: 'w-6 h-6',
        '2xl': 'w-8 h-8'
    }

    const currentSize = sizeClasses[size] || sizeClasses.md
    const currentIconSize = iconSizes[size] || iconSizes.md

    // 1. Border Logic
    const getBorderClass = (borderName) => {
        if (borderName === 'Gold Profile Border') return 'border-2 md:border-4 border-yellow-400 shadow-md'
        if (borderName === 'Neon Purple Border') return 'border-2 md:border-4 border-purple-500 shadow-md'
        if (cosmetics.gradient_border) return 'border-2 md:border-4 border-transparent bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-border'
        return 'border border-gray-200'
    }

    // 2. Badge Logic
    const getBadgeIcon = (badgeName) => {
        if (badgeName === 'OG Badge') return Icons.Crown
        if (badgeName === 'Cyber Spark Badge') return Icons.Zap
        return null
    }
    const BadgeIcon = activeBadge ? getBadgeIcon(activeBadge) : null

    // 3. Animation Variants
    const animations = {
        pulse: { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 2 } },
        spin: { rotate: 360, transition: { repeat: Infinity, duration: 3, ease: "linear" } },
        bounce: { y: [0, -5, 0], transition: { repeat: Infinity, duration: 1.5 } },
        none: {}
    }

    // 4. Glow / Aura Styles
    const glowStyle = cosmetics.glow_color ? {
        boxShadow: `0 0 10px ${cosmetics.glow_color}, 0 0 20px ${cosmetics.glow_color}40`
    } : {}

    const auraStyle = cosmetics.aura_style ? {
        // Add specific aura styles here if defined in JSON
    } : {}

    return (
        <div
            className={`relative inline-block ${className}`}
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            {/* Ring Animation Layer */}
            {cosmetics.ring_animation === 'pulse' && (
                <span className={`absolute inset-0 rounded-full animate-ping opacity-20 bg-primary`} style={{ backgroundColor: cosmetics.glow_color }} />
            )}

            {/* Avatar Container */}
            <motion.div
                className={`relative rounded-full overflow-hidden ${currentSize} ${getBorderClass(activeBorder)}`}
                style={{ ...glowStyle, ...auraStyle }}
                animate={animations[cosmetics.animation_type] || animations.none}
                whileHover={onClick ? { scale: 1.05 } : {}}
                whileTap={onClick ? { scale: 0.95 } : {}}
            >
                <img
                    src={src || `https://ui-avatars.com/api/?name=${alt || 'User'}&background=random`}
                    alt={alt || 'User Avatar'}
                    className="w-full h-full object-cover"
                />
            </motion.div>

            {/* Verified Badge */}
            {isVerified && (
                <div className="absolute -top-1 -right-1 bg-green-500 p-0.5 rounded-full shadow-md border border-white z-10">
                    <ShieldCheck className={`${currentIconSize} text-white fill-current`} />
                </div>
            )}

            {/* Active Badge */}
            {activeBadge && BadgeIcon && !isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-md border border-gray-100 z-10">
                    <BadgeIcon className={`${currentIconSize} text-primary fill-current`} />
                </div>
            )}
        </div>
    )
}

export default CosmeticAvatar
