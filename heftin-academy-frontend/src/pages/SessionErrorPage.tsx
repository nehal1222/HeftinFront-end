import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Loader2, LogOut, RefreshCw } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/lib/constants'

export function SessionErrorPage() {
  const { logout, switchRole } = useAuth()
  const navigate = useNavigate()
  const [view, setView] = useState<'error' | 'loading'>('error')
  const [retrying, setRetrying] = useState(false)

  function handleRetry() {
    setRetrying(true)
    setTimeout(() => {
      setRetrying(false)
    }, 1000)
  }

  async function handleReturnToSignIn() {
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
        {/* Toggle Sample Views */}
        <div className="mb-4 flex items-center justify-center gap-1 rounded-control border border-border bg-surface-elevated p-1 text-caption font-medium">
          <span className="px-2 text-muted">Sample State:</span>
          <button
            type="button"
            onClick={() => setView('error')}
            className={`rounded-control px-3 py-1 transition-colors ${
              view === 'error'
                ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                : 'text-muted hover:text-foreground'
            }`}
          >
            Session Error
          </button>
          <button
            type="button"
            onClick={() => setView('loading')}
            className={`rounded-control px-3 py-1 transition-colors ${
              view === 'loading'
                ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                : 'text-muted hover:text-foreground'
            }`}
          >
            Session Loading
          </button>
        </div>

        {/* The Exact Card */}
        <div className="rounded-card border border-border bg-surface-elevated p-6 shadow-sm sm:p-8">
          {view === 'loading' || retrying ? (
            /* Loading State */
            <div className="flex flex-col items-center py-6 text-center">
              <div className="grid size-12 place-items-center rounded-control bg-primary-soft text-primary-dark animate-spin">
                <Loader2 size={24} aria-hidden="true" />
              </div>
              <h1 className="mt-4 font-display text-heading-xs font-semibold text-foreground-strong">
                Restoring Session
              </h1>
              <p className="mt-1 text-caption text-muted">
                Verifying authentication token and permissions...
              </p>
            </div>
          ) : (
            /* The Exact Session Error Screen */
            <div>
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-control bg-primary-soft text-primary-dark">
                  <AlertCircle size={22} aria-hidden="true" />
                </div>
                <div>
                  <span className="text-caption font-semibold uppercase tracking-wider text-muted">
                    Authentication Status
                  </span>
                  <h1 className="font-display text-heading-sm font-semibold text-foreground-strong">
                    Session Error
                  </h1>
                </div>
              </div>

              <div className="mt-4 rounded-control border border-border bg-surface p-3.5 text-body-sm text-foreground-strong">
                Session verification failed: Authentication token has expired or is invalid.
              </div>

              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="flex items-center justify-center gap-2 rounded-control bg-primary py-2.5 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors shadow-sm"
                >
                  <RefreshCw size={15} />
                  Retry Session
                </button>

                <button
                  type="button"
                  onClick={handleReturnToSignIn}
                  className="flex items-center justify-center gap-2 rounded-control border border-border bg-surface py-2.5 text-body-sm font-semibold text-foreground-strong hover:border-primary transition-colors"
                >
                  <LogOut size={15} />
                  Return to Sign In
                </button>

                <button
                  type="button"
                  onClick={handleContinueDemo}
                  className="mt-1 text-center text-caption font-medium text-primary hover:underline"
                >
                  Continue with demo profile &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
