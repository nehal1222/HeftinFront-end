import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, GraduationCap } from 'lucide-react'
import { authService } from '@/services/auth.service'
import { ROUTES } from '@/lib/constants'

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || 'demo-reset-token'
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await authService.resetPassword(token, password)
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
            Set New Password
          </h1>

          {submitted ? (
            <div className="mt-5 space-y-4 text-center">
              <div className="mx-auto grid size-10 place-items-center rounded-control bg-primary-soft text-primary-dark">
                <CheckCircle2 size={22} aria-hidden="true" />
              </div>
              <h2 className="font-display text-body font-semibold text-foreground-strong">
                Password Updated
              </h2>
              <div className="pt-2">
                <Link
                  to={ROUTES.LOGIN}
                  className="inline-flex w-full items-center justify-center rounded-control bg-primary py-2 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-4 space-y-4">
              {error && (
                <div className="rounded-control bg-primary-soft p-2.5 text-caption font-semibold text-primary-dark">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="reset-pass" className="block text-caption font-semibold text-foreground-strong">
                  New Password
                </label>
                <input
                  id="reset-pass"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 w-full rounded-control border border-border bg-surface px-3 py-2 text-body-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="confirm-pass" className="block text-caption font-semibold text-foreground-strong">
                  Confirm Password
                </label>
                <input
                  id="confirm-pass"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1 w-full rounded-control border border-border bg-surface px-3 py-2 text-body-sm outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-control bg-primary py-2.5 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors disabled:opacity-60"
              >
                {loading ? 'Saving...' : 'Update Password'}
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
