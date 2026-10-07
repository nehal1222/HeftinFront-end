import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/lib/constants'
import '@/auth.css'

export function LoginPage() {
  const { user, isAuthenticated, login, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [loginMode, setLoginMode] = useState<'org' | 'ind'>('org')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [sessionError, setSessionError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setIsLoading(true)
    setSessionError(null)

    try {
      await login({
        email: email.trim(),
        password,
      })

      const destination =
        (location.state as { from?: string } | null)?.from ??
        ROUTES.WORKSPACE

      navigate(destination, { replace: true })
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to sign in. Please check your email and password and try again.'

      setSessionError(message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleLogout() {
    await logout()
    setEmail('')
    setPassword('')
    setSessionError(null)
  }

  return (
    <>
      <div className="background" aria-hidden="true">
        <div className="circle circle-one" />
        <div className="circle circle-two" />
        <div className="circle circle-three" />
      </div>

      <main className="auth-wrapper font-sans">
        <section className="auth-card">
          {isAuthenticated && user ? (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div className="brand" style={{ marginBottom: '18px' }}>
                <div className="brand-icon">
                  <img
                    src="/images/logo.jpeg"
                    alt="Heftin Academy"
                    className="brand-icon-img"
                  />
                </div>
                <span>Heftin Academy</span>
              </div>

              <div className="auth-heading" style={{ marginBottom: '18px' }}>
                <h1 style={{ fontSize: '24px' }}>
                  <span className="line-1">Welcome</span>
                  <span className="line-2">back</span>
                </h1>

                <p>
                  You are currently authenticated as{' '}
                  <strong>{user.displayName}</strong> ({user.email})
                </p>
              </div>

              <div
                style={{
                  margin: '16px 0',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'var(--white)',
                  border: '1px solid var(--border)',
                  fontSize: '12px',
                }}
              >
                <span style={{ color: 'var(--muted)' }}>
                  Active Identity:{' '}
                </span>

                <strong
                  style={{
                    color: 'var(--primary)',
                    textTransform: 'capitalize',
                  }}
                >
                  {user.role.replace('_', ' ')} &middot;{' '}
                  {user.plan.toUpperCase()}
                </strong>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  marginTop: '20px',
                }}
              >
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.WORKSPACE)}
                  className="primary-button"
                  style={{ width: '100%' }}
                >
                  <span className="button-text">
                    Continue to Workspace
                  </span>
                  <span className="button-arrow">&rarr;</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
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
            <>
              <div className="brand">
                <div className="brand-icon">
                  <img
                    src="/images/logo.jpeg"
                    alt="Heftin Academy"
                    className="brand-icon-img"
                  />
                </div>
                <span>Heftin Academy</span>
              </div>

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
                  }}
                >
                  Sign In
                </button>

                <button
                  type="button"
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
                  }}
                >
                  Activate Invite
                </button>

                <button
                  type="button"
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
                  }}
                >
                  Request Org Access
                </button>
              </div>

              <div className="auth-heading">
                <h1>
                  <span className="line-1">Welcome</span>
                  <span className="line-2">back</span>
                </h1>

                <p>Sign in to continue to your account</p>
              </div>

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
                  onClick={() => setLoginMode('org')}
                  style={{
                    flex: 1,
                    padding: '7px 8px',
                    borderRadius: '7px',
                    border:
                      loginMode === 'org'
                        ? 'none'
                        : '1px solid transparent',
                    background:
                      loginMode === 'org'
                        ? 'var(--white)'
                        : 'transparent',
                    color:
                      loginMode === 'org'
                        ? 'var(--primary)'
                        : 'var(--muted)',
                    boxShadow:
                      loginMode === 'org'
                        ? '0 1px 3px rgba(0,0,0,0.06)'
                        : 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Organization Account
                </button>

                <button
                  type="button"
                  onClick={() => setLoginMode('ind')}
                  style={{
                    flex: 1,
                    padding: '7px 8px',
                    borderRadius: '7px',
                    border:
                      loginMode === 'ind'
                        ? 'none'
                        : '1px solid transparent',
                    background:
                      loginMode === 'ind'
                        ? 'var(--white)'
                        : 'transparent',
                    color:
                      loginMode === 'ind'
                        ? 'var(--primary)'
                        : 'var(--muted)',
                    boxShadow:
                      loginMode === 'ind'
                        ? '0 1px 3px rgba(0,0,0,0.06)'
                        : 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Individual Learner
                </button>
              </div>

              {loginMode === 'ind' && (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '18px 16px',
                    border: '1px solid var(--border)',
                    borderRadius: '14px',
                    background: 'var(--white)',
                    marginBottom: '20px',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      borderRadius: '99px',
                      background: 'rgba(0, 130, 142, 0.1)',
                      color: 'var(--primary)',
                      fontSize: '10px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    Individual Category
                  </span>

                  <h3
                    style={{
                      margin: '8px 0 4px',
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'var(--error)',
                    }}
                  >
                    Individual Learner Workspace
                  </h3>

                  <p
                    style={{
                      margin: '0 auto',
                      fontSize: '11.5px',
                      color: 'var(--muted)',
                      lineHeight: 1.5,
                      maxWidth: '320px',
                    }}
                  >
                    Sign in with your individual learner account to access
                    your personal workspace.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="email">Email address</label>

                  <div
                    className={`input-wrapper ${
                      sessionError ? 'has-error' : ''
                    }`}
                  >
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
                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="2"
                        />
                        <path d="m3 7 9 6 9-6" />
                      </svg>
                    </span>

                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value)
                        setSessionError(null)
                      }}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="label-row">
                    <label htmlFor="password">Password</label>

                    <Link
                      to={ROUTES.FORGOT_PASSWORD}
                      className="forgot-link"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div
                    className={`input-wrapper ${
                      sessionError ? 'has-error' : ''
                    }`}
                  >
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
                        <rect
                          x="4"
                          y="10"
                          width="16"
                          height="11"
                          rx="2"
                        />
                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                      </svg>
                    </span>

                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value)
                        setSessionError(null)
                      }}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowPassword((current) => !current)
                      }
                      aria-label={
                        showPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="remember-me">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(event) =>
                        setRememberMe(event.target.checked)
                      }
                    />

                    <span className="custom-checkbox" />
                    <span>Remember me</span>
                  </label>
                </div>

                <div
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
                    <strong
                      style={{
                        display: 'block',
                        color: 'var(--error)',
                      }}
                    >
                      {loginMode === 'org'
                        ? 'Organization Account'
                        : 'Individual Learner Workspace'}
                    </strong>

                    <span
                      style={{
                        color: 'var(--primary)',
                        fontSize: '10px',
                        fontWeight: 600,
                      }}
                    >
                      {loginMode === 'org'
                        ? 'Organization-scoped access'
                        : 'Personal learner access'}
                    </span>
                  </div>

                  <span
                    style={{
                      color: 'var(--primary)',
                      fontWeight: 700,
                      fontSize: '10px',
                    }}
                  >
                    Secure
                  </span>
                </div>

                {sessionError && (
                  <div
                    className="form-message error"
                    role="alert"
                    style={{
                      display: 'block',
                      marginBottom: '15px',
                    }}
                  >
                    {sessionError}
                  </div>
                )}

                <button
                  type="submit"
                  className="primary-button"
                  disabled={isLoading}
                  style={{ width: '100%' }}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="loader"
                        style={{ display: 'inline-block' }}
                      />
                      <span className="button-text">
                        Signing in...
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="button-text">Sign in</span>
                      <span className="button-arrow">&rarr;</span>
                    </>
                  )}
                </button>
              </form>

              <div className="divider">
                <span />
                <p>or</p>
                <span />
              </div>

              <p className="bottom-text">
                Organization accounts are provisioned by your
                administrator.{' '}
                <Link to={ROUTES.SIGNUP}>Activate invite token</Link>{' '}
                &middot;{' '}
                <Link to={ROUTES.REQUEST_ACCESS}>
                  Request org access
                </Link>
              </p>
            </>
          )}
        </section>

        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          <Link
            to={ROUTES.HOME}
            style={{
              color: 'var(--muted)',
              fontSize: '12px',
              textDecoration: 'none',
            }}
          >
            Back to Home
          </Link>

          <span style={{ color: 'var(--muted)' }}>·</span>

          <Link
            to={ROUTES.SESSION_ERROR}
            style={{
              color: 'var(--muted)',
              fontSize: '12px',
              textDecoration: 'none',
            }}
          >
            Session Help
          </Link>
        </div>
      </main>
    </>
  )
}
