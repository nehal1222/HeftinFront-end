import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { APP_NAME, ROUTES } from '@/lib/constants'

type AuthLayoutProps = {
  children: ReactNode
  eyebrow?: string
}

export function AuthLayout({ children, eyebrow = 'Exam preparation, made focused' }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-surface px-5 py-8 text-foreground sm:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-3xl border border-border bg-card shadow-xl lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative hidden overflow-hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full border-[24px] border-primary-foreground/10" />
          <div className="relative">
            <Link className="text-lg font-semibold tracking-tight" to={ROUTES.HOME}>
              {APP_NAME}
            </Link>
            <p className="mt-24 max-w-xs text-4xl font-semibold leading-tight tracking-tight">
              Build confidence for every paper.
            </p>
          </div>
          <p className="relative max-w-sm text-sm leading-6 text-primary-foreground/75">
            One calm place for structured preparation, from prelims to mains.
          </p>
        </aside>
        <section className="flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            <Link className="mb-10 inline-block text-lg font-semibold tracking-tight text-primary lg:hidden" to={ROUTES.HOME}>
              {APP_NAME}
            </Link>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
            {children}
          </div>
        </section>
      </div>
    </main>
  )
}