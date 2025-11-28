import React from 'react'

const CosmeticName = ({
    name,
    cosmetics = {},
    className = ''
}) => {

    // Animation Classes
    const getAnimationClass = (anim) => {
        switch (anim) {
            case 'pulse': return 'animate-pulse'
            case 'bounce': return 'animate-bounce'
            case 'glow': return 'drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]'
            case 'neon': return 'text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-purple drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]'
            case 'typewriter': return '' // Complex to implement with just CSS class, skipping for now or need custom CSS
            default: return ''
        }
    }

    // Color Theme / Gradient
    const getColorStyle = () => {
        if (cosmetics.color_theme) {
            return { color: cosmetics.color_theme }
        }
        if (cosmetics.gradient_text) {
            return {
                backgroundImage: cosmetics.gradient_text,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }
        }
        return {}
    }

    return (
        <span
            className={`${className} ${getAnimationClass(cosmetics.name_animation)}`}
            style={getColorStyle()}
        >
            {name}
        </span>
    )
}

export default CosmeticName
