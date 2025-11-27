import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, ArrowRight, Mail } from 'lucide-react'

const Login = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        // For demo purposes, we'll use a magic link login
        // In a real app, you might want email/password or OAuth
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin,
            },
        })

        if (error) {
            setMessage({ type: 'error', text: error.message })
        } else {
            setMessage({ type: 'success', text: 'Check your email for the magic link!' })
        }
        setLoading(false)
    }

    // Temporary Dev Login for easier testing without email
    const handleDevLogin = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: 'test@example.com',
            password: 'password123'
        })
        if (error) alert("Dev login failed: " + error.message)
        else navigate('/')
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-neon-purple/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="w-8 h-8 text-neon-purple" />
                    </div>
                    <h1 className="text-3xl font-cyber text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-500">Sign in to access Campus Connect</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            College Email
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
                        {loading ? 'Sending Link...' : <>Send Magic Link <ArrowRight className="w-4 h-4" /></>}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-400 mb-4">Developer Mode</p>
                    <button
                        onClick={handleDevLogin}
                        className="text-xs font-bold text-gray-500 hover:text-neon-purple underline"
                    >
                        Quick Login (Dev Account)
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login
