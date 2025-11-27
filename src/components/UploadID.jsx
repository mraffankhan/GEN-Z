import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { verifyIDWithGemini } from '../api/verification/aiVerifyID'
import { useUser } from '../context/UserContext'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

const UploadID = () => {
    const { user, refreshProfile } = useUser()
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [status, setStatus] = useState('idle') // idle, processing, success, error
    const navigate = useNavigate()

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0])
            setMessage('')
            setStatus('idle')
        }
    }

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                // Remove data:image/xyz;base64, prefix
                const base64String = reader.result.split(',')[1]
                resolve(base64String)
            }
            reader.onerror = error => reject(error)
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!file || !user) {
            setMessage('Please select a file first.')
            return
        }

        setLoading(true)
        setStatus('processing')
        setMessage('Analyzing ID card securely...')

        try {
            // 1. Convert to Base64 (No Storage Upload)
            const base64 = await convertToBase64(file)

            // 2. Direct AI Verification
            const result = await verifyIDWithGemini(user.id, base64, file.type)

            if (result.success) {
                if (result.status === 'approved') {
                    setStatus('success')
                    setMessage('Verification Successful! Welcome to the club.')
                    await refreshProfile() // Update context
                    setTimeout(() => navigate('/'), 2000)
                } else {
                    setStatus('error')
                    setMessage(`Verification Failed: ${result.analysis?.reason || "ID not recognized."}`)
                }
            } else {
                // Graceful error handling
                console.error("Verification Error Details:", result.error)
                setStatus('error')
                setMessage("AI verification failed, try again.")
            }

        } catch (err) {
            console.error(err)
            setStatus('error')
            setMessage('Error: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg text-white p-4">
            <h1 className="text-3xl font-cyber mb-8 text-neon-green">Velvet Rope Access</h1>

            <div className="w-full max-w-md bg-card-bg p-8 rounded-xl border border-gray-800">
                <p className="mb-6 text-gray-400">Upload your College ID. <br /> <span className="text-xs text-gray-500">We do NOT store your ID image. It is analyzed instantly and discarded.</span></p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
                        ${status === 'error' ? 'border-red-500 bg-red-500/10' : 'border-gray-700 hover:border-neon-purple'}
                    `}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="id-upload"
                            disabled={loading}
                        />
                        <label htmlFor="id-upload" className="cursor-pointer block">
                            {file ? (
                                <span className="text-neon-purple font-bold">{file.name}</span>
                            ) : (
                                <span className="text-gray-500">Click to select ID Card</span>
                            )}
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !file}
                        className={`w-full py-3 rounded-lg font-bold tracking-wider transition-all flex items-center justify-center gap-2
              ${loading
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                : status === 'success'
                                    ? 'bg-neon-green text-black'
                                    : 'bg-white text-black hover:bg-neon-green hover:text-black shadow-[0_0_15px_rgba(57,255,20,0.5)]'
                            }`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>ANALYZING...</span>
                            </>
                        ) : status === 'success' ? (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                <span>APPROVED</span>
                            </>
                        ) : (
                            'VERIFY INSTANTLY'
                        )}
                    </button>
                </form>

                {message && (
                    <div className={`mt-6 p-4 rounded-lg text-sm text-center border ${status === 'success' ? 'bg-green-500/10 border-green-500 text-green-400' :
                        status === 'error' ? 'bg-red-500/10 border-red-500 text-red-400' :
                            'bg-gray-800 border-gray-700 text-gray-300'
                        }`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    )
}

export default UploadID
