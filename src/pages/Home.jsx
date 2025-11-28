import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Briefcase,
  Users,
  MessageSquare,
  Code,
  PenTool,
  Gamepad2,
  Megaphone,
  ArrowRight,
  MapPin,
  DollarSign,
  Loader2
} from 'lucide-react'
import { useUser } from '../context/UserContext'
import { supabase } from '../lib/supabase'
import AvatarRenderer from '../components/Avatar/AvatarRenderer'
import BaseCard from '../components/BaseCard'

const Home = () => {
  const { profile, loading: userLoading } = useUser()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loadingJobs, setLoadingJobs] = useState(true)

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      const { data } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4)

      if (data) setJobs(data)
      setLoadingJobs(false)
    }

    fetchRecommendedJobs()
  }, [])

  if (userLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  const firstName = profile?.display_name?.split(' ')[0] || profile?.username || 'Student'

  const trendingCategories = [
    { id: 'tech-talk', name: 'Developer', icon: Code, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'creative-corner', name: 'UI/UX', icon: PenTool, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'gaming-zone', name: 'Gaming', icon: Gamepad2, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'content-creators', name: 'Marketing', icon: Megaphone, color: 'text-pink-600', bg: 'bg-pink-50' },
  ]

  return (
    <div className="min-h-screen bg-white text-[#111111] pb-24">
      {/* Header */}
      <div className="px-6 py-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] tracking-tight">
            Good morning,<br />
            <span className="text-gray-500">{firstName}</span>
          </h1>
        </div>
        <Link to="/profile">
          <AvatarRenderer
            profile={profile}
            size="lg"
          />
        </Link>
      </div>

      <div className="px-4 space-y-8">
        {/* Main Shortcuts */}
        <div className="grid grid-cols-3 gap-3">
          <Link to="/opportunities" className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-gray-50 hover:scale-[1.02] transition-transform active:scale-95">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-bold text-gray-700">Jobs</span>
          </Link>

          <Link to="/youth-connect" className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-gray-50 hover:scale-[1.02] transition-transform active:scale-95">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-2">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs font-bold text-gray-700">Connect</span>
          </Link>

          <Link to="/dms" className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-gray-50 hover:scale-[1.02] transition-transform active:scale-95">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-2">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs font-bold text-gray-700">Messages</span>
          </Link>
        </div>

        {/* Recommended Opportunities */}
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg font-bold text-[#111111]">Recommended for you</h2>
            <Link to="/opportunities" className="text-xs font-bold text-blue-600 flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {loadingJobs ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-gray-50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : jobs.length > 0 ? (
              jobs.map(job => (
                <Link key={job.id} to={`/opportunities/${job.id}`}>
                  <div className="p-4 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 flex items-center justify-between group hover:border-blue-100 transition-colors">
                    <div>
                      <h3 className="font-bold text-[#111111] mb-1 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                      <p className="text-xs text-gray-500 mb-2">{job.company}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {job.stipend || 'Unpaid'}
                        </div>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-sm text-gray-500">No opportunities found right now.</p>
              </div>
            )}
          </div>
        </div>

        {/* Trending Communities */}
        <div>
          <h2 className="text-lg font-bold text-[#111111] mb-4 px-1">Trending Communities</h2>
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {trendingCategories.map(cat => (
              <Link
                key={cat.id}
                to={`/youth-connect/room/${cat.id}`}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-white rounded-full shadow-sm border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className={`w-8 h-8 rounded-full ${cat.bg} flex items-center justify-center`}>
                  <cat.icon className={`w-4 h-4 ${cat.color}`} />
                </div>
                <span className="text-sm font-bold text-gray-700 whitespace-nowrap">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
