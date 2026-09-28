import { useEffect, type ReactNode } from 'react'
import { Alert } from '@/components/ui/Alert'
import { cn } from '@/lib/utils'

type ToastProps = {
  open: boolean
  onClose: () => void
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  children: ReactNode
  duration?: number
  className?: string
}

export function Toast({
  open,
  onClose,
  variant = 'info',
  title,
  children,
  duration = 4000,
  className,
}: ToastProps) {
  useEffect(() => {
    if (!open || duration <= 0) {
      return
    }

    const timer = window.setTimeout(onClose, duration)

    return () => {
      window.clearTimeout(timer)
    }
  }, [open, duration, onClose])

  if (!open) {
    return null
  }

  return (
    <div
      className={cn(
        'fixed right-4 top-4 z-[60] w-full max-w-sm',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <Alert
        variant={variant}
        title={title}
      >
        {children}
      </Alert>
    </div>
  )
}