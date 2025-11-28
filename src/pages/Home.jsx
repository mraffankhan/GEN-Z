import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, User, MessageSquare, Zap, ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react'
import FeatureCard from '../components/FeatureCard'
import QuickDM from '../components/QuickDM'
import { useUser } from '../context/UserContext'
import BaseCard from '../components/BaseCard'

import CosmeticAvatar from '../components/Avatar/CosmeticAvatar'

const Home = () => {
  const { profile, loading } = useUser()
  const [showQuickDM, setShowQuickDM] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  // Strict Check: Default to 'not_submitted' if profile or status is missing
  const verificationStatus = profile?.verification_status || 'not_submitted'
  const isApproved = verificationStatus === 'approved'
  const isRejected = verificationStatus === 'rejected'
  const isPending = verificationStatus === 'pending' || verificationStatus === 'not_submitted'

  return (
    <div className="min-h-screen bg-bg text-text-primary pb-24">
      {/* Top Bar */}
      <div className="px-6 py-6 flex justify-between items-center bg-white/90 sticky top-0 z-40 backdrop-blur-md border-b border-gray-100">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-wide">GEN-Z<span className="text-primary">CONNECT</span></h1>
          <p className="text-xs text-text-secondary font-mono">GEN-Z EDITION</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative text-text-secondary hover:text-text-primary transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          <Link to="/profile">
            <CosmeticAvatar
              src={profile?.avatar_url}
              alt={profile?.username}
              size="md"
              activeBadge={profile?.active_badge}
              activeBorder={profile?.active_border}
              cosmetics={profile?.cosmetics || {}}
              isVerified={isApproved}
            />
          </Link>
        </div>
      </div>

      <div className="px-4 max-w-md mx-auto space-y-6 mt-6">
        {/* Verification Banner - Shows for ANY status except approved */}
        {!isApproved && (
          <div className={`p-4 rounded-2xl border flex items-center gap-3 shadow-sm
            ${isRejected
              ? 'bg-red-50 border-red-100 text-red-600'
              : 'bg-yellow-50 border-yellow-100 text-yellow-700'
            }`}>
            {isRejected ? <AlertTriangle className="w-6 h-6 shrink-0" /> : <ShieldCheck className="w-6 h-6 shrink-0" />}
            <div>
              <h3 className="font-bold text-sm">
                {isRejected ? 'Verification Failed' : 'Verification Required'}
              </h3>
              <p className="text-xs opacity-80">
                {isRejected
                  ? 'Your ID was not accepted. Please try again.'
                  : 'Verify your student ID to unlock all features.'}
              </p>
              <Link to="/verify/upload" className="mt-2 inline-block text-xs font-bold underline">
                {isRejected ? 'Retry Verification' : 'Verify Now'}
              </Link>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-bold mb-1 text-text-primary">Hey, <span className="text-primary">{profile?.ai_name?.split(' ')[0] || 'Student'}</span> 👋</h2>
          <p className="text-text-secondary text-sm">What's happening on campus today?</p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-4">

          <FeatureCard
            to="/flashchat"
            icon={Zap}
            title="Flash Chat"
            description="Instant random chat"
            color="purple"
          />
          <FeatureCard
            to="/dms"
            icon={MessageSquare}
            title="DMs"
            description="Chat with peers"
            color="blue"
          />
        </div>

        {/* Quick Actions */}
        <div className="pt-4">
          <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">Quick Actions</h3>
          <BaseCard
            onClick={() => setShowQuickDM(true)}
            className="flex items-center gap-4 group hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-text-primary">Send Quick DM</h4>
              <p className="text-xs text-text-secondary">Message your crush anonymously</p>
            </div>
          </BaseCard>
        </div>
      </div>

      <QuickDM isOpen={showQuickDM} onClose={() => setShowQuickDM(false)} />

    </div>
  )
}

export default Home
