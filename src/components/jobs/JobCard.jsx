import React from 'react'
import { MapPin, ArrowUpRight, Building2, Clock, Briefcase, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const JobCard = ({ job, onClick, currentUser, onDelete }) => {
    const isOwner = currentUser && job.created_by === currentUser.id

    const handleDeleteClick = (e) => {
        e.stopPropagation()
        onDelete(job)
    }

    return (
        <div
            onClick={onClick}
            className="group bg-white rounded-[20px] p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.08)] border border-gray-100 transition-all duration-300 cursor-pointer w-full relative overflow-hidden"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0 pr-4">
                    <h3 className="font-bold text-gray-900 text-[18px] leading-tight truncate group-hover:text-neon-purple transition-colors">
                        {job.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 text-[13px] text-gray-500 font-medium">
                        <span className="truncate max-w-[120px] flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" />
                            {job.company}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0"></span>
                        <span className="truncate flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {job.location}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {isOwner && (
                        <button
                            onClick={handleDeleteClick}
                            className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors z-10"
                            title="Delete Job"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all duration-300 flex-shrink-0">
                        <ArrowUpRight className="w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-[11px] font-semibold text-blue-700 border border-blue-100">
                    <Briefcase className="w-3 h-3 mr-1" />
                    {job.type}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-purple-50 text-[11px] font-semibold text-purple-700 border border-purple-100">
                    <Clock className="w-3 h-3 mr-1" />
                    {job.mode}
                </span>
                {job.stipend && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-green-50 text-[11px] font-semibold text-green-700 border border-green-100">
                        {job.stipend}
                    </span>
                )}
            </div>

            {/* Tags (Desktop only or limited on mobile) */}
            {job.tags && job.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {job.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-gray-50 text-[11px] font-medium text-gray-500 border border-gray-100">
                            {tag}
                        </span>
                    ))}
                    {job.tags.length > 3 && (
                        <span className="text-[10px] text-gray-400 self-center">+{job.tags.length - 3}</span>
                    )}
                </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <span className="text-[11px] text-gray-400 font-medium">
                    Posted {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                </span>
            </div>
        </div>
    )
}

export default JobCard
