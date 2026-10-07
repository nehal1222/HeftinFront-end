import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ROUTES } from '@/lib/constants'
import { getErrorMessage, getFieldErrors } from '@/lib/axios'
import { setTokens } from '@/lib/storage'
import { authService } from '@/services/auth.service'

type AccountType = 'organization' | 'individual'

export function LoginPage() {
  const navigate = useNavigate()
  const [accountType, setAccountType] = useState<AccountType>('organization')
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
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
      if (typeof response.access_token !== 'string' || !response.access_token.trim()) {
        throw new Error('Sign-in failed because the server did not return an access token.')
      }
      setTokens(response.access_token, response.refresh_token, rememberMe)
      navigate(ROUTES.DASHBOARD, { replace: true })
    } catch (error) {
      setServerError(getErrorMessage(error, 'We could not sign you in. Check your details and try again.'))
      const fieldErrors = getFieldErrors(error)
      if (fieldErrors.email && !fieldErrors.login) fieldErrors.login = fieldErrors.email
      if (fieldErrors.mobile && !fieldErrors.login) fieldErrors.login = fieldErrors.mobile
      if (fieldErrors.phone && !fieldErrors.login) fieldErrors.login = fieldErrors.phone
      setErrors(fieldErrors)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
        <header className="login-heading">
          <h1 id="login-heading">
            <span>Welcome</span>
            <strong>back</strong>
          </h1>
          <p>Sign in to continue to your account</p>
        </header>

        <div className="account-switch" role="group" aria-label="Choose account type">
          <button className={accountType === 'organization' ? 'active' : ''} type="button" aria-pressed={accountType === 'organization'} onClick={() => setAccountType('organization')}>
            Organization
          </button>
          <button className={accountType === 'individual' ? 'active' : ''} type="button" aria-pressed={accountType === 'individual'} onClick={() => setAccountType('individual')}>
            Individual
          </button>
        </div>

        {accountType === 'individual' ? (
          <section className="individual-portal" aria-labelledby="individual-portal-heading">
            <span className="individual-portal-label">Individual Portal</span>
            <h2 id="individual-portal-heading">Individual Learner Portal</h2>
            <p>
              Individual accounts and personal test series are scheduled for general release. Heftin is
              currently configured for organization-managed access.
            </p>
            <button type="button" className="individual-portal-back" onClick={() => setAccountType('organization')}>
              ← Back to Organization Login
            </button>
          </section>
        ) : (
          <>
            <form className="login-form" onSubmit={handleSubmit} noValidate>
              {serverError && <div className="login-alert" role="alert">{serverError}</div>}

              <label className="login-field" htmlFor="login">
                <span className="login-label">Email or mobile number</span>
                <span className="login-input-wrap">
                  <Mail className="login-input-icon" size={19} strokeWidth={2} aria-hidden="true" />
                  <Input
                    id="login"
                    type="text"
                    autoComplete="username"
                    required
                    aria-label="Email or mobile number"
                    placeholder="Email or mobile number"
                    value={login}
                    onChange={(event) => {
                      setLogin(event.target.value)
                      setErrors((current) => ({ ...current, login: '' }))
                    }}
                    aria-invalid={Boolean(errors.login)}
                    aria-describedby={errors.login ? 'login-error' : undefined}
                  />
                </span>
                <span className="login-field-error" id="login-error">{errors.login}</span>
              </label>

              <label className="login-field" htmlFor="password">
                <span className="login-label-row">
                  <span className="login-label">Password</span>
                  <Link className="login-forgot" to={ROUTES.FORGOT_PASSWORD}>Forgot password?</Link>
                </span>
                <span className="login-input-wrap">
                  <Lock className="login-input-icon" size={19} strokeWidth={2} aria-hidden="true" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    aria-label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value)
                      setErrors((current) => ({ ...current, password: '' }))
                    }}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  <button className="login-password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-controls="password">
                    {showPassword ? <EyeOff size={19} strokeWidth={2} /> : <Eye size={19} strokeWidth={2} />}
                  </button>
                </span>
                <span className="login-field-error" id="password-error">{errors.password}</span>
              </label>

              <label className="login-remember">
                <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />
                <span className="login-checkbox" aria-hidden="true" />
                <span>Remember me</span>
              </label>

              <Button className="login-submit" disabled={isSubmitting} type="submit">
                <span>{isSubmitting ? 'Signing in...' : 'Sign in'}</span>
                <span className="login-submit-arrow" aria-hidden="true">→</span>
              </Button>
            </form>

            <div className="login-divider" aria-hidden="true">
              <span />
              <span className="login-divider-label">or</span>
              <span />
            </div>

            <div className="login-instructions">
              <p>
                Organization accounts are provisioned by your organization administrator.{' '}
                <a href="https://heftin.netlify.app/signup">Activate an invite token</a>
              </p>
            </div>

          </>
        )}
    </>
  )
}
