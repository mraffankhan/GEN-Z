import React, { memo } from 'react'
import { Instagram, Linkedin, Github, Globe } from 'lucide-react'

const SocialLinks = memo(({ links }) => {
    if (!links) return null

    const { instagram_url, linkedin_url, github_url, portfolio_url } = links

    // Only render if at least one link exists
    if (!instagram_url && !linkedin_url && !github_url && !portfolio_url) return null

    const SocialIcon = ({ href, icon: Icon, color }) => {
        if (!href) return null
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors ${color}`}
            >
                <Icon className="w-5 h-5" />
            </a>
        )
    }

    return (
        <div className="flex items-center justify-center gap-4 py-2">
            <SocialIcon href={instagram_url} icon={Instagram} color="text-pink-600" />
            <SocialIcon href={linkedin_url} icon={Linkedin} color="text-blue-700" />
            <SocialIcon href={github_url} icon={Github} color="text-gray-900" />
            <SocialIcon href={portfolio_url} icon={Globe} color="text-purple-600" />
        </div>
    )
})

SocialLinks.displayName = 'SocialLinks'

export default SocialLinks
