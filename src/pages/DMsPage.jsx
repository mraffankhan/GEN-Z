import React from 'react'
import BottomNav from '../components/BottomNav'
import { MessageSquare } from 'lucide-react'

const DMsPage = () => {
    return (
        <div className="min-h-screen bg-dark-bg text-white pb-24 p-4 flex flex-col items-center justify-center text-center">
            <div className="p-6 rounded-full bg-neon-green/10 mb-6">
                <MessageSquare className="w-12 h-12 text-neon-green" />
            </div>
            <h1 className="text-2xl font-cyber text-neon-green mb-2">Direct Messages</h1>
            <p className="text-gray-400 max-w-xs">
                Slide into DMs safely. Connect with your campus crush.
            </p>
            <BottomNav />
        </div>
    )
}

export default DMsPage
