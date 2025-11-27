import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, ShieldCheck } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useUser } from '../context/UserContext'

const VerificationPending = () => {
    const { user } = useUser()
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) return

        // Poll for status change every 5 seconds
        const interval = setInterval(async () => {
            const { data } = await supabase
                .from('profiles')
                .select('verification_status')
                .eq('id', user.id)
                .single()

            if (data && (data.verification_status === 'approved' || data.verification_status === 'rejected')) {
                navigate('/')
            }
        }, 5000)

        return () => clearInterval(interval)
    }, [navigate, user])

    return (
        <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center text-white p-4 text-center">
            <div className="bg-card-bg p-10 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(66,255,147,0.1)] max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-neon-green blur-xl opacity-20 rounded-full"></div>
                        <ShieldCheck className="w-16 h-16 text-neon-green relative z-10" />
                    </div>
                </div>

                <h1 className="text-2xl font-cyber text-white mb-2">Verifying ID...</h1>
                <p className="text-gray-400 mb-8">
                    Our AI is analyzing your card for authenticity. <br />
                    This usually takes about 10-15 seconds.
                </p>

                <div className="flex items-center justify-center gap-3 text-neon-green font-bold bg-neon-green/10 py-3 px-6 rounded-full border border-neon-green/20">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                </div>
            </div>
        </div>
    )
}

export default VerificationPending
