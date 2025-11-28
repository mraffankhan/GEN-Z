import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { ExternalLink, Loader } from 'lucide-react'

const ApplyRedirect = () => {
    const { jobId } = useParams()
    const [error, setError] = useState(null)

    useEffect(() => {
        const redirect = async () => {
            const { data, error } = await supabase
                .from('jobs')
                .select('apply_link')
                .eq('id', jobId)
                .single()

            if (error || !data) {
                setError('Job not found or link unavailable.')
                return
            }

            if (data.apply_link) {
                window.location.href = data.apply_link
            } else {
                setError('No application link provided for this job.')
            }
        }

        redirect()
    }, [jobId])

    if (error) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center text-white p-4 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button onClick={() => window.history.back()} className="text-gray-400 underline">Go Back</button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center text-white">
            <Loader className="w-10 h-10 text-neon-green animate-spin mb-4" />
            <h2 className="text-xl font-bold mb-2">Redirecting to Application...</h2>
            <p className="text-gray-400 text-sm">Please wait while we take you to the external site.</p>
        </div>
    )
}

export default ApplyRedirect
