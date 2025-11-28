import React, { memo } from 'react'
import { MessageSquare, UserPlus, MoreHorizontal, Edit2 } from 'lucide-react'

const ActionRow = memo(({ isMe, onEdit, onMessage, onConnect }) => {
    if (isMe) {
        return (
            <div className="flex justify-center w-full px-4">
                <button
                    onClick={onEdit}
                    className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-full font-medium text-sm hover:bg-gray-900 transition-colors shadow-sm active:scale-95"
                >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                </button>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center gap-3 w-full px-4">
            <button
                onClick={onMessage}
                className="flex-1 max-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white rounded-full font-medium text-sm hover:bg-gray-900 transition-colors shadow-sm active:scale-95"
            >
                <MessageSquare className="w-4 h-4" />
                Message
            </button>

            <button
                onClick={onConnect}
                className="flex-1 max-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-900 rounded-full font-medium text-sm hover:bg-gray-200 transition-colors active:scale-95"
            >
                <UserPlus className="w-4 h-4" />
                Connect
            </button>

            <button className="p-2.5 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
            </button>
        </div>
    )
})

ActionRow.displayName = 'ActionRow'

export default ActionRow
