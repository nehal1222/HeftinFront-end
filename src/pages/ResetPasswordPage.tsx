import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { ROUTES } from '@/lib/constants'
import { getErrorMessage } from '@/lib/axios'
import { authService } from '@/services/auth.service'

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setServerError('')
    if (!token) {
      setError('This reset link is missing its token. Request a new link.')
      return
    }
    if (password.length < 8) {
      setError('Your password must be at least 8 characters.')
      return
    }
    if (password !== confirmation) {
      setError('Passwords do not match.')
      return
    }
    setIsSubmitting(true)
    try {
      await authService.resetPassword({ token, password, password_confirmation: confirmation })
      setSuccess(true)
    } catch (requestError) {
      setServerError(getErrorMessage(requestError, 'This reset link is invalid or has expired.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground-strong">Create a new password</h1>
      <p className="mt-2 text-sm text-muted">Choose a strong password you have not used before.</p>
      <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
        {serverError && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{serverError}</div>}
        {success && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">Your password has been reset successfully.</div>}
        {!token && <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="alert">This page needs a reset token from your email link.</div>}
        <label className="block text-sm font-medium text-foreground" htmlFor="new-password">New password
          <input className="mt-2 block w-full rounded-xl border border-border bg-surface-elevated px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20" id="new-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} aria-invalid={Boolean(error)} />
        </label>
        <label className="block text-sm font-medium text-foreground" htmlFor="password-confirmation">Confirm new password
          <input className="mt-2 block w-full rounded-xl border border-border bg-surface-elevated px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20" id="password-confirmation" type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} aria-invalid={Boolean(error)} />
          {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
        </label>
        <button className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting || success} type="submit">{isSubmitting ? 'Resetting...' : 'Reset password'}</button>
      </form>
      <Link className="mt-6 block text-center text-sm font-medium text-primary hover:underline" to={ROUTES.LOGIN}>Back to sign in</Link>
    </AuthLayout>
  )
}