import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, GraduationCap } from 'lucide-react'
import { authService } from '@/services/auth.service'
import { ROUTES } from '@/lib/constants'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await authService.forgotPassword(email)
    } catch {
      // Continue locally
    } finally {
      setLoading(false)
      setSubmitted(true)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-8 text-foreground font-sans">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-control bg-primary text-primary-foreground shadow-sm">
            <GraduationCap size={20} aria-hidden="true" />
          </div>
          <span className="font-display text-heading-sm font-semibold text-foreground-strong">
            Heftin Academy
          </span>
        </div>

        <div className="rounded-card border border-border bg-surface-elevated p-6 shadow-sm">
          <h1 className="font-display text-heading-sm font-semibold text-foreground-strong">
            Reset Password
          </h1>

          {submitted ? (
            <div className="mt-5 space-y-4 text-center">
              <div className="mx-auto grid size-10 place-items-center rounded-control bg-primary-soft text-primary-dark">
                <CheckCircle2 size={22} aria-hidden="true" />
              </div>
              <h2 className="font-display text-body font-semibold text-foreground-strong">
                Instructions Sent
              </h2>
              <div className="space-y-2 pt-2">
                <Link
                  to={`${ROUTES.RESET_PASSWORD}?email=${encodeURIComponent(email)}`}
                  className="flex w-full items-center justify-center gap-1.5 rounded-control bg-primary py-2 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors"
                >
                  Set New Password <ArrowRight size={14} aria-hidden="true" />
                </Link>
                <Link
                  to={ROUTES.LOGIN}
                  className="block text-caption font-medium text-muted hover:text-foreground"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="forgot-email" className="block text-caption font-semibold text-foreground-strong">
                  Email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full rounded-control border border-border bg-surface px-3 py-2 text-body-sm outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-control bg-primary py-2.5 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors disabled:opacity-60"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          <div className="mt-5 border-t border-border pt-3 text-center">
            <Link
              to={ROUTES.LOGIN}
              className="text-caption font-medium text-muted hover:text-primary transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
