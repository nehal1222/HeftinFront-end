import { motion } from 'framer-motion'

export default function TopBar({ title, subtitle, role = 'student', authUser, onLogout }) {
  const defaultUser = role === 'organization' || role === 'org_admin' ? { initials: 'OA', name: 'Organization Admin' } : role === 'super_admin' ? { initials: 'SA', name: 'Heftin Super Admin' } : role === 'teacher' || role === 'faculty' ? { initials: 'SK', name: 'Prof. Sanjay K.' } : { initials: 'AR', name: 'Ananya R.' }
  const user = authUser ? {
    name: authUser.displayName || defaultUser.name,
    initials: (authUser.displayName || defaultUser.name).split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
  } : defaultUser

  return (
    <motion.header
      className="dash-topbar"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        <span className="dash-topbar-eyebrow">{role === 'organization' || role === 'org_admin' ? 'Organization Portal' : role === 'super_admin' ? 'Heftin Control Center' : role === 'teacher' || role === 'faculty' ? 'Teacher Portal' : 'Dashboard'}</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="dash-topbar-actions">
        <button type="button" className="dash-bell" aria-label="Notifications">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6 9.5a6 6 0 0 1 12 0v4.2l1.6 2.4a1 1 0 0 1-.8 1.6H5.2a1 1 0 0 1-.8-1.6L6 13.7V9.5Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M9.5 19a2.5 2.5 0 0 0 5 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span className="dash-bell-dot" />
        </button>

        <div className="dash-user">
          <span className="dash-avatar">{user.initials}</span>
          <span>{user.name}</span>
        </div>

        {onLogout && (
          <button type="button" className="dash-bell" onClick={onLogout} aria-label="Sign out" title="Sign out">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ width: 18, height: 18 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          </button>
        )}
      </div>
    </motion.header>
  )
}
