import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { ROUTES } from '@/lib/constants'
import { getErrorMessage } from '@/lib/axios'
import { authService } from '@/services/auth.service'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setServerError('')
    setSuccess(false)
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Enter a valid email address.')
      return
    }
    setIsSubmitting(true)
    try {
      await authService.forgotPassword({ email: email.trim() })
      setSuccess(true)
    } catch (requestError) {
      setServerError(getErrorMessage(requestError, 'We could not send the reset email. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground-strong">Forgot your password?</h1>
      <p className="mt-2 text-sm text-muted">Enter your account email and we will send a secure reset link.</p>
      <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
        {serverError && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{serverError}</div>}
        {success && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">If an account exists for this email, a reset link is on its way.</div>}
        <label className="block text-sm font-medium text-foreground" htmlFor="email">Email address
          <input className="mt-2 block w-full rounded-xl border border-border bg-surface-elevated px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20" id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} aria-invalid={Boolean(error)} />
          {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
        </label>
        <button className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit">{isSubmitting ? 'Sending...' : 'Send reset link'}</button>
      </form>
      <Link className="mt-6 block text-center text-sm font-medium text-primary hover:underline" to={ROUTES.LOGIN}>Back to sign in</Link>
    </AuthLayout>
  )
}