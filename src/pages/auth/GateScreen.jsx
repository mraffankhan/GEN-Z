import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { DoorOpen, ScanLine } from 'lucide-react'

const GateScreen = () => {
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()

    const handleOpenGate = () => {
        setIsOpen(true)
        // Navigate after animation completes (0.8s + buffer)
        setTimeout(() => {
            navigate('/auth/otp-login')
        }, 1000)
    }

    return (
        <div className="fixed inset-0 bg-white overflow-hidden flex items-center justify-center z-50">
            {/* Background Glow (Visible when gate opens) */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-neon-green/20 opacity-0 transition-opacity duration-1000"
                style={{ opacity: isOpen ? 1 : 0 }} />

            {/* Left Gate Panel */}
            <motion.div
                initial={{ x: 0 }}
                animate={{ x: isOpen ? '-100%' : 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute left-0 top-0 bottom-0 w-1/2 bg-gray-50 border-r border-gray-200 flex items-center justify-end pr-8 z-10"
            >
                <div className="w-2 h-32 bg-gray-200 rounded-full" />
            </motion.div>

            {/* Right Gate Panel */}
            <motion.div
                initial={{ x: 0 }}
                animate={{ x: isOpen ? '100%' : 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute right-0 top-0 bottom-0 w-1/2 bg-gray-50 border-l border-gray-200 flex items-center justify-start pl-8 z-10"
            >
                <div className="w-2 h-32 bg-gray-200 rounded-full" />
            </motion.div>

            {/* Center Content (Fades out when opening) */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative z-20 text-center p-8"
                    >
                        <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 border border-gray-100">
                            <DoorOpen className="w-10 h-10 text-neon-purple" />
                        </div>

                        <h1 className="text-3xl font-cyber text-gray-900 mb-2">Gen-Z Campus</h1>
                        <p className="text-gray-500 mb-8">Exclusive Student Network</p>

                        <button
                            onClick={handleOpenGate}
                            className="group relative px-8 py-4 bg-gray-900 text-white rounded-xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-neon-purple/20"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="relative flex items-center gap-2">
                                Open Gate <ScanLine className="w-4 h-4" />
                            </span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default GateScreen
