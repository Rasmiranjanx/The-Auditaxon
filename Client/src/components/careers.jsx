import React, { useState } from 'react'
import axios from 'axios'

const Careers = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobileNo: '',
        gender: '',
        positionAppliedFor: '',
        dateOfBirth: '',
        highestQualification: '',
        portfolioWebsite: '',
        lastCompany: '',
        experienceYears: '',
        experienceMonths: '',
        referenceComments: '',
    })
    const [resumeFile, setResumeFile] = useState(null)
    const [status, setStatus] = useState({ loading: false, success: false, error: '' })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleFileChange = (e) => {
        setResumeFile(e.target.files[0])
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!resumeFile) {
            setStatus({ loading: false, success: false, error: 'Please upload your resume' })
            return
        }

        setStatus({ loading: true, success: false, error: '' })

        const data = new FormData()
        Object.keys(formData).forEach((key) => data.append(key, formData[key]))
        data.append('resume', resumeFile)

        try {
            await axios.post('http://localhost:5000/api/careers/apply', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            setStatus({ loading: false, success: true, error: '' })
            setFormData({
                firstName: '', lastName: '', email: '', mobileNo: '', gender: '',
                positionAppliedFor: '', dateOfBirth: '', highestQualification: '',
                portfolioWebsite: '', lastCompany: '', experienceYears: '',
                experienceMonths: '', referenceComments: '',
            })
            setResumeFile(null)
        } catch (err) {
            setStatus({
                loading: false,
                success: false,
                error: err.response?.data?.message || 'Failed to submit application. Please try again.',
            })
        }
    }

    const inputClass = 'border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-slate-900 transition w-full'

    return (
        <div id="careers" className='min-h-screen py-20 px-6 md:px-20 lg:px-32 bg-white flex flex-col justify-center'>
            <div className='text-center mb-12'>
                <h2 className='text-3xl md:text-4xl font-bold text-slate-900' style={{ fontFamily: "'Playfair Display', serif" }}>
                    Careers
                </h2>
                <p className='text-slate-500 mt-3 max-w-2xl mx-auto'>
                    Join our team. We're always looking for talented individuals to grow with us.
                </p>
            </div>

            <form onSubmit={handleSubmit} className='max-w-3xl mx-auto w-full flex flex-col gap-4'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <input type='text' name='firstName' placeholder='First Name *' value={formData.firstName} onChange={handleChange} required className={inputClass} />
                    <input type='text' name='lastName' placeholder='Last Name *' value={formData.lastName} onChange={handleChange} required className={inputClass} />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <input type='email' name='email' placeholder='Email *' value={formData.email} onChange={handleChange} required className={inputClass} />
                    <input type='tel' name='mobileNo' placeholder='Mobile No *' value={formData.mobileNo} onChange={handleChange} required className={inputClass} />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <select name='gender' value={formData.gender} onChange={handleChange} required className={inputClass}>
                        <option value=''>Gender *</option>
                        <option value='male'>Male</option>
                        <option value='female'>Female</option>
                    </select>
                    <input type='text' name='positionAppliedFor' placeholder='Position Applying For' value={formData.positionAppliedFor} onChange={handleChange} className={inputClass} />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <input type='date' name='dateOfBirth' value={formData.dateOfBirth} onChange={handleChange} className={inputClass} />
                    <input type='text' name='highestQualification' placeholder='Highest Qualification' value={formData.highestQualification} onChange={handleChange} className={inputClass} />
                </div>

                <input type='url' name='portfolioWebsite' placeholder='Portfolio Website (optional)' value={formData.portfolioWebsite} onChange={handleChange} className={inputClass} />

                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                    <input type='text' name='lastCompany' placeholder='Last Company' value={formData.lastCompany} onChange={handleChange} className={inputClass} />
                    <input type='number' name='experienceYears' placeholder='Experience (Years)' value={formData.experienceYears} onChange={handleChange} min='0' className={inputClass} />
                    <input type='number' name='experienceMonths' placeholder='Experience (Months)' value={formData.experienceMonths} onChange={handleChange} min='0' max='11' className={inputClass} />
                </div>

                <textarea name='referenceComments' placeholder='Reference / Comments' value={formData.referenceComments} onChange={handleChange} rows={4} className={inputClass}></textarea>

                <div>
                    <label className='block text-sm text-slate-600 mb-2'>Upload Resume * (PDF/DOC/DOCX, max 1MB)</label>
                    <input type='file' accept='.pdf,.doc,.docx' onChange={handleFileChange} required className={inputClass} />
                </div>

                <button
                    type='submit'
                    disabled={status.loading}
                    className='bg-slate-900 hover:bg-slate-800 transition text-white px-8 py-3 font-semibold disabled:opacity-50 mt-2'
                >
                    {status.loading ? 'Submitting...' : 'Apply Now'}
                </button>

                {status.success && (
                    <p className='text-green-600 text-sm text-center'>Application submitted successfully! We'll be in touch.</p>
                )}
                {status.error && (
                    <p className='text-red-600 text-sm text-center'>{status.error}</p>
                )}
            </form>
        </div>
    )
}

export default Careers