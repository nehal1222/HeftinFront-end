import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function ZoomOverlay({ onClose, children }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <motion.div
      className="zoom-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button type="button" className="zoom-close" onClick={onClose} aria-label="Close zoomed view">
        &times;
      </button>
      <div className="zoom-stage" onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </motion.div>
  )
}
