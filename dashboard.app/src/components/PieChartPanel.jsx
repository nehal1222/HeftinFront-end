import { motion } from 'framer-motion'
import { PIE_SLICES } from '../data/dashboardData.js'

export default function PieChartPanel({ zoomed = false, onZoomIn }) {
  let running = 0
  const boundaries = PIE_SLICES.map((slice) => {
    running += slice.pct
    return running
  })
  const [p1, p2, p3] = boundaries

  return (
    <motion.section
      layoutId="panel-subjects"
      className={`dash-panel piechart${zoomed ? ' zoomed' : ''}`}
      onClick={!zoomed ? onZoomIn : undefined}
      style={!zoomed ? { cursor: 'zoom-in' } : undefined}
      whileHover={!zoomed ? { scale: 1.015 } : undefined}
      initial={!zoomed ? { opacity: 0, y: 16 } : undefined}
      animate={!zoomed ? { opacity: 1, y: 0 } : undefined}
      transition={!zoomed ? { duration: 0.4, delay: 0.15 } : undefined}
    >
      <div className="dash-panel-head">
        <h2>Subject-wise accuracy</h2>
        <span className="dash-panel-sub">This month</span>
      </div>
      <div className="piechart-body">
        <div className={`pie-chart${zoomed ? ' zoomed' : ''}`} style={{ '--p1': p1, '--p2': p2, '--p3': p3 }} />
        <ul className="pie-legend">
          {PIE_SLICES.map((slice) => (
            <li key={slice.label}>
              <span className="pie-dot" style={{ background: slice.color }} />
              {slice.label} <strong>{slice.pct}%</strong>
            </li>
          ))}
        </ul>
      </div>
    </motion.section>
  )
}
