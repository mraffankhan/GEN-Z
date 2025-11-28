import React from 'react'

const SkeletonChatItem = () => {
    return (
        <div className="flex items-center gap-4 p-4 bg-white border-b border-gray-100 animate-pulse">
            {/* Avatar skeleton */}
            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />

            {/* Content skeleton */}
            <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-48 bg-gray-100 rounded" />
            </div>

            {/* Timestamp skeleton */}
            <div className="h-3 w-12 bg-gray-100 rounded flex-shrink-0" />
        </div>
    )
}

export default SkeletonChatItem
