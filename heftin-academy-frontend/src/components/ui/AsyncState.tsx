import { AlertCircle, FileQuestion, Inbox, LoaderCircle, ShieldX } from 'lucide-react'
import type { AsyncStateKind } from '@/lib/async-state'

const STATE_COPY = {
  loading: { title: 'Loading', description: 'Please wait while this view loads.' },
  empty: { title: 'Nothing here yet', description: 'There is no data to show.' },
  error: { title: 'Could not load this view', description: 'Something went wrong. Try again.' },
  forbidden: { title: 'Access denied', description: 'Your account does not have permission to view this.' },
  notFound: { title: 'Not found', description: 'The requested page or data could not be found.' },
} satisfies Record<AsyncStateKind, { title: string; description: string }>

const STATE_ICONS = {
  loading: LoaderCircle,
  empty: Inbox,
  error: AlertCircle,
  forbidden: ShieldX,
  notFound: FileQuestion,
}

export function AsyncState({
  state,
  title,
  description,
  onRetry,
}: {
  state: AsyncStateKind
  title?: string
  description?: string
  onRetry?: () => void
}) {
  const Icon = STATE_ICONS[state]
  const copy = STATE_COPY[state]

  return (
    <div
      className="flex min-h-40 flex-col items-center justify-center gap-3 px-5 py-8 text-center"
      role={state === 'error' || state === 'forbidden' || state === 'notFound' ? 'alert' : 'status'}
      aria-live="polite"
    >
      <Icon size={22} aria-hidden="true" className={state === 'loading' ? 'animate-spin text-primary' : 'text-muted'} />
      <div>
        <h2 className="font-display text-heading-sm text-foreground-strong">{title ?? copy.title}</h2>
        <p className="mt-1 max-w-lg text-body-sm text-muted">{description ?? copy.description}</p>
      </div>
      {onRetry && state !== 'loading' && state !== 'forbidden' && state !== 'notFound' && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-control border border-border bg-surface-elevated px-3 py-2 text-body-sm font-semibold text-foreground-strong hover:border-primary hover:text-primary-dark"
        >
          Try again
        </button>
      )}
    </div>
  )
}