import React, { memo } from 'react'
import InitialsAvatar from '../../components/InitialsAvatar'

/**
 * Optimized MessageBubble with InitialsAvatar
 */
const MessageBubble = memo(({ message, isMe, profile, onProfileClick }) => {
    const displayName = profile?.display_name || profile?.username || 'User'

    return (
        <div className={`flex w-full mb-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-end gap-3 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div
                    className="flex-shrink-0 cursor-pointer mb-1"
                    onClick={() => onProfileClick?.(message.sender_id)}
                >
                    <InitialsAvatar
                        name={displayName}
                        size={34}
                    />
                </div>

                <div className="flex flex-col min-w-0">
                    {/* Sender Name (Only for others) */}
                    {!isMe && (
                        <div className="text-[12px] font-bold text-gray-900 mb-1 px-1 truncate">
                            {displayName}
                        </div>
                    )}

                    {/* Bubble */}
                    <div className={`px-4 py-2.5 rounded-2xl text-[15px] shadow-sm relative break-words leading-relaxed ${isMe
                            ? 'bg-[#3B82F6] text-white rounded-tr-none'
                            : 'bg-[#FFFFFF] text-gray-900 rounded-tl-none'
                        }`}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-[10px] mt-1 text-right font-medium ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}, (prevProps, nextProps) => {
    return (
        prevProps.message.id === nextProps.message.id &&
        prevProps.isMe === nextProps.isMe &&
        prevProps.profile?.id === nextProps.profile?.id
    )
})

MessageBubble.displayName = 'MessageBubble'

export default MessageBubble
