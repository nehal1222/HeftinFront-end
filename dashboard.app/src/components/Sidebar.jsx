import { motion } from 'framer-motion'

const ICONS = {
  overview: <path d="M4 4h7v7H4V4Zm9 0h7v4h-7V4ZM4 13h7v7H4v-7Zm9-2h7v9h-7v-9Z" strokeLinejoin="round" />,
  assignments: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 9h6M9 13h6M9 17h3" strokeLinecap="round" /></>,
  'test-series': <><rect x="4" y="6" width="16" height="4" rx="1" /><rect x="4" y="14" width="16" height="4" rx="1" /></>,
  practice: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3.2" /></>,
  results: <path d="M5 20V10M12 20V4M19 20v-7" strokeLinecap="round" />,
  leaderboard: <path d="M6 20v-6M12 20V6M18 20v-9" strokeLinecap="round" />,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M12 3v2.2M12 18.8V21M4.2 12H2M22 12h-2.2M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6" strokeLinecap="round" /></>,
  submissions: <><path d="M5 4.5h9a2.5 2.5 0 012.5 2.5v12.5H7.5A2.5 2.5 0 015 16.9V4.5z" strokeLinejoin="round" /><path d="M5 16.5h11.5" strokeLinecap="round" /></>,
}

function NavIcon({ id }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      {ICONS[id]}
    </svg>
  )
}

const STUDENT_NAV = [
  { id: 'overview', label: 'Overview' },
  { id: 'assignments', label: 'Assignments' },
  { id: 'test-series', label: 'Test Series' },
  { id: 'practice', label: 'Practice' },
  { id: 'results', label: 'Results' },
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'settings', label: 'Settings' },
]

const TEACHER_NAV = [
  { id: 'submissions', label: 'Submissions' },
  { id: 'settings', label: 'Settings' },
]

export default function Sidebar({ view, onNavigate, role, onToggleRole }) {
  const items = role === 'teacher' ? TEACHER_NAV : STUDENT_NAV

  return (
    <motion.aside
      className="dash-sidebar"
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <nav className="dash-nav">
        {items.map((item) => (
          <a
            key={item.id}
            href="#"
            className={view === item.id ? 'active' : ''}
            onClick={(event) => {
              event.preventDefault()
              onNavigate(item.id)
            }}
          >
            <NavIcon id={item.id} />
            {item.label}
          </a>
        ))}
      </nav>

      <button type="button" className="role-switch-btn" onClick={onToggleRole}>
        Switch to {role === 'teacher' ? 'Student' : 'Teacher'} view
      </button>

      {role === 'student' && (
        <div className="upgrade-card">
          <span className="upgrade-badge">PRO</span>
          <h4>Unlock full analytics</h4>
          <p>Unlimited mock tests, deeper weak-area insights, and priority ranking.</p>
          <a href="../premium.html" className="upgrade-btn">Upgrade to Pro</a>
        </div>
      )}

      <a href="../index.html" className="dash-back">&larr; Back to site</a>
    </motion.aside>
  )
}
