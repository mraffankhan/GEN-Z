import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useUser } from '../../context/UserContext'
import { debounce } from 'lodash'

// Components
import JobCard from '../../components/jobs/JobCard'
import FilterBar from '../../components/jobs/FilterBar'
import SearchBar from '../../components/jobs/SearchBar'
import { JobSkeleton } from '../../components/jobs/JobSkeletons'

// Filter Options
const FILTER_CONFIG = [
    {
        id: 'role',
        label: 'Role',
        options: ['Developer', 'Designer', 'Marketing', 'Editor', 'Data Analyst', 'Business Intern', 'Product Intern']
    },
    {
        id: 'type',
        label: 'Type',
        options: ['Internship', 'Part Time', 'Full Time', 'Remote', 'Hybrid', 'On-Site']
    },
    {
        id: 'location',
        label: 'Location',
        options: ['Remote', 'India', 'Bangalore', 'Hyderabad', 'Delhi NCR', 'Mumbai', 'Pune', 'Chennai']
    }
]

const OpportunitiesFeed = () => {
    const navigate = useNavigate()
    const { user } = useUser()

    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    // Filter State
    const [activeFilters, setActiveFilters] = useState({
        role: 'All',
        type: 'All',
        location: 'All'
    })

    // Fetch Jobs
    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true)
            try {
                const { data, error } = await supabase
                    .from('jobs')
                    .select('*')
                    .order('created_at', { ascending: false })

                if (data) setJobs(data)
            } catch (error) {
                console.error("Error fetching jobs:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchJobs()
    }, [])

    // Filter Logic
    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            // 1. Search Query (Title or Company)
            const matchesSearch = searchQuery === '' ||
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.company.toLowerCase().includes(searchQuery.toLowerCase())

            // 2. Role Filter
            const matchesRole = activeFilters.role === 'All' ||
                job.title.toLowerCase().includes(activeFilters.role.toLowerCase()) ||
                (job.tags && job.tags.some(tag => tag.toLowerCase().includes(activeFilters.role.toLowerCase())))

            // 3. Type Filter
            const matchesType = activeFilters.type === 'All' ||
                job.type.toLowerCase() === activeFilters.type.toLowerCase()

            // 4. Location Filter
            const matchesLocation = activeFilters.location === 'All' ||
                (activeFilters.location === 'India' ? true : job.location.toLowerCase().includes(activeFilters.location.toLowerCase()))

            return matchesSearch && matchesRole && matchesType && matchesLocation
        })
    }, [jobs, searchQuery, activeFilters])

    const handleFilterChange = (filterId, value) => {
        setActiveFilters(prev => ({
            ...prev,
            [filterId]: value
        }))
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-gray-900 pb-28">
            {/* Max Width Container */}
            <div className="max-w-[600px] mx-auto bg-[#FAFAFA] min-h-screen">

                {/* Header & Search */}
                <div className="px-4 pt-6 pb-2 bg-[#FAFAFA] sticky top-0 z-40">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">Opportunities</h1>
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                    <FilterBar
                        filters={FILTER_CONFIG}
                        activeFilters={activeFilters}
                        onFilterChange={handleFilterChange}
                    />
                </div>

                <div className="flex flex-col gap-4 px-4 pt-4">
                    {/* Jobs List */}
                    {loading ? (
                        <>
                            <JobSkeleton />
                            <JobSkeleton />
                            <JobSkeleton />
                            <JobSkeleton />
                        </>
                    ) : filteredJobs.length > 0 ? (
                        filteredJobs.map(job => (
                            <JobCard
                                key={job.id}
                                job={job}
                                onClick={() => navigate(`/opportunities/${job.id}`)}
                            />
                        ))
                    ) : (
                        <div className="py-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl text-gray-400">🔍</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">No jobs found</h3>
                            <p className="text-sm text-gray-500">Try adjusting your filters or search query</p>
                            <button
                                onClick={() => {
                                    setSearchQuery('')
                                    setActiveFilters({ role: 'All', type: 'All', location: 'All' })
                                }}
                                className="mt-4 text-sm font-semibold text-neon-purple hover:text-purple-700"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default OpportunitiesFeed
