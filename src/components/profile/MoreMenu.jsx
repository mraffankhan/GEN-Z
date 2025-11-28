import React, { useEffect, useState } from 'react'
import { Edit2, Share2, Flag, LogOut, X } from 'lucide-react'

const MoreMenu = ({ isOpen, onClose, isMe, onEdit, onLogout, onShare, onReport }) => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)
            document.body.style.overflow = 'hidden'
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300)
            document.body.style.overflow = 'unset'
            return () => clearTimeout(timer)
        }
    }, [isOpen])

    if (!isVisible && !isOpen) return null

    const MenuItem = ({ icon: Icon, label, onClick, isDestructive }) => (
        <button
            onClick={() => {
                onClick?.()
                onClose()
            }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 text-[15px] font-medium transition-colors active:bg-gray-50 rounded-xl
                ${isDestructive ? 'text-[#E63946]' : 'text-gray-700'}
            `}
        >
            <Icon className={`w-5 h-5 ${isDestructive ? 'text-[#E63946]' : 'text-gray-500'}`} />
            {label}
        </button>
    )

    return (
        <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div
                className={`
                    relative w-full max-w-md bg-white rounded-t-[24px] sm:rounded-[24px] shadow-xl overflow-hidden
                    transform transition-transform duration-300 ease-out
                    ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-full sm:translate-y-10 sm:scale-95'}
                `}
            >
                {/* Handle bar for mobile feel */}
                <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                </div>

                <div className="p-2 pb-safe">
                    {isMe ? (
                        <>
                            <MenuItem icon={Edit2} label="Edit Profile" onClick={onEdit} />
                            <MenuItem icon={Share2} label="Share Profile" onClick={onShare} />
                            <div className="h-px bg-gray-100 my-1 mx-4" />
                            <MenuItem icon={LogOut} label="Log Out" onClick={onLogout} isDestructive />
                        </>
                    ) : (
                        <>
                            <MenuItem icon={Share2} label="Share Profile" onClick={onShare} />
                            <div className="h-px bg-gray-100 my-1 mx-4" />
                            <MenuItem icon={Flag} label="Report User" onClick={onReport} isDestructive />
                            <MenuItem icon={X} label="Block User" onClick={onReport} isDestructive />
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MoreMenu
