import React from 'react'

const HomeHeader = () => {
    return (
        <div className="flex items-center justify-start px-4 pt-8 pb-2 bg-white sticky top-0 z-50">
            <div className="relative">
                <h1 className="text-xl font-bold tracking-tight text-gray-900 uppercase">
                    Gen-Z Connect
                </h1>
                <div className="absolute -right-2 top-0 w-1.5 h-1.5 rounded-full bg-neon-green"></div>
            </div>
        </div>
    )
}

export default HomeHeader
