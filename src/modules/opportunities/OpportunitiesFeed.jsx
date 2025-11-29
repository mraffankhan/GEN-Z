import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useUser } from '../../context/UserContext'
import { CheckCircle, AlertCircle } from 'lucide-react'

// Components
import JobCard from '../../components/jobs/JobCard'
import SearchBar from '../../components/jobs/SearchBar'
import FilterBar from '../../components/jobs/FilterBar'
import { JobSkeleton } from '../../components/jobs/JobSkeletons'
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal'

const OpportunitiesFeed = () => {
    const navigate = useNavigate()
    const { user } = useUser()

    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    // Delete State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [jobToDelete, setJobToDelete] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [toast, setToast] = useState(null) // { type: 'success' | 'error', message: '' }

    // Filter State
    const [activeFilters, setActiveFilters] = useState({
        role: 'All',
        type: 'All',
        location: 'All',
        mode: 'All'
    })

    // Fetch Jobs & Realtime Subscription
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data, error } = await supabase
                    .from('jobs')
                    .select('*')
                    .order('created_at', { ascending: false })

                if (data) {
                    setJobs(data)
                }
            } catch (error) {
                console.error("Error fetching jobs:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchJobs()

        // Realtime subscription
        const subscription = supabase
            .channel('jobs_channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, () => {
                fetchJobs()
            })
            .subscribe()

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    // Delete Logic
    const confirmDelete = (job) => {
        setJobToDelete(job)
        setDeleteModalOpen(true)
    }

    const executeDelete = async () => {
        if (!jobToDelete) return

        setIsDeleting(true)
        try {
            const { error } = await supabase
                .from('jobs')
                .delete()
                .eq('id', jobToDelete.id)

            if (error) throw error

            // Update UI immediately
            setJobs(prev => prev.filter(j => j.id !== jobToDelete.id))
            setToast({ type: 'success', message: 'Job deleted successfully' })
            setDeleteModalOpen(false)
            setJobToDelete(null)
        } catch (error) {
            console.error("Error deleting job:", error)
            setToast({ type: 'error', message: 'Failed to delete job. Try again.' })
        } finally {
            setIsDeleting(false)
            // Clear toast after 3 seconds
            setTimeout(() => setToast(null), 3000)
        }
    }

    // 1. Generate Filters from DB Data
    const filters = useMemo(() => {
        if (!jobs || jobs.length === 0) return []

        // Extract unique values directly from DB data
        const roles = Array.from(new Set(jobs.map(j => j.title).filter(Boolean)))
        const types = Array.from(new Set(jobs.map(j => j.type).filter(Boolean)))
        const locations = Array.from(new Set(jobs.map(j => j.location).filter(Boolean)))
        const modes = Array.from(new Set(jobs.map(j => j.mode).filter(Boolean)))

        const generated = []

        if (roles.length > 0) {
            generated.push({ id: 'role', label: 'Role', options: roles })
        }
        if (types.length > 0) {
            generated.push({ id: 'type', label: 'Type', options: types })
        }
        if (locations.length > 0) {
            generated.push({ id: 'location', label: 'Location', options: locations })
        }
        if (modes.length > 0) {
            generated.push({ id: 'mode', label: 'Mode', options: modes })
        }

        return generated
    }, [jobs])

    // 2. Filter Logic (AND Logic)
    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            // Search
            const query = searchQuery.toLowerCase().trim()
            const matchesSearch = !query ||
                job.title?.toLowerCase().includes(query) ||
                job.company?.toLowerCase().includes(query) ||
                job.description?.toLowerCase().includes(query) ||
                (job.tags && job.tags.some(tag => tag.toLowerCase().includes(query)))

            // Filters (Case Insensitive)
            // Role Filter (mapped to Title)
            const matchesRole = activeFilters.role === 'All' ||
                job.title?.trim().toLowerCase() === activeFilters.role?.trim().toLowerCase()

            // Type Filter
            const matchesType = activeFilters.type === 'All' ||
                job.type?.trim().toLowerCase() === activeFilters.type?.trim().toLowerCase()

            // Location Filter
            const matchesLocation = activeFilters.location === 'All' ||
                job.location?.trim().toLowerCase() === activeFilters.location?.trim().toLowerCase()

            // Mode Filter
            const matchesMode = activeFilters.mode === 'All' ||
                job.mode?.trim().toLowerCase() === activeFilters.mode?.trim().toLowerCase()

            return matchesSearch && matchesRole && matchesType && matchesLocation && matchesMode
        })
    }, [jobs, searchQuery, activeFilters])

    // Handlers
    const handleFilterChange = (id, value) => {
        setActiveFilters(prev => ({ ...prev, [id]: value }))
    }

    const clearAllFilters = () => {
        setSearchQuery('')
        setActiveFilters({ role: 'All', type: 'All', location: 'All', mode: 'All' })
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-gray-900 pb-28 relative">
            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border ${toast.type === 'success'
                            ? 'bg-white text-green-700 border-green-100'
                            : 'bg-white text-red-700 border-red-100'
                        }`}>
                        {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="text-sm font-medium">{toast.message}</span>
                    </div>
                </div>
            )}

            {/* Header - Full Width & Sticky */}
            <div className="sticky top-0 z-40 bg-[#FAFAFA]/95 backdrop-blur-md border-b border-gray-200/50">
                <div className="max-w-[600px] mx-auto px-4 pt-4 pb-2">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">Opportunities</h1>
                    <div className="space-y-3 pb-2">
                        <SearchBar value={searchQuery} onChange={setSearchQuery} />
                        <FilterBar
                            filters={filters}
                            activeFilters={activeFilters}
                            onFilterChange={handleFilterChange}
                            onClearAll={clearAllFilters}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[600px] mx-auto px-4 pt-4">
                {/* Job List */}
                <div className="flex flex-col gap-4">
                    {loading ? (
                        <>
                            <JobSkeleton />
                            <JobSkeleton />
                            <JobSkeleton />
                        </>
                    ) : filteredJobs.length > 0 ? (
                        filteredJobs.map(job => (
                            <JobCard
                                key={job.id}
                                job={job}
                                currentUser={user}
                                onDelete={confirmDelete}
                                onClick={() => navigate(`/opportunities/${job.id}`)}
                            />
                        ))
                    ) : (
                        <div className="py-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl text-gray-400">🔍</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">No jobs found</h3>
                            <p className="text-sm text-gray-500">Try adjusting your filters</p>
                            <button
                                onClick={clearAllFilters}
                                className="mt-4 text-sm font-semibold text-neon-purple hover:text-purple-700"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={executeDelete}
                title="Delete Job?"
                message="Are you sure you want to delete this job listing? This action cannot be undone."
                isDeleting={isDeleting}
            />
        </div>
    )
}

export default OpportunitiesFeed
