import React, { useState, useEffect } from 'react'
import api from '../../lib/api'
import { FileText, Mail, Phone, Briefcase, CircleAlert } from 'lucide-react'

const statusOptions = ['received', 'shortlisted', 'rejected', 'hired']

const statusColors = {
  received: 'badge-gold',
  shortlisted: 'badge-navy',
  rejected: 'badge-red',
  hired: 'badge-green',
}

// Card header used by the loading, error and loaded states (presentational only)
const PanelHeader = ({ children }) => (
  <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 border-b border-slate-200 px-4 py-4 sm:px-6">
    <div className="min-w-0">
      <h2 className="text-lg font-semibold text-ink">Job Applications</h2>
      <p className="mt-1 text-sm text-slate-500">
        Applications submitted through the careers form on the website.
      </p>
    </div>
    {children}
  </div>
)

const ApplicationsPanel = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('')

  const fetchApplications = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await api.get('/careers/applications', {
        params: filter ? { status: filter } : {},
      })

      setApplications(res.data.items)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [filter])

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/careers/applications/${id}/status`, { status: newStatus })

      fetchApplications()
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  // Same filter element in every state, so the <select> stays mounted (and keeps focus)
  // while the list reloads (presentational only)
  const filterControl = (
    <div className="flex items-center gap-2">
      <label
        htmlFor="applications-status-filter"
        className="text-sm font-medium whitespace-nowrap text-slate-600"
      >
        Status
      </label>
      <select
        id="applications-status-filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="form-control h-10 w-auto py-1.5 pr-9 pl-3 text-sm lg:h-9"
      >
        <option value="">All statuses</option>

        {statusOptions.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
    </div>
  )

  if (loading) {
    return (
      <div className="card overflow-hidden">
        <PanelHeader>{filterControl}</PanelHeader>
        <p role="status" className="px-6 py-16 text-center text-sm text-slate-500">
          Loading applications…
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card overflow-hidden">
        <PanelHeader>{filterControl}</PanelHeader>
        <div className="p-4 sm:p-6">
          <div role="alert" className="alert alert-error">
            <CircleAlert size={18} aria-hidden="true" className="mt-px shrink-0" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <PanelHeader>{filterControl}</PanelHeader>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-16 text-center">
          <Briefcase size={40} strokeWidth={1.5} aria-hidden="true" className="text-slate-300" />
          <p className="mt-4 font-medium text-ink">No applications found.</p>
          <p className="mt-1 text-sm text-slate-500">
            Applications submitted through the careers form will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="block w-full text-left text-sm lg:table">
            <thead className="hidden border-b border-slate-200 bg-slate-50 text-xs tracking-wide text-slate-500 uppercase lg:table-header-group">
              <tr>
                <th scope="col" className="py-3 pr-4 pl-6 font-semibold">
                  Candidate
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Contact
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Background
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Status
                </th>
                <th scope="col" className="py-3 pr-6 pl-4 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="block divide-y divide-slate-100 lg:table-row-group">
              {applications.map((app) => (
                <tr
                  key={app._id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-3 px-4 py-4 transition-colors duration-150 hover:bg-slate-50/70 sm:px-6 lg:table-row"
                >
                  <th
                    scope="row"
                    className="min-w-0 text-left align-top font-normal lg:py-4 lg:pr-4 lg:pl-6"
                  >
                    <p className="font-semibold text-ink">
                      {app.firstName} {app.lastName}
                    </p>

                    {app.positionAppliedFor && (
                      <p className="mt-0.5 text-slate-500">{app.positionAppliedFor}</p>
                    )}
                  </th>

                  <td className="col-span-2 space-y-1 align-top text-slate-600 lg:px-4 lg:py-4">
                    <p className="flex items-start gap-1.5">
                      <Mail
                        size={14}
                        aria-hidden="true"
                        className="mt-[3px] shrink-0 text-slate-400"
                      />
                      <span className="wrap-break-word">{app.email}</span>
                    </p>

                    <p className="flex items-center gap-1.5">
                      <Phone size={14} aria-hidden="true" className="shrink-0 text-slate-400" />
                      {app.mobileNo}
                    </p>
                  </td>

                  <td className="col-span-2 space-y-1 align-top text-slate-700 max-lg:empty:hidden lg:px-4 lg:py-4">
                    {app.highestQualification && (
                      <p>
                        <span className="text-slate-500">Qualification:</span>{' '}
                        {app.highestQualification}
                      </p>
                    )}

                    {app.lastCompany && (
                      <p>
                        <span className="text-slate-500">Last company:</span> {app.lastCompany}
                      </p>
                    )}

                    {(Number(app.experienceYears) > 0 || Number(app.experienceMonths) > 0) && (
                      <p>
                        <span className="text-slate-500">Experience:</span>{' '}
                        {app.experienceYears || 0}y {app.experienceMonths || 0}m
                      </p>
                    )}
                  </td>

                  <td className="col-start-2 row-start-1 justify-self-end align-top lg:px-4 lg:py-4">
                    <span
                      className={`badge capitalize ${
                        statusColors[app.status] || statusColors.received
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>

                  <td className="col-span-2 align-top lg:py-4 lg:pr-6 lg:pl-4">
                    <div className="flex flex-wrap items-end justify-end gap-x-4 gap-y-2 lg:flex-col lg:flex-nowrap lg:gap-y-2.5">
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm h-10 lg:h-8"
                      >
                        <FileText size={14} aria-hidden="true" />
                        View resume
                      </a>

                      <div className="flex flex-col gap-1 xl:flex-row xl:items-center xl:gap-2">
                        <label
                          htmlFor={`application-status-${app._id}`}
                          className="text-xs font-medium whitespace-nowrap text-slate-500"
                        >
                          Set status
                          <span className="sr-only">
                            {' '}
                            for {app.firstName} {app.lastName}
                          </span>
                        </label>
                        <select
                          id={`application-status-${app._id}`}
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          className="form-control h-10 w-auto py-1 pr-8 pl-2.5 text-sm lg:h-8"
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ApplicationsPanel
