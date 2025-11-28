import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import BaseCard from './BaseCard'

const FeatureCard = ({ to, icon: Icon, title, description, color = 'blue' }) => {
    const colorClass = color === 'purple' ? 'text-purple-600 bg-purple-50' : 'text-blue-600 bg-blue-50'

    return (
        <Link to={to} className="block">
            <BaseCard className="group h-full hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                    <div className={`p-3 rounded-xl ${colorClass}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-text-primary transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-1">{title}</h3>
                <p className="text-sm text-text-secondary leading-tight">{description}</p>
            </BaseCard>
        </Link>
    )
}

export default FeatureCard
