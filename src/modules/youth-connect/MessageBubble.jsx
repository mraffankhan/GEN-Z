import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import AvatarRenderer from '../../components/Avatar/AvatarRenderer'
import CosmeticName from '../../components/Text/CosmeticName'

const MessageBubble = memo(({ message, isMe, profile, onProfileClick }) => {
    // Fallback profile if missing from cache
    const displayProfile = profile || {
        username: 'Loading...',
        avatar_url: null,
        display_name: 'Loading...',
        active_badge: null,
        active_border: null,
        cosmetics: {},

    }

    return (
        <div className={`flex w-full mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-end gap-2 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className="flex-shrink-0 cursor-pointer" onClick={() => onProfileClick(message.sender_id)}>
                    <AvatarRenderer
                        profile={displayProfile}
                        size="sm"
                    />
                </div>

                <div className="flex flex-col min-w-0">
                    {/* Sender Name */}
                    <div className={`text-[11px] font-semibold mb-1 px-1 truncate ${isMe ? 'text-right text-gray-500' : 'text-left text-gray-600'}`}>
                        <CosmeticName
                            name={displayProfile.display_name || displayProfile.username || 'User'}
                            cosmetics={displayProfile.cosmetics || {}}
                        />
                    </div>

                    {/* Bubble */}
                    <div className={`px-4 py-2 rounded-2xl text-[15px] shadow-sm relative break-words ${isMe
                        ? 'bg-[#3B82F6] text-white rounded-tr-none'
                        : 'bg-[#FFFFFF] text-gray-900 rounded-tl-none'
                        }`}>
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}, (prevProps, nextProps) => {
    // Custom comparison for performance
    return (
        prevProps.message.id === nextProps.message.id &&
        prevProps.isMe === nextProps.isMe &&
        prevProps.profile === nextProps.profile // Reference equality check for profile object
    )
})

export default MessageBubble
