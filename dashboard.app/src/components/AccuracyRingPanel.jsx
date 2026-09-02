import { motion } from 'framer-motion'
import { OVERALL_ACCURACY } from '../data/dashboardData.js'

export default function AccuracyRingPanel({ zoomed = false, onZoomIn }) {
  return (
    <motion.div
      layoutId="panel-accuracy"
      className={`dash-panel dash-panel-score${zoomed ? ' zoomed' : ''}`}
      onClick={!zoomed ? onZoomIn : undefined}
      style={!zoomed ? { cursor: 'zoom-in' } : undefined}
      whileHover={!zoomed ? { scale: 1.015 } : undefined}
      initial={!zoomed ? { opacity: 0, y: 16 } : undefined}
      animate={!zoomed ? { opacity: 1, y: 0 } : undefined}
      transition={!zoomed ? { duration: 0.4, delay: 0.1 } : undefined}
    >
      <div className="dash-panel-head">
        <h2>Overall accuracy</h2>
        <span className="dash-panel-sub">All time</span>
      </div>
      <div className={`score-ring big${zoomed ? ' zoomed' : ''}`}>
        <strong>{OVERALL_ACCURACY}%</strong>
      </div>
      <p>You're scoring higher than 76% of aspirants in Banking exams.</p>
    </motion.div>
  )
}
