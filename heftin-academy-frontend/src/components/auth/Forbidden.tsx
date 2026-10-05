import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ROUTES } from '@/lib/constants'

interface ForbiddenProps {
  requiredRight?: string
  message?: string
}

export function Forbidden({ requiredRight, message }: ForbiddenProps) {
  return (
    <motion.main
      className="grid min-h-screen place-items-center bg-surface px-page py-section text-center"
      role="alert"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-md rounded-card border border-border bg-surface-elevated p-8 shadow-sm">
        <span className="inline-block rounded-full bg-primary-soft px-3 py-1 font-mono text-heading-md font-bold text-primary-dark">
          403
        </span>
        <h1 className="mt-4 font-display text-heading-lg text-foreground-strong">Access denied</h1>
        <p className="mt-2 text-body-sm text-muted">
          {message ?? "You don't have the required access to view this page."}
        </p>

        {requiredRight && (
          <div className="mt-4 rounded-control border border-border bg-surface p-2 text-caption">
            <span className="text-muted">Required right: </span>
            <code className="font-mono font-bold text-primary-dark">{requiredRight}</code>
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <Link
            to={ROUTES.DASHBOARD}
            className="rounded-control bg-primary px-4 py-2 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors"
          >
            Return to dashboard
          </Link>
        </div>
      </div>
    </motion.main>
  )
}

export default Forbidden
