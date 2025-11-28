import React from 'react'
import CosmeticAvatar from './CosmeticAvatar'

/**
 * Unified Avatar Renderer
 * Pass the full profile object and it handles the rest.
 */
const AvatarRenderer = ({
    profile,
    size = 'md',
    className = '',
    onClick
}) => {
    if (!profile) {
        return (
            <CosmeticAvatar
                src={null}
                alt="User"
                size={size}
                className={className}
            />
        )
    }

    return (
        <CosmeticAvatar
            src={profile.avatar_url}
            alt={profile.username || profile.display_name}
            size={size}
            activeBadge={profile.active_badge}
            activeBorder={profile.active_border}
            cosmetics={profile.cosmetics || {}}

            className={className}
            onClick={onClick}
        />
    )
}

export default AvatarRenderer
