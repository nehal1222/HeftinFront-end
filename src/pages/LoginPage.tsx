import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { ROUTES, STORAGE_KEYS } from '@/lib/constants'
import { getErrorMessage } from '@/lib/axios'
import { authService } from '@/services/auth.service'

export function LoginPage() {
  const navigate = useNavigate()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!login.trim()) nextErrors.login = 'Enter your email or mobile number.'
    if (!password) nextErrors.password = 'Enter your password.'
    setErrors(nextErrors)
    setServerError('')
    if (Object.keys(nextErrors).length) return

    setIsSubmitting(true)
    try {
      const response = await authService.login({ login: login.trim(), password })
      if (response.access_token) localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.access_token)
      if (response.refresh_token) localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refresh_token)
      navigate(ROUTES.HOME)
    } catch (error) {
      setServerError(getErrorMessage(error, 'We could not sign you in. Check your details and try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground-strong">Welcome back</h1>
      <p className="mt-2 text-sm text-muted">Sign in to continue your preparation.</p>
      <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
        {serverError && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{serverError}</div>}
        <label className="block text-sm font-medium text-foreground" htmlFor="login">Email or mobile number
          <input className="mt-2 block w-full rounded-xl border border-border bg-surface-elevated px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20" id="login" value={login} onChange={(event) => setLogin(event.target.value)} aria-invalid={Boolean(errors.login)} />
          {errors.login && <span className="mt-1 block text-xs text-red-600">{errors.login}</span>}
        </label>
        <label className="block text-sm font-medium text-foreground" htmlFor="password">Password
          <input className="mt-2 block w-full rounded-xl border border-border bg-surface-elevated px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20" id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} aria-invalid={Boolean(errors.password)} />
          {errors.password && <span className="mt-1 block text-xs text-red-600">{errors.password}</span>}
        </label>
        <div className="flex justify-end"><Link className="text-sm font-medium text-primary hover:underline" to={ROUTES.FORGOT_PASSWORD}>Forgot password?</Link></div>
        <button className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit">{isSubmitting ? 'Signing in...' : 'Sign in'}</button>
      </form>
    </AuthLayout>
  )
}