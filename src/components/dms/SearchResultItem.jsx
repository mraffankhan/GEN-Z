import React from 'react'
import InitialsAvatar from '../InitialsAvatar'

const SearchResultItem = ({ profile, onClick }) => {
    const displayName = profile.display_name || profile.username || 'User'

    return (
        <div
            onClick={onClick}
            className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors rounded-xl mx-2"
        >
            <InitialsAvatar
                name={displayName}
                size={40}
            />

            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-[14px] truncate">
                    {displayName}
                </h3>
                <p className="text-[12px] text-gray-500 truncate">
                    @{profile.username}
                </p>
            </div>
        </div>
    )
}

export default SearchResultItem
