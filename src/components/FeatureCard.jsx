import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const FeatureCard = ({ to, icon: Icon, title, description, color = 'neon-green' }) => {
    const colorClass = color === 'neon-purple' ? 'text-neon-purple bg-neon-purple/10' : 'text-neon-green bg-neon-green/10'

    return (
        <Link
            to={to}
            className="block bg-white p-5 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1 group"
        >
            <div className="flex justify-between items-start mb-3">
                <div className={`p-3 rounded-xl ${colorClass}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-gray-600 transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-500 leading-tight">{description}</p>
        </Link>
    )
}

export default FeatureCard
