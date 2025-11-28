import React from 'react'

import { Zap } from 'lucide-react'

const FlashChatPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-4 flex flex-col items-center justify-center text-center">
            <div className="p-6 rounded-full bg-neon-purple/10 mb-6 animate-pulse">
                <Zap className="w-12 h-12 text-neon-purple" />
            </div>
            <h1 className="text-2xl font-cyber text-neon-purple mb-2">Flash Chat</h1>
            <p className="text-gray-500 max-w-xs">
                Instant, anonymous chats with random students on campus. Coming soon!
            </p>

        </div>
    )
}

export default FlashChatPage
