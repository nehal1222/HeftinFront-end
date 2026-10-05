import { useEffect, useMemo, useState } from 'react'
import AsyncState from './components/AsyncState.jsx'
import Forbidden from './components/Forbidden.jsx'
import Phase1Shell from './components/Phase1Shell.jsx'
import RequireRight from './components/RequireRight.jsx'
import {
  AuditPage,
  BatchesPage,
  DepartmentsPage,
  DesignSamplesPage,
  OrganizationCeilingPage,
  OrganizationDashboard,
  OrganizationsPage,
  PeoplePage,
  RightsCatalogPage,
  RoleEditorPage,
  RolesPage,
} from './components/Phase1Views.jsx'
import { DEMO_ORGANIZATION, DEMO_PERSONAS, MOCK_ROLE_GRANTABLE_RIGHTS, MOCK_STUDENT_GRANTABLE_RIGHTS, ORGANIZATION_CEILING, ROLE_DEFINITIONS } from './data/mockAuth.js'
import { isPlatformAdmin } from './utils/rights.js'

function currentPath() {
  const path = window.location.pathname.replace(/\/+$/, '')
  if (path === '/dashboard/index.html') return '/dashboard'
  return path || '/dashboard'
}

export default function Phase1Root() {
  const [path, setPath] = useState(currentPath)
  const [loading, setLoading] = useState(true)
  const [personaId, setPersonaId] = useState(() => {
    try {
      const stored = localStorage.getItem('heftin-phase1-persona')
      return DEMO_PERSONAS.some((persona) => persona.id === stored) ? stored : 'org_admin'
    } catch {
      return 'org_admin'
    }
  })
  const [roles, setRoles] = useState(() => ROLE_DEFINITIONS.map((role) => ({ ...role, rights: [...role.rights] })))
  const [ceiling, setCeiling] = useState(() => [...ORGANIZATION_CEILING])
  const [organizations, setOrganizations] = useState([{ ...DEMO_ORGANIZATION, rightsCount: ORGANIZATION_CEILING.length }])
  const persona = DEMO_PERSONAS.find((item) => item.id === personaId) ?? DEMO_PERSONAS[0]
  const auth = useMemo(() => ({ ...persona.profile, scopes: [...persona.profile.scopes], rights: [...persona.profile.rights] }), [persona])

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 320)
    const onPopState = () => setPath(currentPath())
    window.addEventListener('popstate', onPopState)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

  function navigate(nextPath, replace = false) {
    const normalized = nextPath.replace(/\/+$/, '') || '/dashboard'
    if (replace) window.history.replaceState({}, '', normalized)
    else window.history.pushState({}, '', normalized)
    setPath(normalized)
  }

  function changePersona(nextPersonaId) {
    const nextPersona = DEMO_PERSONAS.find((item) => item.id === nextPersonaId)
    if (!nextPersona) return
    setPersonaId(nextPersona.id)
    try {
      localStorage.setItem('heftin-phase1-persona', nextPersona.id)
    } catch {
      // Keep the in-memory demo persona when browser storage is unavailable.
    }
    navigate(isPlatformAdmin(nextPersona.profile) ? '/platform/organizations' : '/dashboard')
  }

  function createOrganization() {
    const id = `org_demo_${Date.now()}`
    setOrganizations((current) => [...current, {
      ...DEMO_ORGANIZATION,
      id,
      name: 'New organization',
      city: 'Not set',
      status: 'Pending',
      peopleCount: 0,
      roleCount: 0,
      rightsCount: 0,
      updatedAt: 'Just now',
    }])
  }

  function setOrganizationStatus(id, status) {
    setOrganizations((current) => current.map((organization) => organization.id === id ? { ...organization, status } : organization))
  }

  function createRole() {
    const id = `custom_${Date.now()}`
    setRoles((current) => [...current, { id, name: 'Custom role', rights: [], scopeLabel: 'Scope not assigned' }])
    navigate(`/roles/${id}`)
  }

  function updateRoleRights(roleId, rights) {
    setRoles((current) => current.map((role) => role.id === roleId ? { ...role, rights } : role))
  }

  function toggleCeilingRight(right) {
    setCeiling((current) => {
      const next = current.includes(right) ? current.filter((item) => item !== right) : [...current, right]
      setOrganizations((organizationsNow) => organizationsNow.map((organization) => organization.id === DEMO_ORGANIZATION.id ? { ...organization, rightsCount: next.length } : organization))
      return next
    })
  }

  function renderRoute() {
    if (path === '/dashboard' || path === '/') return <OrganizationDashboard auth={{ profile: auth }} navigate={navigate} />
    if (path === '/design-samples') return <OrganizationDashboard auth={{ profile: auth }} navigate={navigate} />

    if (path === '/people') return <RequireRight auth={auth} right="users.view" scope={auth.scopes}><PeoplePage auth={{ profile: auth }} /></RequireRight>
    if (path === '/roles') return <RequireRight auth={auth} right="roles.view"><RolesPage roles={roles} auth={{ profile: auth }} navigate={navigate} onCreateRole={createRole} /></RequireRight>
    const roleMatch = path.match(/^\/roles\/([^/]+)$/)
    if (roleMatch) {
      const role = roles.find((item) => item.id === roleMatch[1])
      const grantableRights = role?.audience === 'student' ? MOCK_STUDENT_GRANTABLE_RIGHTS : MOCK_ROLE_GRANTABLE_RIGHTS
      return <RequireRight auth={auth} right="roles.rights.edit"><RoleEditorPage role={role} availableRights={grantableRights} onRightsChange={updateRoleRights} auth={{ profile: auth }} onReloadAccess={() => window.location.reload()} /></RequireRight>
    }
    if (path === '/departments') return <RequireRight auth={auth} right="departments.view"><DepartmentsPage /></RequireRight>
    if (path === '/batches') return <RequireRight auth={auth} right="batches.view"><BatchesPage auth={{ profile: auth }} /></RequireRight>
    if (path === '/audit') return <RequireRight auth={auth} right="audit.view"><AuditPage /></RequireRight>

    if (path === '/platform/organizations') {
      if (!isPlatformAdmin(auth)) return <Forbidden />
      return <OrganizationsPage organizations={organizations} onCreateOrganization={createOrganization} onSetOrganizationStatus={setOrganizationStatus} navigate={navigate} />
    }
    if (path === '/platform/rights') return isPlatformAdmin(auth) ? <RightsCatalogPage /> : <Forbidden />
    const ceilingMatch = path.match(/^\/platform\/organizations\/([^/]+)\/rights$/)
    if (ceilingMatch) return isPlatformAdmin(auth) ? <OrganizationCeilingPage ceiling={ceiling} onToggleRight={toggleCeilingRight} onReloadAccess={() => window.location.reload()} /> : <Forbidden />

    return <AsyncState state="notFound" />
  }

  if (loading) return <main className="phase-loading-screen"><AsyncState state="loading" title="Loading access..." description="Preparing the Phase 1 demo profile." /></main>

  return (
    <Phase1Shell auth={{ profile: auth }} persona={persona} path={path} navigate={navigate} onPersonaChange={changePersona}>
      {renderRoute()}
    </Phase1Shell>
  )
}