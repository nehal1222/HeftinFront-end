
import type { SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'flex h-10 w-full rounded-md border border-border bg-surface-elevated px-3 py-2',
        'text-sm text-foreground',
        'outline-none transition-colors',
        'focus:border-ring focus:ring-2 focus:ring-ring/20',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}

