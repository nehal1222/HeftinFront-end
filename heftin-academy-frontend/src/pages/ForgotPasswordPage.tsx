import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, Mail, ShieldCheck } from 'lucide-react'
import { authService } from '@/services/auth.service'
import { ROUTES } from '@/lib/constants'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [message, setMessage] = useState('')

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const res = await authService.forgotPassword(email)
      setMessage(res?.message || 'Password reset link sent to your email.')
    } catch {
      setMessage('Password reset request logged. Please check your inbox.')
    } finally {
      setLoading(false)
      setSubmitted(true)
    }
  }

  return (
    <main className="min-h-screen bg-surface px-page py-section font-sans text-foreground">
      <div className="mx-auto max-w-md pt-12">
        <Link to={ROUTES.LOGIN} className="inline-flex items-center gap-2 text-body-sm font-semibold text-primary hover:text-primary-dark">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to sign in
        </Link>

        <div className="mt-8 rounded-card border border-border bg-surface-elevated p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-control bg-primary text-primary-foreground">
              <ShieldCheck size={20} aria-hidden="true" />
            </div>
            <div>
              <p className="text-caption font-semibold uppercase tracking-wider text-muted">Heftin Academy</p>
              <h1 className="font-display text-heading-md text-foreground-strong">Reset password</h1>
            </div>
          </div>

          {submitted ? (
            <div className="space-y-4">
              <div className="grid size-12 place-items-center rounded-control bg-primary-soft text-primary-dark">
                <CheckCircle2 size={24} aria-hidden="true" />
              </div>
              <h2 className="font-display text-heading-sm text-foreground-strong">Check your inbox</h2>
              <p className="text-body-sm text-muted">
                {message} If an account exists for <strong className="text-foreground-strong">{email}</strong>, you will receive instructions.
              </p>
              <div className="pt-4 space-y-2">
                <Link
                  to={`${ROUTES.RESET_PASSWORD}?email=${encodeURIComponent(email)}`}
                  className="flex w-full items-center justify-center gap-2 rounded-control bg-primary px-4 py-2.5 text-body-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
                >
                  Continue to reset form <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link
                  to={ROUTES.LOGIN}
                  className="flex w-full items-center justify-center rounded-control border border-border bg-surface px-4 py-2.5 text-body-sm font-semibold text-foreground-strong hover:border-primary hover:text-primary-dark"
                >
                  Back to sign in
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <p className="text-body-sm text-muted">
                Enter your registered email address and we will dispatch a secure reset token link.
              </p>

              <label className="block text-body-sm font-medium text-foreground-strong">
                Email address
                <div className="relative mt-1.5">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
                    <Mail size={16} aria-hidden="true" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@organization.edu"
                    className="w-full rounded-control border border-border bg-surface py-2.5 pl-9 pr-3 text-body-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-control bg-primary px-4 py-3 text-body-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark disabled:opacity-60"
              >
                {loading ? 'Sending link...' : 'Send reset link'}
                <ArrowRight size={16} aria-hidden="true" />
              </button>

              <div className="pt-2 text-center">
                <Link to={ROUTES.LOGIN} className="text-caption font-semibold text-muted hover:text-primary">
                  Remember your password? Sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
