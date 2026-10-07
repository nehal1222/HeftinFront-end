import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { NetlifyBadge } from '@/components/ui/NetlifyBadge'
import { ROUTES } from '@/lib/constants'
import { getErrorMessage, getFieldErrors } from '@/lib/axios'
import { authService } from '@/services/auth.service'

export function ForgotPasswordPage() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Forgot Password — Heftin Academy'
    return () => {
      document.title = previousTitle
    }
  }, [])

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setFieldErrors({})
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
      const errors = getFieldErrors(requestError)
      if (errors.login && !errors.email) errors.email = errors.login
      setFieldErrors(errors)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <div className="login-background" aria-hidden="true">
        <span className="login-background-circle login-background-circle-one" />
        <span className="login-background-circle login-background-circle-two" />
        <span className="login-background-circle login-background-circle-three" />
      </div>
      <section className="login-card forgot-password-card" aria-labelledby="forgot-password-heading">
        <Link className="login-brand" to={ROUTES.HOME} aria-label="Heftin Academy home">
          <img className="login-brand-mark" src="/heftin-logo.png" alt="" />
          <span>Heftin Academy</span>
        </Link>

        {success ? (
          <div className="forgot-password-success" role="status">
            <h1 id="forgot-password-heading"><span>Check your</span><strong>inbox</strong></h1>
            <p>If an account exists for this email, a reset link is on its way.</p>
            <Link className="forgot-password-back" to={ROUTES.LOGIN}>Back to sign in</Link>
          </div>
        ) : (
          <>
            <header className="login-heading forgot-password-heading">
              <h1 id="forgot-password-heading">
                <span>Forgot</span>
                <strong>password</strong>
              </h1>
              <p>No worries — enter your email and we'll send you a link to reset it.</p>
            </header>

            <form className="forgot-password-form" onSubmit={handleSubmit} noValidate>
              {serverError && <div className="login-alert" role="alert">{serverError}</div>}
              <label className="login-field forgot-password-field" htmlFor="email">
                <span className="login-label">Email address</span>
                <span className="login-input-wrap">
                  <Mail className="login-input-icon" size={19} strokeWidth={2} aria-hidden="true" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value)
                      setError('')
                      setFieldErrors((current) => ({ ...current, email: '' }))
                    }}
                    aria-invalid={Boolean(error || fieldErrors.email)}
                    aria-describedby={error || fieldErrors.email ? 'email-error' : undefined}
                  />
                </span>
                {(error || fieldErrors.email) && <span className="login-field-error" id="email-error">{error || fieldErrors.email}</span>}
              </label>
              <Button className="login-submit forgot-password-submit" disabled={isSubmitting} type="submit">
                <span>{isSubmitting ? 'Sending...' : 'Send reset link'}</span>
                <span className="login-submit-arrow" aria-hidden="true">→</span>
              </Button>
            </form>

            <p className="forgot-password-return">
              Remembered your password?
              <Link to={ROUTES.LOGIN}>Back to sign in</Link>
            </p>
          </>
        )}
      </section>

      <NetlifyBadge />
    </main>
  )
}