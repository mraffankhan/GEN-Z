import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Users,
  MessageSquare,
  Briefcase,
  Code,
  PenTool,
  Gamepad2,
  Megaphone,
  ArrowRight,
  Zap,
  Loader2,
  Sparkles
} from 'lucide-react'
import { useUser } from '../context/UserContext'
import { supabase } from '../lib/supabase'
import AvatarRenderer from '../components/Avatar/AvatarRenderer'
import CosmeticName from '../components/Text/CosmeticName'

const Home = () => {
  const { profile, loading: userLoading } = useUser()
  const navigate = useNavigate()
  const [ads, setAds] = useState([])
  const [loadingAds, setLoadingAds] = useState(true)

  useEffect(() => {
    const fetchAds = async () => {
      const { data } = await supabase
        .from('ads')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })

      if (data) setAds(data)
      setLoadingAds(false)
    }

    fetchAds()
  }, [])

  if (userLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-neon-purple animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black pb-24 overflow-x-hidden">
      {/* 1. Header & Branding */}
      <div className="px-6 pt-10 pb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-cyber font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-blue-600 tracking-tighter drop-shadow-sm">
            GEN-Z CONNECT
          </h1>
          <p className="text-gray-500 text-xs font-medium tracking-wide mt-1">
            Your Space. Your People. Your Vibe.
          </p>
        </div>
        <Link to="/profile" className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple to-blue-500 rounded-full opacity-20 group-hover:opacity-50 blur transition duration-200"></div>
          <div className="relative">
            <AvatarRenderer
              profile={profile}
              size="md"
            />
          </div>
        </Link>
      </div>

      <div className="px-4 space-y-8">
        {/* 2. Quick Access Row */}
        <div className="grid grid-cols-3 gap-4">
          <Link to="/youth-connect" className="group relative p-4 bg-[#F8F8FA] rounded-2xl border border-[#E6E6E8] hover:border-neon-purple/50 transition-all duration-300 active:scale-95 overflow-hidden shadow-sm hover:shadow-md">
            <div className="absolute inset-0 bg-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex flex-col items-center justify-center relative z-10">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300 border border-gray-100 group-hover:border-neon-purple/30 shadow-sm">
                <Users className="w-6 h-6 text-neon-purple" />
              </div>
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider group-hover:text-black">Connect</span>
            </div>
          </Link>

          <Link to="/dms" className="group relative p-4 bg-[#F8F8FA] rounded-2xl border border-[#E6E6E8] hover:border-blue-500/50 transition-all duration-300 active:scale-95 overflow-hidden shadow-sm hover:shadow-md">
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex flex-col items-center justify-center relative z-10">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300 border border-gray-100 group-hover:border-blue-500/30 shadow-sm">
                <MessageSquare className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider group-hover:text-black">Chats</span>
            </div>
          </Link>

          <Link to="/opportunities" className="group relative p-4 bg-[#F8F8FA] rounded-2xl border border-[#E6E6E8] hover:border-neon-green/50 transition-all duration-300 active:scale-95 overflow-hidden shadow-sm hover:shadow-md">
            <div className="absolute inset-0 bg-neon-green/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex flex-col items-center justify-center relative z-10">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300 border border-gray-100 group-hover:border-neon-green/30 shadow-sm">
                <Briefcase className="w-6 h-6 text-neon-green" />
              </div>
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider group-hover:text-black">Gigs</span>
            </div>
          </Link>
        </div>

        {/* 3. Gen-Z Ads Section (Replaces Trending) */}
        <div>
          <div className="flex items-center gap-2 mb-4 px-1">
            <Zap className="w-4 h-4 text-neon-purple fill-current" />
            <h2 className="text-lg font-bold text-black tracking-tight">Gen-Z Ads</h2>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide snap-x">
            {loadingAds ? (
              [1, 2].map(i => (
                <div key={i} className="snap-center flex-shrink-0 w-64 h-32 bg-gray-50 rounded-2xl animate-pulse border border-gray-100" />
              ))
            ) : ads.length > 0 ? (
              ads.map(ad => (
                <a
                  key={ad.id}
                  href={ad.redirect_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="snap-center flex-shrink-0 w-64 h-32 relative rounded-2xl overflow-hidden group border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <img
                    src={ad.image_url}
                    alt={ad.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-sm">{ad.title}</span>
                  </div>
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold text-black border border-gray-100">
                    AD
                  </div>
                </a>
              ))
            ) : (
              <div className="w-full text-center py-8 bg-[#F8F8FA] rounded-2xl border border-dashed border-gray-200">
                <p className="text-sm text-gray-400">No active promotions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
