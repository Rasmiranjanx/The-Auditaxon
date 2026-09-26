import React, { useState } from 'react'
import axios from 'axios'

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [status, setStatus] = useState({ loading: false, error: '' })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus({ loading: true, error: '' })

        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData)
            localStorage.setItem('adminToken', res.data.token)
            localStorage.setItem('adminName', res.data.name)
            window.location.href = '/admin/dashboard'
        } catch (err) {
            setStatus({
                loading: false,
                error: err.response?.data?.message || 'Login failed. Please try again.',
            })
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-black px-6'>
            <div className='w-full max-w-md bg-slate-900/50 border border-slate-800 rounded-lg p-8'>
                <h1 className='text-2xl font-bold text-white text-center mb-2' style={{ fontFamily: "'Playfair Display', serif" }}>
                    Admin Login
                </h1>
                <p className='text-slate-400 text-sm text-center mb-8'>
                    The Auditaxon — Management Panel
                </p>

                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <input
                        type='email'
                        name='email'
                        placeholder='Email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className='bg-black border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-white transition'
                    />

                    <input
                        type='password'
                        name='password'
                        placeholder='Password'
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className='bg-black border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-white transition'
                    />

                    <button
                        type='submit'
                        disabled={status.loading}
                        className='bg-white hover:bg-gray-200 transition text-black px-8 py-3 font-semibold disabled:opacity-50 mt-2'
                    >
                        {status.loading ? 'Logging in...' : 'Login'}
                    </button>

                    {status.error && (
                        <p className='text-red-500 text-sm text-center'>{status.error}</p>
                    )}

                    <a href='/forgot-password' className='text-slate-400 text-sm text-center hover:text-white transition mt-2'>
                        Forgot Password?
                    </a>
                </form>
            </div>
        </div>
    )
}

export default Login