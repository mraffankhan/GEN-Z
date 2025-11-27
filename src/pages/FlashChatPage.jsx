import React from 'react'
import BottomNav from '../components/BottomNav'
import { Zap } from 'lucide-react'

const FlashChatPage = () => {
    return (
        <div className="min-h-screen bg-dark-bg text-white pb-24 p-4 flex flex-col items-center justify-center text-center">
            <div className="p-6 rounded-full bg-neon-purple/10 mb-6 animate-pulse">
                <Zap className="w-12 h-12 text-neon-purple" />
            </div>
            <h1 className="text-2xl font-cyber text-neon-purple mb-2">Flash Chat</h1>
            <p className="text-gray-400 max-w-xs">
                Instant, anonymous chats with random students on campus. Coming soon!
            </p>
            <BottomNav />
        </div>
    )
}

export default FlashChatPage
