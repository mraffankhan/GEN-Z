import React, { useState } from 'react'
import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import LogoutModal from './ui/LogoutModal'

const LogoutButton = () => {
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleLogoutConfirm = async () => {
        try {
            await supabase.auth.signOut()
            navigate('/auth/login')
        } catch (error) {
            console.error('Logout failed:', error)
            // Optional: Show a toast or error state here
        } finally {
            setIsModalOpen(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3 rounded-xl border-2 border-neon-purple text-neon-purple font-bold hover:bg-neon-purple hover:bg-opacity-10 transition-all flex items-center justify-center gap-2"
            >
                <LogOut className="w-5 h-5" />
                Logout
            </button>

            <LogoutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleLogoutConfirm}
            />
        </>
    )
}

export default LogoutButton
