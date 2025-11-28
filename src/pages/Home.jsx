import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Code, PenTool, Video, Palette, TrendingUp, Briefcase, Music, Gamepad2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useUser } from '../context/UserContext'

// Components
import HomeHeader from '../components/home/HomeHeader'
import OpportunityCard from '../components/home/OpportunityCard'
import ConnectCard from '../components/home/ConnectCard'
import AdBanner from '../components/home/AdBanner'

// Categories Data (Cleaned up colors for minimal look - passing accentColor class instead)
const categories = [
  { id: 'developer', name: 'Developer', icon: Code, accentColor: 'bg-blue-500' },
  { id: 'ui-ux', name: 'UI/UX', icon: PenTool, accentColor: 'bg-purple-500' },
  { id: 'video-editor', name: 'Editor', icon: Video, accentColor: 'bg-red-500' },
  { id: 'graphic-designer', name: 'Designer', icon: Palette, accentColor: 'bg-pink-500' },
  { id: 'marketing', name: 'Marketing', icon: TrendingUp, accentColor: 'bg-green-500' },
  { id: 'business', name: 'Business', icon: Briefcase, accentColor: 'bg-indigo-500' },
  { id: 'music-art', name: 'Art', icon: Music, accentColor: 'bg-cyan-500' },
  { id: 'gaming', name: 'Gaming', icon: Gamepad2, accentColor: 'bg-orange-500' },
]

const Home = () => {
  const { user } = useUser()
  const navigate = useNavigate()

  const [jobs, setJobs] = useState([])
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // 1. Fetch Jobs (Limit 3)
        const { data: jobsData } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3)

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

  // Skeletons
  const OpportunitySkeleton = () => (
    <div className="bg-white rounded-[24px] p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] w-full border border-transparent">
      <div className="flex justify-between items-start mb-2">
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

  const ConnectSkeleton = () => (
    <div className="w-28 h-32 flex-shrink-0 bg-white rounded-[24px] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center gap-3 animate-pulse border border-transparent">
      <div className="w-8 h-8 bg-gray-50 rounded-full" />
      <div className="w-16 h-3 bg-gray-50 rounded" />
    </div>
  )

  const AdSkeleton = () => (
    <div className="w-full aspect-video bg-gray-100 rounded-[24px] animate-pulse" />
  )

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 pb-28">
      {/* Max Width Container for Desktop */}
      <div className="max-w-[600px] mx-auto bg-[#FAFAFA] min-h-screen">

        {/* 1. Header */}
        <HomeHeader />

        <div className="flex flex-col gap-8 px-4 pt-2">

          {/* 2. Opportunities Section */}
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-[19px] font-bold text-gray-900 tracking-tight">Opportunities For You</h2>
            </div>
            <div className="flex flex-col gap-4">
              {loading ? (
                <>
                  <OpportunitySkeleton />
                  <OpportunitySkeleton />
                </>
              ) : jobs.length > 0 ? (
                jobs.map(job => (
                  <OpportunityCard
                    key={job.id}
                    job={job}
                    onClick={() => navigate(`/opportunities/${job.id}`)}
                  />
                ))
              ) : (
                <div className="p-8 text-center bg-white rounded-[24px] shadow-sm border border-transparent">
                  <p className="text-sm text-gray-400 font-medium">No active opportunities</p>
                </div>
              )}
            </div>
          </section>

          {/* 3. Youth Connect Section */}
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-[19px] font-bold text-gray-900 tracking-tight">Youth Connect</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x">
              {loading ? (
                <>
                  <ConnectSkeleton />
                  <ConnectSkeleton />
                  <ConnectSkeleton />
                  <ConnectSkeleton />
                </>
              ) : (
                categories.map(cat => (
                  <ConnectCard
                    key={cat.id}
                    category={cat}
                    onClick={() => navigate(`/youth-connect/room/${cat.id}`)}
                  />
                ))
              )}
            </div>
          </section>

          {/* 4. Ads Section */}
          <section>
            <div className="flex flex-col gap-6">
              {loading ? (
                <AdSkeleton />
              ) : ads.length > 0 ? (
                ads.map(ad => (
                  <AdBanner key={ad.id} ad={ad} />
                ))
              ) : null}
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}

export default Home
