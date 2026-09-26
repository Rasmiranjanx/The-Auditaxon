import React, { useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'

const ResetPassword = () => {
    const { token } = useParams()
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [status, setStatus] = useState({ loading: false, success: false, error: '' })

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setStatus({ loading: false, success: false, error: 'Passwords do not match' })
            return
        }

        setStatus({ loading: true, success: false, error: '' })

        try {
            await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password })
            setStatus({ loading: false, success: true, error: '' })
            setTimeout(() => navigate('/login'), 2000)
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
                    Reset Password
                </h1>
                <p className='text-slate-400 text-sm text-center mb-8'>
                    Enter your new password below.
                </p>

                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <input
                        type='password'
                        placeholder='New Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        className='bg-black border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-white transition'
                    />

                    <input
                        type='password'
                        placeholder='Confirm New Password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={8}
                        className='bg-black border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-white transition'
                    />

                    <button
                        type='submit'
                        disabled={status.loading}
                        className='bg-white hover:bg-gray-200 transition text-black px-8 py-3 font-semibold disabled:opacity-50 mt-2'
                    >
                        {status.loading ? 'Resetting...' : 'Reset Password'}
                    </button>

                    {status.success && (
                        <p className='text-green-500 text-sm text-center'>Password reset! Redirecting to login...</p>
                    )}
                    {status.error && (
                        <p className='text-red-500 text-sm text-center'>{status.error}</p>
                    )}
                </form>
            </div>
        </div>
    )
}

export default ResetPassword