import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { FormField } from '@/components/ui/FormField'
import { Select } from '@/components/ui/Select'
import { AsyncState } from '@/components/ui/AsyncState'
import { AuthLayout } from '@/layouts/AuthLayout'
import { useAuth } from '@/hooks/useAuth'
import { DEMO_PERSONAS } from '@/lib/mockAuth'
import { ROUTES } from '@/lib/constants'
import type { DemoPersonaId } from '@/types/auth'

export function LoginPage() {
  const { status, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [personaId, setPersonaId] = useState<DemoPersonaId>('org_admin')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (status === 'loading') {
    return <main className="grid min-h-screen place-items-center bg-surface px-page"><AsyncState state="loading" title="Loading access..." /></main>
  }

  if (status === 'authenticated') return <Navigate to={ROUTES.DASHBOARD} replace />

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(personaId)
      const from = (location.state as { from?: string } | null)?.from ?? ROUTES.DASHBOARD
      navigate(from, { replace: true })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not start the demo session.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <Card className="overflow-hidden p-0">
        <div className="border-b border-border bg-primary-shade-4 px-6 py-7 text-white sm:px-8">
          <p className="text-eyebrow font-bold uppercase tracking-wider text-primary-tint-3">Phase 1 · Organization</p>
          <h1 className="mt-3 font-display text-heading-lg font-medium">Enter your workspace.</h1>
          <p className="mt-2 max-w-sm text-body-sm text-primary-tint-4">Access is loaded from the selected demo AuthProfile. No role or subscription rights are calculated in the browser.</p>
        </div>
        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <p className="text-eyebrow font-bold uppercase tracking-wider text-muted">Development demo</p>
            <h2 className="mt-2 text-xl font-semibold text-foreground-strong">Choose a Phase 1 account</h2>
            <p className="mt-1 text-sm text-muted">Profiles match the planned `/auth/me` shape until the backend endpoint is available.</p>
          </div>

          {error && <Alert variant="error" className="mb-5">{error}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Demo account" htmlFor="demo-persona">
              <Select id="demo-persona" value={personaId} onChange={(event) => setPersonaId(event.target.value as DemoPersonaId)}>
                {DEMO_PERSONAS.map((persona) => <option key={persona.id} value={persona.id}>{persona.label}</option>)}
              </Select>
            </FormField>

            <div className="rounded-control border border-border bg-surface p-4 text-sm text-muted">
              {DEMO_PERSONAS.find((persona) => persona.id === personaId)?.profile.is_platform_admin
                ? 'Platform administrator access is represented by is_platform_admin, not a role name.'
                : personaId === 'student'
                  ? 'Student access is restricted to the assigned Batch 101 scope.'
                  : 'Organization Admin access is organization-wide and carries the demo rights ceiling.'}
            </div>

            <Button type="submit" className="w-full" loading={submitting}>Continue to workspace</Button>
          </form>
        </div>
      </Card>
    </AuthLayout>
  )
}