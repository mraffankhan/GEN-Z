import React, { useEffect, useState } from 'react'
import PollsWidget from '../components/PollsWidget'
import BottomNav from '../components/BottomNav'
import { getVerificationStatus } from '../lib/authHelpers'

const PollsPage = () => {
    const [status, setStatus] = useState('pending')

    useEffect(() => {
        setStatus(getVerificationStatus())
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 pb-24 p-4">
            <div className="max-w-md mx-auto">
                <h1 className="text-2xl font-cyber text-neon-green mb-6">Campus Polls</h1>
                <PollsWidget status={status} />
            </div>
            <BottomNav />
        </div>
    )
}

export default PollsPage
