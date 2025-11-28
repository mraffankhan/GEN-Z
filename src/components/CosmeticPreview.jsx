import React from 'react'
import CosmeticAvatar from './Avatar/CosmeticAvatar'
import CosmeticName from './Text/CosmeticName'

const CosmeticPreview = ({ activeBorder, activeBadge, activeGlow, cosmetics = {} }) => {

    // Merge activeGlow into cosmetics for preview if needed
    const previewCosmetics = {
        ...cosmetics,
        // If activeGlow corresponds to a name animation or color, map it here if not already present
    }

    return (
        <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-4">
                <CosmeticAvatar
                    size="2xl"
                    activeBorder={activeBorder}
                    activeBadge={activeBadge}
                    cosmetics={previewCosmetics}
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
