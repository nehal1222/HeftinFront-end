import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  Building2,
  FileKey2,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { AppLayout } from '@/layouts/AppLayout'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { useAuth } from '@/hooks/useAuth'
import { DEMO_BATCHES, DEMO_DEPARTMENTS, DEMO_ORGANIZATION, DEMO_PEOPLE, DEMO_PERSONAS, DEMO_RIGHTS_CEILING, DEMO_ROLES, getDemoPersona } from '@/lib/mockAuth'
import { ROUTES } from '@/lib/constants'
import { hasRight } from '@/lib/rights'
import type { DemoPersonaId, RightCode, Scope } from '@/types/auth'

const ORGANIZATION_NAV = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'People', path: ROUTES.PEOPLE, icon: Users, right: 'users.view' as const },
  { label: 'Roles', path: ROUTES.ROLES, icon: ShieldCheck, right: 'roles.view' as const },
  { label: 'Departments', path: ROUTES.DEPARTMENTS, icon: Building2, right: 'departments.view' as const },
  { label: 'Batches', path: ROUTES.BATCHES, icon: FolderKanban, right: 'batches.view' as const },
  { label: 'Audit', path: ROUTES.AUDIT, icon: Activity, right: 'audit.view' as const },
]

const PLATFORM_NAV = [
  { label: 'Organizations', path: ROUTES.PLATFORM_ORGANIZATIONS, icon: Building2 },
  { label: 'Rights catalog', path: ROUTES.PLATFORM_RIGHTS, icon: FileKey2 },
  { label: 'Organization ceiling', path: `${ROUTES.PLATFORM_ORGANIZATIONS}/org_001/rights`, icon: ShieldCheck },
]

function isVisibleInScope(scopes: Scope[], resourceScopes: Scope[]) {
  if (scopes.length === 0) return true
  return scopes.some((scope) => resourceScopes.some((resource) => resource.type === scope.type && resource.id === scope.id))
}

function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <header className="mb-7">
      <p className="text-eyebrow font-bold uppercase tracking-wider text-primary">{eyebrow}</p>
      <h1 className="mt-2 font-display text-heading-lg font-medium tracking-tight text-foreground-strong">{title}</h1>
      <p className="mt-2 max-w-3xl text-body-sm text-muted">{description}</p>
    </header>
  )
}

function SummaryCard({ icon: Icon, label, value, note }: { icon: typeof Users; label: string; value: string | number; note: string }) {
  return (
    <Card className="p-4 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <span className="grid size-9 place-items-center rounded-control bg-primary-soft text-primary-dark"><Icon size={18} aria-hidden="true" /></span>
      <p className="mt-4 text-body-sm font-medium text-muted">{label}</p>
      <p className="mt-1 font-display text-heading-lg text-foreground-strong">{value}</p>
      <p className="mt-1 text-caption text-muted">{note}</p>
    </Card>
  )
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="grid min-h-48 place-items-center rounded-card border border-dashed border-border p-6 text-center" role="status"><div><span className="mx-auto grid size-10 place-items-center rounded-full bg-primary-soft text-primary-dark"><FolderKanban size={18} aria-hidden="true" /></span><h2 className="mt-3 text-body font-semibold text-foreground-strong">{title}</h2><p className="mt-1 text-body-sm text-muted">{description}</p></div></div>
}

export function DashboardPage() {
  const { profile, personaId, login, logout, hasRight } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const platformAdmin = profile?.is_platform_admin ?? false
  const navigation = platformAdmin
    ? PLATFORM_NAV
    : ORGANIZATION_NAV.filter((item) => !item.right || (profile && hasRight(item.right)))
  const activePath = location.pathname
  const pageTitle = (() => {
    if (activePath === ROUTES.PEOPLE) return 'People'
    if (activePath === ROUTES.ROLES) return 'Roles'
    if (activePath === ROUTES.DEPARTMENTS) return 'Departments'
    if (activePath === ROUTES.BATCHES) return 'Batches'
    if (activePath === ROUTES.AUDIT) return 'Audit'
    if (activePath === ROUTES.PLATFORM_RIGHTS) return 'Rights catalog'
    if (activePath.includes('/rights')) return 'Organization ceiling'
    if (activePath.startsWith(ROUTES.PLATFORM_ORGANIZATIONS)) return 'Organizations'
    return platformAdmin ? 'Platform administration' : 'Organization dashboard'
  })()

  if (!profile) return null

  async function changePersona(value: string) {
    const next = getDemoPersona(value as DemoPersonaId)
    if (!next) return
    await login(next.id)
    navigate(next.profile.is_platform_admin ? ROUTES.PLATFORM_ORGANIZATIONS : ROUTES.DASHBOARD, { replace: true })
  }

  const nav = (
    <div className="space-y-1" aria-label="Phase 1 navigation">
      {navigation.map((item) => {
        const Icon = item.icon
        const active = activePath === item.path || (item.path === ROUTES.PLATFORM_ORGANIZATIONS && activePath.includes('/rights'))
        return (
          <NavLink key={item.path} to={item.path} className={`flex min-h-10 items-center gap-3 rounded-control px-3 text-sm transition-colors ${active ? 'bg-primary-soft font-semibold text-primary-dark' : 'text-muted hover:bg-surface hover:text-foreground-strong'}`}>
            <Icon size={17} aria-hidden="true" /><span>{item.label}</span>
          </NavLink>
        )
      })}
    </div>
  )

  const profilePanel = (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary-dark">{platformAdmin ? 'PA' : profile.role?.slice(0, 2).toUpperCase()}</span>
        <span className="min-w-0"><strong className="block truncate text-sm text-foreground-strong">{platformAdmin ? 'Platform administrator' : profile.role}</strong><small className="block text-caption text-muted">{platformAdmin ? 'Platform scope' : `${profile.rights.length} effective rights`}</small></span>
      </div>
      <label className="block text-caption font-semibold text-muted" htmlFor="demo-persona">DEMO PERSONA</label>
      <Select id="demo-persona" value={personaId ?? ''} onChange={(event) => void changePersona(event.target.value)} aria-label="Demo persona">
        {DEMO_PERSONAS.map((persona) => <option value={persona.id} key={persona.id}>{persona.label}</option>)}
      </Select>
      <p className="text-caption leading-relaxed text-muted">Development-only mock profile. Not backed by a production login API.</p>
      <Button variant="outline" size="sm" className="w-full justify-start" onClick={logout}><LogOut size={15} className="mr-2" aria-hidden="true" />Sign out</Button>
    </div>
  )

  return (
    <AppLayout nav={nav} profile={profilePanel} title={pageTitle}>
      {renderDashboardContent({ activePath, profile, navigate })}
    </AppLayout>
  )
}

function renderDashboardContent({ activePath, profile, navigate }: { activePath: string; profile: NonNullable<ReturnType<typeof useAuth>['profile']>; navigate: ReturnType<typeof useNavigate> }) {
  const platformAdmin = profile.is_platform_admin
  const scoped = !platformAdmin && profile.scopes.length > 0
  const visiblePeople = DEMO_PEOPLE.filter((person) => isVisibleInScope(profile.scopes, [{ type: 'batch', id: person.batchId }, { type: 'department', id: person.departmentId }]))
  const visibleBatches = DEMO_BATCHES.filter((batch) => isVisibleInScope(profile.scopes, [{ type: 'batch', id: batch.id }, { type: 'department', id: batch.departmentId }]))
  const scopeLabel = profile.scopes.map((scope) => scope.type === 'batch' ? `Batch ${scope.id.replace('batch_', '')}` : scope.id).join(', ')

  if (activePath === ROUTES.PEOPLE) {
    return <><PageHeading eyebrow="ORGANIZATION / PEOPLE" title="People" description={scoped ? `Showing ${scopeLabel} only. User visibility is limited by assigned scope.` : 'People visible within your organization rights.'} />
      {visiblePeople.length === 0 ? <EmptyState title="No people in this scope" description="There are no user records in the assigned scope." /> : <Card className="overflow-x-auto p-0"><table className="w-full min-w-[620px] text-left text-sm"><thead className="border-b border-border bg-surface"><tr>{['Name', 'Role', 'Department', 'Batch', 'Status'].map((label) => <th className="px-4 py-3 text-eyebrow font-bold uppercase tracking-wider text-muted" key={label}>{label}</th>)}</tr></thead><tbody>{visiblePeople.map((person) => <tr className="border-b border-border last:border-0" key={person.id}><td className="px-4 py-3 font-medium text-foreground-strong">{person.name}</td><td className="px-4 py-3 text-muted">{person.role}</td><td className="px-4 py-3 text-muted">{person.department}</td><td className="px-4 py-3 text-muted">{person.batch}</td><td className="px-4 py-3"><span className="rounded-full bg-primary-soft px-2 py-1 text-caption font-semibold text-primary-dark">{person.status}</span></td></tr>)}</tbody></table></Card>}
    </>
  }

  if (activePath === ROUTES.ROLES) {
    return <><PageHeading eyebrow="ORGANIZATION / ACCESS" title="Roles" description="Organization-defined roles; rights are read as effective values from AuthProfile." /><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{DEMO_ROLES.map((role) => <Card key={role.id} className="transition-transform hover:-translate-y-0.5"><span className="grid size-9 place-items-center rounded-control bg-primary-soft text-primary-dark"><ShieldCheck size={17} aria-hidden="true" /></span><h2 className="mt-4 font-display text-heading-sm text-foreground-strong">{role.name}</h2><p className="mt-1 text-body-sm text-muted">{role.scope}</p><div className="mt-4 flex items-center justify-between border-t border-border pt-3"><span className="text-caption text-muted">{role.rights.length} sample rights</span><span className="text-caption font-semibold text-primary">View <ArrowRight className="inline" size={12} /></span></div></Card>)}</section></>
  }

  if (activePath === ROUTES.DEPARTMENTS) {
    const departments = DEMO_DEPARTMENTS.filter((department) => isVisibleInScope(profile.scopes, DEMO_BATCHES.filter((batch) => batch.departmentId === department.id).map((batch) => ({ type: 'batch', id: batch.id })).concat([{ type: 'department', id: department.id }])) )
    return <><PageHeading eyebrow="ORGANIZATION / STRUCTURE" title="Departments" description={scoped ? `Departments visible through ${scopeLabel}.` : 'Organization academic structure.'} />{departments.length ? <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{departments.map((department) => <Card key={department.id}><span className="text-eyebrow font-bold uppercase tracking-wider text-primary">DEPARTMENT</span><h2 className="mt-2 font-display text-heading-sm text-foreground-strong">{department.name}</h2><p className="mt-2 text-body-sm text-muted">Department head · {department.head}</p><p className="mt-4 border-t border-border pt-3 text-caption text-muted">{department.peopleCount} people</p></Card>)}</section> : <EmptyState title="No departments in scope" description="No department records match this profile's scope." />}</>
  }

  if (activePath === ROUTES.BATCHES) {
    return <><PageHeading eyebrow="ORGANIZATION / STRUCTURE" title="Batches" description={scoped ? `Showing ${scopeLabel} only.` : 'Organization cohorts and their assigned staff.'} />{visibleBatches.length ? <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{visibleBatches.map((batch) => <Card key={batch.id}><div className="flex items-start justify-between gap-3"><span className="grid size-9 place-items-center rounded-control bg-primary-soft text-primary-dark"><FolderKanban size={17} aria-hidden="true" /></span><span className="rounded-full bg-primary-soft px-2 py-1 text-caption font-semibold text-primary-dark">Active</span></div><h2 className="mt-4 font-display text-heading-sm text-foreground-strong">{batch.name}</h2><p className="mt-1 text-body-sm text-muted">{batch.department}</p><div className="mt-4 flex justify-between border-t border-border pt-3 text-caption text-muted"><span>{batch.teacher}</span><span>{batch.peopleCount} people</span></div></Card>)}</section> : <EmptyState title="No batches in scope" description="No batch records match this profile's scope." />}</>
  }

  if (activePath === ROUTES.AUDIT) {
    return <><PageHeading eyebrow="ORGANIZATION / SECURITY" title="Audit" description="Recent organization events in the demo workspace." /><Card><div className="space-y-4">{['Batch 101 schedule updated · 9:42 AM', 'Teacher invited to Mathematics · Yesterday', 'Role rights reviewed · Sep 30'].map((item) => <div className="flex items-center gap-3 border-b border-border pb-4 last:border-0 last:pb-0" key={item}><Activity size={16} className="text-primary" aria-hidden="true" /><span className="text-sm text-foreground">{item}</span></div>)}</div></Card></>
  }

  if (activePath === ROUTES.PLATFORM_RIGHTS || activePath.endsWith('/rights')) {
    return <><PageHeading eyebrow="PLATFORM / ORGANIZATION CEILING" title={activePath === ROUTES.PLATFORM_RIGHTS ? 'Rights catalog' : 'Organization rights'} description="Demo catalog only. Production catalog and ceiling are owned by platform APIs." /><Card><p className="text-body-sm text-muted">The sample ceiling contains {DEMO_RIGHTS_CEILING.length} Sprint 2 rights. No effective-right calculation is performed in this client.</p><div className="mt-5 grid gap-2 sm:grid-cols-2">{DEMO_RIGHTS_CEILING.map((right) => <div className="flex items-center gap-2 rounded-control border border-border bg-surface p-3" key={right}><FileKey2 size={15} className="text-primary" aria-hidden="true" /><code className="text-caption text-foreground">{right}</code></div>)}</div></Card></>
  }

  if (activePath.startsWith(ROUTES.PLATFORM_ORGANIZATIONS)) {
    return <><PageHeading eyebrow="PLATFORM ADMINISTRATION" title="Organizations" description="Platform-only organization management demo. SuperAdmin is represented by the platform-admin flag." /><Card><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-eyebrow font-bold uppercase tracking-wider text-primary">ACTIVE ORGANIZATION</p><h2 className="mt-2 font-display text-heading-md text-foreground-strong">{DEMO_ORGANIZATION.name}</h2><p className="mt-1 text-body-sm text-muted">{DEMO_ORGANIZATION.city} · {DEMO_ORGANIZATION.peopleCount} people · {DEMO_ORGANIZATION.roleCount} roles</p></div><Button variant="outline" onClick={() => navigate(`${ROUTES.PLATFORM_ORGANIZATIONS}/org_001/rights`)}>Manage ceiling <ArrowRight size={15} className="ml-2" /></Button></div></Card></>
  }

  return <>
    <PageHeading eyebrow={platformAdmin ? 'PLATFORM ADMINISTRATION' : 'ORGANIZATION OVERVIEW'} title={platformAdmin ? 'Platform administration' : 'Good morning'} description={platformAdmin ? 'Manage organizations and inspect their demo rights ceilings.' : 'A focused overview of your organization and effective access.'} />
    {!platformAdmin && scoped && <Alert variant="info" className="mb-5">Showing {scopeLabel} only. Organization-wide records are not included.</Alert>}
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard icon={Users} label="People" value={scoped ? visiblePeople.length : DEMO_ORGANIZATION.peopleCount} note={scoped ? 'Within assigned scope' : 'Organization total'} />
      <SummaryCard icon={ShieldCheck} label="Roles" value={scoped ? '—' : DEMO_ORGANIZATION.roleCount} note="Organization-defined" />
      <SummaryCard icon={FileKey2} label="Effective rights" value={profile.rights.length} note="Loaded from mock /auth/me" />
      <SummaryCard icon={Building2} label="Departments" value={scoped ? DEMO_DEPARTMENTS.filter((department) => isVisibleInScope(profile.scopes, [{ type: 'department', id: department.id }])).length : DEMO_ORGANIZATION.departmentCount} note="Active departments" />
    </section>
    <section className="mt-6 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <Card>
        <div className="flex items-start justify-between gap-4"><div><p className="text-eyebrow font-bold uppercase tracking-wider text-primary">ORGANIZATION</p><h2 className="mt-2 font-display text-heading-md text-foreground-strong">{platformAdmin ? 'Platform workspace' : DEMO_ORGANIZATION.name}</h2><p className="mt-1 text-body-sm text-muted">{platformAdmin ? 'Platform-level administration' : `${DEMO_ORGANIZATION.city} · ${DEMO_ORGANIZATION.status}`}</p></div><span className="rounded-full bg-primary-soft px-3 py-1 text-caption font-semibold text-primary-dark">{platformAdmin ? 'Platform admin' : 'Phase 1'}</span></div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">{navigationCards(profile, platformAdmin).map((item) => <button className="flex items-center justify-between gap-3 rounded-control border border-border bg-surface p-4 text-left transition-colors hover:border-primary hover:bg-primary-soft" key={item.path} onClick={() => navigate(item.path)}><span><strong className="block text-sm text-foreground-strong">{item.label}</strong><small className="mt-1 block text-caption text-muted">{item.description}</small></span><ArrowRight size={15} className="shrink-0 text-primary" aria-hidden="true" /></button>)}</div>
      </Card>
      <Card>
        <div className="flex items-center justify-between gap-3"><div><p className="text-eyebrow font-bold uppercase tracking-wider text-primary">ACCESS PROFILE</p><h2 className="mt-2 font-display text-heading-md text-foreground-strong">{platformAdmin ? 'Platform administrator' : profile.role}</h2></div><ShieldCheck size={20} className="text-primary" aria-hidden="true" /></div>
        <p className="mt-2 text-body-sm text-muted">{profile.rights.length} effective rights · {profile.scopes.length ? profile.scopes.map((scope) => `${scope.type}: ${scope.id}`).join(', ') : 'organization-wide scope'}</p>
        <div className="mt-5 space-y-2">{profile.rights.length ? profile.rights.slice(0, 6).map((right) => <div className="flex items-center gap-2 text-caption text-foreground" key={right}><span className="size-1.5 rounded-full bg-primary" />{right}</div>) : <EmptyState title="Platform access" description="This profile is identified through is_platform_admin, not a role name." />}</div>
      </Card>
    </section>
  </>
}

function navigationCards(profile: NonNullable<ReturnType<typeof useAuth>['profile']>, platformAdmin: boolean) {
  const source = platformAdmin
    ? [{ label: 'Organizations', path: ROUTES.PLATFORM_ORGANIZATIONS, description: 'Organization status and metadata' }, { label: 'Rights catalog', path: ROUTES.PLATFORM_RIGHTS, description: 'Sprint 2 rights reference' }, { label: 'Organization ceiling', path: `${ROUTES.PLATFORM_ORGANIZATIONS}/org_001/rights`, description: 'Manage demo organization ceiling' }]
    : [{ label: 'People', path: ROUTES.PEOPLE, right: 'users.view' as const, description: 'Scoped organization directory' }, { label: 'Roles', path: ROUTES.ROLES, right: 'roles.view' as const, description: 'Organization-defined roles' }, { label: 'Departments', path: ROUTES.DEPARTMENTS, right: 'departments.view' as const, description: 'Department structure' }, { label: 'Batches', path: ROUTES.BATCHES, right: 'batches.view' as const, description: 'Assigned cohorts' }, { label: 'Audit', path: ROUTES.AUDIT, right: 'audit.view' as const, description: 'Recent activity' }]
  return source.filter((item) => !('right' in item) || hasRight(profile.rights, item.right as RightCode))
}