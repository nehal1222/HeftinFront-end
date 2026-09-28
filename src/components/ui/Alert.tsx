
import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  children: ReactNode
}

const variantClasses = {
  info: 'border-blue-200 bg-blue-50 text-blue-900',
  success: 'border-green-200 bg-green-50 text-green-900',
  warning: 'border-yellow-200 bg-yellow-50 text-yellow-900',
  error: 'border-red-200 bg-red-50 text-red-900',
}

export function Alert({
  variant = 'info',
  title,
  children,
  className,
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-md border p-4 text-sm',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {title && (
        <div className="mb-1 font-semibold">
          {title}
        </div>
      )}

      <div>{children}</div>
    </div>
  )
}

