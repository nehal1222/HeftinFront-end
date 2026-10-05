import { useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Phase1Shell from '@/components/dashboard/Phase1Shell.jsx'
import RequireRight from '@/components/access/RequireRight'
import { Forbidden } from '@/components/auth/Forbidden'
import {
  AuditPage,
  BatchesPage,
  DepartmentsPage,
  OrganizationCeilingPage,
  OrganizationDashboard,
  OrganizationProfilePage,
  OrganizationsPage,
  PeoplePage,
  RightsCatalogPage,
  RoleEditorPage,
  RolesPage,
} from '@/components/dashboard/Phase1Views.jsx'
import {
  DEMO_ORGANIZATION,
  DEMO_PERSONAS,
  MOCK_ROLE_GRANTABLE_RIGHTS,
  MOCK_STUDENT_GRANTABLE_RIGHTS,
  ORGANIZATION_CEILING,
  ROLE_DEFINITIONS,
} from '@/lib/mockAuth'
import type { RightCode, RoleDefinition } from '@/types/auth'
import { isPlatformAdmin } from '@/lib/rights'

export function Phase1Page() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams<{ roleId?: string; orgId?: string }>()

  const path = location.pathname.replace(/\/+$/, '') || '/dashboard'

  const [personaId, setPersonaId] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('heftin-phase1-persona')
      return DEMO_PERSONAS.some((persona) => persona.id === stored) ? (stored as string) : 'org_admin'
    } catch {
      return 'org_admin'
    }
  })

  const [roles, setRoles] = useState<RoleDefinition[]>(() =>
    ROLE_DEFINITIONS.map((role) => ({ ...role, rights: [...role.rights] }))
  )
  const [ceiling, setCeiling] = useState(() => [...ORGANIZATION_CEILING])
  const [organizations, setOrganizations] = useState([
    { ...DEMO_ORGANIZATION, rightsCount: ORGANIZATION_CEILING.length },
  ])

  const persona = DEMO_PERSONAS.find((item) => item.id === personaId) ?? DEMO_PERSONAS[0]
  const auth = useMemo(
    () => ({
      ...persona.profile,
      scopes: [...persona.profile.scopes],
      rights: [...persona.profile.rights],
    }),
    [persona]
  )

  function changePersona(nextPersonaId: string) {
    const nextPersona = DEMO_PERSONAS.find((item) => item.id === nextPersonaId)
    if (!nextPersona) return
    setPersonaId(nextPersona.id)
    try {
      localStorage.setItem('heftin-phase1-persona', nextPersona.id)
    } catch {
      // Continue if storage is disabled
    }
    navigate(isPlatformAdmin(nextPersona.profile) ? '/platform/organizations' : '/dashboard')
  }

  function createOrganization() {
    const id = `org_demo_${Date.now()}`
    setOrganizations((current) => [
      ...current,
      {
        ...DEMO_ORGANIZATION,
        id,
        name: 'New organization',
        city: 'Not set',
        status: 'Pending',
        peopleCount: 0,
        roleCount: 0,
        rightsCount: 0,
        updatedAt: 'Just now',
      },
    ])
  }

  function setOrganizationStatus(id: string, status: string) {
    setOrganizations((current) =>
      current.map((organization) => (organization.id === id ? { ...organization, status } : organization))
    )
  }

  function createRole() {
    const id = `custom_${Date.now()}`
    setRoles((current) => [
      ...current,
      { id, name: 'Custom role', rights: [], scopeLabel: 'Scope not assigned' },
    ])
    navigate(`/roles/${id}`)
  }

  function updateRoleRights(roleId: string, rights: RightCode[]) {
    setRoles((current) => current.map((role) => (role.id === roleId ? { ...role, rights } : role)))
  }

  function toggleCeilingRight(right: RightCode) {
    setCeiling((current) => {
      const next = current.includes(right) ? current.filter((item) => item !== right) : [...current, right]
      setOrganizations((organizationsNow) =>
        organizationsNow.map((organization) =>
          organization.id === DEMO_ORGANIZATION.id ? { ...organization, rightsCount: next.length } : organization
        )
      )
      return next
    })
  }

  function renderContent() {
    // Design Sample 1 — Organization Dashboard
    if (path === '/dashboard' || path === '/workspace') {
      return <OrganizationDashboard auth={{ profile: auth }} navigate={navigate} />
    }

    // Redirect legacy design samples to dashboard
    if (path === '/design-samples') {
      return <Navigate to="/dashboard" replace />
    }

    // People
    if (path === '/people') {
      return (
        <RequireRight auth={auth} right="users.view" scope={auth.scopes}>
          <PeoplePage auth={{ profile: auth }} />
        </RequireRight>
      )
    }

    // Design Sample 2 — Role & Rights Management
    if (path === '/roles') {
      return (
        <RequireRight auth={auth} right="roles.view">
          <RolesPage
            roles={roles}
            auth={{ profile: auth }}
            navigate={navigate}
            onCreateRole={createRole}
          />
        </RequireRight>
      )
    }

    // Design Sample 3 — Role Editor / Rights Matrix
    if (path.startsWith('/roles/')) {
      const roleId = params.roleId || path.split('/')[2]
      const role = roles.find((item) => item.id === roleId)
      const grantableRights =
        role?.audience === 'student' ? MOCK_STUDENT_GRANTABLE_RIGHTS : MOCK_ROLE_GRANTABLE_RIGHTS
      return (
        <RequireRight auth={auth} right="roles.rights.edit">
          <RoleEditorPage
            role={role}
            availableRights={grantableRights}
            onRightsChange={updateRoleRights}
            auth={{ profile: auth }}
            navigate={navigate}
          />
        </RequireRight>
      )
    }

    // Organization Profile
    if (path === '/organization') {
      return (
        <RequireRight auth={auth} right="org.profile.view">
          <OrganizationProfilePage navigate={navigate} />
        </RequireRight>
      )
    }

    // Departments
    if (path === '/departments') {
      return (
        <RequireRight auth={auth} right="departments.view">
          <DepartmentsPage />
        </RequireRight>
      )
    }

    // Batches
    if (path === '/batches') {
      return (
        <RequireRight auth={auth} right="batches.view">
          <BatchesPage auth={{ profile: auth }} />
        </RequireRight>
      )
    }

    // Audit
    if (path === '/audit') {
      return (
        <RequireRight auth={auth} right="audit.view">
          <AuditPage />
        </RequireRight>
      )
    }

    // Platform Organizations
    if (path === '/platform/organizations') {
      if (!isPlatformAdmin(auth)) {
        return <Forbidden message="Platform administration is restricted to SuperAdmins." />
      }
      return (
        <OrganizationsPage
          organizations={organizations}
          onCreateOrganization={createOrganization}
          onSetOrganizationStatus={setOrganizationStatus}
          navigate={navigate}
        />
      )
    }

    // Platform Rights Catalog
    if (path === '/platform/rights') {
      if (!isPlatformAdmin(auth)) {
        return <Forbidden message="Rights catalog is restricted to SuperAdmins." />
      }
      return <RightsCatalogPage />
    }

    // Design Sample 4 — SuperAdmin Organization Ceiling
    if (path.includes('/platform/organizations/') && path.endsWith('/rights')) {
      if (!isPlatformAdmin(auth)) {
        return <Forbidden message="Organization ceiling management is restricted to SuperAdmins." />
      }
      return (
        <OrganizationCeilingPage
          ceiling={ceiling}
          onToggleRight={toggleCeilingRight}
          navigate={navigate}
        />
      )
    }

    return <OrganizationDashboard auth={{ profile: auth }} navigate={navigate} />
  }

  const { logout } = useAuth()

  function handleLogout() {
    logout()
    try {
      localStorage.removeItem('heftin-phase1-persona')
    } catch {
      // Continue if storage is disabled
    }
    navigate('/login?logged_out=true', { replace: true })
  }

  return (
    <Phase1Shell
      auth={{ profile: auth }}
      persona={persona}
      path={path}
      navigate={navigate}
      onPersonaChange={changePersona}
      onLogout={handleLogout}
    >
      {renderContent()}
    </Phase1Shell>
  )
}

export default Phase1Page
