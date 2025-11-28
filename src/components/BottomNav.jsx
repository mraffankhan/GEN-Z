import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, MessageSquare, Briefcase, Users, User } from 'lucide-react'

const BottomNav = () => {
    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/opportunities', icon: Briefcase, label: 'Opportunities' },
        { path: '/youth-connect', icon: Users, label: 'Youth Connect' },
        { path: '/dms', icon: MessageSquare, label: 'Messages' },
        { path: '/profile', icon: User, label: 'Profile' },
    ]

    return (
        <>
            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 px-6 py-4 z-50 shadow-lg pb-safe">
                <div className="flex justify-between items-center max-w-md mx-auto">
                    {navItems.map(({ path, icon: Icon, label }) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) =>
                                `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-neon-purple' : 'text-gray-400 hover:text-gray-600'
                                }`
                            }
                        >
                            <Icon className="w-6 h-6" />
                            <span className="text-[10px] font-medium">{label}</span>
                        </NavLink>
                    ))}
                </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex fixed left-0 top-0 h-full w-20 flex-col items-center py-8 bg-white border-r border-gray-100 z-50">
                <div className="mb-8">
                    <div className="w-10 h-10 bg-neon-purple rounded-xl flex items-center justify-center text-white font-bold">
                        GZ
                    </div>
                </div>
                <div className="flex flex-col gap-8 w-full">
                    {navItems.map(({ path, icon: Icon, label }) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) =>
                                `flex flex-col items-center gap-1 transition-colors w-full py-2 border-l-4 ${isActive ? 'border-neon-purple text-neon-purple' : 'border-transparent text-gray-400 hover:text-gray-600'
                                }`
                            }
                            title={label}
                        >
                            <Icon className="w-7 h-7" />
                        </NavLink>
                    ))}
                </div>
            </div>
        </>
    )
}

export default BottomNav
