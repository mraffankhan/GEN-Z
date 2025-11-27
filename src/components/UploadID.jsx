import React, { useState } from 'react'
import { uploadID } from '../api/verification/uploadID'
import { useNavigate } from 'react-router-dom'
import { setVerificationStatus } from '../lib/authHelpers'
import { verifyIDWithGemini } from '../api/verification/aiVerifyID'

const UploadID = () => {
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0])
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!file) {
            setMessage('Please select a file first.')
            return
        }

        setLoading(true)
        setMessage('')

        try {
            // 1. Upload to Supabase Storage
            const { url, error } = await uploadID(file)
            if (error) throw new Error(error)

            // 2. Trigger AI Verification (Async)
            const fakeUserId = '00000000-0000-0000-0000-000000000000'

            // Fire and forget for demo speed, or await if we want to log it
            verifyIDWithGemini(fakeUserId, url).then(result => {
                console.log("Verification Result:", result)
            })

            // 3. Navigate to Pending
            setVerificationStatus('pending')
            navigate('/verify/pending')

        } catch (err) {
            setMessage('Upload failed: ' + err.message)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg text-white p-4">
            <h1 className="text-3xl font-cyber mb-8 text-neon-green">Velvet Rope Access</h1>

            <div className="w-full max-w-md bg-card-bg p-8 rounded-xl border border-gray-800">
                <p className="mb-6 text-gray-400">Upload your College ID to verify your status.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-neon-purple transition-colors">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="id-upload"
                        />
                        <label htmlFor="id-upload" className="cursor-pointer block">
                            {file ? (
                                <span className="text-neon-purple">{file.name}</span>
                            ) : (
                                <span className="text-gray-500">Click to select ID Card</span>
                            )}
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-bold tracking-wider transition-all
              ${loading
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                : 'bg-white text-black hover:bg-neon-green hover:text-black shadow-[0_0_15px_rgba(57,255,20,0.5)]'
                            }`}
                    >
                        {loading ? 'UPLOADING...' : 'VERIFY ME'}
                    </button>
                </form>

                {message && (
                    <p className={`mt-4 text-center text-sm ${message.includes('Success') ? 'text-neon-green' : 'text-red-500'}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    )
}

export default UploadID
