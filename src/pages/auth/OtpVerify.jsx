import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate, useLocation } from 'react-router-dom'
import { ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react'

const OtpVerify = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const navigate = useNavigate()
    const location = useLocation()
    const inputRefs = useRef([])

    const { type, identifier } = location.state || { type: 'email', identifier: '' }

    useEffect(() => {
        if (!identifier) {
            navigate('/auth/otp-login')
        }
        // Auto-focus first input
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus()
        }
    }, [identifier, navigate])

    const handleChange = (index, value) => {
        if (isNaN(value)) return
        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Move to next input
        if (value && index < 5) {
            inputRefs.current[index + 1].focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus()
        }
    }

    const handleVerify = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)
        const token = otp.join('')

        if (token.length !== 6) {
            await supabase.auth.signInWithOtp({ email: identifier })
        } else {
            const mockOtp = Math.floor(100000 + Math.random() * 900000).toString()
            sessionStorage.setItem(`mock_otp_${identifier}`, mockOtp)
            alert(`DEMO: Your new OTP is ${mockOtp}`)
        }
        setMessage({ type: 'success', text: 'OTP Resent!' })
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative">
            <button onClick={() => navigate('/auth/otp-login')} className="absolute top-6 left-6 p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>

            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-neon-purple/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="w-8 h-8 text-neon-purple" />
                    </div>
                    <h1 className="text-3xl font-cyber text-gray-900 mb-2">Verify OTP</h1>
                    <p className="text-gray-500">Enter the code sent to {identifier}</p>
                </div>

                <form onSubmit={handleVerify} className="space-y-6">
                    <div className="flex justify-between gap-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-14 text-center text-2xl font-bold bg-gray-50 border border-gray-200 rounded-xl focus:border-neon-purple focus:outline-none transition-colors"
                            />
                        ))}
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
                        {loading ? 'Verifying...' : <>Verify OTP <ArrowRight className="w-4 h-4" /></>}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        Didn't receive code?{' '}
                        <button onClick={handleResend} className="font-bold text-neon-purple hover:underline">
                            Resend
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default OtpVerify
