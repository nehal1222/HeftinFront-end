import { motion } from 'framer-motion'
import { RECENT_ATTEMPTS, accuracyPillClass } from '../data/dashboardData.js'

export default function AttemptsTable() {
  return (
    <motion.section
      className="dash-panel dash-table-panel"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="dash-panel-head">
        <h2>Recent test attempts</h2>
        <span className="dash-panel-sub">{RECENT_ATTEMPTS.length} attempts</span>
      </div>
      <table className="dash-table">
        <thead>
          <tr>
            <th>Test</th>
            <th>Date</th>
            <th>Score</th>
            <th>Accuracy</th>
          </tr>
        </thead>
        <tbody>
          {RECENT_ATTEMPTS.map((attempt, index) => (
            <motion.tr
              key={attempt.test}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.25 + index * 0.06 }}
            >
              <td>{attempt.test}</td>
              <td>{attempt.date}</td>
              <td>{attempt.score}</td>
              <td>
                <span className={`dash-pill ${accuracyPillClass(attempt.accuracy)}`}>
                  {attempt.accuracy}%
                </span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.section>
  )
}
