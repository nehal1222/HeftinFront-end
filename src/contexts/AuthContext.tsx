import { useMemo, useState, type ReactNode } from 'react'
import { AuthContext } from '@/contexts/auth-context'
import { hasRight } from '@/lib/rights'
import type { AuthProfile, DemoPersonaId } from '@/types/auth'

const DEMO_PROFILES: Record<DemoPersonaId, AuthProfile> = {
  student: {
    id: 'student-001',
    name: 'Student User',
    role: 'student',
    rights: [],
    is_platform_admin: false,
  },

  faculty: {
    id: 'faculty-001',
    name: 'Faculty User',
    role: 'faculty',
    rights: ['users.view'],
    is_platform_admin: false,
  },

  org_admin: {
    id: 'org-admin-001',
    name: 'Organization Admin',
    role: 'org_admin',
    rights: ['users.view', 'roles.view'],
    is_platform_admin: false,
  },

  super_admin: {
    id: 'super-admin-001',
    name: 'Super Admin',
    role: 'super_admin',
    rights: [],
    is_platform_admin: true,
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [personaId, setPersonaId] = useState<DemoPersonaId>('student')

  const profile = DEMO_PROFILES[personaId]

  const value = useMemo(
    () => ({
      profile,
      personaId,
      setPersona: setPersonaId,
      hasRight: (right: Parameters<typeof hasRight>[1]) =>
        profile.is_platform_admin || hasRight(profile.rights, right),
    }),
    [personaId, profile],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
