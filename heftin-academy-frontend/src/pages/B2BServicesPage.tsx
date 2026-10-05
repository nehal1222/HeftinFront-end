import { useEffect, useState } from 'react'
import { Building2, CalendarDays, CheckCircle2, ClipboardList, Users } from 'lucide-react'
import { AsyncState } from '@/components/ui/AsyncState'
import { getAsyncState } from '@/lib/async-state'
import { getErrorMessage } from '@/lib/axios'
import { b2bService } from '@/services/b2b.service'
import type { B2BBatch, B2BEntitlement, B2BExam, B2BOrganization } from '@/types/b2b'

type OrganizationData = {
  organization: B2BOrganization
  batches: B2BBatch[]
  exams: B2BExam[]
  entitlements: B2BEntitlement[]
}

type LoadState = { status: 'loading' } | { status: 'ready'; data: OrganizationData } | { status: 'failed'; error: unknown }

export function B2BServicesPage() {
  const [attempt, setAttempt] = useState(0)
  const [loadState, setLoadState] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    let active = true
    setLoadState({ status: 'loading' })

    Promise.all([
      b2bService.getOrganization(),
      b2bService.listBatches(),
      b2bService.listExams(),
      b2bService.listEntitlements(),
    ]).then(([organization, batches, exams, entitlements]) => {
      if (active) setLoadState({ status: 'ready', data: { organization, batches, exams, entitlements } })
    }).catch((error: unknown) => {
      if (active) setLoadState({ status: 'failed', error })
    })

    return () => {
      active = false
    }
  }, [attempt])

  if (loadState.status === 'loading') return <AsyncState state="loading" />
  if (loadState.status === 'failed') {
    const state = getAsyncState(loadState.error)
    return (
      <AsyncState
        state={state}
        description={state === 'error' ? getErrorMessage(loadState.error) : undefined}
        onRetry={state === 'error' ? () => setAttempt((value) => value + 1) : undefined}
      />
    )
  }

  const { organization, batches, exams, entitlements } = loadState.data

  return (
    <section className="mt-8 space-y-6" aria-labelledby="b2b-services-title">
      <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-eyebrow font-bold uppercase tracking-wider text-primary">B2B services</p><h2 id="b2b-services-title" className="mt-1 font-display text-heading-md text-foreground-strong">{organization.name}</h2><p className="mt-2 text-body-sm text-muted">Organization operations for UPSC batches, faculty, learners, and exam delivery.</p></div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-caption font-semibold text-primary-dark"><CheckCircle2 size={14} aria-hidden="true" /> Pack active</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <ServiceStat icon={Users} value={organization.learnerCount} label="Learners" />
        <ServiceStat icon={Building2} value={organization.batchCount} label="UPSC batches" />
        <ServiceStat icon={ClipboardList} value={organization.facultyCount} label="Faculty members" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-card border border-border bg-surface-elevated p-card"><div className="flex items-center justify-between gap-3"><div><p className="text-eyebrow font-bold uppercase tracking-wider text-muted">Batches</p><h3 className="mt-1 font-display text-heading-sm text-foreground-strong">Manage UPSC cohorts</h3></div><button type="button" className="rounded-control bg-primary px-3 py-2 text-caption font-semibold text-primary-foreground hover:bg-primary-dark">New batch</button></div><div className="mt-5 space-y-3">{batches.length ? batches.map((batch) => <div key={batch.id} className="rounded-control border border-border bg-surface p-4"><div className="flex flex-wrap items-start justify-between gap-2"><div><p className="text-body-sm font-semibold text-foreground-strong">{batch.name}</p><p className="mt-1 text-caption text-muted">{batch.learnerCount} learners · {batch.facultyName}</p></div><span className="text-caption font-semibold text-primary-dark">{batch.progress}% progress</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-primary-soft"><div className="h-full rounded-full bg-primary" style={{ width: `${batch.progress}%` }} /></div><p className="mt-2 text-caption text-muted">Next: {batch.nextExam}</p></div>) : <AsyncState state="empty" />}</div></article>

        <article className="rounded-card border border-border bg-surface-elevated p-card"><div><p className="text-eyebrow font-bold uppercase tracking-wider text-muted">Exam operations</p><h3 className="mt-1 font-display text-heading-sm text-foreground-strong">UPSC exam schedule</h3></div><div className="mt-5 space-y-3">{exams.length ? exams.map((exam) => <div key={exam.id} className="flex gap-3 rounded-control border border-border bg-surface p-3"><CalendarDays size={17} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" /><div className="min-w-0 flex-1"><p className="text-body-sm font-semibold text-foreground-strong">{exam.title}</p><p className="mt-1 text-caption text-muted">{exam.batchName} · {exam.scheduledFor}</p><p className="mt-1 text-caption text-muted">{exam.submissions} submissions</p></div><span className="text-caption font-semibold capitalize text-primary-dark">{exam.status}</span></div>) : <AsyncState state="empty" />}</div><button type="button" className="mt-5 w-full rounded-control border border-primary px-3 py-2.5 text-body-sm font-semibold text-primary hover:bg-primary-soft">Create UPSC exam</button></article>
      </div>

      <article className="rounded-card border border-border bg-surface-elevated p-card"><p className="text-eyebrow font-bold uppercase tracking-wider text-muted">Heftin-managed rights</p><h3 className="mt-1 font-display text-heading-sm text-foreground-strong">Organization pack</h3>{entitlements.length ? <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">{entitlements.map((item) => <div key={item.code} className={`rounded-control border p-3 ${item.enabled ? 'border-primary-tint-4 bg-primary-soft' : 'border-border bg-surface'}`}><p className="text-body-sm font-semibold text-foreground-strong">{item.label}</p><p className="mt-1 text-caption text-muted">{item.enabled ? 'Available' : 'Not included'}</p></div>)}</div> : <AsyncState state="empty" />}<p className="mt-4 text-caption text-muted">Heftin Super Admin controls this pack. Organization Admin can assign only enabled rights to faculty and learners.</p></article>
    </section>
  )
}

function ServiceStat({ icon: Icon, value, label }: { icon: typeof Users; value: number; label: string }) {
  return <div className="flex items-center gap-3 rounded-card border border-border bg-surface-elevated p-card"><span className="grid size-9 place-items-center rounded-control bg-primary-soft text-primary-dark"><Icon size={18} aria-hidden="true" /></span><span><strong className="block font-display text-heading-md text-foreground-strong">{value}</strong><span className="text-caption text-muted">{label}</span></span></div>
}
