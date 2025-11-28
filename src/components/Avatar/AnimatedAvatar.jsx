import React from 'react'
import { motion } from 'framer-motion'

const AnimatedAvatar = ({
    src,
    alt,
    size = 'md', // sm, md, lg, xl, 2xl
    animationType, // 'pulse', 'spin', 'bounce', 'none'
    glowColor, // hex code
    borderStyle, // 'solid', 'dashed', 'gradient', 'none'
    ringAnimation, // 'pulse', 'rotate', 'none'
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

    const currentSize = sizeClasses[size] || sizeClasses.md

    // Animation variants
    const animations = {
        pulse: { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 2 } },
        spin: { rotate: 360, transition: { repeat: Infinity, duration: 3, ease: "linear" } },
        bounce: { y: [0, -5, 0], transition: { repeat: Infinity, duration: 1.5 } },
        none: {}
    }

    // Glow styles
    const glowStyle = glowColor ? {
        boxShadow: `0 0 10px ${glowColor}, 0 0 20px ${glowColor}40`
    } : {}

    // Border styles
    const getBorderClass = () => {
        switch (borderStyle) {
            case 'solid': return 'border-2 border-white'
            case 'dashed': return 'border-2 border-dashed border-white'
            case 'gradient': return 'border-2 border-transparent bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-border'
            default: return 'border border-white/10'
        }
    }

    return (
        <div
            className={`relative inline-block ${className}`}
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            {/* Ring Animation Layer */}
            {ringAnimation === 'pulse' && (
                <span className={`absolute inset-0 rounded-full animate-ping opacity-20 ${glowColor ? '' : 'bg-primary'}`} style={{ backgroundColor: glowColor }} />
            )}

            {/* Avatar Container */}
            <motion.div
                className={`relative rounded-full overflow-hidden ${currentSize} ${getBorderClass()}`}
                style={glowStyle}
                animate={animations[animationType] || animations.none}
                whileHover={onClick ? { scale: 1.05 } : {}}
                whileTap={onClick ? { scale: 0.95 } : {}}
            >
                <img
                    src={src || `https://ui-avatars.com/api/?name=${alt || 'User'}&background=random`}
                    alt={alt || 'User Avatar'}
                    className="w-full h-full object-cover"
                />
            </motion.div>

            {/* Optional Status Indicator (can be added later) */}
        </div>
    )
}

export default AnimatedAvatar
