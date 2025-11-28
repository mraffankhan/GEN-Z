import React from 'react'

const SkeletonMessage = ({ isMe = false }) => {
    return (
        <div className={`flex w-full mb-4 ${isMe ? 'justify-end' : 'justify-start'} animate-pulse`}>
            <div className={`flex items-end gap-2 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar skeleton */}
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />

                {/* Message bubble skeleton */}
                <div className="flex flex-col min-w-0 gap-1">
                    <div className="h-3 w-16 bg-gray-100 rounded" />
                    <div className={`px-4 py-2 rounded-2xl bg-gray-100 ${isMe ? 'rounded-tr-none' : 'rounded-tl-none'}`}>
                        <div className="h-4 w-32 bg-gray-200 rounded mb-1" />
                        <div className="h-4 w-24 bg-gray-200 rounded" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SkeletonMessage
