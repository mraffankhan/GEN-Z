import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const PageHeader = ({ title, subtitle, showBack = true, action }) => {
    const navigate = useNavigate()

    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                {showBack && (
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-gray-100 text-text-secondary hover:text-text-primary transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                )}
                <div>
                    <h1 className="text-xl md:text-2xl font-semibold text-text-primary tracking-tight">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>
                    )}
                </div>
            </div>
            {action && <div>{action}</div>}
        </div>
    )
}

export default PageHeader
