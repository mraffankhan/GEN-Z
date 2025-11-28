import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, Star } from 'lucide-react'

const CategoryInfo = () => {
    const { categoryId } = useParams()
    const navigate = useNavigate()

    const categoryName = categoryId?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-white p-4">
            <button onClick={() => navigate(-1)} className="mb-6 p-2 hover:bg-gray-800 rounded-full">
                <ArrowLeft className="w-6 h-6 text-white" />
            </button>

            <div className="text-center mb-8">
                <div className="w-20 h-20 bg-neon-purple/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-neon-purple/30">
                    <Users className="w-10 h-10 text-neon-purple" />
                </div>
                <h1 className="text-2xl font-bold mb-2">{categoryName}</h1>
                <p className="text-gray-400 text-sm">Connect with other {categoryName}s, share ideas, and collaborate.</p>
            </div>

            <div className="bg-[#151515] rounded-xl p-6 border border-gray-800 mb-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Community Guidelines
                </h3>
                <ul className="space-y-3 text-sm text-gray-400 list-disc list-inside">
                    <li>Be respectful and supportive.</li>
                    <li>No spam or self-promotion without context.</li>
                    <li>Keep discussions relevant to {categoryName}.</li>
                    <li>Messages are ephemeral and clear daily at 6:00 AM IST.</li>
                </ul>
            </div>

            <div className="text-center">
                <p className="text-xs text-gray-500">Top creators feature coming soon!</p>
            </div>
        </div>
    )
}

export default CategoryInfo
