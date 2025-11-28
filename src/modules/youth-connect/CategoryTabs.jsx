import React, { memo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Code, PenTool, Video, Palette, Edit3, TrendingUp, Briefcase, Music, Gamepad2, Globe } from 'lucide-react'

const categories = [
    { id: 'developer', name: 'Developer', icon: Code },
    { id: 'ui-ux', name: 'UI/UX', icon: PenTool },
    { id: 'video-editor', name: 'Video', icon: Video },
    { id: 'graphic-designer', name: 'Design', icon: Palette },
    { id: 'writer', name: 'Writer', icon: Edit3 },
    { id: 'marketing', name: 'Marketing', icon: TrendingUp },
    { id: 'business', name: 'Business', icon: Briefcase },
    { id: 'music-art', name: 'Music', icon: Music },
    { id: 'gaming', name: 'Gaming', icon: Gamepad2 },
    { id: 'freelance', name: 'Freelance', icon: Globe },
]

const CategoryTabs = memo(() => {
    const navigate = useNavigate()
    const { categoryId } = useParams()

    return (
        <div className="flex items-center gap-2 overflow-x-auto px-4 py-2 scrollbar-hide bg-white">
            {categories.map((cat) => {
                const isActive = cat.id === categoryId
                const Icon = cat.icon

                return (
                    <button
                        key={cat.id}
                        onClick={() => navigate(`/youth-connect/room/${cat.id}`)}
                        className={`
                            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium transition-all whitespace-nowrap flex-shrink-0 border
                            ${isActive
                                ? 'bg-black text-white border-black shadow-sm'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'}
                        `}
                    >
                        <Icon className="w-3.5 h-3.5" />
                        {cat.name}
                    </button>
                )
            })}
        </div>
    )
})

CategoryTabs.displayName = 'CategoryTabs'

export default CategoryTabs
