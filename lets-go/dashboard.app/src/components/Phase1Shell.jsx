import { hasRight, isPlatformAdmin } from '../utils/rights.js'
import PersonaSwitcher from './PersonaSwitcher.jsx'

const ORGANIZATION_NAV = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'People', path: '/people', right: 'users.view' },
  { label: 'Roles', path: '/roles', right: 'roles.view' },
  { label: 'Departments', path: '/departments', right: 'departments.view' },
  { label: 'Batches', path: '/batches', right: 'batches.view' },
  { label: 'Audit', path: '/audit', right: 'audit.view' },
  { label: 'Organization', path: '/organization', right: 'org.profile.view' },
]

const PLATFORM_NAV = [
  { label: 'Organizations', path: '/platform/organizations' },
  { label: 'Rights catalog', path: '/platform/rights' },
  { label: 'Organization ceiling', path: '/platform/organizations/org_001/rights' },
]

const SAMPLES_NAV = [
  { label: 'Blueprints', path: '/design-samples' },
  { label: 'Auth Samples', path: '/auth-samples' },
  { label: 'Design Tokens', path: '/tokens' },
  { label: 'Session Lifecycle', path: '/session-lifecycle' },
]

function isActive(itemPath, currentPath) {
  return itemPath === currentPath || (itemPath === '/roles' && currentPath.startsWith('/roles/'))
}

export default function Phase1Shell({ auth, persona, path, navigate, onPersonaChange, children }) {
  const navigation = isPlatformAdmin(auth.profile)
    ? PLATFORM_NAV
    : ORGANIZATION_NAV.filter((item) => !item.right || hasRight(auth.profile.rights, item.right))

  return (
    <div className="phase-shell">
      <aside className="phase-sidebar">
        <a className="phase-brand" href="/dashboard" onClick={(event) => { event.preventDefault(); navigate('/dashboard') }}>
          <span className="phase-brand-mark">H</span>
          <span><strong>HEFTIN</strong><small>ACADEMY ENTERPRISE</small></span>
        </a>

        <div className="phase-org-switch">
          <span>WORKSPACE</span>
          <strong>{isPlatformAdmin(auth.profile) ? 'Heftin Platform Central' : 'Delhi Public Academy'}</strong>
          <small>{isPlatformAdmin(auth.profile) ? 'Platform Administration' : auth.profile.scopes.length ? 'Scoped Access' : 'Institutional Workspace'}</small>
        </div>

        <nav className="phase-nav" aria-label="Main navigation">
          <span className="phase-nav-label">{isPlatformAdmin(auth.profile) ? 'PLATFORM' : 'ORGANIZATION'}</span>
          {navigation.map((item) => (
            <a
              key={`${item.label}-${item.path}`}
              href={item.path}
              className={isActive(item.path, path) ? 'active' : ''}
              aria-current={isActive(item.path, path) ? 'page' : undefined}
              onClick={(event) => { event.preventDefault(); navigate(item.path) }}
            >
              <span className="phase-nav-mark" aria-hidden="true">{item.label.slice(0, 1)}</span>
              {item.label}
            </a>
          ))}
        </nav>

        <nav className="phase-nav" aria-label="Architecture samples" style={{ marginTop: '16px' }}>
          <span className="phase-nav-label">SAMPLES & BENCHES</span>
          {SAMPLES_NAV.map((item) => (
            <a
              key={`${item.label}-${item.path}`}
              href={item.path}
              className={isActive(item.path, path) ? 'active' : ''}
              aria-current={isActive(item.path, path) ? 'page' : undefined}
              onClick={(event) => { event.preventDefault(); navigate(item.path) }}
            >
              <span className="phase-nav-mark" aria-hidden="true">{item.label.slice(0, 1)}</span>
              {item.label}
            </a>
          ))}
        </nav>


      </aside>

      <main className="phase-main">
        <header className="phase-topbar">
          <div className="phase-breadcrumb"><span>Heftin Academy</span><i>/</i><strong>{path.split('/').filter(Boolean).slice(-1)[0]?.replaceAll('-', ' ') || 'dashboard'}</strong></div>
          <div className="phase-topbar-actions">
            <PersonaSwitcher personaId={persona.id} onChange={onPersonaChange} />
            <div className="phase-profile" aria-label={`Signed in as ${persona.name}`}>
              <span className="phase-avatar">{persona.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>
              <span><strong>{persona.name}</strong><small>{auth.profile.role ?? 'Platform administrator'}</small></span>
            </div>
            <button
              type="button"
              className="phase-button phase-button-outline"
              style={{ fontSize: '12px', padding: '6px 12px', cursor: 'pointer' }}
              title="Sign out of workspace"
              onClick={async () => {
                const token = localStorage.getItem('heftin_access_token')
                const baseUrl = window.HEFTIN_API_BASE || localStorage.getItem('heftin_api_base') || 'http://localhost:8001/api/v1'
                if (token) {
                  try {
                    await fetch(`${baseUrl}/auth/logout`, {
                      method: 'POST',
                      headers: { Authorization: `Bearer ${token}` },
                    })
                  } catch (e) {}
                }
                localStorage.removeItem('heftin_access_token')
                localStorage.removeItem('heftin_refresh_token')
                localStorage.removeItem('heftin_user_profile')
                localStorage.removeItem('heftin_auth_mode')
                localStorage.removeItem('heftin-phase1-persona')
                localStorage.removeItem('heftinRole')
                localStorage.removeItem('heftinName')
                window.location.href = '/login.html'
              }}
            >
              Sign out
            </button>
          </div>
        </header>
        <div className="phase-content" key={path}>
          {children}
        </div>
      </main>
    </div>
  )
}