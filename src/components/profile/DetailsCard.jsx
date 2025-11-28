import React, { memo } from 'react'
import { MapPin, Globe, Instagram, Linkedin, Github } from 'lucide-react'

const DetailsCard = memo(({ profile }) => {
    const { location, skills, instagram_url, linkedin_url, github_url, portfolio_url } = profile || {}

    // Parse skills
    let skillsArray = []
    if (Array.isArray(skills)) {
        skillsArray = skills
    } else if (typeof skills === 'string') {
        try { skillsArray = JSON.parse(skills) } catch (e) { skillsArray = [] }
    }

    const hasSocials = instagram_url || linkedin_url || github_url || portfolio_url
    const hasLocation = !!location

    if (!hasLocation && !hasSocials && (!skillsArray || skillsArray.length === 0)) {
        return null
    }

    const DetailRow = ({ icon: Icon, text, href, label }) => {
        if (!text && !href) return null

        const content = (
            <div className="flex items-center gap-3 py-2">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                    <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[14px] text-gray-900 font-medium truncate max-w-[200px]">
                        {label || text}
                    </span>
                </div>
            </div>
        )

        if (href) {
            return (
                <a href={href} target="_blank" rel="noopener noreferrer" className="block hover:bg-gray-50 rounded-lg transition-colors -mx-2 px-2">
                    {content}
                </a>
            )
        }

        return content
    }

    return (
        <div className="w-full bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] p-6 space-y-8 border border-gray-50">

            {/* About Section */}
            {(hasLocation || hasSocials) && (
                <div className="space-y-3">
                    <h3 className="text-[16px] font-semibold text-gray-900">About</h3>
                    <div className="space-y-1">
                        <DetailRow icon={MapPin} text={location} />
                        <DetailRow icon={Globe} href={portfolio_url} label="Portfolio" />
                        <DetailRow icon={Instagram} href={instagram_url} label="Instagram" />
                        <DetailRow icon={Linkedin} href={linkedin_url} label="LinkedIn" />
                        <DetailRow icon={Github} href={github_url} label="GitHub" />
                    </div>
                </div>
            )}

            {/* Interests Section */}
            {skillsArray && skillsArray.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-[16px] font-semibold text-gray-900">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                        {skillsArray.map((skill, index) => (
                            <span
                                key={index}
                                className="px-4 py-3 bg-[#F3F3F3] text-gray-700 text-[13px] font-medium rounded-xl"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
})

DetailsCard.displayName = 'DetailsCard'

export default DetailsCard
