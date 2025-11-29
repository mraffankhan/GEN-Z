import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, DollarSign, Clock, Building, Share2, Briefcase, ExternalLink as ExternalLinkIcon } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import BaseCard from '../../components/BaseCard'
import ExternalLink from '../../components/common/ExternalLink'

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

    if (loading) return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center text-gray-500">Loading...</div>
    if (!job) return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center text-gray-500">Job not found</div>

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-gray-900 pb-32">
            {/* Header Image / Pattern */}
            <div className="h-40 bg-gradient-to-r from-gray-100 to-gray-200 relative border-b border-gray-200">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-white transition-colors shadow-sm z-10"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-900" />
                </button>
            </div>

            <div className="px-4 -mt-10 relative z-10 max-w-2xl mx-auto">
                <BaseCard className="shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] border-gray-100 bg-white rounded-[24px] overflow-hidden">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-2xl font-bold mb-2 text-gray-900 leading-tight">{job.title}</h1>
                                <div className="flex items-center gap-2 text-gray-500 font-medium">
                                    <Building className="w-4 h-4" />
                                    <span className="text-sm">{job.company}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href)
                                    alert('Link copied!')
                                }}
                                className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 transition-colors"
                            >
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-8 border-b border-gray-50 pb-8">
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                <Briefcase className="w-4 h-4 text-gray-400" />
                                <span>{job.type}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>{job.mode}</span>
                            </div>
                            {job.stipend && (
                                <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 text-green-700 font-medium">
                                    <DollarSign className="w-4 h-4" />
                                    <span>{job.stipend}</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h3 className="font-bold text-lg mb-3 text-gray-900">About the Role</h3>
                                <p className="text-gray-600 leading-relaxed text-[15px] whitespace-pre-wrap">
                                    {job.description || "No description provided."}
                                </p>
                            </div>

                            {job.tags && job.tags.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-lg mb-3 text-gray-900">Skills & Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {job.tags.map((tag, index) => (
                                            <span key={index} className="text-xs px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 border border-gray-100 font-medium">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </BaseCard>
            </div>

            {/* Sticky Apply Button - FIXED for mobile */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-gray-100 z-[999] safe-bottom">
                <div className="max-w-2xl mx-auto">
                    <ExternalLink
                        href={job.apply_link}
                        className="w-full flex items-center justify-center gap-2 bg-black text-white font-bold py-4 rounded-[18px] hover:bg-gray-900 transition-all active:scale-[0.98] shadow-lg shadow-black/10"
                    >
                        <span>Apply Now</span>
                        <ExternalLinkIcon className="w-4 h-4" />
                    </ExternalLink>
                </div>
            </div>
        </div>
    )
}

export default JobDetails
