import React from 'react'

const ConnectCard = ({ category, onClick }) => {
    const Icon = category.icon

    return (
        <div
            onClick={onClick}
            className="flex flex-col items-center justify-center w-28 h-32 flex-shrink-0 bg-white rounded-[24px] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_-5px_rgba(0,0,0,0.08)] border border-transparent hover:border-gray-50 cursor-pointer transition-all duration-300 snap-center group relative overflow-hidden"
        >
            {/* Subtle Neon Accent Dot */}
            <div className={`absolute top-3 right-3 w-1.5 h-1.5 rounded-full ${category.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

            <div className="mb-3 text-gray-400 group-hover:text-gray-900 transition-colors duration-300">
                <Icon className="w-7 h-7" strokeWidth={1.5} />
            </div>
            <span className="text-[13px] font-semibold text-gray-600 text-center px-2 leading-tight group-hover:text-gray-900 transition-colors">
                {category.name}
            </span>
        </div>
    )
}

export default ConnectCard
