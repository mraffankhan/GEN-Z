import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'

const PublicOnlyRoute = ({ children }) => {
    const { session, loading } = useUser()


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-purple"></div>
            </div>
        )
    }

    if (session) {
        // Redirect to home if already logged in
        return <Navigate to="/" replace />
    }

    return children
}

export default PublicOnlyRoute
