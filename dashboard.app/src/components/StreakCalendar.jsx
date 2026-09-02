import { motion } from 'framer-motion'
import { STREAK_DAYS } from '../data/dashboardData.js'

function currentStreak(days) {
  let count = 0
  for (let i = days.length - 1; i >= 0; i--) {
    if (!days[i]) break
    count++
  }
  return count
}

export default function StreakCalendar() {
  const streak = currentStreak(STREAK_DAYS)

  return (
    <motion.div
      className="dash-panel streak-panel"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
    >
      <div className="dash-panel-head">
        <h2>Study streak</h2>
        <span className="dash-panel-sub">{streak}-day streak &middot; last 28 days</span>
      </div>

      <div className="streak-grid">
        {STREAK_DAYS.map((practiced, index) => (
          <span key={index} className={practiced ? 'streak-day active' : 'streak-day'} />
        ))}
      </div>

      <div className="streak-legend">
        <span className="streak-day active" />
        Practiced
        <span className="streak-day" />
        Missed
      </div>
    </motion.div>
  )
}
