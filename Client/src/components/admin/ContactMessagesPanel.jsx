import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Mail, Trash2, CheckCircle } from 'lucide-react'

const ContactMessagesPanel = () => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const token = localStorage.getItem('adminToken')

    const fetchMessages = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/contact', {
                headers: { Authorization: `Bearer ${token}` },
            })
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
            await axios.put(`http://localhost:5000/api/contact/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            })
            fetchMessages()
        } catch (err) {
            console.error('Failed to mark as read:', err)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this message?')) return
        try {
            await axios.delete(`http://localhost:5000/api/contact/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            fetchMessages()
        } catch (err) {
            console.error('Failed to delete:', err)
        }
    }

    if (loading) return <p className='text-slate-400'>Loading messages...</p>
    if (error) return <p className='text-red-500'>{error}</p>

    return (
        <div>
            <h2 className='text-2xl font-bold text-white mb-6' style={{ fontFamily: "'Playfair Display', serif" }}>
                Contact Messages
            </h2>

            {messages.length === 0 ? (
                <p className='text-slate-400'>No messages yet.</p>
            ) : (
                <div className='flex flex-col gap-4'>
                    {messages.map((msg) => (
                        <div
                            key={msg._id}
                            className={`p-5 rounded-lg border ${
                                msg.isRead ? 'border-slate-800 bg-slate-900/30' : 'border-white/30 bg-slate-900/60'
                            }`}
                        >
                            <div className='flex justify-between items-start mb-2'>
                                <div>
                                    <h4 className='font-semibold text-white'>{msg.name}</h4>
                                    <p className='text-slate-400 text-sm flex items-center gap-1'>
                                        <Mail size={14} /> {msg.email}
                                    </p>
                                </div>
                                <span className='text-xs text-slate-500'>
                                    {new Date(msg.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            {msg.subject && <p className='text-slate-300 text-sm font-medium mb-1'>{msg.subject}</p>}
                            <p className='text-slate-300 text-sm mb-3'>{msg.message}</p>
                            {msg.phone && <p className='text-slate-500 text-xs mb-3'>Phone: {msg.phone}</p>}

                            <div className='flex gap-3'>
                                {!msg.isRead && (
                                    <button
                                        onClick={() => handleMarkRead(msg._id)}
                                        className='flex items-center gap-1 text-green-400 hover:text-green-300 text-sm transition'
                                    >
                                        <CheckCircle size={16} /> Mark as read
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(msg._id)}
                                    className='flex items-center gap-1 text-red-400 hover:text-red-300 text-sm transition'
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ContactMessagesPanel