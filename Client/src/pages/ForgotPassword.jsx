import React, { useState } from 'react'
import api from '../lib/api'
import { Link } from 'react-router-dom'
import { ArrowLeft, CircleAlert, CircleCheck } from 'lucide-react'
import siteConfig from '../config/site'
import BrandMark from '../components/ui/BrandMark'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState({ loading: false, success: false, error: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ loading: true, success: false, error: '' })

    try {
      await api.post('/auth/forgot-password', { email })
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
    <div className="min-h-dvh bg-white lg:grid lg:grid-cols-2">
      {/* Brand panel (lg and up) */}
      <aside className="relative hidden overflow-hidden bg-navy-900 text-white lg:flex lg:flex-col">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--color-navy-700)_0%,transparent_65%)]"
        />
        <div
          aria-hidden="true"
          className="pattern-hex pattern-fade pointer-events-none absolute inset-0"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-48 -bottom-48 size-[36rem] rounded-full bg-[radial-gradient(circle,var(--color-gold-500)_0%,transparent_65%)] opacity-10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gold-500/20"
        />

        <div className="relative flex flex-1 flex-col p-10 xl:p-14">
          <Link
            to="/"
            className="self-start rounded-lg focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-4 focus-visible:ring-offset-navy-900 focus-visible:outline-none"
          >
            <BrandMark onDark size="lg" />
          </Link>

          <div className="my-auto max-w-md py-16">
            <p className="eyebrow eyebrow-on-dark">Account recovery</p>
            <p className="mt-5 font-display text-4xl leading-[1.1] font-semibold tracking-tight text-white xl:text-5xl">
              Management Panel
            </p>
            <p className="mt-5 text-base leading-relaxed text-navy-100/80">
              Request a reset link by email, then choose a new password to get back into the panel.
            </p>
          </div>

          <p className="border-t border-white/10 pt-6 text-xs font-semibold tracking-[0.24em] text-gold-400 uppercase">
            Expertise · Precision · Integrity
          </p>
        </div>
      </aside>

      {/* Form column */}
      <main className="flex min-h-dvh flex-col px-5 py-6 sm:px-8 lg:py-10 xl:px-12 xl:py-14">
        <div className="mx-auto flex w-full max-w-md items-center lg:min-h-14">
          <Link to="/" className="link -mx-2 inline-flex min-h-10 items-center gap-1.5 px-2 text-sm">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to website
          </Link>
        </div>

        <div className="flex flex-1 flex-col py-8 sm:justify-center sm:py-12">
          <div className="mx-auto w-full max-w-md">
            <BrandMark className="mb-10 lg:hidden" />

            <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
              Forgot Password
            </h1>
            <p className="mt-2 text-base text-pretty text-slate-600">
              Enter your email and we'll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {status.success && (
                <div role="alert" className="alert alert-success">
                  <CircleCheck size={18} aria-hidden="true" className="mt-px shrink-0" />
                  <p>If that email exists, a reset link has been sent.</p>
                </div>
              )}
              {status.error && (
                <div role="alert" className="alert alert-error">
                  <CircleAlert size={18} aria-hidden="true" className="mt-px shrink-0" />
                  <p>{status.error}</p>
                </div>
              )}

              <div>
                <label htmlFor="forgot-email" className="form-label">
                  Email address
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-control"
                />
              </div>

              <button type="submit" disabled={status.loading} className="btn btn-primary w-full">
                {status.loading ? 'Sending…' : 'Send reset link'}
              </button>

              <p className="text-center text-sm">
                <Link to="/login" className="link inline-flex min-h-10 items-center px-2">
                  Back to login
                </Link>
              </p>
            </form>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md space-y-2 border-t border-slate-200 pt-5 lg:border-t-0 lg:pt-0">
          <p className="text-xs font-semibold tracking-[0.2em] text-gold-700 uppercase lg:hidden">
            Expertise · Precision · Integrity
          </p>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  )
}

export default ForgotPassword
