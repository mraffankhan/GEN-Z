import React, { useEffect, useState } from 'react'
import ConfessionsFeed from '../components/ConfessionsFeed'
import BottomNav from '../components/BottomNav'
import { getVerificationStatus } from '../lib/authHelpers'

const ConfessionsPage = () => {
    const [status, setStatus] = useState('pending')

    useEffect(() => {
        setStatus(getVerificationStatus())
    }, [])

    return (
        <div className="min-h-screen bg-dark-bg text-white pb-24 p-4">
            <div className="max-w-md mx-auto">
                <h1 className="text-2xl font-cyber text-neon-purple mb-6">Confessions</h1>
                <ConfessionsFeed status={status} />
            </div>
            <BottomNav />
        </div>
    )
}

export default ConfessionsPage
