import React from 'react'

export const JobSkeleton = () => (
    <div className="bg-white rounded-[24px] p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] w-full border border-transparent animate-pulse">
        <div className="flex justify-between items-start mb-3">
            <div className="flex-1 pr-4 space-y-2">
                <div className="h-5 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-50 rounded w-1/2" />
            </div>
            <div className="w-9 h-9 rounded-full bg-gray-50" />
        </div>
        <div className="space-y-2 mb-4">
            <div className="h-3 bg-gray-50 rounded w-full" />
            <div className="h-3 bg-gray-50 rounded w-5/6" />
        </div>
        <div className="flex justify-between pt-4 border-t border-gray-50">
            <div className="flex gap-2">
                <div className="h-6 w-16 bg-gray-50 rounded-lg" />
                <div className="h-6 w-20 bg-gray-50 rounded-lg" />
            </div>
            <div className="h-3 w-12 bg-gray-50 rounded" />
        </div>
    </div>
)

export const CategorySkeleton = () => (
    <div className="min-w-[100px] h-[110px] bg-white rounded-[22px] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center gap-2 animate-pulse">
        <div className="w-8 h-8 bg-gray-50 rounded-full" />
        <div className="w-16 h-3 bg-gray-50 rounded" />
    </div>
)
