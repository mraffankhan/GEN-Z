import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Code, PenTool, Video, Palette, Edit3, TrendingUp, Briefcase, Music, Gamepad2, Globe } from 'lucide-react'
import BaseCard from '../../components/BaseCard'
import PageHeader from '../../components/PageHeader'

const categories = [
    { id: 'developer', name: 'Developer', icon: Code, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'ui-ux', name: 'UI/UX Designer', icon: PenTool, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'video-editor', name: 'Video Editor', icon: Video, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'graphic-designer', name: 'Graphic Designer', icon: Palette, color: 'text-pink-500', bg: 'bg-pink-50' },
    { id: 'writer', name: 'Writer', icon: Edit3, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { id: 'marketing', name: 'Marketing', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
    { id: 'business', name: 'Business / Startup', icon: Briefcase, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 'music-art', name: 'Music / Art', icon: Music, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { id: 'gaming', name: 'Gaming', icon: Gamepad2, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'freelance', name: 'Freelance Jobs', icon: Globe, color: 'text-teal-500', bg: 'bg-teal-50' },
]

const CategoriesList = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-bg text-text-primary px-4 pt-6 pb-24">
            <PageHeader
                title="Youth Connect"
                subtitle="Join a skill-based room and connect with others."
                showBack={false}
            />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((cat) => (
                    <BaseCard
                        key={cat.id}
                        onClick={() => navigate(`/youth-connect/room/${cat.id}`)}
                        className={`flex flex-col items-center justify-center gap-3 text-center h-32 group hover:shadow-md transition-all`}
                    >
                        <div className={`p-3 rounded-xl ${cat.bg} transition-colors`}>
                            <cat.icon className={`w-8 h-8 ${cat.color}`} />
                        </div>
                        <span className="font-medium text-sm text-text-primary">{cat.name}</span>
                    </BaseCard>
                ))}
            </div>
        </div>
    )
}

export default CategoriesList
