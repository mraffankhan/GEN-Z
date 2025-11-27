import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, MessageSquare, BarChart2, Zap, User } from 'lucide-react'

const BottomNav = () => {
    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/confessions', icon: MessageSquare, label: 'Confessions' },
        { path: '/polls', icon: BarChart2, label: 'Polls' },
        { path: '/flashchat', icon: Zap, label: 'Flash Chat' },
    ]

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 px-6 py-4 z-50 shadow-lg">
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
    )
}

export default BottomNav
