import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  Clock,
  Eye,
  GraduationCap,
  Key,
  Layers,
  Loader2,
  LogOut,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  User,
  X,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/services/auth.service'
import { ROLE_LABELS } from '@/lib/access'
import { ROUTES } from '@/lib/constants'
import { getRefreshToken } from '@/lib/storage'
import type { UserRole } from '@/types/access'

type SuiteTab = 'login' | 'signup' | 'shell' | 'error_loading' | 'session'
type AuthCategory = 'organizational' | 'individual'
type ErrorLoadingSubState = 'loading' | 'empty' | 'network_error' | 'forbidden'

export function UnifiedAuthSuitePage() {
  const { user, login, logout } = useAuth()

  // Master Active Tab
  const [activeTab, setActiveTab] = useState<SuiteTab>('login')

  // Tab 1: Login States
  const [loginCategory, setLoginCategory] =
    useState<AuthCategory>('organizational')
  const [loginEmail, setLoginEmail] = useState('student@academy.delhi.in')
  const [loginPassword, setLoginPassword] = useState('pass1234')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginFeedback, setLoginFeedback] = useState<string | null>(null)

  // Tab 2: Signup States
  const [signupType, setSignupType] =
    useState<'onboarding' | 'invite'>('onboarding')
  const [orgName, setOrgName] = useState('Delhi IAS Excellence Academy')
  const [contactName, setContactName] = useState('Dr. S. K. Verma')
  const [officialEmail, setOfficialEmail] = useState(
    'director@delhi-ias.edu.in',
  )
  const [cohortSize, setCohortSize] = useState('150')
  const [inviteToken, setInviteToken] = useState('HAC-DELHI-2026-X89')
  const [inviteAspirantName, setInviteAspirantName] =
    useState('Rohan Sharma')
  const [signupSubmitted, setSignupSubmitted] = useState(false)

  // Tab 3: Dashboard Shell States
  const [shellRole, setShellRole] = useState<UserRole>(
    user?.role || 'student',
  )
  const [isTestSimulatorOpen, setIsTestSimulatorOpen] = useState(false)
  const [simulatorQuestionIndex, setSimulatorQuestionIndex] = useState(0)
  const [simulatorAnswers, setSimulatorAnswers] = useState<
    Record<number, number>
  >({})
  const [simulatorSubmitted, setSimulatorSubmitted] = useState(false)
  const [dailyStreak, setDailyStreak] = useState(14)
  const [streakCheckedIn, setStreakCheckedIn] = useState(false)
  const [isReaderDrawerOpen, setIsReaderDrawerOpen] = useState(false)
  const [isGradingDrawerOpen, setIsGradingDrawerOpen] = useState(false)
  const [gradingScore, setGradingScore] = useState('142')
  const [gradingSubmitted, setGradingSubmitted] = useState(false)

  // Tab 4: Error & Loading States
  const [errorSubState, setErrorSubState] =
    useState<ErrorLoadingSubState>('loading')
  const [isRetryingError, setIsRetryingError] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(45)

  // Tab 5: Session Handling States
  const [sessionTtl, setSessionTtl] = useState(892)
  const [isSessionExpiredModalOpen, setIsSessionExpiredModalOpen] =
    useState(false)
  const [refreshingToken, setRefreshingToken] = useState(false)
  const [sessionNotice, setSessionNotice] = useState<string | null>(null)

  // Active Role description
  const activeRoleLabel = ROLE_LABELS[shellRole] || 'Student Aspirant'

  // Keep the shell role synchronized with the authenticated user.
  useEffect(() => {
    if (user?.role) {
      setShellRole(user.role)
    }
  }, [user?.role])

  // Countdown timer for session
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTtl((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Progress animation for simulated loading state
  useEffect(() => {
    if (activeTab === 'error_loading' && errorSubState === 'loading') {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => (prev >= 100 ? 10 : prev + 15))
      }, 700)

      return () => clearInterval(interval)
    }
  }, [activeTab, errorSubState])

  // Handle Login Execution
  async function handlePerformLogin(e: React.FormEvent) {
    e.preventDefault()

    setLoginLoading(true)
    setLoginFeedback(null)

    try {
      await login({
        email: loginEmail.trim(),
        password: loginPassword,
      })

      setLoginFeedback(
        'Login authenticated successfully. Session verified with the backend.',
      )

      setTimeout(() => {
        setActiveTab('shell')
      }, 600)
    } catch {
      setLoginFeedback(
        'Authentication failed. Please check your email and password and try again.',
      )
    } finally {
      setLoginLoading(false)
    }
  }

  // Handle Signup Submission
  function handlePerformSignup(e: React.FormEvent) {
    e.preventDefault()
    setSignupSubmitted(true)

    setTimeout(() => {
      setSignupSubmitted(false)
      setActiveTab('login')
    }, 1500)
  }

  // Handle real session refresh
  async function handleSilentRefresh() {
    const refreshToken = getRefreshToken()

    if (!refreshToken) {
      setSessionNotice(
        'No refresh token is available. Please sign in again.',
      )
      setIsSessionExpiredModalOpen(false)
      return
    }

    setRefreshingToken(true)
    setSessionNotice(null)

    try {
      await authService.refresh(refreshToken)
      setSessionTtl(900)
      setSessionNotice(
        'Session successfully renewed with live token rotation.',
      )
    } catch {
      setSessionNotice(
        'Session renewal failed. Please sign in again to continue.',
      )
    } finally {
      setRefreshingToken(false)
      setIsSessionExpiredModalOpen(false)
    }
  }

  // Real logout
  async function handleLogout() {
    await logout()
    setActiveTab('login')
    setLoginFeedback('You have been signed out. Please sign in again.')
  }

  // End-to-End Walkthrough Step
  function handleStartWalkthrough() {
    setActiveTab('login')
    setLoginFeedback(
      'Step 1 of 5: Enter your real credentials and click Sign In.',
    )
  }

  // Questions for test simulator
  const sampleQuestions = [
    {
      text: 'Which Article of the Indian Constitution enshrines the Right to Constitutional Remedies?',
      options: ['Article 19', 'Article 21', 'Article 32', 'Article 226'],
      correct: 2,
    },
    {
      text: 'The Monetary Policy Committee (MPC) in India consists of how many members?',
      options: ['4 members', '6 members', '8 members', '10 members'],
      correct: 1,
    },
    {
      text: 'Which mountain range acts as a water divide between the Indus and the Ganga river systems?',
      options: [
        'Aravalli Range',
        'Satpura Range',
        'Western Ghats',
        'Zaskar Range',
      ],
      correct: 0,
    },
  ]

  return (
    <div className="min-h-screen bg-surface font-sans text-foreground">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & UNIFIED SUITE SELECTOR */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface-elevated/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              to={ROUTES.HOME}
              className="flex items-center gap-2 text-foreground-strong hover:text-primary transition-colors"
            >
              <div className="grid size-9 place-items-center rounded-control bg-primary text-primary-foreground shadow-sm">
                <ShieldCheck size={18} />
              </div>

              <div>
                <p className="font-display text-heading-xs font-bold leading-tight">
                  Heftin Academy
                </p>
                <p className="text-eyebrow font-bold uppercase tracking-wider text-primary">
                  All-in-One Auth &amp; Shell Suite
                </p>
              </div>
            </Link>
          </div>

          {/* Master 5-in-1 Tabs */}
          <nav className="flex flex-wrap items-center gap-1.5 rounded-control border border-border bg-surface p-1">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex items-center gap-1.5 rounded-control px-3 py-1.5 text-caption font-semibold transition-all ${
                activeTab === 'login'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <Key size={14} />
              <span>1. Login</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('signup')}
              className={`flex items-center gap-1.5 rounded-control px-3 py-1.5 text-caption font-semibold transition-all ${
                activeTab === 'signup'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <Building2 size={14} />
              <span>2. Sign Up</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('shell')}
              className={`flex items-center gap-1.5 rounded-control px-3 py-1.5 text-caption font-semibold transition-all ${
                activeTab === 'shell'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <Layers size={14} />
              <span>3. Dashboard Shell</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('error_loading')}
              className={`flex items-center gap-1.5 rounded-control px-3 py-1.5 text-caption font-semibold transition-all ${
                activeTab === 'error_loading'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <AlertTriangle size={14} />
              <span>4. Error &amp; Loading</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('session')}
              className={`flex items-center gap-1.5 rounded-control px-3 py-1.5 text-caption font-semibold transition-all ${
                activeTab === 'session'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <Clock size={14} />
              <span>5. Session Handling</span>
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleStartWalkthrough}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-control border border-border bg-surface-elevated px-3 py-1.5 text-caption font-semibold text-foreground-strong hover:border-primary hover:text-primary transition-colors"
            >
              <RefreshCw size={13} />
              <span>Full Walkthrough</span>
            </button>

            <Link
              to={ROUTES.HOME}
              className="rounded-control bg-primary px-3 py-1.5 text-caption font-semibold text-primary-foreground hover:bg-primary-dark transition-colors"
            >
              View Landing Page
            </Link>
          </div>
        </div>
      </header>

      {/* Main Suite Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ========================================================================= */}
        {/* TAB 1: LOGIN */}
        {/* ========================================================================= */}
        {activeTab === 'login' && (
          <section className="mx-auto max-w-xl animate-in fade-in duration-300">
            <div className="rounded-card border border-border bg-surface-elevated p-6 shadow-sm sm:p-8">
              {/* Category Switcher */}
              <div className="flex rounded-control border border-border bg-surface p-1 text-body-sm font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setLoginCategory('organizational')
                    setLoginEmail('student@academy.delhi.in')
                  }}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-control py-2 transition-all ${
                    loginCategory === 'organizational'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  <Building2 size={16} />
                  <span>Organizational</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginCategory('individual')
                    setLoginEmail('aspirant@independent.in')
                  }}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-control py-2 transition-all ${
                    loginCategory === 'individual'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  <User size={16} />
                  <span>Individual</span>
                </button>
              </div>

              {/* Action Heading */}
              <div className="mt-6">
                <h1 className="font-display text-heading-md font-bold text-foreground-strong">
                  {loginCategory === 'organizational'
                    ? 'Organizational Portal Sign In'
                    : 'Independent Learner Sign In'}
                </h1>

                <p className="mt-1 text-caption text-muted">
                  {loginCategory === 'organizational'
                    ? 'Access your academy workspace, batch mock papers, and role privileges.'
                    : 'Self-paced UPSC civil services mock drill simulator.'}
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handlePerformLogin} className="mt-6 space-y-4">
                <div>
                  <label className="text-caption font-semibold text-foreground-strong">
                    Email
                  </label>

                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="mt-1 w-full rounded-control border border-border bg-surface px-3 py-2 text-body-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-caption font-semibold text-foreground-strong">
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={() => setActiveTab('session')}
                      className="text-caption font-semibold text-primary hover:underline"
                    >
                      Trouble signing in?
                    </button>
                  </div>

                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="mt-1 w-full rounded-control border border-border bg-surface px-3 py-2 text-body-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between text-caption text-muted">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-border text-primary"
                    />
                    <span>Keep session active</span>
                  </label>

                  <span className="font-mono text-caption text-primary">
                    JWT + Silent Rotate
                  </span>
                </div>

                {loginFeedback && (
                  <div className="rounded-control border border-primary/30 bg-primary-soft/50 p-2.5 text-caption font-semibold text-primary-dark">
                    {loginFeedback}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-control bg-primary py-2.5 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-70"
                >
                  {loginLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign in to Workspace Shell</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-caption text-muted">
                <span>New to Heftin Academy?</span>

                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className="font-semibold text-primary hover:underline"
                >
                  Request Onboarding / Sign Up &rarr;
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SIGN UP & ONBOARDING */}
        {/* ========================================================================= */}
        {activeTab === 'signup' && (
          <section className="mx-auto max-w-xl animate-in fade-in duration-300">
            <div className="rounded-card border border-border bg-surface-elevated p-6 shadow-sm sm:p-8">
              {/* Type Switcher */}
              <div className="flex rounded-control border border-border bg-surface p-1 text-body-sm font-semibold">
                <button
                  type="button"
                  onClick={() => setSignupType('onboarding')}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-control py-2 transition-all ${
                    signupType === 'onboarding'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  <Building2 size={16} />
                  <span>Academy Request</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSignupType('invite')}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-control py-2 transition-all ${
                    signupType === 'invite'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  <GraduationCap size={16} />
                  <span>Student Invite</span>
                </button>
              </div>

              {signupType === 'onboarding' ? (
                <form
                  onSubmit={handlePerformSignup}
                  className="mt-6 space-y-4"
                >
                  <div>
                    <h1 className="font-display text-heading-md font-bold text-foreground-strong">
                      Request Institutional Academy Onboarding
                    </h1>

                    <p className="mt-1 text-caption text-muted">
                      Submit prospective institute details to receive enterprise
                      quota allocations and admin credentials.
                    </p>
                  </div>

                  <div>
                    <label className="text-caption font-semibold text-foreground-strong">
                      Academy / Coaching Center Name
                    </label>

                    <input
                      type="text"
                      required
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="mt-1 w-full rounded-control border border-border bg-surface px-3 py-2 text-body-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-caption font-semibold text-foreground-strong">
                        Director / Contact Name
                      </label>

                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="mt-1 w-full rounded-control border border-border bg-surface px-3 py-2 text-body-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-caption font-semibold text-foreground-strong">
                        Official Domain Email
                      </label>

                      <input
                        type="email"
                        required
                        value={officialEmail}
                        onChange={(e) => setOfficialEmail(e.target.value)}
                        className="mt-1 w-full rounded-control border border-border bg-surface px-3 py-2 text-body-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-caption font-semibold text-foreground-strong">
                      Projected Cohort Aspirant Volume
                    </label>

                    <select
                      value={cohortSize}
                      onChange={(e) => setCohortSize(e.target.value)}
                      className="mt-1 w-full rounded-control border border-border bg-surface px-3 py-2 text-body-sm text-foreground focus:border-primary focus:outline-none"
                    >
                      <option value="50">
                        50 - 100 Aspirants (Small Batch)
                      </option>
                      <option value="150">
                        100 - 300 Aspirants (Standard Cohort)
                      </option>
                      <option value="500">
                        300 - 1000 Aspirants (Multi-Center)
                      </option>
                      <option value="2000">
                        1000+ Aspirants (Enterprise Network)
                      </option>
                    </select>
                  </div>

                  {signupSubmitted && (
                    <div className="rounded-control border border-primary/30 bg-primary-soft/50 p-2.5 text-caption font-semibold text-primary-dark">
                      Onboarding request dispatched to Platform Central.
                      Verification email sent!
                    </div>
                  )}

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-control bg-primary py-2.5 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors shadow-sm"
                  >
                    <span>Submit Onboarding Request</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              ) : (
                <form
                  onSubmit={handlePerformSignup}
                  className="mt-6 space-y-4"
                >
                  <div>
                    <h1 className="font-display text-heading-md font-bold text-foreground-strong">
                      Activate Academy Cohort Invite
                    </h1>

                    <p className="mt-1 text-caption text-muted">
                      Enter the one-time activation voucher issued by your
                      coaching administrator.
                    </p>
                  </div>

                  <div>
                    <label className="text-caption font-semibold text-foreground-strong">
                      Invite Code / Security Voucher
                    </label>

                    <input
                      type="text"
                      required
                      value={inviteToken}
                      onChange={(e) => setInviteToken(e.target.value)}
                      className="mt-1 w-full rounded-control border border-border bg-surface px-3 py-2 font-mono text-body-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-caption font-semibold text-foreground-strong">
                      Aspirant Full Name
                    </label>

                    <input
                      type="text"
                      required
                      value={inviteAspirantName}
                      onChange={(e) => setInviteAspirantName(e.target.value)}
                      className="mt-1 w-full rounded-control border border-border bg-surface px-3 py-2 text-body-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-caption font-semibold text-foreground-strong">
                        Create Password
                      </label>

                      <input
                        type="password"
                        required
                        defaultValue="studentPass123!"
                        className="mt-1 w-full rounded-control border border-border bg-surface px-3 py-2 text-body-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-caption font-semibold text-foreground-strong">
                        Confirm Password
                      </label>

                      <input
                        type="password"
                        required
                        defaultValue="studentPass123!"
                        className="mt-1 w-full rounded-control border border-border bg-surface px-3 py-2 text-body-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  {signupSubmitted && (
                    <div className="rounded-control border border-primary/30 bg-primary-soft/50 p-2.5 text-caption font-semibold text-primary-dark">
                      Student account successfully created! Directing to
                      Login...
                    </div>
                  )}

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-control bg-primary py-2.5 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors shadow-sm"
                  >
                    <span>Activate Student Account &amp; Proceed</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}

              <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-caption text-muted">
                <span>Already have active credentials?</span>

                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="font-semibold text-primary hover:underline"
                >
                  Return to Sign In &rarr;
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: AUTH TO DASHBOARD SHELL */}
        {/* ========================================================================= */}
        {activeTab === 'shell' && (
          <section className="space-y-6 animate-in fade-in duration-300">
            {/* Shell Header Controls */}
            <div className="rounded-card border border-border bg-surface-elevated p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-control bg-primary text-primary-foreground font-display font-bold text-heading-xs shadow-sm">
                  {shellRole.charAt(0).toUpperCase()}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-display text-heading-sm font-bold text-foreground-strong">
                      {user?.displayName || loginEmail.split('@')[0]}
                    </h1>

                    <span className="rounded-full bg-primary-soft text-primary-dark px-2.5 py-0.5 text-caption font-bold">
                      {activeRoleLabel}
                    </span>
                  </div>

                  <p className="text-caption text-muted">
                    {user?.email || loginEmail} &middot; Active Session:{' '}
                    {Math.floor(sessionTtl / 60)}m {sessionTtl % 60}s
                  </p>
                </div>
              </div>

              {/* Authenticated Session Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-caption font-bold text-muted">
                  Authenticated:
                </span>

                <span className="rounded-control border border-primary/30 bg-primary-soft px-2.5 py-1 text-caption font-semibold text-primary-dark">
                  {activeRoleLabel}
                </span>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-control border border-border bg-surface px-3 py-1 text-caption font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <LogOut size={13} />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Interactive Shell Features Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="rounded-card border border-border bg-surface-elevated p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-primary-soft text-primary-dark px-2 py-0.5 text-caption font-bold">
                      Interactive Simulator
                    </span>
                    <span className="text-caption text-muted">
                      GS Paper 1
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-heading-xs font-bold text-foreground-strong">
                    UPSC Prelims Mock Simulator
                  </h3>

                  <p className="mt-2 text-caption text-muted leading-relaxed">
                    Live timed question drill with instant negative marking
                    calculation (-0.66 marks) and breakdown.
                  </p>
                </div>

                <div className="mt-5 border-t border-border pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsTestSimulatorOpen(true)
                      setSimulatorSubmitted(false)
                      setSimulatorAnswers({})
                      setSimulatorQuestionIndex(0)
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-control bg-primary py-2 text-caption font-semibold text-primary-foreground hover:bg-primary-dark transition-colors shadow-sm"
                  >
                    <BookOpen size={14} />
                    <span>Launch Test Simulator Modal</span>
                  </button>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="rounded-card border border-border bg-surface-elevated p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-primary-soft text-primary-dark px-2 py-0.5 text-caption font-bold">
                      Aspirant Discipline
                    </span>

                    <span className="font-mono text-caption text-primary">
                      {dailyStreak} Days Active
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-heading-xs font-bold text-foreground-strong">
                    Daily Streak Check-in
                  </h3>

                  <p className="mt-2 text-caption text-muted leading-relaxed">
                    Personal best consistency tracker. Mark your daily
                    attendance to retain leaderboard momentum.
                  </p>
                </div>

                <div className="mt-5 border-t border-border pt-4">
                  <button
                    type="button"
                    disabled={streakCheckedIn}
                    onClick={() => {
                      setDailyStreak((prev) => prev + 1)
                      setStreakCheckedIn(true)
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-control border border-border bg-surface py-2 text-caption font-semibold text-foreground-strong hover:border-primary hover:text-primary transition-colors disabled:opacity-60"
                  >
                    <CheckCircle2
                      size={14}
                      className={streakCheckedIn ? 'text-primary' : ''}
                    />

                    <span>
                      {streakCheckedIn
                        ? 'Attendance Confirmed Today (+1 Day)'
                        : 'Check In for Today'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="rounded-card border border-border bg-surface-elevated p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-primary-soft text-primary-dark px-2 py-0.5 text-caption font-bold">
                      Curriculum Hub
                    </span>

                    <span className="text-caption text-muted">
                      Syllabus 2026
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-heading-xs font-bold text-foreground-strong">
                    General Studies In-App Reader
                  </h3>

                  <p className="mt-2 text-caption text-muted leading-relaxed">
                    Inspect core constitutional frameworks, fiscal policy
                    breakdowns, and geography references.
                  </p>
                </div>

                <div className="mt-5 border-t border-border pt-4">
                  <button
                    type="button"
                    onClick={() => setIsReaderDrawerOpen(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-control border border-border bg-surface py-2 text-caption font-semibold text-foreground-strong hover:border-primary hover:text-primary transition-colors"
                  >
                    <Eye size={14} />
                    <span>Open Study Reader Drawer</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Lifecycle Triggers */}
            <div className="rounded-card border border-border bg-surface-elevated p-6 shadow-sm">
              <p className="text-caption font-bold uppercase tracking-wider text-muted">
                Lifecycle &amp; Session Stress-Test Actions
              </p>

              <div className="mt-3 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsSessionExpiredModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-control border border-border bg-surface px-3 py-2 text-caption font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <AlertCircle size={14} className="text-primary" />
                  <span>Simulate 401 Session Expiry Modal</span>
                </button>

                <button
                  type="button"
                  onClick={handleSilentRefresh}
                  disabled={refreshingToken}
                  className="flex items-center gap-1.5 rounded-control border border-border bg-surface px-3 py-2 text-caption font-semibold text-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-60"
                >
                  <RefreshCw
                    size={14}
                    className={
                      refreshingToken ? 'animate-spin text-primary' : ''
                    }
                  />

                  <span>Execute Silent Refresh (/auth/refresh)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('error_loading')
                    setErrorSubState('network_error')
                  }}
                  className="flex items-center gap-1.5 rounded-control border border-border bg-surface px-3 py-2 text-caption font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <ShieldAlert size={14} className="text-primary" />
                  <span>Simulate Gateway Network Outage</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsGradingDrawerOpen(true)}
                  className="flex items-center gap-1.5 rounded-control border border-border bg-surface px-3 py-2 text-caption font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <GraduationCap size={14} className="text-primary" />
                  <span>Open Faculty Grading Drawer</span>
                </button>
              </div>

              {sessionNotice && (
                <div className="mt-3 rounded-control border border-primary/30 bg-primary-soft/50 p-2.5 text-caption font-semibold text-primary-dark">
                  {sessionNotice}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ERROR & LOADING STATES TESTBENCH */}
        {/* ========================================================================= */}
        {activeTab === 'error_loading' && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <div className="rounded-card border border-border bg-surface-elevated p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <span className="text-caption font-bold uppercase tracking-wider text-muted">
                Inspect Async &amp; Error Boundary States:
              </span>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setErrorSubState('loading')}
                  className={`rounded-control px-3 py-1.5 text-caption font-semibold transition-all ${
                    errorSubState === 'loading'
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'border border-border bg-surface text-foreground hover:border-primary'
                  }`}
                >
                  1. Async Loading Skeleton
                </button>

                <button
                  type="button"
                  onClick={() => setErrorSubState('empty')}
                  className={`rounded-control px-3 py-1.5 text-caption font-semibold transition-all ${
                    errorSubState === 'empty'
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'border border-border bg-surface text-foreground hover:border-primary'
                  }`}
                >
                  2. Empty Record State
                </button>

                <button
                  type="button"
                  onClick={() => setErrorSubState('network_error')}
                  className={`rounded-control px-3 py-1.5 text-caption font-semibold transition-all ${
                    errorSubState === 'network_error'
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'border border-border bg-surface text-foreground hover:border-primary'
                  }`}
                >
                  3. 500 Network Outage &amp; Retry
                </button>

                <button
                  type="button"
                  onClick={() => setErrorSubState('forbidden')}
                  className={`rounded-control px-3 py-1.5 text-caption font-semibold transition-all ${
                    errorSubState === 'forbidden'
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'border border-border bg-surface text-foreground hover:border-primary'
                  }`}
                >
                  4. 403 Forbidden Ceiling Gate
                </button>
              </div>
            </div>

            <div className="rounded-card border border-border bg-surface-elevated p-8 shadow-sm min-h-[380px] flex items-center justify-center">
              {errorSubState === 'loading' && (
                <div className="w-full max-w-lg space-y-5 text-center">
                  <div className="mx-auto grid size-12 place-items-center rounded-control bg-primary-soft text-primary-dark animate-spin">
                    <Loader2 size={24} />
                  </div>

                  <div>
                    <h2 className="font-display text-heading-sm font-bold text-foreground-strong">
                      Hydrating Secure Session &amp; Ceiling Matrix
                    </h2>

                    <p className="mt-1 text-caption text-muted">
                      Exchanging refresh token for active bearer token and
                      rights claims...
                    </p>
                  </div>

                  <div className="w-full rounded-full bg-border h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-300"
                      style={{ width: `${loadingProgress}%` }}
                    ></div>
                  </div>

                  <div className="space-y-3 pt-3">
                    <div className="h-4 w-3/4 rounded bg-border animate-pulse mx-auto"></div>
                    <div className="h-4 w-1/2 rounded bg-border animate-pulse mx-auto"></div>
                  </div>
                </div>
              )}

              {errorSubState === 'empty' && (
                <div className="w-full max-w-md text-center space-y-4">
                  <div className="mx-auto grid size-14 place-items-center rounded-full bg-primary-soft text-primary-dark">
                    <Layers size={28} />
                  </div>

                  <div>
                    <h2 className="font-display text-heading-sm font-bold text-foreground-strong">
                      No Test Series Assigned
                    </h2>

                    <p className="mt-1 text-caption text-muted leading-relaxed">
                      Your academy administrator has not scheduled any mock
                      exams for batch 101 this week.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('shell')}
                    className="inline-flex items-center gap-1.5 rounded-control bg-primary px-4 py-2 text-caption font-semibold text-primary-foreground hover:bg-primary-dark transition-colors shadow-sm"
                  >
                    <span>Return to Workspace Shell</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {errorSubState === 'network_error' && (
                <div className="w-full max-w-md text-center space-y-4">
                  <div className="mx-auto grid size-14 place-items-center rounded-full bg-primary-soft text-primary-dark">
                    <AlertCircle size={28} />
                  </div>

                  <div>
                    <h2 className="font-display text-heading-sm font-bold text-foreground-strong">
                      500 Network Connection Interrupted
                    </h2>

                    <p className="mt-1 text-caption text-muted leading-relaxed">
                      Unable to synchronize exam telemetry with backend API.
                      Automatic resilient retry active.
                    </p>
                  </div>

                  <div className="rounded-control border border-border bg-surface p-3 text-caption font-mono text-muted">
                    ERR_GATEWAY_TIMEOUT: /api/v1/organization/exams (Retrying
                    in 4s)
                  </div>

                  <button
                    type="button"
                    disabled={isRetryingError}
                    onClick={() => {
                      setIsRetryingError(true)

                      setTimeout(() => {
                        setIsRetryingError(false)
                        setErrorSubState('loading')
                      }, 1000)
                    }}
                    className="inline-flex items-center gap-2 rounded-control bg-primary px-5 py-2.5 text-caption font-semibold text-primary-foreground hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-70"
                  >
                    <RefreshCw
                      size={14}
                      className={isRetryingError ? 'animate-spin' : ''}
                    />

                    <span>
                      {isRetryingError
                        ? 'Re-establishing Connection...'
                        : 'Retry Connection Now'}
                    </span>
                  </button>
                </div>
              )}

              {errorSubState === 'forbidden' && (
                <div className="w-full max-w-md text-center space-y-4">
                  <div className="mx-auto grid size-14 place-items-center rounded-full bg-primary-soft text-primary-dark">
                    <ShieldAlert size={28} />
                  </div>

                  <div>
                    <h2 className="font-display text-heading-sm font-bold text-foreground-strong">
                      403 Forbidden: Ceiling Restriction
                    </h2>

                    <p className="mt-1 text-caption text-muted leading-relaxed">
                      Your assigned role ({shellRole}) does not possess the{' '}
                      <code className="font-mono text-primary font-bold">
                        org_exam:write
                      </code>{' '}
                      privilege required to modify paper templates.
                    </p>
                  </div>

                  <div className="rounded-control border border-border bg-surface p-3 text-caption text-muted">
                    Request permission elevation from your Organization
                    Administrator. Access is determined by the authenticated
                    account and backend rights.
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('shell')}
                    className="inline-flex items-center gap-1.5 rounded-control bg-primary px-4 py-2 text-caption font-semibold text-primary-foreground hover:bg-primary-dark transition-colors shadow-sm"
                  >
                    <span>Return to Workspace</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SESSION HANDLING & LIFECYCLE */}
        {/* ========================================================================= */}
        {activeTab === 'session' && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Session Status Card */}
              <div className="rounded-card border border-border bg-surface-elevated p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-heading-sm font-bold text-foreground-strong">
                    Active JWT Session Telemetry
                  </h2>

                  <span className="rounded-full bg-primary-soft text-primary-dark px-2.5 py-0.5 text-caption font-bold">
                    Connected
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-2 text-caption">
                    <span className="text-muted">
                      Access Token Remaining:
                    </span>

                    <span className="font-mono font-bold text-primary">
                      {Math.floor(sessionTtl / 60)}m {sessionTtl % 60}s
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-border pb-2 text-caption">
                    <span className="text-muted">Refresh Token Policy:</span>

                    <span className="font-semibold text-foreground">
                      Backend Refresh Token Rotation
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-border pb-2 text-caption">
                    <span className="text-muted">Tenant Organization ID:</span>

                    <span className="font-mono text-muted">
                      {user?.email ? 'Authenticated Organization' : 'Unknown'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-border pb-2 text-caption">
                    <span className="text-muted">
                      Effective Rights Ceiling:
                    </span>

                    <span className="font-semibold text-primary">
                      Backend Authenticated Rights
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={handleSilentRefresh}
                    disabled={refreshingToken}
                    className="flex-1 flex items-center justify-center gap-2 rounded-control bg-primary py-2 text-caption font-semibold text-primary-foreground hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-60"
                  >
                    <RefreshCw
                      size={14}
                      className={refreshingToken ? 'animate-spin' : ''}
                    />

                    <span>Silent Refresh Token</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSessionExpiredModalOpen(true)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-control border border-border bg-surface py-2 text-caption font-semibold text-foreground hover:border-primary transition-colors"
                  >
                    <AlertCircle size={14} className="text-primary" />
                    <span>Trigger 401 Expiry</span>
                  </button>
                </div>
              </div>

              {/* Session Claims Inspector */}
              <div className="rounded-card border border-border bg-surface-elevated p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-heading-sm font-bold text-foreground-strong">
                    Authenticated Session Profile
                  </h2>

                  <span className="font-mono text-caption text-muted">
                    Backend Verified
                  </span>
                </div>

                <div className="rounded-control border border-border bg-surface p-4 font-mono text-caption text-foreground space-y-1.5 overflow-x-auto">
                  <p>
                    <span className="text-primary font-bold">"id":</span>{' '}
                    "{user?.email ? 'authenticated-user' : 'unknown'}",
                  </p>

                  <p>
                    <span className="text-primary font-bold">"email":</span>{' '}
                    "{user?.email || 'unknown'}",
                  </p>

                  <p>
                    <span className="text-primary font-bold">"role":</span>{' '}
                    "{user?.role || shellRole}",
                  </p>

                  <p>
                    <span className="text-primary font-bold">"plan":</span>{' '}
                    "{user?.plan || 'unknown'}",
                  </p>

                  <p>
                    <span className="text-primary font-bold">
                      "permissions":
                    </span>{' '}
                    {JSON.stringify(user?.permissions || [])},
                  </p>

                  <p>
                    <span className="text-primary font-bold">
                      "entitlements":
                    </span>{' '}
                    {JSON.stringify(user?.entitlements || [])}
                  </p>
                </div>

                <p className="text-caption text-muted">
                  User identity and access information are populated from the
                  authenticated backend session.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: UPSC PRELIMS TEST SIMULATOR */}
      {/* ========================================================================= */}
      {isTestSimulatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-card border border-border bg-surface-elevated p-6 shadow-xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="text-caption font-semibold uppercase tracking-wider text-primary">
                  UPSC CSE Prelims Mock Drill 2026
                </span>

                <h2 className="font-display text-heading-xs font-bold text-foreground-strong">
                  Question {simulatorQuestionIndex + 1} of{' '}
                  {sampleQuestions.length}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsTestSimulatorOpen(false)}
                className="rounded-control p-1 text-muted hover:bg-surface hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            {!simulatorSubmitted ? (
              <div>
                <p className="text-body font-semibold text-foreground-strong leading-relaxed">
                  {sampleQuestions[simulatorQuestionIndex].text}
                </p>

                <div className="mt-4 space-y-2.5">
                  {sampleQuestions[simulatorQuestionIndex].options.map(
                    (opt, i) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() =>
                          setSimulatorAnswers({
                            ...simulatorAnswers,
                            [simulatorQuestionIndex]: i,
                          })
                        }
                        className={`w-full rounded-control border p-3 text-left text-body-sm transition-all flex items-center justify-between ${
                          simulatorAnswers[simulatorQuestionIndex] === i
                            ? 'border-primary bg-primary-soft text-primary-dark font-semibold'
                            : 'border-border bg-surface text-foreground hover:border-primary/50'
                        }`}
                      >
                        <span>{opt}</span>

                        <span className="font-mono text-caption text-muted">
                          Option {String.fromCharCode(65 + i)}
                        </span>
                      </button>
                    ),
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <button
                    type="button"
                    disabled={simulatorQuestionIndex === 0}
                    onClick={() =>
                      setSimulatorQuestionIndex((prev) => prev - 1)
                    }
                    className="rounded-control border border-border bg-surface px-4 py-2 text-caption font-semibold text-foreground hover:border-primary disabled:opacity-40"
                  >
                    &larr; Previous Question
                  </button>

                  {simulatorQuestionIndex < sampleQuestions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setSimulatorQuestionIndex((prev) => prev + 1)
                      }
                      className="rounded-control bg-primary px-4 py-2 text-caption font-semibold text-primary-foreground hover:bg-primary-dark"
                    >
                      Next Question &rarr;
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSimulatorSubmitted(true)}
                      className="rounded-control bg-primary px-5 py-2 text-caption font-semibold text-primary-foreground hover:bg-primary-dark"
                    >
                      Submit Exam Paper
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="mx-auto grid size-14 place-items-center rounded-full bg-primary-soft text-primary-dark">
                  <CheckCircle2 size={32} />
                </div>

                <h3 className="font-display text-heading-sm font-bold text-foreground-strong">
                  Exam Paper Evaluated
                </h3>

                <div className="mx-auto max-w-xs rounded-control border border-border bg-surface p-4 text-center">
                  <p className="text-caption text-muted">Final Raw Score</p>

                  <p className="font-display text-heading-md font-bold text-primary">
                    {Object.entries(simulatorAnswers).filter(
                      ([qIdx, ans]) =>
                        sampleQuestions[Number(qIdx)].correct === ans,
                    ).length *
                      2 -
                      Object.entries(simulatorAnswers).filter(
                        ([qIdx, ans]) =>
                          sampleQuestions[Number(qIdx)].correct !== ans,
                      ).length *
                        0.66}{' '}
                    / 6.00 Marks
                  </p>

                  <p className="mt-1 text-caption text-muted">
                    Negative calculus applied (-0.66)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsTestSimulatorOpen(false)}
                  className="rounded-control bg-primary px-6 py-2 text-caption font-semibold text-primary-foreground hover:bg-primary-dark"
                >
                  Close &amp; Return to Shell
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: 401 SESSION EXPIRED MODAL */}
      {/* ========================================================================= */}
      {isSessionExpiredModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-card border border-border bg-surface-elevated p-6 shadow-xl space-y-4 text-center animate-in zoom-in-95 duration-200">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-primary-soft text-primary-dark">
              <AlertCircle size={24} />
            </div>

            <div>
              <h3 className="font-display text-heading-xs font-bold text-foreground-strong">
                Session Expired
              </h3>

              <p className="mt-1 text-caption text-muted leading-relaxed">
                Your secure session has reached its inactivity threshold.
                Re-validate your token to prevent test score loss.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={handleSilentRefresh}
                disabled={refreshingToken}
                className="flex items-center justify-center gap-2 rounded-control bg-primary py-2.5 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  className={refreshingToken ? 'animate-spin' : ''}
                />

                <span>Renew Session (Silent Refresh)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsSessionExpiredModalOpen(false)
                  setActiveTab('login')
                }}
                className="rounded-control border border-border bg-surface py-2 text-caption font-semibold text-foreground hover:border-primary transition-colors"
              >
                Sign In with Credentials
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DRAWER 1: STUDY MODULE READER */}
      {/* ========================================================================= */}
      {isReaderDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-surface-elevated p-6 shadow-2xl flex flex-col justify-between border-l border-border animate-in slide-in-from-right duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-primary" />

                  <h3 className="font-display text-heading-xs font-bold text-foreground-strong">
                    Indian Polity Syllabus Reader
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setIsReaderDrawerOpen(false)}
                  className="rounded-control p-1 text-muted hover:bg-surface hover:text-foreground"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3 text-body-sm text-foreground-strong leading-relaxed">
                <p className="font-semibold text-primary">
                  Chapter 3: Fundamental Rights &amp; Remedies
                </p>

                <p className="text-muted text-caption">
                  Articles 12 to 35 contained in Part III of the Constitution
                  deal with Fundamental Rights. These rights are justiciable,
                  allowing citizens to move the Supreme Court under Article 32
                  directly for enforcement.
                </p>

                <div className="rounded-control border border-border bg-surface p-3 text-caption text-foreground">
                  <p className="font-bold text-primary mb-1">
                    Key Landmark Precedents:
                  </p>

                  <ul className="list-disc pl-4 space-y-1 text-muted">
                    <li>
                      Kesavananda Bharati v. State of Kerala (1973) - Basic
                      Structure Doctrine
                    </li>
                    <li>
                      Maneka Gandhi v. Union of India (1978) - Procedural Due
                      Process
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsReaderDrawerOpen(false)}
              className="mt-6 w-full rounded-control bg-primary py-2 text-caption font-semibold text-primary-foreground hover:bg-primary-dark"
            >
              Close Syllabus Reader
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DRAWER 2: FACULTY ESSAY GRADING DRAWER */}
      {/* ========================================================================= */}
      {isGradingDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-surface-elevated p-6 shadow-2xl flex flex-col justify-between border-l border-border animate-in slide-in-from-right duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <GraduationCap size={18} className="text-primary" />

                  <h3 className="font-display text-heading-xs font-bold text-foreground-strong">
                    Faculty Essay Evaluation Drawer
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setIsGradingDrawerOpen(false)}
                  className="rounded-control p-1 text-muted hover:bg-surface hover:text-foreground"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3 text-body-sm">
                <div>
                  <span className="text-caption font-bold text-muted">
                    Candidate:
                  </span>

                  <p className="font-semibold text-foreground-strong">
                    Aarav K. (Batch GS-101)
                  </p>
                </div>

                <div>
                  <span className="text-caption font-bold text-muted">
                    Essay Topic:
                  </span>

                  <p className="text-caption text-foreground">
                    "Artificial Intelligence Governance and Democratic
                    Safeguards in Developing Nations"
                  </p>
                </div>

                <div>
                  <label className="text-caption font-bold text-foreground-strong">
                    Award Marks (Out of 250)
                  </label>

                  <input
                    type="number"
                    max={250}
                    value={gradingScore}
                    onChange={(e) => setGradingScore(e.target.value)}
                    className="mt-1 w-full rounded-control border border-border bg-surface px-3 py-2 text-body-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-caption font-bold text-foreground-strong">
                    Faculty Evaluation Feedback
                  </label>

                  <textarea
                    rows={3}
                    defaultValue="Strong constitutional backing in paragraph 2. Needs more quantitative data regarding digital divide in rural panchayats."
                    className="mt-1 w-full rounded-control border border-border bg-surface px-3 py-2 text-caption text-foreground focus:border-primary focus:outline-none"
                  ></textarea>
                </div>

                {gradingSubmitted && (
                  <div className="rounded-control border border-primary/30 bg-primary-soft/50 p-2.5 text-caption font-semibold text-primary-dark">
                    Marks officially submitted and published to student report
                    card!
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setGradingSubmitted(true)

                  setTimeout(() => {
                    setGradingSubmitted(false)
                    setIsGradingDrawerOpen(false)
                  }, 1200)
                }}
                className="flex-1 rounded-control bg-primary py-2 text-caption font-semibold text-primary-foreground hover:bg-primary-dark"
              >
                Submit Score &amp; Publish
              </button>

              <button
                type="button"
                onClick={() => setIsGradingDrawerOpen(false)}
                className="rounded-control border border-border bg-surface px-4 py-2 text-caption font-semibold text-foreground hover:border-primary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
