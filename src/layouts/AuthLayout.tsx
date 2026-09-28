import type { ReactNode } from 'react'

type AuthLayoutProps = {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-8">
      <div className="w-full max-w-md">
        {children}
      </div>
    </main>
  )
}