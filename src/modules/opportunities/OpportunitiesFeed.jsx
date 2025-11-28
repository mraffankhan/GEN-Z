import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, MapPin, DollarSign, Clock, Search } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import BaseCard from '../../components/BaseCard'
import BaseInput from '../../components/BaseInput'
import PageHeader from '../../components/PageHeader'

const OpportunitiesFeed = () => {
    const navigate = useNavigate()
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const fetchJobs = async () => {
            const { data, error } = await supabase
                .from('jobs')
                .select('*')
                .order('created_at', { ascending: false })

            if (data) setJobs(data)
            setLoading(false)
        }

        fetchJobs()
    }, [])

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    return (
        <div className="min-h-screen bg-bg text-text-primary px-4 pt-6 pb-24">
            <PageHeader
                title="Opportunities"
                subtitle="Find your next internship or freelance gig."
                showBack={false}
            />

            <div className="mb-6">
                <BaseInput
                    icon={Search}
                    placeholder="Search jobs, companies, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredJobs.map((job) => (
                        <BaseCard
                            key={job.id}
                            onClick={() => navigate(`/opportunities/${job.id}`)}
                            className="group hover:border-primary/30 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-semibold text-lg text-text-primary group-hover:text-primary transition-colors">{job.title}</h3>
                                    <p className="text-text-secondary text-sm">{job.company}</p>
                                </div>
                                <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded text-text-secondary">{job.type}</span>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-text-secondary mb-4">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    <span>{job.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" />
                                    <span>{job.stipend}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{new Date(job.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {job.tags?.map((tag, index) => (
                                    <span key={index} className="text-[10px] px-2 py-1 rounded-full bg-primary/5 text-primary border border-primary/10">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </BaseCard>
                    ))}

                    {filteredJobs.length === 0 && (
                        <div className="text-center py-10 text-text-subtle">
                            <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>No opportunities found.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default OpportunitiesFeed
