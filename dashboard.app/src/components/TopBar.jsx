import { motion } from 'framer-motion'

export default function TopBar({ title, subtitle, role = 'student' }) {
  const user = role === 'teacher' ? { initials: 'SK', name: 'Prof. Sanjay K.' } : { initials: 'AR', name: 'Ananya R.' }

  return (
    <motion.header
      className="dash-topbar"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        <span className="dash-topbar-eyebrow">{role === 'teacher' ? 'Teacher Portal' : 'Dashboard'}</span>
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
      </div>
    </motion.header>
  )
}
