import React from 'react'

/**
 * Unified Avatar Renderer
 * Simple circle avatar.
 */
const AvatarRenderer = ({
    profile,
    size = 'md',
    className = '',
    onClick
}) => {
    const sizeClasses = {
        xs: 'w-6 h-6',
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
        xl: 'w-24 h-24',
        '2xl': 'w-32 h-32'
    }

    const currentSize = sizeClasses[size] || sizeClasses.md
    const src = profile?.avatar_url || 'https://via.placeholder.com/150'
    const alt = profile?.username || profile?.display_name || 'User'

    return (
        <img
            src={src}
            alt={alt}
            className={`rounded-full object-cover ${currentSize} ${className}`}
            onClick={onClick}
        />
    )
}

export default AvatarRenderer
