import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { AsyncState } from '@/components/ui/AsyncState'
import type { AsyncStateKind } from '@/lib/async-state'

/**
 * [HAC01-FE-11] Error, Loading & Session Handling
 * Isolated preview and verification page for async states and session lifecycles.
 */
export function SessionLifecyclePage() {
  const [activeState, setActiveState] = useState<AsyncStateKind>('loading')
  const [retryCount, setRetryCount] = useState(0)

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-page font-sans text-foreground">
      <header>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 text-body-sm font-semibold text-primary hover:text-primary-dark">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to home
          </Link>
          <div className="flex items-center gap-3">
            <Link to={ROUTES.LOGIN} className="rounded-control bg-primary px-3 py-1.5 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors">
              Sign In
            </Link>
          </div>
        </div>

        <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
          [HAC01-FE-11] Error, Loading &amp; Session Handling
        </span>
        <h1 className="mt-1 font-display text-heading-lg font-light tracking-tight text-foreground-strong">
          Shared Async States &amp; Session Lifecycle
        </h1>
        <p className="mt-2 max-w-2xl text-body-sm text-error/80">
          Unified pattern used across login, auth guards, and dashboard pages. Handles all 6 lifecycle events without leaving a broken shell.
        </p>
      </header>

      <section className="rounded-card border border-border bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4 mb-4">
          <h2 className="text-sm font-bold text-error uppercase tracking-wider">
            Lifecycle Specimen Controls
          </h2>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-[11px] font-bold text-primary">
            Auth + Dashboard Pattern
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {(['loading', 'empty', 'error', 'forbidden', 'notFound'] as AsyncStateKind[]).map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => setActiveState(kind)}
              className={`rounded-control border px-3 py-1.5 text-xs font-bold transition-all ${
                activeState === kind
                  ? 'border-primary bg-primary text-white shadow-xs'
                  : 'border-border bg-white text-error hover:border-primary/50'
              }`}
            >
              {kind}
            </button>
          ))}

          <Link
            to="/login?expired=true"
            className="rounded-control border border-primary/40 bg-border/20 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all ml-auto"
          >
            Simulate Session Expired →
          </Link>
        </div>

        <div className="rounded-xl border border-border bg-border/10 p-8 min-h-[260px] flex items-center justify-center">
          <AsyncState
            state={activeState}
            onRetry={
              activeState === 'error'
                ? () => setRetryCount((c) => c + 1)
                : undefined
            }
            description={
              activeState === 'error' && retryCount > 0
                ? `Simulated retry clicked ${retryCount} time(s). Everything re-evaluated safely.`
                : undefined
            }
          />
        </div>
      </section>
    </main>
  )
}
