import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ConfessionsFeed from '../components/ConfessionsFeed'
import PollsWidget from '../components/PollsWidget'
import QuickDM from '../components/QuickDM'
import { AlertTriangle, XCircle, CheckCircle, Info, Lock, MessageSquare } from 'lucide-react'

const Home = () => {
  const [status, setStatus] = useState('loading')
  const [loading, setLoading] = useState(true)
  const [isDMOpen, setIsDMOpen] = useState(false)

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    // Fake User ID for MVP testing
    const fakeUserId = '00000000-0000-0000-0000-000000000000'

    const { data, error } = await supabase
      .from('profiles')
      .select('verification_status')
      .eq('id', fakeUserId)
      .single()

    if (data) {
      setStatus(data.verification_status || 'not_submitted')
    } else {
      setStatus('not_submitted')
    }
    setLoading(false)
  }

  if (loading) return <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-dark-bg text-white pb-20">

      {/* Status Banners */}
      {status === 'not_submitted' && (
        <div className="w-full bg-blue-900/20 border-b border-blue-500/50 p-4 flex items-center justify-center gap-3 backdrop-blur-md">
          <Info className="text-blue-400 w-5 h-5" />
          <p className="text-blue-400 text-sm font-bold tracking-wider">
            Verify your student identity to unlock full access.
          </p>
        </div>
      )}

      {status === 'pending' && (
        <div className="w-full bg-yellow-900/20 border-b border-yellow-500/50 p-4 flex items-center justify-center gap-3 backdrop-blur-md">
          <AlertTriangle className="text-yellow-400 w-5 h-5" />
          <p className="text-yellow-400 text-sm font-bold tracking-wider">
            VERIFICATION PENDING — Some features locked
          </p>
        </div>
      )}

      {status === 'rejected' && (
        <div className="w-full bg-red-900/20 border-b border-red-500/50 p-4 flex items-center justify-center gap-3 backdrop-blur-md">
          <XCircle className="text-red-400 w-5 h-5" />
          <p className="text-red-400 text-sm font-bold tracking-wider">
            Verification Failed — Upload a clearer ID card
          </p>
        </div>
      )}

      {status === 'approved' && (
        <div className="w-full bg-green-900/20 border-b border-green-500/50 p-4 flex items-center justify-center gap-3 backdrop-blur-md">
          <CheckCircle className="text-neon-green w-5 h-5" />
          <p className="text-neon-green text-sm font-bold tracking-wider">
            VERIFIED STUDENT — FULL ACCESS GRANTED
          </p>
        </div>
      )}

      <div className="p-4 flex flex-col items-center">
        <h1 className="text-4xl font-cyber text-neon-green mb-2 mt-4 tracking-tight">Gen-Z Social</h1>
        <p className="text-gray-400 mb-8 text-center max-w-md text-sm font-medium">
          The exclusive network for verified college students.
        </p>

        {(status === 'not_submitted' || status === 'rejected') && (
          <div className="bg-card-bg p-8 rounded-2xl border border-white/10 text-center max-w-sm mb-8 backdrop-blur-xl shadow-2xl">
            <div className="flex justify-center mb-4">
              <Lock className="text-gray-500 w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-white">Access Restricted</h2>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              You are not verified yet. Join the waitlist or verify your college ID to get full access.
            </p>
            <Link
              to="/verify/start"
              className="inline-flex items-center justify-center w-full bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-neon-green transition-all duration-300 transform hover:scale-[1.02] shadow-[0_0_20px_rgba(66,255,147,0.3)]"
            >
              {status === 'rejected' ? 'TRY AGAIN' : 'VERIFY NOW'}
            </Link>
          </div>
        )}

        {(status === 'pending' || status === 'approved') && (
          <div className="text-gray-500 text-sm font-medium flex items-center gap-2">
            {status === 'approved' ? (
              <>
                <CheckCircle className="w-4 h-4 text-neon-green" />
                <span className="text-neon-green">Welcome to the inner circle.</span>
              </>
            ) : (
              'Feel free to browse while we check your ID.'
            )}
          </div>
        )}

        {/* Feature Widgets */}
        <PollsWidget status={status} />
        <ConfessionsFeed status={status} />

      </div>

      {/* Floating DM Button */}
      {status === 'approved' && (
        <>
          <button
            onClick={() => setIsDMOpen(true)}
            className="fixed bottom-6 right-6 bg-neon-green text-black p-4 rounded-full shadow-[0_0_20px_rgba(66,255,147,0.4)] hover:scale-110 transition-transform z-40"
          >
            <MessageSquare className="w-6 h-6" />
          </button>
          <QuickDM isOpen={isDMOpen} onClose={() => setIsDMOpen(false)} />
        </>
      )}
    </div>
  )
}

export default Home
