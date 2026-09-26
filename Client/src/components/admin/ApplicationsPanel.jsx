
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FileText, Mail, Phone } from 'lucide-react'

const statusOptions = ['received', 'shortlisted', 'rejected', 'hired']

const statusColors = {
    received: 'bg-slate-700 text-slate-200',
    shortlisted: 'bg-blue-900 text-blue-300',
    rejected: 'bg-red-900 text-red-300',
    hired: 'bg-green-900 text-green-300',
}

const ApplicationsPanel = () => {
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [filter, setFilter] = useState('')

    const token = localStorage.getItem('adminToken')

    const fetchApplications = async () => {
        setLoading(true)
        setError('')

        try {
            const res = await axios.get(
                'http://localhost:5000/api/careers/applications',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: filter ? { status: filter } : {},
                }
            )

            setApplications(res.data.items)
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Failed to load applications'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchApplications()
    }, [filter])

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(
                `http://localhost:5000/api/careers/applications/${id}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            fetchApplications()
        } catch (err) {
            console.error('Failed to update status:', err)
        }
    }

    if (loading) {
        return (
            <p className="text-slate-400">
                Loading applications...
            </p>
        )
    }

    if (error) {
        return (
            <p className="text-red-500">
                {error}
            </p>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2
                    className="text-2xl font-bold text-white"
                    style={{
                        fontFamily: "'Playfair Display', serif",
                    }}
                >
                    Job Applications
                </h2>

                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm outline-none"
                >
                    <option value="">All statuses</option>

                    {statusOptions.map((s) => (
                        <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            {applications.length === 0 ? (
                <p className="text-slate-400">
                    No applications found.
                </p>
            ) : (
                <div className="flex flex-col gap-4">
                    {applications.map((app) => (
                        <div
                            key={app._id}
                            className="p-5 rounded-lg border border-slate-800 bg-slate-900/30"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-semibold text-white">
                                        {app.firstName} {app.lastName}
                                    </h4>

                                    {app.positionAppliedFor && (
                                        <p className="text-slate-400 text-sm">
                                            {app.positionAppliedFor}
                                        </p>
                                    )}
                                </div>

                                <span
                                    className={`text-xs px-3 py-1 rounded-full ${
                                        statusColors[app.status] ||
                                        statusColors.received
                                    }`}
                                >
                                    {app.status}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-3">
                                <span className="flex items-center gap-1">
                                    <Mail size={14} />
                                    {app.email}
                                </span>

                                <span className="flex items-center gap-1">
                                    <Phone size={14} />
                                    {app.mobileNo}
                                </span>
                            </div>

                            {app.highestQualification && (
                                <p className="text-slate-500 text-xs mb-1">
                                    Qualification: {app.highestQualification}
                                </p>
                            )}

                            {app.lastCompany && (
                                <p className="text-slate-500 text-xs mb-1">
                                    Last company: {app.lastCompany}
                                </p>
                            )}

                            {(app.experienceYears || app.experienceMonths) && (
                                <p className="text-slate-500 text-xs mb-3">
                                    Experience: {app.experienceYears || 0}y{' '}
                                    {app.experienceMonths || 0}m
                                </p>
                            )}

                            <div className="flex items-center gap-4 mt-3">
                                <a
                                    href={app.resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm transition"
                                >
                                    <FileText size={16} />
                                    View Resume
                                </a>

                                <select
                                    value={app.status}
                                    onChange={(e) =>
                                        handleStatusChange(
                                            app._id,
                                            e.target.value
                                        )
                                    }
                                    className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2 py-1 text-sm outline-none ml-auto"
                                >
                                    {statusOptions.map((s) => (
                                        <option key={s} value={s}>
                                            {s.charAt(0).toUpperCase() + s.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ApplicationsPanel