import React, { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, ArrowRight, Mail, Lock, User, ArrowLeft } from 'lucide-react'

const SignupScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const navigate = useNavigate()

    const handleSignup = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' })
            setLoading(false)
            return
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: window.location.origin,
            },
        })

        if (error) {
            setMessage({ type: 'error', text: error.message })
            setLoading(false)
        } else {
            // Create profile immediately if user was created
            if (data?.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: data.user.id,
                        email: data.user.email,

                        trust_score: 500,
                        coins: 0,
                        created_at: new Date().toISOString()
                    })

                if (profileError) {
                    console.error('Profile creation failed:', profileError)
                }
            }
            // Redirect to home immediately (no email verification needed)
            navigate('/')
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative">


            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-neon-purple/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-neon-purple" />
                    </div>
                    <h1 className="text-3xl font-cyber text-gray-900 mb-2">Join Campus</h1>
                    <p className="text-gray-500">Create your student account</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
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

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 pl-12 pr-4 py-3 rounded-xl focus:border-neon-purple focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
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
                        {loading ? 'Creating Account...' : <>Create Account <ArrowRight className="w-4 h-4" /></>}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        Already have an account?{' '}
                        <Link to="/auth/login" className="font-bold text-neon-purple hover:underline">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignupScreen
