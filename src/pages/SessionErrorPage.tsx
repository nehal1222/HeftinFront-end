import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, GraduationCap, Loader2, LogOut, RefreshCw } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/lib/constants'

type ErrorScenario = 'expired' | 'network' | 'loading'

export function SessionErrorPage() {
  const { logout, switchRole } = useAuth()
  const navigate = useNavigate()
  const [scenario, setScenario] = useState<ErrorScenario>('expired')
  const [retrying, setRetrying] = useState(false)

  function handleRetry() {
    setRetrying(true)
    setTimeout(() => {
      setRetrying(false)
    }, 1200)
  }

  async function handleSignInAgain() {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  function handleContinueDemo() {
    switchRole('student')
    navigate(ROUTES.WORKSPACE)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-8 font-sans text-foreground">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-control bg-primary text-primary-foreground shadow-sm">
            <GraduationCap size={20} aria-hidden="true" />
          </div>
          <span className="font-display text-heading-sm font-semibold text-foreground-strong">
            Heftin Academy
          </span>
        </div>

        {/* Sample Scenario Switcher Bar */}
        <div className="mb-4 rounded-control border border-border bg-surface-elevated p-2">
          <span className="block px-1 text-caption font-semibold uppercase tracking-wider text-muted">
            Sample Error Scenarios:
          </span>
          <div className="mt-1.5 grid grid-cols-3 gap-1 text-caption font-medium">
            <button
              type="button"
              onClick={() => setScenario('expired')}
              className={`rounded-control py-1 transition-colors ${
                scenario === 'expired'
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'text-muted hover:text-foreground hover:bg-surface'
              }`}
            >
              Token Expired
            </button>
            <button
              type="button"
              onClick={() => setScenario('network')}
              className={`rounded-control py-1 transition-colors ${
                scenario === 'network'
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'text-muted hover:text-foreground hover:bg-surface'
              }`}
            >
              Network Failure
            </button>
            <button
              type="button"
              onClick={() => setScenario('loading')}
              className={`rounded-control py-1 transition-colors ${
                scenario === 'loading'
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'text-muted hover:text-foreground hover:bg-surface'
              }`}
            >
              Session Loading
            </button>
          </div>
        </div>

        {/* Dynamic Card Output */}
        <div className="rounded-card border border-border bg-surface-elevated p-6 shadow-sm sm:p-8">
          {scenario === 'loading' || retrying ? (
            /* 1. Loading Session Sample */
            <div className="flex flex-col items-center py-6 text-center">
              <div className="grid size-12 place-items-center rounded-control bg-primary-soft text-primary-dark animate-spin">
                <Loader2 size={24} aria-hidden="true" />
              </div>
              <h1 className="mt-4 font-display text-heading-sm font-semibold text-foreground-strong">
                Restoring Session
              </h1>
              <p className="mt-1 text-caption text-muted">
                Validating security tokens against GET /api/v1/auth/me...
              </p>
            </div>
          ) : scenario === 'expired' ? (
            /* 2. Token Expired Sample (401) */
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-control bg-primary-soft text-primary-dark">
                    <AlertCircle size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-caption font-semibold uppercase tracking-wider text-muted">
                      Auth Status
                    </span>
                    <h1 className="font-display text-heading-sm font-semibold text-foreground-strong">
                      Session Expired
                    </h1>
                  </div>
                </div>
                <span className="rounded-control border border-border bg-surface px-2 py-0.5 text-caption font-bold text-muted">
                  401
                </span>
              </div>

              <div className="mt-4 rounded-control border border-border bg-surface p-3.5 text-body-sm text-foreground-strong">
                Your authentication token has expired or is invalid. Please sign in again to access the workspace.
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleSignInAgain}
                  className="flex items-center justify-center gap-2 rounded-control bg-primary py-2.5 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors"
                >
                  <LogOut size={15} />
                  Sign In Again
                </button>

                <button
                  type="button"
                  onClick={handleRetry}
                  className="flex items-center justify-center gap-2 rounded-control border border-border bg-surface py-2.5 text-body-sm font-semibold text-foreground-strong hover:border-primary transition-colors"
                >
                  <RefreshCw size={15} />
                  Retry Connection
                </button>

                <button
                  type="button"
                  onClick={handleContinueDemo}
                  className="mt-1 text-center text-caption font-medium text-primary hover:underline"
                >
                  Continue with Demo Workspace &rarr;
                </button>
              </div>
            </div>
          ) : (
            /* 3. Network / Server Offline Sample (503) */
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-control bg-primary-soft text-primary-dark">
                    <AlertCircle size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-caption font-semibold uppercase tracking-wider text-muted">
                      Network Status
                    </span>
                    <h1 className="font-display text-heading-sm font-semibold text-foreground-strong">
                      Server Unreachable
                    </h1>
                  </div>
                </div>
                <span className="rounded-control border border-border bg-surface px-2 py-0.5 text-caption font-bold text-muted">
                  503
                </span>
              </div>

              <div className="mt-4 rounded-control border border-border bg-surface p-3.5 text-body-sm text-foreground-strong">
                Unable to reach the authentication server at localhost:8001. Verification timed out.
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="flex items-center justify-center gap-2 rounded-control bg-primary py-2.5 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors"
                >
                  <RefreshCw size={15} />
                  Retry Connection
                </button>

                <button
                  type="button"
                  onClick={handleContinueDemo}
                  className="flex items-center justify-center gap-2 rounded-control border border-border bg-surface py-2.5 text-body-sm font-semibold text-foreground-strong hover:border-primary transition-colors"
                >
                  Continue in Demo Mode
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 border-t border-border pt-4 text-center">
            <Link
              to={ROUTES.HOME}
              className="text-caption font-medium text-muted hover:text-foreground"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
