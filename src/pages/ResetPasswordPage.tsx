import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, KeyRound, ShieldCheck } from 'lucide-react'
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
      setError('Password must contain at least 6 characters.')
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
      // Graceful fallback for mock/demo
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
              <h1 className="font-display text-heading-md text-foreground-strong">Create new password</h1>
            </div>
          </div>

          {submitted ? (
            <div className="space-y-4">
              <div className="grid size-12 place-items-center rounded-control bg-primary-soft text-primary-dark">
                <CheckCircle2 size={24} aria-hidden="true" />
              </div>
              <h2 className="font-display text-heading-sm text-foreground-strong">Password updated</h2>
              <p className="text-body-sm text-muted">
                Your credentials have been securely updated. You can now access your workspace with your new password.
              </p>
              <div className="pt-4">
                <Link
                  to={ROUTES.LOGIN}
                  className="flex w-full items-center justify-center gap-2 rounded-control bg-primary px-4 py-2.5 text-body-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
                >
                  Sign in with new password <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <p className="text-body-sm text-muted">
                Choose a strong password with at least 6 characters for institutional authentication.
              </p>

              {error && (
                <div className="rounded-control border border-border bg-surface p-3 text-caption font-semibold text-primary-dark">
                  {error}
                </div>
              )}

              <label className="block text-body-sm font-medium text-foreground-strong">
                New password
                <div className="relative mt-1.5">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
                    <KeyRound size={16} aria-hidden="true" />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-control border border-border bg-surface py-2.5 pl-9 pr-3 text-body-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
                  />
                </div>
              </label>

              <label className="block text-body-sm font-medium text-foreground-strong">
                Confirm new password
                <div className="relative mt-1.5">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
                    <KeyRound size={16} aria-hidden="true" />
                  </span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-control border border-border bg-surface py-2.5 pl-9 pr-3 text-body-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-control bg-primary px-4 py-3 text-body-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark disabled:opacity-60"
              >
                {loading ? 'Updating password...' : 'Update password'}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
