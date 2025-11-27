import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, User, MessageSquare, BarChart2, Zap, ShieldCheck, AlertTriangle } from 'lucide-react'
import { getVerificationStatus } from '../lib/authHelpers'
import BottomNav from '../components/BottomNav'
import FeatureCard from '../components/FeatureCard'
import QuickDM from '../components/QuickDM'

const Home = () => {
  const [status, setStatus] = useState('pending')
  const [showQuickDM, setShowQuickDM] = useState(false)

  useEffect(() => {
    setStatus(getVerificationStatus())
  }, [])

  const isApproved = status === 'approved'
  const isRejected = status === 'rejected'

  return (
    <div className="min-h-screen bg-dark-bg text-white pb-24">
      {/* Top Bar */}
      <div className="px-6 py-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent sticky top-0 z-40 backdrop-blur-sm">
        <div>
          <h1 className="text-xl font-cyber text-white tracking-wide">CAMPUS<span className="text-neon-green">CONNECT</span></h1>
          <p className="text-xs text-gray-400 font-mono">MIT-WPU EDITION</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative text-gray-400 hover:text-white transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-neon-purple rounded-full"></span>
          </button>
          <Link to="/profile" className="w-10 h-10 rounded-full bg-gray-800 border border-white/20 flex items-center justify-center overflow-hidden">
            <User className="w-6 h-6 text-gray-400" />
          </Link>
        </div>
      </div>

      <div className="px-4 max-w-md mx-auto space-y-6">
        {/* Verification Banner */}
        {!isApproved && (
          <div className={`p-4 rounded-2xl border backdrop-blur-md flex items-center gap-3 shadow-lg
            ${isRejected
              ? 'bg-red-900/20 border-red-500/50 text-red-200'
              : 'bg-yellow-900/20 border-yellow-500/50 text-yellow-200'
            }`}>
            {isRejected ? <AlertTriangle className="w-6 h-6 shrink-0" /> : <ShieldCheck className="w-6 h-6 shrink-0" />}
            <div>
              <h3 className="font-bold text-sm">{isRejected ? 'Verification Failed' : 'Verification Pending'}</h3>
              <p className="text-xs opacity-80">
                {isRejected
                  ? 'Upload a clearer ID card to access features.'
                  : 'You have limited access until verified.'}
              </p>
              {isRejected && (
                <Link to="/verify/upload" className="mt-2 inline-block text-xs font-bold underline">
                  Resubmit ID
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-bold mb-1">Hey, <span className="text-neon-green">Student</span> 👋</h2>
          <p className="text-gray-400 text-sm">What's happening on campus today?</p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-4">
          <FeatureCard
            to="/confessions"
            icon={MessageSquare}
            title="Confessions"
            description="Anon campus secrets"
            color="neon-purple"
          />
          <FeatureCard
            to="/polls"
            icon={BarChart2}
            title="Daily Polls"
            description="Vote on hot topics"
            color="neon-green"
          />
          <FeatureCard
            to="/flashchat"
            icon={Zap}
            title="Flash Chat"
            description="Instant random chat"
            color="neon-purple"
          />
          <FeatureCard
            to="/dms"
            icon={MessageSquare}
            title="DMs"
            description="Chat with peers"
            color="neon-green"
          />
        </div>

        {/* Quick Actions */}
        <div className="pt-4">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h3>
          <button
            onClick={() => setShowQuickDM(true)}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl flex items-center gap-4 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-neon-green/20 flex items-center justify-center text-neon-green group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-white">Send Quick DM</h4>
              <p className="text-xs text-gray-400">Message your crush anonymously</p>
            </div>
          </button>
        </div>
      </div>

      <QuickDM isOpen={showQuickDM} onClose={() => setShowQuickDM(false)} />
      <BottomNav />
    </div>
  )
}

export default Home
