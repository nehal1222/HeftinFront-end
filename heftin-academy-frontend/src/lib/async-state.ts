export type AsyncStateKind = 'loading' | 'empty' | 'error' | 'forbidden' | 'notFound'

export function getAsyncState(error: unknown): Exclude<AsyncStateKind, 'loading' | 'empty'> {
  const status = (error as { response?: { status?: number } } | null)?.response?.status
  if (status === 403) return 'forbidden'
  if (status === 404) return 'notFound'
  return 'error'
}