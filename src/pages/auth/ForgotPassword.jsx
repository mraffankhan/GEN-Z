import React, { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, ArrowRight } from 'lucide-react'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)

    const handleReset = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset`,
        })

        if (error) {
            setMessage({ type: 'error', text: error.message })
        } else {
            setMessage({ type: 'success', text: 'Password reset link sent to your email.' })
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative">
            <Link to="/auth/login" className="absolute top-6 left-6 p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>

            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-cyber text-gray-900 mb-2">Forgot Password?</h1>
                    <p className="text-gray-500">Enter your email to reset it</p>
                </div>

                <form onSubmit={handleReset} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="student@college.edu"
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 pl-12 pr-4 py-3 rounded-xl focus:border-neon-purple focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {message && (
                        <div className={`p-3 rounded-xl text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-neon-purple transition-all shadow-lg shadow-gray-200 disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : <>Send Reset Link <ArrowRight className="w-4 h-4" /></>}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword
