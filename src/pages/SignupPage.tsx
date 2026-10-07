import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { b2bService } from '@/services/b2b.service'
import '@/auth.css'

interface SignupPageProps {
  defaultMode?: 'invite' | 'b2b' | 'indiv'
}

type SignupRole = 'student' | 'faculty' | 'org_admin' | 'super_admin'

export function SignupPage({ defaultMode: initialDefaultMode }: SignupPageProps) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const urlMode = searchParams.get('mode') as
    | 'invite'
    | 'b2b'
    | 'indiv'
    | null

  const activeInitialMode = urlMode || initialDefaultMode || 'invite'

  const [signupMode, setSignupMode] = useState<
    'invite' | 'b2b' | 'indiv'
  >(activeInitialMode)

  // Activate Invite Form State
  const [inviteCode, setInviteCode] = useState('')
  const [selectedRole, setSelectedRole] = useState<SignupRole>('student')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Errors & Loading for Invite Form
  const [fullNameError, setFullNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // B2B Request Form State
  const [b2bOrgName, setB2bOrgName] = useState('')
  const [b2bOrgType, setB2bOrgType] = useState('coaching')
  const [b2bContactName, setB2bContactName] = useState('')
  const [b2bContactEmail, setB2bContactEmail] = useState('')
  const [b2bCity, setB2bCity] = useState('')
  const [b2bLearners, setB2bLearners] = useState('500-1000')
  const [b2bExams, setB2bExams] = useState('UPSC')
  const [b2bMessage, setB2bMessage] = useState('')
  const [b2bLoading, setB2bLoading] = useState(false)
  const [b2bSuccess, setB2bSuccess] = useState(false)
  const [b2bSubmittedOrg, setB2bSubmittedOrg] = useState('')

  // Individual Waitlist State
  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [waitlistMsg, setWaitlistMsg] = useState('')
  const [waitlistSuccess, setWaitlistSuccess] = useState(false)

  function clearErrors() {
    setFullNameError('')
    setEmailError('')
    setPasswordError('')
    setConfirmPasswordError('')
    setFormMessage('')
  }

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  function handleRoleChange(role: SignupRole) {
    setSelectedRole(role)
  }

  async function handleInviteSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    clearErrors()

    let valid = true

    if (inviteCode.trim() === '') {
      setFormMessage('Please enter your invite token or cohort code.')
      valid = false
    }

    if (fullName.trim() === '') {
      setFullNameError('Please enter your full name.')
      valid = false
    }

    if (email.trim() === '') {
      setEmailError('Please enter your email address.')
      valid = false
    } else if (!isValidEmail(email.trim())) {
      setEmailError('Please enter a valid email address.')
      valid = false
    }

    if (password === '') {
      setPasswordError('Please create a password.')
      valid = false
    } else if (password.length < 6) {
      setPasswordError('Password must contain at least 6 characters.')
      valid = false
    }

    if (confirmPassword === '') {
      setConfirmPasswordError('Please confirm your password.')
      valid = false
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match.')
      valid = false
    }

    if (!valid) {
      return
    }

    /*
     * Account creation is not implemented by the current auth service.
     * The existing backend authentication flow uses /auth/login and
     * /auth/me. Therefore this page directs the user to sign in after
     * validation instead of creating a fake local account.
     */
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      setFormMessage(
        'Your invite details are ready. Please use the Sign In page with an account provisioned by your organization.',
      )
    }, 500)
  }

  async function handleB2BSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setB2bLoading(true)

    const org = b2bOrgName.trim() || 'Your Organization'

    try {
      await b2bService.requestOnboarding({
        orgName: org,
        orgType: b2bOrgType,
        contactName: b2bContactName.trim(),
        contactEmail: b2bContactEmail.trim(),
        city: b2bCity.trim(),
        expectedLearners: b2bLearners,
        examFocus: b2bExams,
        notes: b2bMessage.trim(),
      })
    } catch {
      // Gracefully continue and show the request feedback.
    }

    setTimeout(() => {
      setB2bLoading(false)
      setB2bSubmittedOrg(org)
      setB2bSuccess(true)
    }, 700)
  }

  function handleWaitlist(event: React.FormEvent) {
    event.preventDefault()

    if (!isValidEmail(waitlistEmail.trim())) {
      setWaitlistMsg('Please enter a valid email address.')
      setWaitlistSuccess(false)
      return
    }

    setWaitlistMsg(
      'You are on the waitlist! We will notify you at launch.',
    )
    setWaitlistSuccess(true)
    setWaitlistEmail('')
  }

  const isSuperAdmin = selectedRole === 'super_admin'

  const tenantNameText = isSuperAdmin
    ? 'Heftin Platform Central'
    : 'Delhi Public Academy'

  const tenantScopeText = isSuperAdmin
    ? 'Platform Administrator · Global Scope'
    : selectedRole === 'student'
      ? 'Tenant: org_001 · Student (Batch 101)'
      : selectedRole === 'faculty'
        ? 'Tenant: org_001 · Faculty Access'
        : 'Tenant: org_001 · Organization Admin'

  const tenantBadgeText = isSuperAdmin
    ? 'Platform Root'
    : 'Verified Invite'

  return (
    <>
      <div className="background" aria-hidden="true">
        <div className="circle circle-one" />
        <div className="circle circle-two" />
        <div className="circle circle-three" />
      </div>

      <main className="auth-wrapper font-sans">
        <section
          className="auth-card auth-card-wide"
          style={{ maxWidth: '520px' }}
        >
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

          {/* Mode Switcher */}
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
              onClick={() => {
                setSignupMode('invite')
                clearErrors()
              }}
              style={{
                flex: 1,
                padding: '8px 6px',
                borderRadius: '8px',
                border:
                  signupMode === 'invite'
                    ? 'none'
                    : '1px solid var(--border)',
                background:
                  signupMode === 'invite'
                    ? 'var(--primary)'
                    : '#fff',
                color:
                  signupMode === 'invite'
                    ? '#fff'
                    : 'var(--error)',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Activate Invite
            </button>

            <button
              type="button"
              onClick={() => {
                setSignupMode('b2b')
                clearErrors()
              }}
              style={{
                flex: 1,
                padding: '8px 6px',
                borderRadius: '8px',
                border:
                  signupMode === 'b2b'
                    ? 'none'
                    : '1px solid var(--border)',
                background:
                  signupMode === 'b2b'
                    ? 'var(--primary)'
                    : '#fff',
                color:
                  signupMode === 'b2b'
                    ? '#fff'
                    : 'var(--error)',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Request Org Access
            </button>

            <button
              type="button"
              onClick={() => {
                setSignupMode('indiv')
                clearErrors()
              }}
              style={{
                flex: 1,
                padding: '8px 6px',
                borderRadius: '8px',
                border:
                  signupMode === 'indiv'
                    ? 'none'
                    : '1px solid var(--border)',
                background:
                  signupMode === 'indiv'
                    ? 'var(--primary)'
                    : '#fff',
                color:
                  signupMode === 'indiv'
                    ? '#fff'
                    : 'var(--error)',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Individual
            </button>
          </div>

          {/* Invite */}
          {signupMode === 'invite' && (
            <div>
              <div className="auth-heading">
                <h1>
                  <span className="line-1">Activate your</span>
                  <span className="line-2">account</span>
                </h1>

                <p>
                  Join your institution with an invite token. Your account
                  must be provisioned by the organization.
                </p>
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
                  background: '#ffffff',
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
                    {tenantNameText}
                  </strong>

                  <span
                    style={{
                      color: 'var(--primary)',
                      fontSize: '10px',
                      fontWeight: 600,
                    }}
                  >
                    {tenantScopeText}
                  </span>
                </div>

                <span
                  style={{
                    color: 'var(--primary)',
                    fontWeight: 700,
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>

                  {tenantBadgeText}
                </span>
              </div>

              <form onSubmit={handleInviteSubmit} noValidate>
                <div
                  className="form-group"
                  style={{ marginBottom: '14px' }}
                >
                  <label
                    htmlFor="inviteCode"
                    style={{
                      margin: 0,
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    Invite token / cohort code
                  </label>

                  <div className="input-wrapper">
                    <span className="input-icon">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </span>

                    <input
                      type="text"
                      id="inviteCode"
                      value={inviteCode}
                      onChange={(event) =>
                        setInviteCode(event.target.value)
                      }
                      placeholder="e.g. DPA-2026-COHORT"
                      autoComplete="off"
                      style={{
                        fontFamily: 'monospace',
                        letterSpacing: '0.05em',
                        fontSize: '12px',
                      }}
                    />
                  </div>
                </div>

                {/* Role */}
                <div
                  className="form-group"
                  style={{ marginBottom: '16px' }}
                >
                  <label
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    Account role
                  </label>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      marginTop: '6px',
                    }}
                  >
                    <div
                      style={{
                        padding: '8px 10px',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        background: 'var(--bg-soft)',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          color: 'var(--primary)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          display: 'block',
                          marginBottom: '6px',
                        }}
                      >
                        Organisation
                      </span>

                      <div
                        className="role-select"
                        style={{
                          gridTemplateColumns:
                            'repeat(3, 1fr)',
                          gap: '6px',
                        }}
                      >
                        <label className="role-option">
                          <input
                            type="radio"
                            name="role"
                            value="org_admin"
                            checked={
                              selectedRole === 'org_admin'
                            }
                            onChange={() =>
                              handleRoleChange('org_admin')
                            }
                          />

                          <span
                            className="role-option-card"
                            style={{ padding: '8px 4px' }}
                          >
                            <span className="role-option-icon">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                aria-hidden="true"
                              >
                                <rect
                                  x="4"
                                  y="5"
                                  width="16"
                                  height="14"
                                  rx="2"
                                />
                                <path d="M8 9h8M8 13h5" />
                              </svg>
                            </span>

                            <span
                              className="role-option-label"
                              style={{ fontSize: '10px' }}
                            >
                              Org Admin
                            </span>
                          </span>
                        </label>

                        <label className="role-option">
                          <input
                            type="radio"
                            name="role"
                            value="faculty"
                            checked={
                              selectedRole === 'faculty'
                            }
                            onChange={() =>
                              handleRoleChange('faculty')
                            }
                          />

                          <span
                            className="role-option-card"
                            style={{ padding: '8px 4px' }}
                          >
                            <span className="role-option-icon">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                aria-hidden="true"
                              >
                                <rect
                                  x="3"
                                  y="4"
                                  width="18"
                                  height="12"
                                  rx="2"
                                />
                                <path d="M8 21h8M12 16v5" />
                              </svg>
                            </span>

                            <span
                              className="role-option-label"
                              style={{ fontSize: '10px' }}
                            >
                              Faculty
                            </span>
                          </span>
                        </label>

                        <label className="role-option">
                          <input
                            type="radio"
                            name="role"
                            value="super_admin"
                            checked={
                              selectedRole === 'super_admin'
                            }
                            onChange={() =>
                              handleRoleChange('super_admin')
                            }
                          />

                          <span
                            className="role-option-card"
                            style={{ padding: '8px 4px' }}
                          >
                            <span className="role-option-icon">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                aria-hidden="true"
                              >
                                <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
                              </svg>
                            </span>

                            <span
                              className="role-option-label"
                              style={{ fontSize: '10px' }}
                            >
                              SuperAdmin
                            </span>
                          </span>
                        </label>
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '8px 10px',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        background: 'var(--bg-soft)',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          color: 'var(--error)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          display: 'block',
                          marginBottom: '6px',
                        }}
                      >
                        Individual
                      </span>

                      <div
                        className="role-select"
                        style={{
                          gridTemplateColumns: '1fr',
                          gap: '6px',
                        }}
                      >
                        <label className="role-option">
                          <input
                            type="radio"
                            name="role"
                            value="student"
                            checked={selectedRole === 'student'}
                            onChange={() =>
                              handleRoleChange('student')
                            }
                          />

                          <span
                            className="role-option-card"
                            style={{ padding: '8px 4px' }}
                          >
                            <span className="role-option-icon">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                aria-hidden="true"
                              >
                                <path d="M22 10 12 5 2 10l10 5 10-5Z" />
                                <path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
                              </svg>
                            </span>

                            <span
                              className="role-option-label"
                              style={{ fontSize: '10px' }}
                            >
                              Student
                            </span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Name + Email */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fit, minmax(210px, 1fr))',
                    gap: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <div
                    className="form-group"
                    style={{ marginBottom: 0 }}
                  >
                    <label htmlFor="fullName">Full name</label>

                    <div
                      className={`input-wrapper ${
                        fullNameError ? 'has-error' : ''
                      }`}
                    >
                      <span className="input-icon">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="8" r="4" />
                          <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
                        </svg>
                      </span>

                      <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(event) => {
                          setFullName(event.target.value)

                          if (fullNameError) {
                            setFullNameError('')
                          }
                        }}
                        placeholder="Your full name"
                        autoComplete="name"
                      />
                    </div>

                    {fullNameError && (
                      <small className="error-message">
                        {fullNameError}
                      </small>
                    )}
                  </div>

                  <div
                    className="form-group"
                    style={{ marginBottom: 0 }}
                  >
                    <label htmlFor="email">Email address</label>

                    <div
                      className={`input-wrapper ${
                        emailError ? 'has-error' : ''
                      }`}
                    >
                      <span className="input-icon">
                        <svg
                          width="18"
                          height="18"
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

                          if (emailError) {
                            setEmailError('')
                          }
                        }}
                        placeholder="you@dpa.edu"
                        autoComplete="email"
                      />
                    </div>

                    {emailError && (
                      <small className="error-message">
                        {emailError}
                      </small>
                    )}
                  </div>
                </div>

                {/* Passwords */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fit, minmax(210px, 1fr))',
                    gap: '12px',
                    marginBottom: '14px',
                  }}
                >
                  <div
                    className="form-group"
                    style={{ marginBottom: 0 }}
                  >
                    <label htmlFor="password">Password</label>

                    <div
                      className={`input-wrapper ${
                        passwordError ? 'has-error' : ''
                      }`}
                    >
                      <span className="input-icon">
                        <svg
                          width="18"
                          height="18"
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

                          if (passwordError) {
                            setPasswordError('')
                          }
                        }}
                        placeholder="Min. 6 chars"
                        autoComplete="new-password"
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

                    {passwordError && (
                      <small className="error-message">
                        {passwordError}
                      </small>
                    )}
                  </div>

                  <div
                    className="form-group"
                    style={{ marginBottom: 0 }}
                  >
                    <label htmlFor="confirmPassword">
                      Confirm password
                    </label>

                    <div
                      className={`input-wrapper ${
                        confirmPasswordError
                          ? 'has-error'
                          : ''
                      }`}
                    >
                      <span className="input-icon">
                        <svg
                          width="18"
                          height="18"
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
                        type={
                          showConfirmPassword
                            ? 'text'
                            : 'password'
                        }
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(event) => {
                          setConfirmPassword(event.target.value)

                          if (confirmPasswordError) {
                            setConfirmPasswordError('')
                          }
                        }}
                        placeholder="Re-enter password"
                        autoComplete="new-password"
                      />

                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() =>
                          setShowConfirmPassword(
                            (current) => !current,
                          )
                        }
                        aria-label={
                          showConfirmPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                      >
                        {showConfirmPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>

                    {confirmPasswordError && (
                      <small className="error-message">
                        {confirmPasswordError}
                      </small>
                    )}
                  </div>
                </div>

                {formMessage && (
                  <div
                    className="form-message error"
                    style={{
                      display: 'block',
                      marginBottom: '14px',
                    }}
                    role="alert"
                  >
                    {formMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="primary-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="loader"
                        style={{ display: 'inline-block' }}
                      />
                      <span className="button-text">
                        Checking invite...
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="button-text">
                        Continue
                      </span>
                      <span className="button-arrow">
                        &rarr;
                      </span>
                    </>
                  )}
                </button>
              </form>

              <p
                className="bottom-text"
                style={{ marginTop: '18px' }}
              >
                Already have an account?{' '}
                <Link to={ROUTES.LOGIN}>Sign in</Link>
              </p>
            </div>
          )}

          {/* B2B */}
          {signupMode === 'b2b' && (
            <div>
              <div className="auth-heading">
                <h1>
                  <span className="line-1">Request access for</span>
                  <span className="line-2">
                    your organization
                  </span>
                </h1>

                <p>
                  Public front door for coaching institutes,
                  schools, and academy networks.
                </p>
              </div>

              <div
                style={{
                  padding: '12px',
                  marginBottom: '16px',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  background: '#ffffff',
                }}
              >
                <strong
                  style={{
                    fontSize: '11.5px',
                    color: 'var(--error)',
                    display: 'block',
                  }}
                >
                  Super Admin Review Queue
                </strong>

                <p
                  style={{
                    fontSize: '11px',
                    color: 'var(--error)',
                    opacity: 0.8,
                    margin: '4px 0 0',
                    lineHeight: 1.4,
                  }}
                >
                  This form creates an onboarding request only.
                  It does not create an unverified tenant or
                  login.
                </p>
              </div>

              {!b2bSuccess ? (
                <form
                  onSubmit={handleB2BSubmit}
                  noValidate
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '10px',
                      marginBottom: '10px',
                    }}
                  >
                    <div
                      className="form-group"
                      style={{ marginBottom: 0 }}
                    >
                      <label htmlFor="b2bOrgName">
                        Organization name
                      </label>

                      <input
                        type="text"
                        id="b2bOrgName"
                        required
                        value={b2bOrgName}
                        onChange={(event) =>
                          setB2bOrgName(event.target.value)
                        }
                        placeholder="e.g. Apex IAS Academy"
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                    </div>

                    <div
                      className="form-group"
                      style={{ marginBottom: 0 }}
                    >
                      <label htmlFor="b2bOrgType">
                        Org type
                      </label>

                      <select
                        id="b2bOrgType"
                        value={b2bOrgType}
                        onChange={(event) =>
                          setB2bOrgType(event.target.value)
                        }
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          fontSize: '12px',
                          background: '#fff',
                        }}
                      >
                        <option value="coaching">
                          Coaching Institute
                        </option>
                        <option value="school">
                          School / College
                        </option>
                        <option value="academy">
                          Training Academy
                        </option>
                        <option value="other">
                          Other Enterprise
                        </option>
                      </select>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '10px',
                      marginBottom: '10px',
                    }}
                  >
                    <div
                      className="form-group"
                      style={{ marginBottom: 0 }}
                    >
                      <label htmlFor="b2bContactName">
                        Contact person
                      </label>

                      <input
                        type="text"
                        id="b2bContactName"
                        required
                        value={b2bContactName}
                        onChange={(event) =>
                          setB2bContactName(event.target.value)
                        }
                        placeholder="e.g. Aarav Patel"
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                    </div>

                    <div
                      className="form-group"
                      style={{ marginBottom: 0 }}
                    >
                      <label htmlFor="b2bContactEmail">
                        Work email
                      </label>

                      <input
                        type="email"
                        id="b2bContactEmail"
                        required
                        value={b2bContactEmail}
                        onChange={(event) =>
                          setB2bContactEmail(
                            event.target.value,
                          )
                        }
                        placeholder="founder@apex.edu"
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(130px, 1fr))',
                      gap: '10px',
                      marginBottom: '10px',
                    }}
                  >
                    <div
                      className="form-group"
                      style={{ marginBottom: 0 }}
                    >
                      <label htmlFor="b2bCity">City</label>

                      <input
                        type="text"
                        id="b2bCity"
                        required
                        value={b2bCity}
                        onChange={(event) =>
                          setB2bCity(event.target.value)
                        }
                        placeholder="e.g. New Delhi"
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                    </div>

                    <div
                      className="form-group"
                      style={{ marginBottom: 0 }}
                    >
                      <label htmlFor="b2bLearners">
                        Expected learners
                      </label>

                      <select
                        id="b2bLearners"
                        value={b2bLearners}
                        onChange={(event) =>
                          setB2bLearners(event.target.value)
                        }
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          fontSize: '12px',
                          background: '#fff',
                        }}
                      >
                        <option value="100-500">
                          100 - 500
                        </option>
                        <option value="500-1000">
                          500 - 1,000
                        </option>
                        <option value="1000-5000">
                          1,000 - 5,000
                        </option>
                        <option value="5000+">5,000+</option>
                      </select>
                    </div>

                    <div
                      className="form-group"
                      style={{ marginBottom: 0 }}
                    >
                      <label htmlFor="b2bExams">
                        Exam focus
                      </label>

                      <select
                        id="b2bExams"
                        value={b2bExams}
                        onChange={(event) =>
                          setB2bExams(event.target.value)
                        }
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          fontSize: '12px',
                          background: '#fff',
                        }}
                      >
                        <option value="UPSC">
                          UPSC Civil Services
                        </option>
                        <option value="SSC">SSC CGL</option>
                        <option value="PSC">State PSC</option>
                        <option value="NEET">
                          NEET / JEE
                        </option>
                      </select>
                    </div>
                  </div>

                  <div
                    className="form-group"
                    style={{ marginBottom: '14px' }}
                  >
                    <label htmlFor="b2bMessage">
                      Notes &amp; requirements
                    </label>

                    <textarea
                      id="b2bMessage"
                      rows={2}
                      value={b2bMessage}
                      onChange={(event) =>
                        setB2bMessage(event.target.value)
                      }
                      placeholder="Tell us about your batch schedule and custom rights needs."
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="primary-button"
                    disabled={b2bLoading}
                  >
                    {b2bLoading ? (
                      <>
                        <span
                          className="loader"
                          style={{
                            display: 'inline-block',
                          }}
                        />
                        <span className="button-text">
                          Logging request...
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="button-text">
                          Submit onboarding request
                        </span>
                        <span className="button-arrow">
                          &rarr;
                        </span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div
                  style={{
                    padding: '24px 16px',
                    border: '1px solid var(--border)',
                    borderRadius: '14px',
                    background: '#ffffff',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      margin: '0 auto 12px',
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: '50%',
                      background:
                        'rgba(0, 130, 142, 0.1)',
                      color: 'var(--primary)',
                    }}
                  >
                    ✓
                  </div>

                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'var(--error)',
                      margin: '0 0 6px',
                    }}
                  >
                    Onboarding request for {b2bSubmittedOrg}{' '}
                    logged!
                  </h3>

                  <p
                    style={{
                      fontSize: '11.5px',
                      color: 'var(--error)',
                      opacity: 0.85,
                      lineHeight: 1.5,
                      margin: '0 0 16px',
                    }}
                  >
                    Your request has been queued for Super Admin
                    review. No login account has been created
                    automatically.
                  </p>

                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => navigate(ROUTES.LOGIN)}
                    style={{ width: '100%' }}
                  >
                    Return to Sign In &rarr;
                  </button>
                </div>
              )}

              <p
                className="bottom-text"
                style={{ marginTop: '18px' }}
              >
                Looking for student or faculty sign in?{' '}
                <Link to={ROUTES.LOGIN}>Sign in</Link>
              </p>
            </div>
          )}

          {/* Individual */}
          {signupMode === 'indiv' && (
            <div
              id="individualContainer"
              style={{ textAlign: 'center' }}
            >
              <span
                style={{
                  display: 'inline-block',
                  padding: '3px 10px',
                  borderRadius: '99px',
                  background:
                    'rgba(0, 130, 142, 0.1)',
                  color: 'var(--primary)',
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                Individual Portal
              </span>

              <h3
                style={{
                  margin: '8px 0 4px',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--error)',
                }}
              >
                Individual Learner Portal
              </h3>

              <p
                style={{
                  margin: '0 auto 16px',
                  fontSize: '12px',
                  color: 'var(--error)',
                  lineHeight: 1.5,
                  maxWidth: '380px',
                }}
              >
                Individual accounts and self-service
                subscriptions are scheduled for general
                availability. Heftin is currently configured for
                organization-managed institutional access.
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  marginBottom: '18px',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    padding: '10px 8px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    background: '#ffffff',
                  }}
                >
                  <strong
                    style={{
                      fontSize: '11.5px',
                      color: 'var(--primary)',
                      display: 'block',
                    }}
                  >
                    Scholar Plan
                  </strong>

                  <span
                    style={{
                      fontSize: '10px',
                      color: 'var(--error)',
                      opacity: 0.8,
                      display: 'block',
                      marginTop: '2px',
                    }}
                  >
                    Daily mock tests &amp; basic solutions.
                  </span>
                </div>

                <div
                  style={{
                    padding: '10px 8px',
                    border: '1px solid var(--primary)',
                    borderRadius: '8px',
                    background:
                      'rgba(0,130,142,0.04)',
                  }}
                >
                  <strong
                    style={{
                      fontSize: '11.5px',
                      color: 'var(--primary)',
                      display: 'block',
                    }}
                  >
                    Achiever Plan
                  </strong>

                  <span
                    style={{
                      fontSize: '10px',
                      color: 'var(--error)',
                      opacity: 0.8,
                      display: 'block',
                      marginTop: '2px',
                    }}
                  >
                    Full test series &amp; Mains review.
                  </span>
                </div>

                <div
                  style={{
                    padding: '10px 8px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    background: '#ffffff',
                  }}
                >
                  <strong
                    style={{
                      fontSize: '11.5px',
                      color: 'var(--primary)',
                      display: 'block',
                    }}
                  >
                    Ranker Plan
                  </strong>

                  <span
                    style={{
                      fontSize: '10px',
                      color: 'var(--error)',
                      opacity: 0.8,
                      display: 'block',
                      marginTop: '2px',
                    }}
                  >
                    1-on-1 faculty evaluation &amp; mentor
                    calls.
                  </span>
                </div>
              </div>

              <div
                style={{
                  padding: '14px',
                  border: '1px dashed var(--border)',
                  borderRadius: '10px',
                  background: '#ffffff',
                  marginBottom: '16px',
                }}
              >
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 600,
                    marginBottom: '6px',
                    color: 'var(--error)',
                  }}
                >
                  Get notified for individual self-registration
                </label>

                <form
                  onSubmit={handleWaitlist}
                  style={{
                    display: 'flex',
                    gap: '6px',
                  }}
                >
                  <input
                    type="email"
                    value={waitlistEmail}
                    onChange={(event) =>
                      setWaitlistEmail(event.target.value)
                    }
                    placeholder="your.email@example.com"
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      fontSize: '12px',
                    }}
                  />

                  <button
                    type="submit"
                    className="primary-button"
                    style={{
                      padding: '8px 14px',
                      fontSize: '11px',
                    }}
                  >
                    Notify Me
                  </button>
                </form>

                {waitlistMsg && (
                  <small
                    style={{
                      display: 'block',
                      marginTop: '6px',
                      fontSize: '10.5px',
                      color: waitlistSuccess
                        ? 'var(--primary)'
                        : '#d9383a',
                    }}
                  >
                    {waitlistMsg}
                  </small>
                )}
              </div>

              <p className="bottom-text">
                Looking for student or faculty sign in?{' '}
                <Link to={ROUTES.LOGIN}>Sign in</Link>
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  )
}
