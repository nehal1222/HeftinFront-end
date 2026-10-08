import { Building2, CalendarDays, CheckCircle2, ClipboardList, Users } from 'lucide-react'
import type { B2BBatch, B2BEntitlement, B2BExam, B2BOrganization } from '@/types/b2b'

const organization: B2BOrganization = {
  id: 'demo-org',
  name: 'Heftin UPSC Institute',
  examFocus: 'UPSC',
  learnerCount: 148,
  facultyCount: 12,
  batchCount: 6,
  status: 'active',
}

const batches: B2BBatch[] = [
  { id: 'b1', name: 'UPSC Foundation 2026', learnerCount: 64, facultyName: 'Dr. Meera Kapoor', nextExam: 'UPSC Prelims Mock 04', progress: 72 },
  { id: 'b2', name: 'UPSC Prelims Intensive', learnerCount: 48, facultyName: 'Arjun Rao', nextExam: 'UPSC CSAT Practice 02', progress: 58 },
  { id: 'b3', name: 'UPSC Mains Answer Writing', learnerCount: 36, facultyName: 'Nisha Menon', nextExam: 'GS Paper II Review', progress: 84 },
]

const exams: B2BExam[] = [
  { id: 'e1', title: 'UPSC Prelims Mock 04', batchName: 'UPSC Foundation 2026', status: 'scheduled', scheduledFor: '18 Sep, 10:00', submissions: 0 },
  { id: 'e2', title: 'UPSC CSAT Practice 02', batchName: 'UPSC Prelims Intensive', status: 'live', scheduledFor: 'Today, 14:00', submissions: 31 },
  { id: 'e3', title: 'GS Paper II Review', batchName: 'UPSC Mains Answer Writing', status: 'completed', scheduledFor: '16 Sep, 09:00', submissions: 34 },
]

const entitlements: B2BEntitlement[] = [
  { code: 'exams', label: 'UPSC exam delivery', enabled: true, source: 'Heftin pack' },
  { code: 'batches', label: 'Batch management', enabled: true, source: 'Heftin pack' },
  { code: 'faculty', label: 'Faculty workspace', enabled: true, source: 'Heftin pack' },
  { code: 'analytics', label: 'Organization analytics', enabled: true, source: 'Heftin pack' },
  { code: 'mains-evaluation', label: 'Mains evaluation', enabled: false, source: 'Heftin pack' },
]

export function B2BServicesPage() {
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
        <article className="rounded-card border border-border bg-surface-elevated p-card"><div className="flex items-center justify-between gap-3"><div><p className="text-eyebrow font-bold uppercase tracking-wider text-muted">Batches</p><h3 className="mt-1 font-display text-heading-sm text-foreground-strong">Manage UPSC cohorts</h3></div><button type="button" className="rounded-control bg-primary px-3 py-2 text-caption font-semibold text-primary-foreground hover:bg-primary-dark">New batch</button></div><div className="mt-5 space-y-3">{batches.map((batch) => <div key={batch.id} className="rounded-control border border-border bg-surface p-4"><div className="flex flex-wrap items-start justify-between gap-2"><div><p className="text-body-sm font-semibold text-foreground-strong">{batch.name}</p><p className="mt-1 text-caption text-muted">{batch.learnerCount} learners · {batch.facultyName}</p></div><span className="text-caption font-semibold text-primary-dark">{batch.progress}% progress</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-primary-soft"><div className="h-full rounded-full bg-primary" style={{ width: `${batch.progress}%` }} /></div><p className="mt-2 text-caption text-muted">Next: {batch.nextExam}</p></div>)}</div></article>

        <article className="rounded-card border border-border bg-surface-elevated p-card"><div><p className="text-eyebrow font-bold uppercase tracking-wider text-muted">Exam operations</p><h3 className="mt-1 font-display text-heading-sm text-foreground-strong">UPSC exam schedule</h3></div><div className="mt-5 space-y-3">{exams.map((exam) => <div key={exam.id} className="flex gap-3 rounded-control border border-border bg-surface p-3"><CalendarDays size={17} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" /><div className="min-w-0 flex-1"><p className="text-body-sm font-semibold text-foreground-strong">{exam.title}</p><p className="mt-1 text-caption text-muted">{exam.batchName} · {exam.scheduledFor}</p><p className="mt-1 text-caption text-muted">{exam.submissions} submissions</p></div><span className="text-caption font-semibold capitalize text-primary-dark">{exam.status}</span></div>)}</div><button type="button" className="mt-5 w-full rounded-control border border-primary px-3 py-2.5 text-body-sm font-semibold text-primary hover:bg-primary-soft">Create UPSC exam</button></article>
      </div>

      <article className="rounded-card border border-border bg-surface-elevated p-card"><p className="text-eyebrow font-bold uppercase tracking-wider text-muted">Heftin-managed rights</p><h3 className="mt-1 font-display text-heading-sm text-foreground-strong">Organization pack</h3><div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">{entitlements.map((item) => <div key={item.code} className={`rounded-control border p-3 ${item.enabled ? 'border-primary-tint-4 bg-primary-soft' : 'border-border bg-surface'}`}><p className="text-body-sm font-semibold text-foreground-strong">{item.label}</p><p className="mt-1 text-caption text-muted">{item.enabled ? 'Available' : 'Not included'}</p></div>)}</div><p className="mt-4 text-caption text-muted">Heftin Super Admin controls this pack. Organization Admin can assign only enabled rights to faculty and learners.</p></article>
    </section>
  )
}

function ServiceStat({ icon: Icon, value, label }: { icon: typeof Users; value: number; label: string }) {
  return <div className="flex items-center gap-3 rounded-card border border-border bg-surface-elevated p-card"><span className="grid size-9 place-items-center rounded-control bg-primary-soft text-primary-dark"><Icon size={18} aria-hidden="true" /></span><span><strong className="block font-display text-heading-md text-foreground-strong">{value}</strong><span className="text-caption text-muted">{label}</span></span></div>
}
