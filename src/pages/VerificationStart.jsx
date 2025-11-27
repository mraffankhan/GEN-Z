import React from 'react'
import { Link } from 'react-router-dom'

const VerificationStart = () => {
    return (
        <div className="min-h-screen bg-dark-bg text-white p-4 flex flex-col items-center justify-center">
            <div className="max-w-md w-full text-center">
                <h1 className="text-3xl font-cyber text-neon-purple mb-6">The Velvet Rope</h1>
                <p className="text-gray-400 mb-8">
                    To ensure Gen-Z remains a safe and exclusive space for students, we require a valid College ID.
                </p>

                <div className="space-y-4">
                    <Link
                        to="/verify/upload"
                        className="block w-full bg-neon-green text-black py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity"
                    >
                        I HAVE MY ID CARD
                    </Link>

                    <Link
                        to="/"
                        className="block w-full text-gray-500 py-4 hover:text-white transition-colors"
                    >
                        Go Back
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default VerificationStart
