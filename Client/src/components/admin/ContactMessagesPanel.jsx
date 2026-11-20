import React, { useState, useEffect } from 'react'
import api from '../../lib/api'
import { Mail, Phone, Trash2, CheckCircle, Inbox, CircleAlert } from 'lucide-react'

// Card header used by the loading, error and loaded states (presentational only)
const PanelHeader = () => (
  <div className="border-b border-slate-200 px-4 py-4 sm:px-6">
    <h2 className="text-lg font-semibold text-ink">Contact Messages</h2>
    <p className="mt-1 text-sm text-slate-500">
      Enquiries sent through the contact form on the website.
    </p>
  </div>
)

const ContactMessagesPanel = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchMessages = async () => {
    try {
      const res = await api.get('/contact')
      setMessages(res.data.items)
      setLoading(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load messages')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/contact/${id}/read`)
      fetchMessages()
    } catch (err) {
      console.error('Failed to mark as read:', err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return
    try {
      await api.delete(`/contact/${id}`)
      fetchMessages()
    } catch (err) {
      console.error('Failed to delete:', err)
    }
  }

  if (loading)
    return (
      <div className="card overflow-hidden">
        <PanelHeader />
        <p role="status" className="px-6 py-16 text-center text-sm text-slate-500">
          Loading messages…
        </p>
      </div>
    )
  if (error)
    return (
      <div className="card overflow-hidden">
        <PanelHeader />
        <div className="p-4 sm:p-6">
          <div role="alert" className="alert alert-error">
            <CircleAlert size={18} aria-hidden="true" className="mt-px shrink-0" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    )

  return (
    <div className="card overflow-hidden">
      <PanelHeader />

      {messages.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-16 text-center">
          <Inbox size={40} strokeWidth={1.5} aria-hidden="true" className="text-slate-300" />
          <p className="mt-4 font-medium text-ink">No messages yet.</p>
          <p className="mt-1 text-sm text-slate-500">
            Enquiries from the website&apos;s contact form will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="block w-full text-left text-sm lg:table">
            <thead className="hidden border-b border-slate-200 bg-slate-50 text-xs tracking-wide text-slate-500 uppercase lg:table-header-group">
              <tr>
                <th scope="col" className="py-3 pr-4 pl-6 font-semibold">
                  From
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Message
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Received
                </th>
                <th scope="col" className="py-3 pr-6 pl-4 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="block divide-y divide-slate-100 lg:table-row-group">
              {messages.map((msg) => (
                <tr
                  key={msg._id}
                  className={`grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-3 px-4 py-4 transition-colors duration-150 hover:bg-slate-50/70 sm:px-6 lg:table-row ${
                    msg.isRead ? '' : 'bg-navy-50/60'
                  }`}
                >
                  <th
                    scope="row"
                    className="min-w-0 text-left align-top font-normal lg:w-56 lg:py-4 lg:pr-4 lg:pl-6 xl:w-72"
                  >
                    <p className={`text-ink ${msg.isRead ? 'font-medium' : 'font-semibold'}`}>
                      {msg.name}
                    </p>
                    <p className="mt-1 flex items-start gap-1.5 text-slate-500">
                      <Mail size={14} aria-hidden="true" className="mt-[3px] shrink-0" />
                      <span className="wrap-break-word">{msg.email}</span>
                    </p>
                    {msg.phone && (
                      <p className="mt-0.5 flex items-center gap-1.5 text-slate-500">
                        <Phone size={14} aria-hidden="true" className="shrink-0" />
                        {msg.phone}
                      </p>
                    )}
                  </th>

                  <td className="col-span-2 space-y-1 align-top lg:px-4 lg:py-4">
                    {msg.subject && <p className="font-medium text-ink">{msg.subject}</p>}
                    <p className="leading-relaxed whitespace-pre-line text-slate-600">
                      {msg.message}
                    </p>
                  </td>

                  <td className="col-start-2 row-start-1 flex flex-col items-end gap-1.5 justify-self-end align-top lg:table-cell lg:px-4 lg:py-4">
                    <span className={`badge ${msg.isRead ? 'badge-slate' : 'badge-navy'}`}>
                      {msg.isRead ? 'Read' : 'Unread'}
                    </span>
                    {/* Mobile only: received date stacked under the badge */}
                    <span className="text-xs whitespace-nowrap text-slate-500 lg:hidden">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </td>

                  <td className="hidden align-top text-sm whitespace-nowrap text-slate-500 lg:table-cell lg:px-4 lg:py-4">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </td>

                  <td className="col-span-2 justify-self-end align-top lg:py-4 lg:pr-6 lg:pl-4">
                    <div className="flex flex-wrap justify-end gap-2 lg:flex-col lg:flex-nowrap lg:items-end xl:flex-row xl:items-center">
                      {!msg.isRead && (
                        <button
                          onClick={() => handleMarkRead(msg._id)}
                          aria-label={`Mark as read: message from ${msg.name}`}
                          className="btn btn-outline btn-sm h-10 lg:h-8"
                        >
                          <CheckCircle size={14} aria-hidden="true" /> Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(msg._id)}
                        aria-label={`Delete message from ${msg.name}`}
                        className="btn btn-danger btn-sm h-10 lg:h-8"
                      >
                        <Trash2 size={14} aria-hidden="true" /> Delete
                      </button>
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

export default ContactMessagesPanel
