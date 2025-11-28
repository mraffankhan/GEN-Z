import React from 'react'
import AvatarRenderer from './Avatar/AvatarRenderer'
import CosmeticName from './Text/CosmeticName'

const CosmeticPreview = ({ activeBorder, activeBadge, activeGlow, cosmetics = {} }) => {

    // Merge activeGlow into cosmetics for preview if needed
    const previewCosmetics = {
        ...cosmetics,
        // If activeGlow corresponds to a name animation or color, map it here if not already present
    }

    const dummyProfile = {
        avatar_url: null,
        username: 'Preview',
        active_badge: activeBadge,
        active_border: activeBorder,
        cosmetics: previewCosmetics,

    }

    return (
        <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-4">
                <AvatarRenderer
                    profile={dummyProfile}
                    size="xl"
                />
            </div>

            <div className="mt-2">
                <CosmeticName
                    name="Student Name"
                    cosmetics={previewCosmetics}
                    className="font-bold text-lg"
                />
            </div>
        </div>
    )
}

export default CosmeticPreview
