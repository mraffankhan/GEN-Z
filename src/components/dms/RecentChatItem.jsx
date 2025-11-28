import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import InitialsAvatar from '../InitialsAvatar'

const RecentChatItem = ({ conversation, onClick }) => {
    const { userId, lastMessage, timestamp, isRead, profile } = conversation
    const displayName = profile?.display_name || profile?.username || 'User'

    return (
        <div
            onClick={onClick}
            className="flex items-center gap-4 p-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50"
        >
            <InitialsAvatar
                name={displayName}
                size={44}
                className="flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-gray-900 text-[15px] truncate pr-2">
                        {displayName}
                    </h3>
                    {timestamp && (
                        <span className="text-[11px] text-gray-400 whitespace-nowrap flex-shrink-0">
                            {formatDistanceToNow(new Date(timestamp), { addSuffix: false })}
                        </span>
                    )}
                </div>
                <p className={`text-[13px] truncate ${isRead ? 'text-gray-500' : 'text-gray-900 font-semibold'}`}>
                    {lastMessage}
                </p>
            </div>
        </div>
    )
}

export default RecentChatItem
