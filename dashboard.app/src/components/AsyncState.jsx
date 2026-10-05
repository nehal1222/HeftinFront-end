const STATE_COPY = {
  loading: ['Loading', 'Please wait while this view loads.'],
  empty: ['Nothing here yet', 'There is no data to show.'],
  error: ['Could not load this view', 'Something went wrong. Try again.'],
  forbidden: ['Access denied', 'Your account does not have permission to view this.'],
  notFound: ['Not found', 'The requested page or data could not be found.'],
}

export function getAsyncState(error) {
  const status = error?.response?.status
  if (status === 403) return 'forbidden'
  if (status === 404) return 'notFound'
  return 'error'
}

export default function AsyncState({ state, title, description, onRetry }) {
  const [defaultTitle, defaultDescription] = STATE_COPY[state]
  const isFailure = ['error', 'forbidden', 'notFound'].includes(state)

  return (
    <div className={`dash-state dash-state-${state}`} role={isFailure ? 'alert' : 'status'} aria-live="polite">
      {state === 'loading' && <span className="dash-state-spinner" aria-hidden="true" />}
      <strong>{title ?? defaultTitle}</strong>
      <span>{description ?? defaultDescription}</span>
      {onRetry && state === 'error' && (
        <button type="button" onClick={onRetry}>Try again</button>
      )}
    </div>
  )
}