import React, { memo } from 'react'
import InitialsAvatar from '../InitialsAvatar'

const ProfileHeader = memo(({ profile }) => {
    const displayName = profile?.display_name || profile?.username || 'User'
    const username = profile?.username ? `@${profile.username}` : ''
    const bio = profile?.bio || ''

    return (
        <div className="flex flex-col items-center text-center w-full">
            {/* Avatar */}
            <div className="mb-4 shadow-sm rounded-full">
                <InitialsAvatar
                    name={displayName}
                    size={96}
                    className="text-3xl"
                />
            </div>

            {/* Name */}
            <h1 className="text-[22px] font-semibold text-gray-900 leading-tight mb-1">
                {displayName}
            </h1>

            {/* Username */}
            {username && (
                <p className="text-[13px] text-[#777777] font-medium mb-4">
                    {username}
                </p>
            )}

            {/* Bio */}
            {bio && (
                <p className="text-[14px] text-[#666666] leading-relaxed max-w-[80%] mx-auto">
                    {bio}
                </p>
            )}
        </div>
    )
})

ProfileHeader.displayName = 'ProfileHeader'

export default ProfileHeader
