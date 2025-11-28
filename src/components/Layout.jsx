import React from 'react'
import BottomNav from './BottomNav'

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 pb-24 md:pb-0 md:pl-20">
            <div className="max-w-screen-xl mx-auto w-full px-4 md:px-6 lg:px-8 pt-safe">
                {children}
            </div>
            <BottomNav />
        </div>
    )
}

export default Layout
