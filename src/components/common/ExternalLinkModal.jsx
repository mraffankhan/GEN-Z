import React from 'react'
import { X, ExternalLink as ExternalLinkIcon, Share } from 'lucide-react'
import { createPortal } from 'react-dom'

const ExternalLinkModal = ({ isOpen, onClose, url }) => {
    if (!isOpen) return null

    const handleOpenBrowser = async () => {
        // Try to use native share if available (best for PWA to open system sheet)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Open Link',
                    url: url
                })
                onClose()
                return
            } catch (err) {
                console.log('Share failed or cancelled, falling back to window.open')
            }
        }

        // Fallback: Force open in new window
        window.open(url, '_blank', 'noopener,noreferrer')
        onClose()
    }

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <div className="p-6 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ExternalLinkIcon className="w-6 h-6 text-gray-600" />
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Open External Link?
                    </h3>

                    <p className="text-gray-500 text-sm mb-6">
                        This link will open outside GenZ Connect.
                        <br />
                        <span className="text-xs text-gray-400 mt-1 block truncate px-4">{url}</span>
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleOpenBrowser}
                            className="w-full py-3 bg-black text-white rounded-xl font-semibold text-[15px] active:scale-95 transition-transform flex items-center justify-center gap-2"
                        >
                            <Share className="w-4 h-4" />
                            Choose Browser
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-gray-50 text-gray-700 rounded-xl font-semibold text-[15px] active:scale-95 transition-transform hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}

export default ExternalLinkModal
