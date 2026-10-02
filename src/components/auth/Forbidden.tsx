import { ShieldAlert } from 'lucide-react'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useAuth } from '@/hooks/useAuth'

export function Forbidden() {
  const { logout } = useAuth()

  return (
    <main className="grid min-h-screen place-items-center bg-surface px-page py-section">
      <Card className="w-full max-w-lg text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-primary-soft text-primary-dark">
          <ShieldAlert size={22} aria-hidden="true" />
        </span>
        <p className="mt-5 text-eyebrow font-bold uppercase tracking-wider text-primary">403 · Access denied</p>
        <h1 className="mt-2 font-display text-heading-md text-foreground-strong">You don't have the required access.</h1>
        <p className="mt-2 text-body-sm text-muted">This account cannot open the requested workspace or resource scope.</p>
        <Alert variant="info" className="mt-5 text-left">Access is determined by the active demo AuthProfile's rights and scopes.</Alert>
        <Button className="mt-5" onClick={logout}>Sign out</Button>
      </Card>
    </main>
  )
}