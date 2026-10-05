import { hasRight, isPlatformAdmin } from '@/utils/rights.js'
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

function isActive(itemPath, currentPath) {
  return itemPath === currentPath || (itemPath === '/roles' && currentPath.startsWith('/roles/'))
}

export default function Phase1Shell({ auth, persona, path, navigate, onPersonaChange, onLogout, children }) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      try {
        localStorage.removeItem('heftin-phase1-persona')
        localStorage.removeItem('heftin_auth_user')
      } catch {
        // Storage disabled or blocked
      }
      navigate('/login?logged_out=true')
    }
  }

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

        <nav className="phase-nav" aria-label="Phase 1 navigation">
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

        <div className="phase-sidebar-footer">
          <button
            type="button"
            className="phase-sidebar-logout-btn"
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              padding: '7px 10px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--white)',
              color: 'var(--error)',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <main className="phase-main">
        <header className="phase-topbar">
          <div className="phase-breadcrumb"><span>Heftin Academy</span><i>/</i><strong>{path.split('/').filter(Boolean).slice(-1)[0]?.replaceAll('-', ' ') || 'dashboard'}</strong></div>
          <div className="phase-topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PersonaSwitcher personaId={persona.id} onChange={onPersonaChange} />
            <div className="phase-profile" aria-label={`Signed in as ${persona.name}`}>
              <span className="phase-avatar">{persona.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>
              <span><strong>{persona.name}</strong><small>{auth.profile.role ?? 'Platform administrator'}</small></span>
            </div>
            <button
              type="button"
              className="phase-logout-btn"
              onClick={handleLogout}
              title="Sign out of Heftin Academy"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--white)',
                color: 'var(--error)',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Log Out</span>
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
