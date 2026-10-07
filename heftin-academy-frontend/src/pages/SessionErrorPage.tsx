import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, GraduationCap, Loader2, LogOut, RefreshCw } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/lib/constants'

export function SessionErrorPage() {
  const { logout, retrySession } = useAuth()
  const navigate = useNavigate()
  const [retrying, setRetrying] = useState(false)

  async function handleRetry() {
    setRetrying(true)
    try {
      await retrySession()
    } finally {
      setRetrying(false)
    }
  }

  async function handleReturnToSignIn() {
    await logout()
    navigate(ROUTES.LOGIN)
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

        {/* Card */}
        <div className="rounded-card border border-border bg-surface-elevated p-6 shadow-sm sm:p-8">
          {retrying ? (
            /* Session Loading State on Retry */
            <div className="flex flex-col items-center py-6 text-center">
              <div className="grid size-12 place-items-center rounded-control bg-primary-soft text-primary-dark animate-spin">
                <Loader2 size={24} aria-hidden="true" />
              </div>
              <h1 className="mt-4 font-display text-heading-xs font-semibold text-foreground-strong">
                Restoring Session
              </h1>
              <p className="mt-1 text-caption text-muted">
                Verifying authentication token and renewing security permissions...
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-caption text-muted">
                <span className="size-2 rounded-full bg-primary animate-pulse" />
                <span>Contacting authorization gateway...</span>
              </div>
            </div>
          ) : (
            /* Session Error State */
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
                Session verification failed: Authentication token has expired or is invalid (401 Unauthorized).
              </div>

              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="flex items-center justify-center gap-2 rounded-control bg-primary py-2.5 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors shadow-sm cursor-pointer"
                >
                  <RefreshCw size={15} />
                  <span>Retry Session Handshake</span>
                </button>

                <button
                  type="button"
                  onClick={handleReturnToSignIn}
                  className="flex items-center justify-center gap-2 rounded-control border border-border bg-surface py-2.5 text-body-sm font-semibold text-foreground-strong hover:border-primary transition-colors cursor-pointer"
                >
                  <LogOut size={15} />
                  <span>Return to Sign In</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-center gap-4 text-center">
          <Link
            to={ROUTES.HOME}
            className="text-caption font-medium text-muted hover:text-foreground"
          >
            Back to Home
          </Link>
          <span className="text-muted text-caption">&middot;</span>
          <Link
            to={ROUTES.REQUEST_ACCESS}
            className="text-caption font-medium text-muted hover:text-foreground"
          >
            Institutional Portal
          </Link>
        </div>
      </div>
    </main>
  )
}
