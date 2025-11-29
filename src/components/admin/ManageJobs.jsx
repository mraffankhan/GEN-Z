import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Trash2, Edit2, Loader2, AlertCircle } from 'lucide-react'

const ManageJobs = ({ onEdit }) => {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchJobs = async () => {
        try {
            const { data, error } = await supabase
                .from('jobs')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setJobs(data)
        } catch (error) {
            console.error('Error fetching jobs:', error)
            setError('Failed to load jobs')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchJobs()
    }, [])

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return
        setError(null)

        try {
            const { error } = await supabase
                .from('jobs')
                .delete()
                .eq('id', id)

            if (error) throw error
            setJobs(jobs.filter(job => job.id !== id))
        } catch (error) {
            console.error('Error deleting job:', error)
            setError('Failed to delete job')
        }
    }

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>

    return (
        <div className="space-y-4">
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}
            {jobs.map(job => (
                <div key={job.id} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-start group hover:shadow-sm transition-all">
                    <div>
                        <h3 className="font-bold text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-500">{job.company} • {job.type}</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => onEdit(job)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleDelete(job.id)}
                            className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
            {jobs.length === 0 && !error && (
                <div className="text-center py-8 text-gray-500 text-sm">
                    No jobs posted yet.
                </div>
            )}
        </div>
    )
}

export default ManageJobs
