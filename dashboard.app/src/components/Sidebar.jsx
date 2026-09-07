import { motion } from 'framer-motion'

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

      <a
        href="#"
        className="dash-back"
        onClick={(event) => {
          event.preventDefault()
          onNavigate('design-system')
        }}
      >
        Design tokens (Sprint 1)
      </a>

      <a href="../index.html" className="dash-back">&larr; Back to site</a>
    </motion.aside>
  )
}
