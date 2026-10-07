import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { NetlifyBadge } from '@/components/ui/NetlifyBadge'
import { ROUTES } from '@/lib/constants'
import { getErrorMessage, getFieldErrors } from '@/lib/axios'
import { authService } from '@/services/auth.service'

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Reset Password — Heftin Academy'
    return () => {
      document.title = previousTitle
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrors({})
    setFieldErrors({})
    setServerError('')
    if (!token) {
      setServerError('This reset link is missing its token. Request a new link.')
      return
    }
    if (password.length < 8) {
      setErrors({ password: 'Your password must be at least 8 characters.' })
      return
    }
    if (password !== confirmation) {
      setErrors({ password_confirmation: 'Passwords do not match.' })
      return
    }
    setIsSubmitting(true)
    try {
      await authService.resetPassword({ token, password, password_confirmation: confirmation })
      setSuccess(true)
    } catch (requestError) {
      setServerError(getErrorMessage(requestError, 'This reset link is invalid or has expired.'))
      const errors = getFieldErrors(requestError)
      if (errors.confirmation && !errors.password_confirmation) {
        errors.password_confirmation = errors.confirmation
      }
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
      <section className="login-card reset-password-card" aria-labelledby="reset-password-heading">
        <Link className="login-brand" to={ROUTES.HOME} aria-label="Heftin Academy home">
          <img className="login-brand-mark" src="/heftin-logo.png" alt="" />
          <span>Heftin Academy</span>
        </Link>

        {success ? (
          <div className="reset-password-success" role="status">
            <span className="reset-password-success-mark" aria-hidden="true">✓</span>
            <h1 id="reset-password-heading">Password updated</h1>
            <p>Your password has been changed successfully. You can now sign in with your new password.</p>
            <Link className="login-submit reset-password-success-link" to={ROUTES.LOGIN}>
              <span>Continue to sign in</span>
              <span className="login-submit-arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        ) : (
          <>
            <header className="login-heading reset-password-heading">
              <h1 id="reset-password-heading">
                <span>Reset</span>
                <strong>password</strong>
              </h1>
              <p>Choose a new password for your account.</p>
            </header>

            {serverError && <div className="login-alert" role="alert">{serverError}</div>}

            <form className="reset-password-form" onSubmit={handleSubmit} noValidate>
              <label className="login-field reset-password-field" htmlFor="new-password">
                <span className="login-label">New password</span>
                <span className="login-input-wrap">
                  <Lock className="login-input-icon" size={19} strokeWidth={2} aria-hidden="true" />
                  <Input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    placeholder="Enter new password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value)
                      setErrors((current) => ({ ...current, password: '' }))
                      setFieldErrors((current) => ({ ...current, password: '' }))
                    }}
                    aria-invalid={Boolean(errors.password || fieldErrors.password)}
                    aria-describedby={errors.password || fieldErrors.password ? 'new-password-error' : undefined}
                  />
                  <button className="login-password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide new password' : 'Show new password'} aria-controls="new-password">
                    {showPassword ? <EyeOff size={19} strokeWidth={2} /> : <Eye size={19} strokeWidth={2} />}
                  </button>
                </span>
                {(errors.password || fieldErrors.password) && <span className="login-field-error" id="new-password-error">{errors.password || fieldErrors.password}</span>}
              </label>

              <label className="login-field reset-password-field" htmlFor="password-confirmation">
                <span className="login-label">Confirm new password</span>
                <span className="login-input-wrap">
                  <Lock className="login-input-icon" size={19} strokeWidth={2} aria-hidden="true" />
                  <Input
                    id="password-confirmation"
                    type={showConfirmation ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    placeholder="Re-enter new password"
                    value={confirmation}
                    onChange={(event) => {
                      setConfirmation(event.target.value)
                      setErrors((current) => ({ ...current, password_confirmation: '' }))
                      setFieldErrors((current) => ({ ...current, password_confirmation: '' }))
                    }}
                    aria-invalid={Boolean(errors.password_confirmation || fieldErrors.password_confirmation)}
                    aria-describedby={errors.password_confirmation || fieldErrors.password_confirmation ? 'password-confirmation-error' : undefined}
                  />
                  <button className="login-password-toggle" type="button" onClick={() => setShowConfirmation((visible) => !visible)} aria-label={showConfirmation ? 'Hide confirmation password' : 'Show confirmation password'} aria-controls="password-confirmation">
                    {showConfirmation ? <EyeOff size={19} strokeWidth={2} /> : <Eye size={19} strokeWidth={2} />}
                  </button>
                </span>
                {(errors.password_confirmation || fieldErrors.password_confirmation) && <span className="login-field-error" id="password-confirmation-error">{errors.password_confirmation || fieldErrors.password_confirmation}</span>}
              </label>

              <Button className="login-submit reset-password-submit" disabled={isSubmitting} type="submit">
                <span>{isSubmitting ? 'Resetting...' : 'Reset password'}</span>
                <span className="login-submit-arrow" aria-hidden="true">→</span>
              </Button>
            </form>

            <p className="reset-password-return">
              <Link to={ROUTES.LOGIN}>Back to sign in</Link>
            </p>
          </>
        )}
      </section>

      <NetlifyBadge />
    </main>
  )
}