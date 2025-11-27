import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const FeatureCard = ({ to, icon: Icon, title, description, color = 'neon-green' }) => {
    const colorClass = color === 'neon-purple' ? 'text-neon-purple border-neon-purple/30' : 'text-neon-green border-neon-green/30'
    const bgHoverClass = color === 'neon-purple' ? 'hover:bg-neon-purple/10' : 'hover:bg-neon-green/10'

    return (
        <Link
            to={to}
            className={`block bg-card-bg p-5 rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${bgHoverClass} group`}
        >
            <div className="flex justify-between items-start mb-3">
                <div className={`p-3 rounded-xl bg-white/5 ${colorClass} border`}>
                    <Icon className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
            <p className="text-sm text-gray-400 leading-tight">{description}</p>
        </Link>
    )
}

export default FeatureCard
