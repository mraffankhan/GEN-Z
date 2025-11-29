import React, { useState } from 'react'
import ExternalLinkModal from './ExternalLinkModal'

const ExternalLink = ({ href, children, className, ...props }) => {
    const [showModal, setShowModal] = useState(false)

    const isPWA = () => {
        return (window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone) || document.referrer.includes('android-app://')
    }

    const handleClick = (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!href) return

        // If PWA, show modal
        if (isPWA()) {
            setShowModal(true)
        } else {
            // Desktop/Mobile Web: Always open in new tab
            window.open(href, '_blank', 'noopener,noreferrer')
        }
    }

    return (
        <>
            <a
                href={href}
                onClick={handleClick}
                className={className}
                {...props}
            >
                {children}
            </a>

            <ExternalLinkModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                url={href}
            />
        </>
    )
}

export default ExternalLink
