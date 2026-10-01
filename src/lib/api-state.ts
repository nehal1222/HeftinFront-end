export type ApiStateKind = 'loading' | 'empty' | 'error' | 'forbidden' | 'notFound'

export function getApiStatus(error: unknown): number | undefined {
  const response = (error as { response?: { status?: unknown } } | null)?.response
  return typeof response?.status === 'number' ? response.status : undefined
}

export function getApiState(error: unknown): Exclude<ApiStateKind, 'loading' | 'empty'> {
  const status = getApiStatus(error)
  if (status === 403) return 'forbidden'
  if (status === 404) return 'notFound'
  return 'error'
}