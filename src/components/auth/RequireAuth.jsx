import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from '../../context/UserContext'

const RequireAuth = ({ children }) => {
    const { session, loading } = useUser()
    const location = useLocation()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-purple"></div>
            </div>
        )
    }

    if (!session) {
        // Redirect to login, saving the current location they were trying to go to
        return <Navigate to="/auth/login" state={{ from: location }} replace />
    }

    return children
}

export default RequireAuth
