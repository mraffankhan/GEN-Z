import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, DollarSign, Clock, Building, Share2, ExternalLink } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import BaseButton from '../../components/BaseButton'
import BaseCard from '../../components/BaseCard'

const JobDetails = () => {
    const { jobId } = useParams()
    const navigate = useNavigate()
    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchJob = async () => {
            const { data, error } = await supabase
                .from('jobs')
                .select('*')
                .eq('id', jobId)
                .single()

            if (data) setJob(data)
            setLoading(false)
        }

        fetchJob()
    }, [jobId])

    if (loading) return <div className="min-h-screen bg-bg flex items-center justify-center text-text-primary">Loading...</div>
    if (!job) return <div className="min-h-screen bg-bg flex items-center justify-center text-text-primary">Job not found</div>

    return (
        <div className="min-h-screen bg-bg text-text-primary pb-safe">
            {/* Header Image / Pattern */}
            <div className="h-40 bg-gradient-to-r from-blue-50 to-indigo-50 relative border-b border-border">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-white transition-colors shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5 text-text-primary" />
                </button>
            </div>

            <div className="px-4 -mt-10 relative z-10 pb-24">
                <BaseCard className="shadow-lg border-border bg-white">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-2xl font-semibold mb-1 text-text-primary">{job.title}</h1>
                            <div className="flex items-center gap-2 text-text-secondary">
                                <Building className="w-4 h-4" />
                                <span className="text-sm">{job.company}</span>
                            </div>
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-full text-text-secondary hover:text-text-primary transition-colors">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-text-secondary mb-6 border-b border-border pb-6">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                            <DollarSign className="w-4 h-4 text-primary" />
                            <span>{job.stipend}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>{job.type}</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-lg mb-2 text-text-primary">About the Role</h3>
                            <p className="text-text-secondary leading-relaxed text-sm">
                                {job.description || "No description provided."}
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-2 text-text-primary">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {job.tags?.map((tag, index) => (
                                    <span key={index} className="text-xs px-3 py-1 rounded-full bg-primary/5 text-primary border border-primary/10">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </BaseCard>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-border z-50 pb-safe">
                <BaseButton
                    onClick={() => navigate(`/opportunities/apply/${job.id}`)}
                    fullWidth
                    variant="primary"
                >
                    <span>Apply Now</span>
                    <ExternalLink className="w-4 h-4" />
                </BaseButton>
            </div>
        </div>
    )
}

export default JobDetails
