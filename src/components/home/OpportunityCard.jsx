import React from 'react'
import { MapPin, ArrowUpRight } from 'lucide-react'

const OpportunityCard = ({ job, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="group bg-white rounded-[24px] p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.08)] border border-transparent hover:border-gray-50 transition-all duration-300 cursor-pointer w-full"
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0 pr-4">
                    <h3 className="font-bold text-gray-900 text-[17px] leading-tight truncate group-hover:text-neon-purple transition-colors">
                        {job.title}
                    </h3>
                    <p className="text-gray-400 text-[13px] font-medium mt-1 truncate">
                        {job.company}
                    </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all duration-300 flex-shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-50 text-[11px] font-semibold text-gray-600">
                    {job.type}
                </span>
                {job.location && (
                    <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-[100px]">{job.location}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default OpportunityCard
