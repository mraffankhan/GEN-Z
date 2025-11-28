import React from 'react'
import { LogOut } from 'lucide-react'

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                        <LogOut className="w-6 h-6 text-red-500" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Logout?
                    </h3>

                    <p className="text-gray-500 mb-6">
                        Are you sure you want to logout?
                    </p>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 py-3 px-4 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 shadow-lg shadow-red-200 transition-all active:scale-95"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LogoutModal
