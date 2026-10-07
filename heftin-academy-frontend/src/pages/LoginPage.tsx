import { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  LogOut,
  User,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/lib/constants'
import type { SubscriptionPlan, UserRole } from '@/types/access'

function inferProfileFromEmail(email: string): { displayName: string; role: UserRole; plan: SubscriptionPlan } {
  const normalized = email.trim().toLowerCase()
  if (normalized.includes('admin@dpa.edu') || normalized.startsWith('admin@')) {
    return { displayName: 'Vikram Malhotra', role: 'org_admin', plan: 'institution' }
  }
  if (normalized.includes('meera') || normalized.includes('faculty') || normalized.includes('teacher')) {
    return { displayName: 'Dr. Meera Patel', role: 'faculty', plan: 'institution' }
  }
  if (normalized.includes('super') || normalized.includes('lead@heftin')) {
    return { displayName: 'Platform Administrator', role: 'super_admin', plan: 'pro' }
  }
  if (normalized.endsWith('.edu') || normalized.includes('student')) {
    return { displayName: 'Arjun Kumar', role: 'student', plan: 'institution' }
  }
  const namePart = normalized.split('@')[0].replace(/[._-]/g, ' ')
  const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1)
  return { displayName: formattedName || 'Personal Learner', role: 'individual', plan: 'scholar' }
}

export function LoginPage() {
  const { user, isAuthenticated, login, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const requestedRole = searchParams.get('role')
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

  const [email, setEmail] = useState(defaultEmail)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [sessionError, setSessionError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setSessionError(null)

    const profile = inferProfileFromEmail(email)

    try {
      await login({
        email: email.trim(),
        password,
        displayName: profile.displayName,
        role: profile.role,
        plan: profile.plan,
      })

      const destination = (location.state as { from?: string } | null)?.from ?? ROUTES.WORKSPACE
      navigate(destination, { replace: true })
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
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-12 font-sans text-foreground">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <div className="grid size-10 place-items-center rounded-control bg-primary text-primary-foreground shadow-sm">
              <GraduationCap size={22} aria-hidden="true" />
            </div>
            <span className="font-display text-heading-md font-semibold text-foreground-strong">
              Heftin Academy
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-card border border-border bg-surface-elevated p-7 shadow-sm sm:p-8">
          {isAuthenticated && user ? (
            /* State: Already signed in */
            <div className="text-center">
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-primary-soft text-primary-dark">
                <User size={24} aria-hidden="true" />
              </div>
              <h1 className="mt-4 font-display text-heading-sm font-semibold text-foreground-strong">
                Welcome back, {user.displayName}
              </h1>
              <p className="mt-1 text-body-sm text-muted">
                You are currently signed in as{' '}
                <span className="font-semibold text-foreground-strong">{user.email}</span>
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-caption font-semibold text-primary-dark capitalize">
                Role: {user.role.replace('_', ' ')}
              </div>

              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.WORKSPACE)}
                  className="flex items-center justify-center gap-2 rounded-control bg-primary py-2.5 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors shadow-sm cursor-pointer"
                >
                  <span>Continue to Workspace</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await logout()
                    setEmail('')
                    setPassword('')
                    setSessionError(null)
                  }}
                  className="flex items-center justify-center gap-2 rounded-control border border-border bg-surface py-2 text-body-sm font-medium text-muted hover:text-foreground hover:border-primary transition-colors cursor-pointer"
                >
                  <LogOut size={15} aria-hidden="true" />
                  <span>Sign Out &amp; Use Another Account</span>
                </button>
              </div>
            </div>
          ) : (
            /* State: Standard Clean Production Sign In Form */
            <div>
              <div className="mb-5">
                <h1 className="font-display text-heading-md font-semibold text-foreground-strong">
                  Sign In
                </h1>
                <p className="mt-1 text-body-sm text-muted">
                  Enter your credentials to access your academy workspace.
                </p>
              </div>

              {/* Session Error Alert Banner (Triggers on False Credentials) */}
              {sessionError && (
                <div
                  role="alert"
                  className="mb-5 flex items-start gap-3 rounded-control border border-primary-tint-3 bg-primary-soft/40 p-3.5 text-body-sm text-foreground-strong"
                >
                  <AlertCircle size={18} className="shrink-0 mt-0.5 text-primary" aria-hidden="true" />
                  <div className="space-y-1">
                    <p className="font-semibold text-primary-dark">Authentication Failed</p>
                    <p className="text-caption text-muted leading-relaxed">{sessionError}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="login-email"
                    className="block text-caption font-semibold text-foreground-strong"
                  >
                    Email Address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@institution.edu or name@gmail.com"
                    required
                    autoComplete="email"
                    className="mt-1.5 w-full rounded-control border border-border bg-surface px-3.5 py-2.5 text-body-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="login-password"
                      className="block text-caption font-semibold text-foreground-strong"
                    >
                      Password
                    </label>
                    <Link
                      to={ROUTES.FORGOT_PASSWORD}
                      className="text-caption font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative mt-1.5">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                      className="w-full rounded-control border border-border bg-surface py-2.5 pl-3.5 pr-10 text-body-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted hover:text-foreground cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-caption">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-muted hover:text-foreground">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="size-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span>Remember this device</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-control bg-primary py-2.5 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-70 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                      <span>Authenticating Session...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={16} aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>

              {/* Systematic Role Credentials Reference */}
              <div className="mt-5 border-t border-border pt-4">
                <span className="block text-caption font-semibold uppercase tracking-wider text-muted text-center mb-2.5">
                  Institutional Roles Directory
                </span>
                <div className="space-y-1.5 rounded-control border border-border bg-surface p-3 text-caption">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground-strong">Student:</span>
                    <span className="font-mono text-muted">student@dpa.edu &middot; student@123</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground-strong">Faculty:</span>
                    <span className="font-mono text-muted">faculty@dpa.edu &middot; faculty@123</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground-strong">Org Admin:</span>
                    <span className="font-mono text-muted">admin@dpa.edu &middot; admin@123</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground-strong">SuperAdmin:</span>
                    <span className="font-mono text-muted">superadmin@heftin.com &middot; superadmin@123</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground-strong">Individual:</span>
                    <span className="font-mono text-muted">learner@gmail.com &middot; learner@123</span>
                  </div>
                </div>
              </div>

              {/* Institutional access link */}
              <div className="mt-3 text-center">
                <Link
                  to={ROUTES.REQUEST_ACCESS}
                  className="text-caption font-medium text-muted hover:text-primary transition-colors"
                >
                  Need an institutional license? Request Access &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-center gap-4 text-center">
          <Link
            to={ROUTES.HOME}
            className="text-caption font-medium text-muted hover:text-foreground transition-colors"
          >
            Back to Home
          </Link>
          <span className="text-muted text-caption">&middot;</span>
          <Link
            to={ROUTES.SESSION_ERROR}
            className="text-caption font-medium text-muted hover:text-foreground transition-colors"
          >
            Session Help
          </Link>
        </div>
      </div>
    </main>
  )
}
