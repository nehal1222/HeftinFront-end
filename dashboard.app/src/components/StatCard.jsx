import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

const DISTANCE_THRESHOLD = 140 // px
const VELOCITY_THRESHOLD = 500 // px/s
const SPRING = { type: 'spring', stiffness: 300, damping: 22 }

export default function StatCard({ card, onDismiss }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useTransform(x, [-250, 250], [-18, 18])
  const opacity = useTransform(x, [-250, -150, 0, 150, 250], [0, 1, 1, 1, 0])

  function handleDragEnd(_event, info) {
    const farEnough = Math.abs(info.offset.x) > DISTANCE_THRESHOLD
    const fastEnough = Math.abs(info.velocity.x) > VELOCITY_THRESHOLD

    if (farEnough || fastEnough) {
      const direction = info.offset.x >= 0 ? 1 : -1
      const flyDistance = direction * (window.innerWidth || 1000)
      animate(x, flyDistance, { duration: 0.32, ease: 'easeOut' })
      animate(y, info.offset.y * 2, { duration: 0.32, ease: 'easeOut' })
      setTimeout(() => onDismiss(card.id), 320)
    } else {
      animate(x, 0, SPRING)
      animate(y, 0, SPRING)
    }
  }

  return (
    <motion.div
      className="dash-stat-card"
      layout
      style={{ x, y, rotate, opacity }}
      drag
      dragElastic={0.6}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.85 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.25 }}
    >
      <strong>{card.value}</strong>
      <span className="dash-stat-label">{card.label}</span>
      <span className={`dash-stat-delta${card.deltaClass ? ` ${card.deltaClass}` : ''}`}>
        {card.delta}
      </span>
    </motion.div>
  )
}
