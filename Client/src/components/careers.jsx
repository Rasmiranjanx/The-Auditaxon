import React, { useState } from 'react'
import { ChevronDown, CircleAlert, CircleCheck, Mail } from 'lucide-react'
import api from '../lib/api'
import siteConfig, { hasValue } from '../config/site'
import SectionHeader from './ui/SectionHeader'

// "How to apply" copy: describes the form below and the resume files it accepts.
const applySteps = [
  {
    title: 'Share your details',
    text: "Tell us who you are, the role you're applying for and the experience you bring.",
  },
  {
    title: 'Attach your resume',
    text: 'Upload your resume as a PDF, DOC or DOCX file of up to 1 MB.',
  },
  {
    title: 'Submit your application',
    text: "Select Apply Now. You'll see a confirmation here once it's received, and we'll be in touch.",
  },
]

// Step number inside a hexagon outline, echoing the logo mark.
const StepNumber = ({ children }) => (
  <span className="relative flex h-10 w-9 shrink-0 items-center justify-center">
    <svg
      viewBox="0 0 36 40"
      className="absolute inset-0 h-full w-full text-navy-800"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M18 1.5 34 10.75v18.5L18 38.5 2 29.25v-18.5Z"
        fill="#fff"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
    <span className="relative font-display text-base font-semibold text-gold-700 lining-nums">
      {children}
    </span>
  </span>
)

// Small uppercase group heading with a hairline rule running to the right.
const GroupLegend = ({ children }) => (
  <legend className="w-full">
    <span className="flex items-center gap-3 text-xs font-semibold tracking-wider text-slate-500 uppercase after:h-px after:flex-1 after:bg-slate-200">
      {children}
    </span>
  </legend>
)

const RequiredMark = () => (
  <span className="ml-0.5 text-gold-700" aria-hidden="true">
    *
  </span>
)

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
      await api.post('/careers/apply', data)
      setStatus({ loading: false, success: true, error: '' })
      setFormData({
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
      setResumeFile(null)
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || 'Failed to submit application. Please try again.',
      })
    }
  }

  return (
    <section id="careers" className="section bg-white">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Intro, how to apply and the email alternative */}
          <div className="lg:col-span-5">
            <SectionHeader
              align="left"
              eyebrow="Work with us"
              title="Careers"
              lead="Join our team. We're always looking for talented individuals to grow with us."
            />

            <div className="mt-10">
              <h3 className="text-lg font-semibold text-ink">How to apply</h3>
              <ol className="mt-6">
                {applySteps.map((step, index) => (
                  <li key={step.title} className="relative flex gap-4 pb-7 last:pb-0">
                    {index < applySteps.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="absolute top-12 bottom-2 left-4.5 w-px bg-navy-100"
                      />
                    )}
                    <StepNumber>{index + 1}</StepNumber>
                    <div className="pt-2">
                      <p className="font-semibold text-ink">{step.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {hasValue(siteConfig.contact.careersEmail) && (
              <div className="mt-10 flex items-center gap-4 border-t border-slate-200 pt-8">
                <span className="icon-tile">
                  <Mail size={22} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <p className="text-sm leading-relaxed text-slate-600">
                  <span className="block font-semibold text-ink">Prefer email?</span>
                  Write to{' '}
                  <a href={`mailto:${siteConfig.contact.careersEmail}`} className="link break-all">
                    {siteConfig.contact.careersEmail}
                  </a>
                </p>
              </div>
            )}
          </div>

          {/* Application form */}
          <div className="lg:col-span-7">
            <div className="card p-6 sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-lg font-semibold text-ink">Application form</h3>
                <p className="text-xs text-slate-500">
                  Fields marked <span className="font-semibold text-gold-700">*</span> are required
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-7 space-y-8">
                <fieldset className="min-w-0">
                  <GroupLegend>Personal details</GroupLegend>
                  <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="careers-firstName" className="form-label">
                        First name
                        <RequiredMark />
                      </label>
                      <input
                        id="careers-firstName"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label htmlFor="careers-lastName" className="form-label">
                        Last name
                        <RequiredMark />
                      </label>
                      <input
                        id="careers-lastName"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label htmlFor="careers-email" className="form-label">
                        Email address
                        <RequiredMark />
                      </label>
                      <input
                        id="careers-email"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label htmlFor="careers-mobileNo" className="form-label">
                        Mobile number
                        <RequiredMark />
                      </label>
                      <input
                        id="careers-mobileNo"
                        type="tel"
                        name="mobileNo"
                        value={formData.mobileNo}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label htmlFor="careers-gender" className="form-label">
                        Gender
                        <RequiredMark />
                      </label>
                      <div className="relative">
                        <select
                          id="careers-gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          required
                          className={`form-control appearance-none pr-10 [&_option]:text-ink ${formData.gender ? '' : 'text-slate-500'}`}
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                        <ChevronDown
                          size={18}
                          aria-hidden="true"
                          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="careers-dateOfBirth" className="form-label">
                        Date of birth
                      </label>
                      <input
                        id="careers-dateOfBirth"
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className={`form-control ${formData.dateOfBirth ? '' : 'text-slate-500'}`}
                      />
                    </div>
                  </div>
                </fieldset>

                <fieldset className="min-w-0">
                  <GroupLegend>Professional details</GroupLegend>
                  <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="careers-positionAppliedFor" className="form-label">
                        Position applying for
                      </label>
                      <input
                        id="careers-positionAppliedFor"
                        type="text"
                        name="positionAppliedFor"
                        value={formData.positionAppliedFor}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label htmlFor="careers-highestQualification" className="form-label">
                        Highest qualification
                      </label>
                      <input
                        id="careers-highestQualification"
                        type="text"
                        name="highestQualification"
                        value={formData.highestQualification}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label htmlFor="careers-lastCompany" className="form-label">
                        Last company
                      </label>
                      <input
                        id="careers-lastCompany"
                        type="text"
                        name="lastCompany"
                        value={formData.lastCompany}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label htmlFor="careers-portfolioWebsite" className="form-label">
                        Portfolio website
                      </label>
                      <input
                        id="careers-portfolioWebsite"
                        type="url"
                        name="portfolioWebsite"
                        placeholder="https://"
                        value={formData.portfolioWebsite}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label htmlFor="careers-experienceYears" className="form-label">
                        Experience (years)
                      </label>
                      <input
                        id="careers-experienceYears"
                        type="number"
                        name="experienceYears"
                        value={formData.experienceYears}
                        onChange={handleChange}
                        min="0"
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label htmlFor="careers-experienceMonths" className="form-label">
                        Experience (months)
                      </label>
                      <input
                        id="careers-experienceMonths"
                        type="number"
                        name="experienceMonths"
                        value={formData.experienceMonths}
                        onChange={handleChange}
                        min="0"
                        max="11"
                        className="form-control"
                      />
                    </div>
                  </div>
                </fieldset>

                <fieldset className="min-w-0">
                  <GroupLegend>Additional information</GroupLegend>
                  <div className="mt-5">
                    <label htmlFor="careers-referenceComments" className="form-label">
                      Reference / comments
                    </label>
                    <textarea
                      id="careers-referenceComments"
                      name="referenceComments"
                      placeholder="Anything else you'd like us to know"
                      value={formData.referenceComments}
                      onChange={handleChange}
                      rows={4}
                      className="form-control resize-y"
                    ></textarea>
                  </div>
                </fieldset>

                <fieldset className="min-w-0">
                  <GroupLegend>Resume</GroupLegend>
                  <div className="mt-5">
                    <label htmlFor="careers-resume" className="form-label">
                      Upload your resume
                      <RequiredMark />
                    </label>
                    <input
                      id="careers-resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      required
                      aria-describedby="careers-resume-hint"
                      className="form-file"
                    />
                    <p id="careers-resume-hint" className="form-hint">
                      Accepted formats: PDF, DOC or DOCX, up to 1 MB.
                    </p>
                  </div>
                </fieldset>

                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={status.loading}
                    className="btn btn-primary w-full"
                  >
                    {status.loading ? 'Submitting...' : 'Apply Now'}
                  </button>

                  {status.success && (
                    <p role="status" className="alert alert-success">
                      <CircleCheck size={18} className="mt-px shrink-0" aria-hidden="true" />
                      <span>Application submitted successfully! We'll be in touch.</span>
                    </p>
                  )}
                  {status.error && (
                    <p role="alert" className="alert alert-error">
                      <CircleAlert size={18} className="mt-px shrink-0" aria-hidden="true" />
                      <span>{status.error}</span>
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Careers
