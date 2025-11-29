import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Compass, MessageSquare, Users, User } from 'lucide-react'

const BottomNav = () => {
    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/opportunities', icon: Compass, label: 'opportunities' },
        { path: '/dms', icon: MessageSquare, label: 'Messages' },
        { path: '/youth-connect', icon: Users, label: 'Connect' },
        { path: '/profile', icon: User, label: 'Profile' },
    ]

    return (
        <>
            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 px-6 py-3 z-50 pb-safe">
                <div className="flex justify-between items-center max-w-md mx-auto">
                    {navItems.map(({ path, icon: Icon, label }) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) =>
                                `flex flex-col items-center gap-1 transition-all duration-200 ${isActive ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon
                                        className={`w-6 h-6 transition-all duration-200 ${isActive ? 'fill-black scale-105' : 'scale-100'
                                            }`}
                                        strokeWidth={isActive ? 0 : 2}
                                    />
                                    <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
                                        {label}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex fixed left-0 top-0 h-full w-20 flex-col items-center py-8 bg-white border-r border-gray-100 z-50">
                <div className="mb-8">
                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        GZ
                    </div>
                </div>
                <div className="flex flex-col gap-8 w-full">
                    {navItems.map(({ path, icon: Icon, label }) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) =>
                                `flex flex-col items-center gap-1 transition-all w-full py-2 border-l-4 ${isActive
                                    ? 'border-black text-black'
                                    : 'border-transparent text-gray-400 hover:text-gray-600'
                                }`
                            }
                            title={label}
                        >
                            {({ isActive }) => (
                                <Icon
                                    className={`w-7 h-7 transition-all ${isActive ? 'fill-black' : ''}`}
                                    strokeWidth={isActive ? 0 : 2}
                                />
                            )}
                        </NavLink>
                    ))}
                </div>
            </div>
        </>
    )
}

export default BottomNav
