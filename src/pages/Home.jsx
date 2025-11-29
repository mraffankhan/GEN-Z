import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Briefcase, Zap, ArrowRight, Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useUser } from '../context/UserContext'

// Shared Components
import JobCard from '../components/jobs/JobCard'

// Categories Data (No Emojis)
const categories = [
  { id: 'developer', name: 'Developers' },
  { id: 'ui-ux', name: 'UI/UX Design' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'video-editor', name: 'Video Editing' },
  { id: 'business', name: 'Business' },
  { id: 'content', name: 'Content Creation' },
]

const Home = () => {
  const { user } = useUser()
  const navigate = useNavigate()

  const [jobs, setJobs] = useState([])
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentAdIndex, setCurrentAdIndex] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // 1. Fetch Jobs (Limit 4)
        const { data: jobsData } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4)

        if (jobsData) setJobs(jobsData)

        // 2. Fetch Ads
        const { data: adsData } = await supabase
          .from('ads')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false })

        if (adsData) setAds(adsData)

      } catch (error) {
        console.error("Error fetching home data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  // Auto-rotate ads
  useEffect(() => {
    if (ads.length <= 1) return
    const interval = setInterval(() => {
      setCurrentAdIndex(prev => (prev + 1) % ads.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [ads])

  const handleAdClick = (ad) => {
    if (ad.redirect_url) {
      window.open(ad.redirect_url, '_blank')
    }
  }

  // Skeleton for Job Card
  const JobSkeleton = () => (
    <div className="bg-white rounded-[20px] p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-gray-100 w-full">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 pr-4 space-y-2">
          <div className="h-5 bg-gray-100 rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-gray-50 rounded w-1/2 animate-pulse" />
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-50 animate-pulse" />
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-6 w-16 bg-gray-50 rounded-lg animate-pulse" />
        <div className="h-6 w-24 bg-gray-50 rounded-lg animate-pulse" />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 pb-28">

      {/* 1. Header (Sticky) - Clean, Centered, Separator */}
      <div className="sticky top-0 z-40 bg-[#FAFAFA]/95 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-[600px] mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 text-center">GenZ Connect</h1>
        </div>
      </div>

      <div className="max-w-[600px] mx-auto px-4 pt-6">

        {/* 2. Quick Action Buttons - Matches FilterBar Button Style */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 mb-6">
          <button
            onClick={() => navigate('/youth-connect')}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[13px] font-medium transition-all whitespace-nowrap border bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-95 shadow-sm"
          >
            <Users className="w-3.5 h-3.5" />
            Youth Connect
          </button>
          <button
            onClick={() => navigate('/opportunities')}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[13px] font-medium transition-all whitespace-nowrap border bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-95 shadow-sm"
          >
            <Briefcase className="w-3.5 h-3.5" />
            Opportunities
          </button>
          <button
            onClick={() => navigate('/youth-connect')}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[13px] font-medium transition-all whitespace-nowrap border bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-95 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Communities
          </button>
        </div>

        {/* 3. Hero Banner Carousel - Matches Job Card Style */}
        {ads.length > 0 && (
          <div className="mb-8">
            <div
              className="relative w-full aspect-[2/1] rounded-[20px] overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-gray-100 group cursor-pointer bg-white"
              onClick={() => handleAdClick(ads[currentAdIndex])}
            >
              {ads.map((ad, index) => (
                <div
                  key={ad.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentAdIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                  <img
                    src={ad.image_url}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white font-bold text-lg leading-tight mb-1">{ad.title}</h3>
                    <div className="flex items-center gap-1.5 text-white/90 text-xs font-medium">
                      <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">Sponsored</span>
                      <span className="flex items-center gap-0.5">
                        View <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Dots */}
              <div className="absolute bottom-4 right-4 flex gap-1.5">
                {ads.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${idx === currentAdIndex ? 'bg-white w-4' : 'bg-white/40 w-1.5'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. Latest Opportunities - Matches Opportunities Page Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-[19px] font-bold text-gray-900 tracking-tight">Latest Opportunities</h2>
            <button
              onClick={() => navigate('/opportunities')}
              className="text-[13px] font-semibold text-gray-500 hover:text-gray-900 transition-colors"
            >
              View All
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {loading ? (
              <>
                <JobSkeleton />
                <JobSkeleton />
                <JobSkeleton />
              </>
            ) : jobs.length > 0 ? (
              jobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  currentUser={user}
                  onDelete={() => { }} // No-op for Home page
                  onClick={() => navigate(`/opportunities/${job.id}`)}
                />
              ))
            ) : (
              <div className="text-center py-10 bg-white rounded-[20px] border border-gray-100 shadow-sm">
                <p className="text-gray-400 font-medium text-sm">No opportunities found</p>
              </div>
            )}
          </div>
        </div>

        {/* 5. Youth Connect Preview - Matches Filter Pill Style */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-[19px] font-bold text-gray-900 tracking-tight">Active Rooms</h2>
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => navigate(`/youth-connect/room/${cat.id}`)}
                className="flex-shrink-0 px-5 py-2.5 bg-white rounded-full text-[13px] font-medium text-gray-600 whitespace-nowrap border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all active:scale-95 snap-start shadow-sm"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Home
