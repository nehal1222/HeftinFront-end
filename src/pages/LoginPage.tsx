import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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

export function LoginPage() {
  const { user, isAuthenticated, login, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

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

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-12 font-sans text-foreground">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
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
                <span className="font-semibold text-foreground-strong">
                  {user.email}
                </span>
              </p>

              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-caption font-semibold text-primary-dark capitalize">
                Role: {user.role.replace('_', ' ')}
              </div>

              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.WORKSPACE)}
                  className="flex items-center justify-center gap-2 rounded-control bg-primary py-2.5 text-body-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark shadow-sm cursor-pointer"
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
                  className="flex items-center justify-center gap-2 rounded-control border border-border bg-surface py-2 text-body-sm font-medium text-muted transition-colors hover:border-primary hover:text-foreground cursor-pointer"
                >
                  <LogOut size={15} aria-hidden="true" />
                  <span>Sign Out &amp; Use Another Account</span>
                </button>
              </div>
            </div>
          ) : (
            /* State: Standard Sign In Form */
            <div>
              <div className="mb-5">
                <h1 className="font-display text-heading-md font-semibold text-foreground-strong">
                  Sign In
                </h1>

                <p className="mt-1 text-body-sm text-muted">
                  Enter your credentials to access your academy workspace.
                </p>
              </div>

              {/* Authentication Error */}
              {sessionError && (
                <div
                  role="alert"
                  className="mb-5 flex items-start gap-3 rounded-control border border-primary-tint-3 bg-primary-soft/40 p-3.5 text-body-sm text-foreground-strong"
                >
                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-primary"
                    aria-hidden="true"
                  />

                  <div className="space-y-1">
                    <p className="font-semibold text-primary-dark">
                      Authentication Failed
                    </p>

                    <p className="text-caption leading-relaxed text-muted">
                      {sessionError}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
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
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@institution.edu or name@gmail.com"
                    required
                    autoComplete="email"
                    className="mt-1.5 w-full rounded-control border border-border bg-surface px-3.5 py-2.5 text-body-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Password */}
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
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                      className="w-full rounded-control border border-border bg-surface py-2.5 pl-3.5 pr-10 text-body-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                      className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-muted hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff size={16} aria-hidden="true" />
                      ) : (
                        <Eye size={16} aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1 text-caption">
                  <label className="flex cursor-pointer select-none items-center gap-2 text-muted hover:text-foreground">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) =>
                        setRememberMe(event.target.checked)
                      }
                      className="size-4 rounded border-border text-primary focus:ring-primary"
                    />

                    <span>Remember this device</span>
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-control bg-primary py-2.5 text-body-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                        aria-hidden="true"
                      />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={16} aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>

              {/* Institutional Access */}
              <div className="mt-5 border-t border-border pt-3.5 text-center">
                <Link
                  to={ROUTES.REQUEST_ACCESS}
                  className="text-caption font-medium text-muted transition-colors hover:text-primary"
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
            className="text-caption font-medium text-muted transition-colors hover:text-foreground"
          >
            Back to Home
          </Link>

          <span className="text-caption text-muted">&middot;</span>

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
