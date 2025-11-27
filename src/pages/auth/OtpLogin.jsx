import React, { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { Smartphone, Mail, ArrowRight, ArrowLeft } from 'lucide-react'

const OtpLogin = () => {
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const navigate = useNavigate()

    const handleSendOtp = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const isEmail = input.includes('@')

        if (isEmail) {
            // Email OTP Flow
            const { error } = await supabase.auth.signInWithOtp({
                email: input,
                options: {
                    shouldCreateUser: true,
                },
            })

            if (error) {
                setMessage({ type: 'error', text: error.message })
                setLoading(false)
            } else {
                // Navigate to verify screen
                navigate('/auth/otp-verify', { state: { type: 'email', identifier: input } })
            }
        } else {
            // Phone OTP Flow (Mock)
            // In a real app, you'd call an API here.
            // For this demo, we'll generate a code and log it.
            const mockOtp = Math.floor(100000 + Math.random() * 900000).toString()
            console.log('MOCK SMS OTP:', mockOtp)

            // Store in sessionStorage for verification
            sessionStorage.setItem(`mock_otp_${input}`, mockOtp)

            // Simulate API delay
            setTimeout(() => {
                alert(`DEMO: Your OTP is ${mockOtp}`)
                navigate('/auth/otp-verify', { state: { type: 'phone', identifier: input } })
            }, 1000)
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative">
            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-neon-purple/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Smartphone className="w-8 h-8 text-neon-purple" />
                    </div>
                    <h1 className="text-3xl font-cyber text-gray-900 mb-2">Welcome</h1>
                    <p className="text-gray-500">Enter your email or phone to continue</p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Email or Phone
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                required
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="student@college.edu or 9876543210"
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
                        {loading ? 'Sending OTP...' : <>Send OTP <ArrowRight className="w-4 h-4" /></>}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default OtpLogin
