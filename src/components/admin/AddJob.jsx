import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Loader2, X, CheckCircle, AlertCircle } from 'lucide-react'
import { useUser } from '../../context/UserContext'

const AddJob = ({ onClose, onJobAdded, jobToEdit = null }) => {
    const { user } = useUser()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null) // { type: 'success' | 'error', text: '' }
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        type: 'Internship',
        mode: 'Remote',
        location: '',
        stipend: '',
        apply_link: '',
        description: '',
        tags: ''
    })

    useEffect(() => {
        if (jobToEdit) {
            setFormData({
                ...jobToEdit,
                tags: jobToEdit.tags ? jobToEdit.tags.join(', ') : ''
            })
        }
    }, [jobToEdit])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            // Parse tags
            const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')

            const jobData = {
                title: formData.title,
                company: formData.company,
                type: formData.type,
                mode: formData.mode,
                location: formData.location,
                stipend: formData.stipend,
                apply_link: formData.apply_link,
                description: formData.description,
                tags: tagsArray,
                created_by: user.id
            }

            let error
            if (jobToEdit) {
                const { error: updateError } = await supabase
                    .from('jobs')
                    .update(jobData)
                    .eq('id', jobToEdit.id)
                error = updateError
            } else {
                const { error: insertError } = await supabase
                    .from('jobs')
                    .insert([jobData])
                error = insertError
            }

            if (error) throw error

            setMessage({ type: 'success', text: jobToEdit ? 'Job updated successfully!' : 'Job posted successfully!' })

            // Clear form if adding new
            if (!jobToEdit) {
                setFormData({
                    title: '',
                    company: '',
                    type: 'Internship',
                    mode: 'Remote',
                    location: '',
                    stipend: '',
                    apply_link: '',
                    description: '',
                    tags: ''
                })
            }

            if (onJobAdded) onJobAdded()

            // Optional: Close after delay
            // setTimeout(() => {
            //     if (onClose) onClose()
            // }, 2000)

        } catch (error) {
            console.error('Error saving job:', error)
            setMessage({ type: 'error', text: error.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">{jobToEdit ? 'Edit Job' : 'Post New Job'}</h2>
                {onClose && (
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                )}
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="text-sm font-medium">{message.text}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 focus:ring-0 transition-all text-sm"
                            placeholder="e.g. Frontend Developer"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <input
                            type="text"
                            name="company"
                            required
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 focus:ring-0 transition-all text-sm"
                            placeholder="e.g. Google"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 focus:ring-0 transition-all text-sm"
                        >
                            <option value="Internship">Internship</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                        <select
                            name="mode"
                            value={formData.mode}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 focus:ring-0 transition-all text-sm"
                        >
                            <option value="Remote">Remote</option>
                            <option value="Office">Office</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                            type="text"
                            name="location"
                            required
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 focus:ring-0 transition-all text-sm"
                            placeholder="e.g. San Francisco, CA"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stipend / Salary</label>
                        <input
                            type="text"
                            name="stipend"
                            value={formData.stipend}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 focus:ring-0 transition-all text-sm"
                            placeholder="e.g. $5000/mo or Unpaid"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apply Link</label>
                    <input
                        type="url"
                        name="apply_link"
                        required
                        value={formData.apply_link}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 focus:ring-0 transition-all text-sm"
                        placeholder="https://..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 focus:ring-0 transition-all text-sm"
                        placeholder="React, Node.js, Design"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        required
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 focus:ring-0 transition-all text-sm resize-none"
                        placeholder="Job details..."
                    ></textarea>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-black text-white font-semibold text-sm hover:bg-gray-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {jobToEdit ? 'Updating...' : 'Posting...'}
                            </>
                        ) : (
                            jobToEdit ? 'Update Job' : 'Post Job'
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddJob
