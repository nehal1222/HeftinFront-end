import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { AuthContext, type AuthStatus } from '@/contexts/auth-context'
import { getDemoPersona } from '@/lib/mockAuth'
import { canAccess, hasRight } from '@/lib/rights'
import { clearAuthStorage, getAccessToken, getStoredDemoSession, setStoredDemoSession, setTokens } from '@/lib/storage'
import type { AuthProfile, DemoPersonaId, RightCode, Scope } from '@/types/auth'

const MOCK_ACCESS_TOKEN = 'phase1-demo-access'
const MOCK_REFRESH_TOKEN = 'phase1-demo-refresh'

function clearDemoSession() {
  try {
    clearAuthStorage()
  } catch {
    // The in-memory session still clears when browser storage is unavailable.
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<AuthProfile | null>(null)
  const [personaId, setPersonaId] = useState<DemoPersonaId | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    let active = true
    const timer = window.setTimeout(() => {
      if (!active) return
      const stored = getStoredDemoSession()
      if (getAccessToken() && stored) {
        setProfile(stored.profile)
        setPersonaId(stored.personaId)
        setStatus('authenticated')
      } else {
        clearDemoSession()
        setStatus('unauthenticated')
      }
    }, 180)

    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [])

  async function login(nextPersonaId: DemoPersonaId) {
    const persona = getDemoPersona(nextPersonaId)
    if (!persona) throw new Error('Unknown demo account.')
    setStatus('loading')
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 160))
      setTokens(MOCK_ACCESS_TOKEN, MOCK_REFRESH_TOKEN)
      setStoredDemoSession({ personaId: persona.id, profile: persona.profile })
      setProfile(persona.profile)
      setPersonaId(persona.id)
      setStatus('authenticated')
    } catch (error) {
      clearDemoSession()
      setProfile(null)
      setPersonaId(null)
      setStatus('unauthenticated')
      throw error
    }
  }

  function logout() {
    clearDemoSession()
    setProfile(null)
    setPersonaId(null)
    setStatus('unauthenticated')
  }

  const value = useMemo(() => ({
    profile,
    personaId,
    status,
    login,
    logout,
    hasRight: (right: RightCode) => profile ? hasRight(profile.rights, right) : false,
    canAccess: (right: RightCode, scope?: Scope) => profile ? canAccess(profile, right, scope) : false,
  }), [profile, personaId, status])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}