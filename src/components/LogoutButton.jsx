import React from 'react'
import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const LogoutButton = () => {
    const navigate = useNavigate()

    const handleLogout = async () => {
        const confirm = window.confirm('Are you sure you want to logout?')
        if (!confirm) return

        try {
            await supabase.auth.signOut()
            navigate('/auth/login')
        } catch (error) {
            console.error('Logout failed:', error)
            alert('Failed to logout. Please try again.')
        }
    }

    return (
        <button
            onClick={handleLogout}
            className="w-full py-3 rounded-xl border-2 border-neon-purple text-neon-purple font-bold hover:bg-neon-purple hover:bg-opacity-10 transition-all flex items-center justify-center gap-2"
        >
            <LogOut className="w-5 h-5" />
            Logout
        </button>
    )
}

export default LogoutButton
