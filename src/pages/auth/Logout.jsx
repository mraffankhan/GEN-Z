import React, { useEffect } from 'react'
import { useUser } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
    const { logout } = useUser()
    const navigate = useNavigate()

    useEffect(() => {
        const performLogout = async () => {
            await logout()
            navigate('/auth/login', { replace: true })
        }
        performLogout()
    }, [logout, navigate])

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-purple mx-auto mb-4"></div>
                <p className="text-gray-500">Logging out...</p>
            </div>
        </div>
    )
}

export default Logout
