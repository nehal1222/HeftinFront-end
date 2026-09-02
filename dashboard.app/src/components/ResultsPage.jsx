import { motion } from 'framer-motion'
import { ALL_RESULTS, accuracyPillClass } from '../data/dashboardData.js'

export default function ResultsPage() {
  return (
    <motion.section
      className="dash-panel dash-table-panel"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="dash-panel-head">
        <h2>All results</h2>
        <span className="dash-panel-sub">{ALL_RESULTS.length} attempts on record</span>
      </div>
      <table className="dash-table">
        <thead>
          <tr>
            <th>Test</th>
            <th>Category</th>
            <th>Date</th>
            <th>Score</th>
            <th>Accuracy</th>
          </tr>
        </thead>
        <tbody>
          {ALL_RESULTS.map((result, index) => (
            <motion.tr
              key={`${result.test}-${result.date}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
            >
              <td>{result.test}</td>
              <td>{result.category}</td>
              <td>{result.date}</td>
              <td>{result.score}</td>
              <td>
                <span className={`dash-pill ${accuracyPillClass(result.accuracy)}`}>
                  {result.accuracy}%
                </span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.section>
  )
}
