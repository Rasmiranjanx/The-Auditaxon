import React, { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState({ loading: false, success: false, error: '' })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus({ loading: true, success: false, error: '' })

        try {
            await axios.post('http://localhost:5000/api/auth/forgot-password', { email })
            setStatus({ loading: false, success: true, error: '' })
        } catch (err) {
            setStatus({
                loading: false,
                success: false,
                error: err.response?.data?.message || 'Something went wrong. Please try again.',
            })
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-black px-6'>
            <div className='w-full max-w-md bg-slate-900/50 border border-slate-800 rounded-lg p-8'>
                <h1 className='text-2xl font-bold text-white text-center mb-2' style={{ fontFamily: "'Playfair Display', serif" }}>
                    Forgot Password
                </h1>
                <p className='text-slate-400 text-sm text-center mb-8'>
                    Enter your email and we'll send you a reset link.
                </p>

                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <input
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className='bg-black border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-white transition'
                    />

                    <button
                        type='submit'
                        disabled={status.loading}
                        className='bg-white hover:bg-gray-200 transition text-black px-8 py-3 font-semibold disabled:opacity-50 mt-2'
                    >
                        {status.loading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                    {status.success && (
                        <p className='text-green-500 text-sm text-center'>
                            If that email exists, a reset link has been sent.
                        </p>
                    )}
                    {status.error && (
                        <p className='text-red-500 text-sm text-center'>{status.error}</p>
                    )}

                    <Link to='/login' className='text-slate-400 text-sm text-center hover:text-white transition mt-2'>
                        Back to Login
                    </Link>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword