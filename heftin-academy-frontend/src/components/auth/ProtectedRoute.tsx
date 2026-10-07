import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AlertCircle, Loader2, LogOut, RefreshCw } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { useAuth } from '@/hooks/useAuth'

export function ProtectedRoute() {
  const {
    isAuthenticated,
    isLoadingSession,
    sessionError,
    retrySession,
    logout,
  } = useAuth()
  const location = useLocation()

  // 1. Session Loading Output State
  if (isLoadingSession) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-surface p-6 font-sans text-foreground">
        <div className="flex flex-col items-center text-center">
          <div className="grid size-12 place-items-center rounded-control bg-primary-soft text-primary-dark animate-spin">
            <Loader2 size={24} aria-hidden="true" />
          </div>
          <h1 className="mt-4 font-display text-heading-xs font-semibold text-foreground-strong">
            Restoring Session
          </h1>
          <p className="mt-1 text-caption text-muted">
            Verifying authentication token and permissions with authorization gateway...
          </p>
        </div>
      </main>
    )
  }

  // 2. Error Loading Session Output State
  if (sessionError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface p-6 font-sans text-foreground">
        <div className="w-full max-w-md rounded-card border border-border bg-surface-elevated p-6 shadow-sm sm:p-8">
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
            {sessionError}
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={retrySession}
              className="flex items-center justify-center gap-2 rounded-control bg-primary py-2.5 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors shadow-sm cursor-pointer"
            >
              <RefreshCw size={15} />
              <span>Retry Session Handshake</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                await logout()
              }}
              className="flex items-center justify-center gap-2 rounded-control border border-border bg-surface py-2.5 text-body-sm font-semibold text-foreground-strong hover:border-primary transition-colors cursor-pointer"
            >
              <LogOut size={15} />
              <span>Return to Sign In</span>
            </button>
          </div>
        </div>
      </main>
    )
  }

  // 3. Unauthenticated State
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
