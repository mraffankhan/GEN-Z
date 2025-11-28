import React from 'react'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { ShieldCheck } from 'lucide-react'
import { useCosmetics } from '../../context/CosmeticsContext'

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
    const { resolveBorder, resolveBadge, getCosmetic } = useCosmetics()

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

    // 1. Resolve Border
    const borderClass = resolveBorder(activeBorder)

    // 2. Resolve Badge
    const badgeIconName = resolveBadge(activeBadge)
    const BadgeIcon = badgeIconName ? (Icons[badgeIconName] || Icons.Star) : null

    // 3. Animation Variants
    const animations = {
        pulse: { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 2 } },
        spin: { rotate: 360, transition: { repeat: Infinity, duration: 3, ease: "linear" } },
        bounce: { y: [0, -5, 0], transition: { repeat: Infinity, duration: 1.5 } },
        none: {}
    }

    // 4. Glow / Aura Styles
    // Resolve glow from ID if present, otherwise fallback to color
    const glowId = cosmetics.active_glow_id
    const resolvedGlow = glowId ? resolveBorder(glowId) : cosmetics.glow_color // Re-using resolveBorder as it returns color class or style? Wait, resolveBorder returns CLASS. Glow needs COLOR.

    // We need a helper for color resolution if we store IDs.
    // Let's assume resolveBorder returns a class, but for glow we need a color value for box-shadow.
    // We might need to extend CosmeticsContext to return the raw item.

    // Let's use getCosmetic from context
    // Let's use getCosmetic from context (already destructured above)
    const glowItem = glowId ? getCosmetic(glowId) : null
    const glowColor = glowItem ? glowItem.color : cosmetics.glow_color

    const glowStyle = glowColor ? {
        boxShadow: `0 0 10px ${glowColor}, 0 0 20px ${glowColor}40`
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
                className={`relative rounded-full overflow-hidden ${currentSize} ${borderClass}`}
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
