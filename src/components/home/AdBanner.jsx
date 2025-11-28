import React from 'react'
import { ExternalLink } from 'lucide-react'

const AdBanner = ({ ad }) => {
    return (
        <div className="w-full">
            {/* Sponsored Label */}
            <div className="px-1 mb-2">
                <span className="text-[10px] font-semibold text-[#999999] uppercase tracking-wider">Sponsored</span>
            </div>

            <a
                href={ad.redirect_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full aspect-video relative rounded-[24px] overflow-hidden shadow-[0_4px_20px_-5px_rgba(0,0,0,0.06)] group"
            >
                <img
                    src={ad.image_url}
                    alt={ad.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="flex-1 mr-4">
                        <h3 className="text-white font-bold text-lg leading-tight drop-shadow-md">{ad.title}</h3>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                        <ExternalLink className="w-4 h-4" />
                    </div>
                </div>
            </a>
        </div>
    )
}

export default AdBanner
