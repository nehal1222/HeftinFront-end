import { useCallback, useState } from 'react'
import { getApiState, type ApiStateKind } from '@/lib/api-state'

export function useApiState(initialState: ApiStateKind = 'loading') {
  const [state, setState] = useState<ApiStateKind>(initialState)

  const setLoading = useCallback(() => {
    setState('loading')
  }, [])

  const setEmpty = useCallback(() => {
    setState('empty')
  }, [])

  const setError = useCallback(() => {
    setState('error')
  }, [])

  const setForbidden = useCallback(() => {
    setState('forbidden')
  }, [])

  const setNotFound = useCallback(() => {
    setState('notFound')
  }, [])

  const setFromError = useCallback((error: unknown) => {
    setState(getApiState(error))
  }, [])

  return {
    state,
    setState,
    setLoading,
    setEmpty,
    setError,
    setForbidden,
    setNotFound,
    setFromError,
  }
}