
import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type CheckboxProps = InputHTMLAttributes<HTMLInputElement>

export function Checkbox({ className,...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={cn(
        'h-4 w-4 rounded border border-border',
        'accent-primary',
        'focus:outline-none focus:ring-2 focus:ring-ring/20',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
