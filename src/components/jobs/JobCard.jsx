import React from 'react'
import { MapPin, ArrowUpRight, Building2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const JobCard = ({ job, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="group bg-white rounded-[24px] p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.08)] border border-transparent hover:border-gray-50 transition-all duration-300 cursor-pointer w-full"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0 pr-4">
                    <h3 className="font-bold text-gray-900 text-[17px] leading-tight truncate group-hover:text-neon-purple transition-colors">
                        {job.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[13px] text-gray-500 font-medium">
                        <span className="truncate max-w-[150px]">{job.company}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="truncate">{job.location}</span>
                    </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all duration-300 flex-shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                </div>
            </div>

            <p className="text-[13px] text-gray-600 leading-relaxed line-clamp-2 mb-4">
                {job.description}
            </p>

            {/* Requirements / Tags */}
            {job.tags && job.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {job.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-gray-50 text-[11px] font-medium text-gray-600 border border-gray-100">
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-[11px] font-semibold text-blue-700 border border-blue-100">
                        {job.type}
                    </span>
                    {job.stipend && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-green-50 text-[11px] font-semibold text-green-700 border border-green-100">
                            {job.stipend}
                        </span>
                    )}
                </div>
                <span className="text-[11px] text-gray-400 font-medium">
                    {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                </span>
            </div>
        </div>
    )
}

export default JobCard
