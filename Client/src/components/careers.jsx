import React, { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, CircleAlert, CircleCheck, FileText, Mail, X } from 'lucide-react'
import api from '../lib/api'
import siteConfig, { hasValue } from '../config/site'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'

const MAX_RESUME_BYTES = 1 * 1024 * 1024
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx']

// "How to apply" copy: describes the form below and the resume files it accepts.
const applySteps = [
  {
    title: 'Share your details',
    text: "Tell us who you are, the role you're applying for and the experience you bring.",
  },
  {
    title: 'Attach your resume',
    text: 'Upload your resume as a PDF, DOC or DOCX file of up to 1\u00a0MB.',
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
  const [genderOpen, setGenderOpen] = useState(false)
  const [status, setStatus] = useState({ loading: false, success: false, error: '' })
  const fileInputRef = useRef(null)
  const genderMenuRef = useRef(null)

  useEffect(() => {
    if (!genderOpen) return undefined
    const onPointerDown = (e) => {
      if (genderMenuRef.current && !genderMenuRef.current.contains(e.target)) {
        setGenderOpen(false)
      }
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setGenderOpen(false)
    }
    window.addEventListener('mousedown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('mousedown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [genderOpen])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const clearResume = () => {
    setResumeFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) {
      setResumeFile(null)
      return
    }
    const lowerName = file.name.toLowerCase()
    if (!ALLOWED_EXTENSIONS.some((ext) => lowerName.endsWith(ext))) {
      clearResume()
      setStatus({
        loading: false,
        success: false,
        error: 'Resume must be a PDF, DOC, or DOCX file.',
      })
      return
    }
    if (file.size > MAX_RESUME_BYTES) {
      clearResume()
      setStatus({
        loading: false,
        success: false,
        error: 'Resume file size must be 1 MB or smaller.',
      })
      return
    }
    setStatus((prev) => (prev.error ? { ...prev, error: '' } : prev))
    setResumeFile(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.gender) {
      setStatus({ loading: false, success: false, error: 'Please select your gender' })
      return
    }

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
      clearResume()
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || 'Failed to submit application. Please try again.',
      })
    }
  }

  return (
    <section id="careers" className="section bg-paper">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5 lg:self-start lg:[@media(min-height:50rem)]:sticky lg:[@media(min-height:50rem)]:top-28">
            <SectionHeader
              align="left"
              eyebrow="Careers"
              title="Careers"
              lead="Join our team. We're always looking for talented individuals to grow with us."
            />

            <div className="mt-10">
              <h3 className="text-lg font-semibold text-ink">How to apply</h3>
              <ol role="list" className="mt-6">
                {applySteps.map((step, index) => (
                  <li key={step.title} className="relative flex gap-4 pb-7 last:pb-0">
                    {index < applySteps.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="absolute top-12 bottom-2 left-4.5 w-px bg-navy-200/70"
                      />
                    )}
                    <StepNumber>{index + 1}</StepNumber>
                    <div className="pt-2">
                      <p className="font-semibold text-ink">{step.title}</p>
                      <p className="mt-1 text-[15px] leading-relaxed text-slate-600">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {hasValue(siteConfig.contact.careersEmail) && (
              <div className="mt-10 flex items-center gap-4 border-t border-paper-edge pt-8">
                <span className="icon-tile bg-white">
                  <Mail size={22} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <p className="text-[15px] leading-relaxed text-slate-600">
                  <span className="block font-semibold text-ink">Prefer email?</span>
                  Write to{' '}
                  <a href={`mailto:${siteConfig.contact.careersEmail}`} className="link">
                    {siteConfig.contact.careersEmail}
                  </a>
                </p>
              </div>
            )}
          </Reveal>

          {/* Application form */}
          <Reveal delay={80} className="lg:col-span-7">
            <div className="card-luxury p-6 sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 id="careers-form-title" className="text-lg font-semibold text-ink">
                  Application form
                </h3>
                <p className="text-xs text-slate-500">
                  Fields marked <span className="font-semibold text-gold-700">*</span> are required
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                aria-labelledby="careers-form-title"
                className="mt-7 space-y-8"
              >
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
                        autoComplete="given-name"
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
                        autoComplete="family-name"
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
                        autoComplete="email"
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
                        autoComplete="tel"
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
                      <div ref={genderMenuRef} className="relative">
                        <input
                          type="text"
                          tabIndex={-1}
                          aria-hidden="true"
                          required
                          value={formData.gender}
                          onChange={() => {}}
                          className="pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-0"
                        />
                        <button
                          id="careers-gender"
                          type="button"
                          aria-haspopup="listbox"
                          aria-expanded={genderOpen}
                          onClick={() => setGenderOpen((prev) => !prev)}
                          className={[
                            'form-control flex items-center justify-between gap-2 text-left',
                            formData.gender ? 'text-ink' : 'text-slate-400',
                          ].join(' ')}
                        >
                          <span className="truncate">
                            {formData.gender === 'male'
                              ? 'Male'
                              : formData.gender === 'female'
                                ? 'Female'
                                : 'Select gender'}
                          </span>
                          <ChevronDown
                            size={18}
                            aria-hidden="true"
                            className={[
                              'shrink-0 text-slate-400 transition-transform duration-150',
                              genderOpen && 'rotate-180 text-navy-800',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                          />
                        </button>

                        {genderOpen && (
                          <ul
                            role="listbox"
                            aria-labelledby="careers-gender"
                            className="absolute z-20 mt-1.5 w-full overflow-hidden rounded border border-paper-edge bg-white py-1 shadow-lg"
                          >
                            {[
                              { value: 'male', label: 'Male' },
                              { value: 'female', label: 'Female' },
                            ].map((opt) => {
                              const selected = formData.gender === opt.value
                              return (
                                <li key={opt.value} role="option" aria-selected={selected}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFormData((prev) => ({ ...prev, gender: opt.value }))
                                      setGenderOpen(false)
                                    }}
                                    className={[
                                      'flex w-full items-center justify-between px-3.5 py-2 text-left text-[15px] transition-colors hover:bg-paper',
                                      selected ? 'font-medium text-navy-900' : 'text-ink',
                                    ].join(' ')}
                                  >
                                    <span>{opt.label}</span>
                                    {selected && (
                                      <Check
                                        size={15}
                                        className="shrink-0 text-gold-600"
                                        aria-hidden="true"
                                      />
                                    )}
                                  </button>
                                </li>
                              )
                            })}
                          </ul>
                        )}
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
                        autoComplete="bday"
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
                        autoComplete="organization"
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
                        autoComplete="url"
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
                      ref={fileInputRef}
                      id="careers-resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      required
                      aria-describedby="careers-resume-hint"
                      className="form-file"
                    />
                    {resumeFile && (
                      <div className="mt-2.5 flex items-center justify-between gap-3 rounded-md border border-navy-100 bg-navy-50/70 px-3 py-2 text-xs text-navy-800">
                        <span className="inline-flex min-w-0 items-center gap-2 font-medium">
                          <FileText
                            size={14}
                            className="shrink-0 text-gold-700"
                            aria-hidden="true"
                          />
                          <span className="truncate">{resumeFile.name}</span>
                          <span className="shrink-0 text-slate-500">
                            ({Math.max(1, Math.round(resumeFile.size / 1024))} KB)
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={clearResume}
                          aria-label="Remove selected resume"
                          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-slate-500 transition-colors hover:bg-navy-100 hover:text-navy-900"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                    <p id="careers-resume-hint" className="form-hint">
                      Accepted formats: PDF, DOC or DOCX, up to 1&nbsp;MB.
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
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default Careers
