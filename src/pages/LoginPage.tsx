import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { NetlifyBadge } from '@/components/ui/NetlifyBadge'
import { ROUTES, STORAGE_KEYS } from '@/lib/constants'
import { getErrorMessage, getFieldErrors } from '@/lib/axios'
import { authService } from '@/services/auth.service'

type AccountType = 'organization' | 'individual'
type DemoRole = 'student' | 'faculty' | 'orgAdmin' | 'superAdmin'

const demoAccounts: Record<DemoRole, { email: string; organization: string; tenant: string; status: string }> = {
  student: {
    email: 'sana@dpa.edu',
    organization: 'Delhi Public Academy',
    tenant: 'Tenant: org_001 · Student (Batch 101)',
    status: 'Verified',
  },
  faculty: {
    email: 'teacher@dpa.edu',
    organization: 'Delhi Public Academy',
    tenant: 'Tenant: org_001 · Faculty (Batch 101 Scoped)',
    status: 'Verified',
  },
  orgAdmin: {
    email: 'orgadmin@dpa.edu',
    organization: 'Delhi Public Academy',
    tenant: 'Tenant: org_001 · Org Admin (Institution-wide)',
    status: 'Verified',
  },
  superAdmin: {
    email: 'admin@heftin.com',
    organization: 'Heftin Platform Central',
    tenant: 'Platform Administrator · Full Scope',
    status: 'Platform',
  },
}

const demoPassword = 'password123'

export function LoginPage() {
  const navigate = useNavigate()
  const [accountType, setAccountType] = useState<AccountType>('organization')
  const [selectedDemoRole, setSelectedDemoRole] = useState<DemoRole | null>(null)
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const selectedDemoAccount = selectedDemoRole ? demoAccounts[selectedDemoRole] : null

  function selectDemoRole(role: DemoRole) {
    const demoAccount = demoAccounts[role]
    setSelectedDemoRole(role)
    setLogin(demoAccount.email)
    setPassword(demoPassword)
    setErrors({})
    setServerError('')
  }

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
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.access_token)
      if (response.refresh_token) localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refresh_token)
      navigate(ROUTES.HOME)
    } catch (error) {
      setServerError(getErrorMessage(error, 'We could not sign you in. Check your details and try again.'))
      const fieldErrors = getFieldErrors(error)
      if (fieldErrors.email && !fieldErrors.login) fieldErrors.login = fieldErrors.email
      setErrors(fieldErrors)
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
      <section className="login-card" aria-labelledby="login-heading">
        <Link className="login-brand" to={ROUTES.HOME} aria-label="Heftin Academy home">
          <img className="login-brand-mark" src="/heftin-logo.png" alt="" />
          <span>Heftin Academy</span>
        </Link>

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
                <span className="login-label">Email address</span>
                <span className="login-input-wrap">
                  <Mail className="login-input-icon" size={19} strokeWidth={2} aria-hidden="true" />
                  <Input
                    id="login"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    aria-label="Email address"
                    placeholder="you@example.com"
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

              <div
                className="organization-badge"
                aria-label={`${selectedDemoAccount?.status ?? 'Verified'} organization: ${selectedDemoAccount?.organization ?? 'Delhi Public Academy'}`}
              >
                <span className="organization-details">
                  <strong>{selectedDemoAccount?.organization ?? 'Delhi Public Academy'}</strong>
                  <small>{selectedDemoAccount?.tenant ?? 'Tenant: org_001 · Scoped Access'}</small>
                </span>
                <span className="organization-verified">
                  <span aria-hidden="true">✓</span> {selectedDemoAccount?.status ?? 'Verified'}
                </span>
              </div>

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

            <div className="login-role-box" aria-label="Organization role selection">
              <div className="login-role-header">
                <span>The 4 Organization Roles (Simulation Deck)</span>
                <span className="login-role-test">1-Click Test</span>
              </div>
              <div className="login-role-grid">
                <button className={selectedDemoRole === 'student' ? 'active' : ''} type="button" aria-pressed={selectedDemoRole === 'student'} onClick={() => selectDemoRole('student')}>Student</button>
                <button className={selectedDemoRole === 'faculty' ? 'active' : ''} type="button" aria-pressed={selectedDemoRole === 'faculty'} onClick={() => selectDemoRole('faculty')}>Faculty</button>
                <button className={selectedDemoRole === 'orgAdmin' ? 'active' : ''} type="button" aria-pressed={selectedDemoRole === 'orgAdmin'} onClick={() => selectDemoRole('orgAdmin')}>Org Admin</button>
                <button className={selectedDemoRole === 'superAdmin' ? 'active' : ''} type="button" aria-pressed={selectedDemoRole === 'superAdmin'} onClick={() => selectDemoRole('superAdmin')}>SuperAdmin</button>
              </div>
            </div>
          </>
        )}
      </section>

      <NetlifyBadge />
    </main>
  )
}
