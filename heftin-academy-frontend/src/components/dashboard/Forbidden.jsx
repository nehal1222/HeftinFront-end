import { motion } from 'framer-motion'

export default function Forbidden({ requiredRight }) {
  return (
    <motion.section className="phase-state" role="alert" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <span className="phase-state-code">403</span>
      <h2>Access denied</h2>
      <p>You don't have the required access to view this page.</p>
      {requiredRight && <code>Required right: {requiredRight}</code>}
    </motion.section>
  )
}
