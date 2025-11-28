import React, { useMemo, memo } from 'react'

const COLORS = [
    '#F2FCEB', // Soft Green
    '#E8F0FE', // Soft Blue
    '#FCE7F3', // Soft Pink
    '#FFF4D6', // Soft Yellow
    '#E8FFF4'  // Mint
]

const InitialsAvatar = memo(({ name, size = 40, className = '' }) => {
    // Deterministic color generation
    const { initials, bgColor } = useMemo(() => {
        const cleanName = (name || '').trim().toUpperCase()

        // Generate Initials
        let initials = '??'
        if (cleanName) {
            const parts = cleanName.split(' ').filter(Boolean)
            if (parts.length === 1) {
                initials = parts[0].substring(0, 2)
            } else if (parts.length >= 2) {
                initials = parts[0][0] + parts[1][0]
            }
        }

        // Generate Color Hash
        let hash = 0
        for (let i = 0; i < cleanName.length; i++) {
            hash = cleanName.charCodeAt(i) + ((hash << 5) - hash)
        }
        const index = Math.abs(hash) % COLORS.length

        return {
            initials,
            bgColor: COLORS[index]
        }
    }, [name])

    return (
        <div
            className={`flex items-center justify-center rounded-full font-bold text-[#333333] select-none ${className}`}
            style={{
                width: size,
                height: size,
                backgroundColor: bgColor,
                fontSize: Math.max(10, Math.floor(size * 0.4)), // Scale font size
                minWidth: size, // Prevent shrinking
            }}
        >
            {initials}
        </div>
    )
}, (prev, next) => {
    return prev.name === next.name && prev.size === next.size && prev.className === next.className
})

InitialsAvatar.displayName = 'InitialsAvatar'

export default InitialsAvatar
