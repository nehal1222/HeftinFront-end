import { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/lib/constants'
import type { SubscriptionPlan, UserRole } from '@/types/access'
import '@/auth.css'

interface WelcomeProfile {
  name: string
  role: string
  organization: string
}

export function LoginPage() {
  const { user, isAuthenticated, login, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const requestedRole = searchParams.get('role')
  const defaultMode = requestedRole === 'individual' ? 'ind' : 'org'
  const defaultEmail =
    requestedRole === 'faculty'
      ? 'faculty@dpa.edu'
      : requestedRole === 'org_admin'
      ? 'admin@dpa.edu'
      : requestedRole === 'super_admin'
      ? 'superadmin@heftin.com'
      : requestedRole === 'student'
      ? 'student@dpa.edu'
      : requestedRole === 'individual'
      ? 'learner@gmail.com'
      : ''

  const [loginMode, setLoginMode] = useState<'org' | 'ind'>(defaultMode)
  const [email, setEmail] = useState(defaultEmail)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [sessionError, setSessionError] = useState<string | null>(null)
  const [welcomeUser, setWelcomeUser] = useState<WelcomeProfile | null>(null)

  function fillRolePreset(presetEmail: string, presetPassword: string) {
    setEmail(presetEmail)
    setPassword(presetPassword)
    setSessionError(null)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setSessionError(null)

    const normalized = email.trim().toLowerCase()
    let assignedRole: UserRole = 'student'
    let assignedName = 'Arjun Kumar'
    let assignedPlan: SubscriptionPlan = 'institution'
    let organizationName = 'Delhi Public Academy'

    if (normalized.includes('faculty') || normalized.includes('teacher') || normalized.includes('meera')) {
      assignedRole = 'faculty'
      assignedName = 'Dr. Meera Patel'
      organizationName = 'Delhi Public Academy'
    } else if (normalized.includes('admin@dpa') || normalized.includes('orgadmin')) {
      assignedRole = 'org_admin'
      assignedName = 'Vikram Malhotra'
      organizationName = 'Delhi Public Academy'
    } else if (normalized.includes('superadmin') || normalized.includes('admin@heftin') || normalized.includes('lead@heftin')) {
      assignedRole = 'super_admin'
      assignedName = 'Platform Administrator'
      assignedPlan = 'pro'
      organizationName = 'Heftin Central Enterprise'
    } else if (normalized.includes('learner') || normalized.includes('ananya') || loginMode === 'ind') {
      assignedRole = 'individual'
      assignedName = 'Ananya Sharma'
      assignedPlan = 'scholar'
      organizationName = 'Individual Scholar'
    }

    try {
      await login({
        email: normalized,
        password,
        displayName: assignedName,
        role: assignedRole,
        plan: assignedPlan,
      })

      // Show the authentic LETSGO workspace welcome screen overlay
      setWelcomeUser({
        name: assignedName,
        role: assignedRole,
        organization: organizationName,
      })

      setTimeout(() => {
        const destination = (location.state as { from?: string } | null)?.from ?? ROUTES.WORKSPACE
        navigate(destination, { replace: true })
      }, 1100)
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Session verification failed: Invalid credentials or token rejected (401 Unauthorized).'
      setSessionError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* ================================
           ANIMATED FLOATING BACKGROUND
      ================================= */}
      <div className="background" aria-hidden="true">
        <div className="circle circle-one" />
        <div className="circle circle-two" />
        <div className="circle circle-three" />
      </div>

      {/* ================================
           MAIN WRAPPER & LOGIN CARD
      ================================= */}
      <main className="auth-wrapper font-sans">
        <section className="auth-card">
          {isAuthenticated && user && !welcomeUser ? (
            /* State: Already Authenticated */
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div className="brand" style={{ marginBottom: '18px' }}>
                <div className="brand-icon">
                  <img src="/images/logo.jpeg" alt="Heftin Academy" className="brand-icon-img" />
                </div>
                <span>Heftin Academy</span>
              </div>

              <div className="auth-heading" style={{ marginBottom: '18px' }}>
                <h1 style={{ fontSize: '24px' }}>
                  <span className="line-1">Welcome</span>
                  <span className="line-2">back</span>
                </h1>
                <p>
                  You are currently authenticated as <strong>{user.displayName}</strong> ({user.email})
                </p>
              </div>

              <div style={{ margin: '16px 0', padding: '12px', borderRadius: '10px', background: 'var(--white)', border: '1px solid var(--border)', fontSize: '12px' }}>
                <span style={{ color: 'var(--muted)' }}>Active Identity: </span>
                <strong style={{ color: 'var(--primary)', textTransform: 'capitalize' }}>
                  {user.role.replace('_', ' ')} &middot; {user.plan.toUpperCase()}
                </strong>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.WORKSPACE)}
                  className="primary-button"
                  style={{ width: '100%' }}
                >
                  <span className="button-text">Continue to Workspace</span>
                  <span className="button-arrow">&rarr;</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await logout()
                    setEmail('')
                    setPassword('')
                    setSessionError(null)
                  }}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '11px',
                    border: '1px solid var(--border)',
                    background: 'var(--white)',
                    color: 'var(--muted)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Sign Out &amp; Use Another Account
                </button>
              </div>
            </div>
          ) : (
            /* Standard LETSGO Card Form */
            <>
              {/* ================================
                   LOGO
              ================================= */}
              <div className="brand">
                <div className="brand-icon">
                  <img src="/images/logo.jpeg" alt="Heftin Academy" className="brand-icon-img" />
                </div>
                <span>Heftin Academy</span>
              </div>

              {/* ================================
                   TOP AUTH MODE SWITCHER
              ================================= */}
              <div
                style={{
                  display: 'flex',
                  gap: '4px',
                  marginBottom: '20px',
                  padding: '4px',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  background: 'var(--white)',
                }}
              >
                <button
                  type="button"
                  id="tabSignIn"
                  style={{
                    flex: 1,
                    padding: '8px 6px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--primary)',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  id="tabInvite"
                  onClick={() => navigate(ROUTES.SIGNUP)}
                  style={{
                    flex: 1,
                    padding: '8px 6px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: '#fff',
                    color: 'var(--error)',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <span>Activate Invite</span>
                </button>
                <button
                  type="button"
                  id="tabB2B"
                  onClick={() => navigate(ROUTES.REQUEST_ACCESS)}
                  style={{
                    flex: 1,
                    padding: '8px 6px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: '#fff',
                    color: 'var(--error)',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <span>Request Org Access</span>
                </button>
              </div>

              {/* ================================
                   HEADING
              ================================= */}
              <div className="auth-heading">
                <h1>
                  <span className="line-1">Welcome</span>
                  <span className="line-2">back</span>
                </h1>
                <p>Sign in to continue to your account</p>
              </div>

              {/* ================================
                   SCOPE TOGGLE: ORG VS INDIVIDUAL
              ================================= */}
              <div
                style={{
                  display: 'flex',
                  gap: '6px',
                  marginBottom: '16px',
                  padding: '3px',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  background: 'var(--bg-soft)',
                }}
              >
                <button
                  type="button"
                  id="tabOrg"
                  onClick={() => {
                    setLoginMode('org')
                    if (email === 'ananya@gmail.com') setEmail('')
                  }}
                  style={{
                    flex: 1,
                    padding: '7px 8px',
                    borderRadius: '7px',
                    border: loginMode === 'org' ? 'none' : '1px solid transparent',
                    background: loginMode === 'org' ? 'var(--white)' : 'transparent',
                    color: loginMode === 'org' ? 'var(--primary)' : 'var(--muted)',
                    boxShadow: loginMode === 'org' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span>Organization Account</span>
                </button>
                <button
                  type="button"
                  id="tabInd"
                  onClick={() => {
                    setLoginMode('ind')
                    setEmail('ananya@gmail.com')
                    setPassword('password123')
                  }}
                  style={{
                    flex: 1,
                    padding: '7px 8px',
                    borderRadius: '7px',
                    border: loginMode === 'ind' ? 'none' : '1px solid transparent',
                    background: loginMode === 'ind' ? 'var(--white)' : 'transparent',
                    color: loginMode === 'ind' ? 'var(--primary)' : 'var(--muted)',
                    boxShadow: loginMode === 'ind' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span>Individual Learner</span>
                </button>
              </div>

              {/* ================================
                   LOGIN FORM
              ================================= */}
              <form id="loginForm" onSubmit={handleSubmit} noValidate>
                {/* EMAIL */}
                <div className="form-group">
                  <label htmlFor="email">Email address</label>
                  <div className={`input-wrapper ${sessionError ? 'has-error' : ''}`}>
                    <span className="input-icon">
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="m3 7 9 6 9-6" />
                      </svg>
                    </span>

                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setSessionError(null)
                      }}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="form-group">
                  <div className="label-row">
                    <label htmlFor="password">Password</label>
                    <Link to={ROUTES.FORGOT_PASSWORD} className="forgot-link">
                      Forgot password?
                    </Link>
                  </div>

                  <div className={`input-wrapper ${sessionError ? 'has-error' : ''}`}>
                    <span className="input-icon">
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <rect x="4" y="10" width="16" height="11" rx="2" />
                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                      </svg>
                    </span>

                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setSessionError(null)
                      }}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      id="passwordToggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg
                          id="eyeClosed"
                          width="19"
                          height="19"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden="true"
                        >
                          <path d="m3 3 18 18" />
                          <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                          <path d="M9.9 4.2A10.6 10.6 0 0 1 12 4c6.5 0 10 8 10 8a18.7 18.7 0 0 1-3.1 4.4" />
                          <path d="M6.2 6.2C3.5 8.2 2 12 2 12s3.5 8 10 8c1.8 0 3.4-.5 4.8-1.2" />
                        </svg>
                      ) : (
                        <svg
                          id="eyeOpen"
                          width="19"
                          height="19"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden="true"
                        >
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* REMEMBER ME */}
                <div className="form-options">
                  <label className="remember-me">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="custom-checkbox" />
                    <span>Remember me</span>
                  </label>
                </div>

                {/* Dynamic Domain & Tenant Indicator */}
                <div
                  id="tenantIndicator"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    marginBottom: '16px',
                    border: '1px solid var(--border)',
                    borderRadius: '9px',
                    background: 'var(--white)',
                    fontSize: '11px',
                  }}
                >
                  <div>
                    <strong style={{ display: 'block', color: 'var(--error)' }}>
                      {loginMode === 'org' ? 'Delhi Public Academy' : 'Individual Learner Workspace'}
                    </strong>
                    <span style={{ color: 'var(--primary)', fontSize: '10px', fontWeight: 600 }}>
                      {loginMode === 'org'
                        ? 'Tenant: org_001 \u00B7 Scoped Access'
                        : 'Personal Analytics \u00B7 Self-Paced Practice'}
                    </span>
                  </div>
                  <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '10px' }}>
                    {loginMode === 'org' ? 'Verified' : 'Active Tier'}
                  </span>
                </div>

                {/* FORM MESSAGE (Session Error Handling) */}
                {sessionError && (
                  <div
                    id="formMessage"
                    className="form-message error"
                    role="alert"
                    style={{ display: 'block', marginBottom: '15px' }}
                  >
                    {sessionError}
                  </div>
                )}

                {/* LOGIN BUTTON */}
                <button
                  type="submit"
                  className="primary-button"
                  id="loginButton"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loader" style={{ display: 'inline-block' }} />
                      <span id="buttonText" className="button-text">
                        Signing in...
                      </span>
                    </>
                  ) : (
                    <>
                      <span id="buttonText" className="button-text">
                        Sign in
                      </span>
                      <span id="buttonArrow" className="button-arrow">
                        &rarr;
                      </span>
                    </>
                  )}
                </button>
              </form>

              {/* DIVIDER */}
              <div className="divider">
                <span />
                <p>or</p>
                <span />
              </div>

              {/* SIGN UP / ONBOARDING */}
              <p className="bottom-text">
                Organization accounts are provisioned by your administrator.{' '}
                <Link to={ROUTES.SIGNUP}>Activate invite token</Link> &middot;{' '}
                <Link to={ROUTES.REQUEST_ACCESS}>Request org access</Link>
              </p>

              {/* Evaluator Test Deck: The 4 Organization Roles */}
              <div
                id="reviewerTestDeck"
                style={{
                  marginTop: '24px',
                  padding: '14px',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  background: 'var(--white)',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: '8px',
                  }}
                >
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--error)' }}>
                    {loginMode === 'org'
                      ? 'The 4 Organization Roles (Simulation Deck)'
                      : 'Individual Learner (Simulation Deck)'}
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--primary)' }}>
                    1-Click Test
                  </span>
                </div>
                {loginMode === 'org' ? (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '6px',
                      marginTop: '10px',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => fillRolePreset('sana@dpa.edu', 'password123')}
                      style={{
                        padding: '6px 4px',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        background: 'var(--white)',
                        color: 'var(--error)',
                        fontSize: '10px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => fillRolePreset('teacher@dpa.edu', 'password123')}
                      style={{
                        padding: '6px 4px',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        background: 'var(--white)',
                        color: 'var(--error)',
                        fontSize: '10px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Faculty
                    </button>
                    <button
                      type="button"
                      onClick={() => fillRolePreset('orgadmin@dpa.edu', 'password123')}
                      style={{
                        padding: '6px 4px',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        background: 'var(--white)',
                        color: 'var(--error)',
                        fontSize: '10px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Org Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => fillRolePreset('admin@heftin.com', 'password123')}
                      style={{
                        padding: '6px 4px',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        background: 'var(--white)',
                        color: 'var(--error)',
                        fontSize: '10px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      SuperAdmin
                    </button>
                  </div>
                ) : (
                  <div style={{ marginTop: '10px' }}>
                    <button
                      type="button"
                      onClick={() => fillRolePreset('ananya@gmail.com', 'password123')}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        background: 'var(--white)',
                        color: 'var(--error)',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Ananya Sharma (Individual Scholar) &rarr;
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </main>

      {/* ================================
           WORKSPACE WELCOME OVERLAY MODAL
      ================================= */}
      {welcomeUser && (
        <section id="workspaceWelcome" className="workspace-welcome" aria-live="polite">
          <div className="workspace-welcome-card">
            <div className="workspace-welcome-mark">H</div>
            <p className="workspace-welcome-eyebrow">Heftin Academy</p>
            <h2>Hi, welcome to your workspace</h2>
            <p className="workspace-welcome-person">
              Signing you in as <strong id="welcomeName">{welcomeUser.name}</strong>
            </p>
            <div className="workspace-welcome-details">
              <span>
                <small>Organization</small>
                <strong id="welcomeOrganization">{welcomeUser.organization}</strong>
              </span>
              <span>
                <small>Role</small>
                <strong id="welcomeRole" style={{ textTransform: 'capitalize' }}>
                  {welcomeUser.role.replace('_', ' ')}
                </strong>
              </span>
            </div>
            <p className="workspace-welcome-loading">Preparing your role home...</p>
          </div>
        </section>
      )}
    </>
  )
}
