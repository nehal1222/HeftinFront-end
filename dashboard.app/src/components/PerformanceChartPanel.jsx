import { motion } from 'framer-motion'
import { PERFORMANCE_BARS } from '../data/dashboardData.js'

export default function PerformanceChartPanel({ zoomed = false, onZoomIn }) {
  const lastIndex = PERFORMANCE_BARS.length - 1

  return (
    <motion.div
      layoutId="panel-trend"
      className={`dash-panel dash-panel-chart${zoomed ? ' zoomed' : ''}`}
      onClick={!zoomed ? onZoomIn : undefined}
      style={!zoomed ? { cursor: 'zoom-in' } : undefined}
      whileHover={!zoomed ? { scale: 1.015 } : undefined}
      initial={!zoomed ? { opacity: 0, y: 16 } : undefined}
      animate={!zoomed ? { opacity: 1, y: 0 } : undefined}
      transition={!zoomed ? { duration: 0.4, delay: 0.05 } : undefined}
    >
      <div className="dash-panel-head">
        <h2>Performance trend</h2>
        <span className="dash-panel-sub">Last {PERFORMANCE_BARS.length} mock tests</span>
      </div>
      <div className={`dashboard-mock-chart big${zoomed ? ' zoomed' : ''}`}>
        {PERFORMANCE_BARS.map((value, index) => (
          <div
            key={index}
            className={`bar bar-tone-${index % 5}${index === lastIndex ? ' bar-current' : ''}`}
            style={{ '--h': `${value}%` }}
          />
        ))}
      </div>
    </motion.div>
  )
}
