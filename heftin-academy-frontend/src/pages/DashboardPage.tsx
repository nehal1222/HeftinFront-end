import { useMemo, useState } from 'react'
import {
  BarChart3,
  BookOpen,
  Building2,
  CheckSquare,
  Check,
  ChevronRight,
  Clock3,
  Crown,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Library,
  ListChecks,
  LogOut,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { B2BServicesPage } from '@/pages/B2BServicesPage'
import { canAccess, getVisibleNavigation, NAVIGATION_ITEMS, PLAN_LABELS, ROLE_LABELS } from '@/lib/access'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

const ICONS: Record<string, LucideIcon> = {
  overview: LayoutDashboard,
  exams: FileText,
  learning: BookOpen,
  microtasks: ListChecks,
  knowledge: Library,
  analytics: BarChart3,
  content: Sparkles,
  assignments: CheckSquare,
  people: Users,
  organization: Building2,
  subscriptions: Crown,
}

const NAV_GROUP_LABELS = { learn: 'Learn', manage: 'Manage', platform: 'Platform' } as const

const ROLE_HOME = {
  individual: { eyebrow: 'Individual plan', title: 'Build your learning rhythm.', description: 'A personal workspace that grows with your subscription, from first practice set to full exam analytics.', stats: [['3', 'Active courses', 'Keep your momentum'], ['12', 'Microtasks', 'Ready to practise'], ['78%', 'Weekly progress', 'Up 8% this week']] },
  student: { eyebrow: 'Student workspace', title: 'Your next best study move.', description: 'Find UPSC exams, learning material, and focused practice in one calm place.', stats: [['04', 'Open UPSC exams', 'Two due this week'], ['18', 'Lessons left', 'Across 3 subjects'], ['6 days', 'Study streak', 'Keep it going']] },
  faculty: { eyebrow: 'Faculty workspace', title: 'Turn expertise into progress.', description: 'Create material, guide assignments, and see where your learners need support.', stats: [['24', 'Assigned learners', 'Across 2 batches'], ['08', 'Pending reviews', 'Due this week'], ['92%', 'Class engagement', 'Above target']] },
  org_admin: { eyebrow: 'Organization workspace', title: 'Run a focused learning operation.', description: 'Manage people, rights, and the exam experience your organization has purchased.', stats: [['06', 'Active batches', 'Across your org'], ['148', 'Learners', '12 new this month'], ['11', 'Rights enabled', 'From the org pack']] },
  super_admin: { eyebrow: 'Heftin platform', title: 'See the whole learning network.', description: 'Control organizations, subscription plans, and platform capabilities available to every workspace.', stats: [['42', 'Organizations', '3 awaiting review'], ['8.4k', 'Active learners', 'Across all plans'], ['12', 'Live capabilities', 'Available platform-wide']] },
} as const

export function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  const visibleNavigation = useMemo(() => (user ? getVisibleNavigation(user) : []), [user])
  if (!user) return null
  const activeItem = visibleNavigation.find((item) => item.id === activeTab) ?? visibleNavigation[0]
  const ActiveIcon = ICONS[activeItem?.id ?? 'overview']
  const home = ROLE_HOME[user.role]

  function handleLogout() {
    logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <div className="min-h-screen bg-surface font-sans text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[96rem]">
        <aside className="hidden w-72 shrink-0 flex-col border-r border-border bg-surface-elevated p-6 lg:flex">
          <div className="flex items-center gap-3 border-b border-border pb-6">
            <div className="grid size-10 place-items-center rounded-control bg-primary text-primary-foreground"><GraduationCap size={21} aria-hidden="true" /></div>
            <div><p className="font-display text-heading-sm text-foreground-strong">Heftin</p><p className="text-caption uppercase tracking-wider text-muted">Academy OS</p></div>
          </div>
          <div className="flex flex-1 flex-col pt-8">
            <p className="mb-3 text-eyebrow font-bold uppercase tracking-wider text-muted">Workspace</p>
            <nav className="space-y-5" aria-label="Workspace navigation">
              {(['learn', 'manage', 'platform'] as const).map((group) => {
                const groupItems = visibleNavigation.filter((item) => item.group === group)
                if (!groupItems.length) return null
                return <div key={group}><p className="mb-2 px-3 text-eyebrow font-bold uppercase tracking-wider text-muted">{NAV_GROUP_LABELS[group]}</p><div className="space-y-1">{groupItems.map((item) => {
                  const Icon = ICONS[item.id]
                  const selected = activeItem?.id === item.id
                  return <button key={item.id} type="button" onClick={() => setActiveTab(item.id)} className={cn('flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-left text-body-sm transition-colors', selected ? 'bg-primary text-primary-foreground' : 'text-muted hover:bg-primary-soft hover:text-primary-dark')}><Icon size={17} aria-hidden="true" /><span className="min-w-0 flex-1 truncate">{item.label}</span>{selected && <ChevronRight size={15} aria-hidden="true" />}</button>
                })}</div></div>
              })}
            </nav>
            <div className="mt-auto rounded-card border border-border bg-surface p-4"><p className="text-caption font-semibold uppercase tracking-wider text-muted">Access snapshot</p><p className="mt-2 text-body-sm text-foreground-strong">{user.permissions.length} permissions</p><p className="text-body-sm text-muted">{user.entitlements.length} capabilities visible</p></div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-page">
          <header className="flex flex-col gap-6 border-b border-border pb-6 xl:flex-row xl:items-end xl:justify-between">
            <div><p className="text-eyebrow font-bold uppercase tracking-wider text-primary">{home.eyebrow}</p><h1 className="mt-2 max-w-3xl font-display text-display font-light tracking-tight text-foreground-strong">{home.title}</h1><p className="mt-3 max-w-2xl text-body text-muted">{home.description}</p></div>
            <div className="flex items-center gap-3"><div className="text-right"><p className="text-body-sm font-semibold text-foreground-strong">{user.displayName}</p><p className="text-caption text-muted">{ROLE_LABELS[user.role]} · {PLAN_LABELS[user.plan]}</p></div><button type="button" onClick={handleLogout} aria-label="Sign out" title="Sign out" className="grid size-10 place-items-center rounded-control border border-border bg-surface-elevated text-muted hover:bg-primary-soft hover:text-primary-dark"><LogOut size={17} aria-hidden="true" /></button></div>
          </header>

          <div className="mt-6 rounded-card border border-border bg-surface-elevated p-3 lg:hidden">
            <label htmlFor="mobile-workspace-nav" className="text-eyebrow font-bold uppercase tracking-wider text-muted">Jump to</label>
            <select id="mobile-workspace-nav" value={activeItem?.id ?? ''} onChange={(event) => setActiveTab(event.target.value)} className="mt-2 w-full rounded-control border border-border bg-surface px-3 py-2.5 text-body-sm font-medium text-foreground-strong outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft">
              {visibleNavigation.map((item) => <option key={item.id} value={item.id}>{NAV_GROUP_LABELS[item.group]} / {item.label}</option>)}
            </select>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {user.role === 'super_admin' && (
              <button type="button" onClick={() => navigate(ROUTES.SUPER_ADMIN)} className="rounded-control bg-primary px-4 py-2 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark">
                Open onboarding queue
              </button>
            )}
            {(user.role === 'org_admin' || user.role === 'faculty') && (
              <button type="button" onClick={() => navigate(ROUTES.ORG_ADMIN)} className="rounded-control border border-border bg-surface-elevated px-4 py-2 text-body-sm font-semibold text-foreground-strong hover:border-primary hover:text-primary-dark">
                Open org management
              </button>
            )}
          </div>

          <section className="mt-8 grid gap-3 sm:grid-cols-3">{home.stats.map(([value, label, note]) => <article key={label} className="rounded-card border border-border bg-surface-elevated p-card"><p className="font-display text-heading-md text-foreground-strong">{value}</p><p className="mt-1 text-body-sm font-medium text-foreground">{label}</p><p className="mt-2 text-caption text-muted">{note}</p></article>)}</section>

          {activeItem?.id === 'organization' && <B2BServicesPage />}
          {renderRoleSpecificPanel(user.role, activeItem?.id ?? 'overview')}

          <section className="mt-8 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <article className="rounded-card border border-border bg-surface-elevated p-card"><div className="flex items-start justify-between gap-4"><div><div className="mb-3 inline-flex rounded-full bg-primary-soft p-2 text-primary-dark"><ActiveIcon size={19} aria-hidden="true" /></div><p className="text-eyebrow font-bold uppercase tracking-wider text-muted">Active view</p><h2 className="mt-1 font-display text-heading-md text-foreground-strong">{activeItem?.label}</h2><p className="mt-2 max-w-xl text-body-sm text-muted">{activeItem?.description}. This shared panel is filled by the active microtask or service.</p></div><span className="rounded-full bg-primary-soft px-3 py-1 text-caption font-semibold text-primary-dark">{PLAN_LABELS[user.plan]}</span></div><div className="mt-8 grid gap-3 sm:grid-cols-2">{getFeatureCards(user.role, activeItem?.id ?? 'overview').map(([title, copy]) => <div key={title} className="rounded-control border border-border bg-surface p-4"><p className="text-body-sm font-semibold text-foreground-strong">{title}</p><p className="mt-1 text-caption leading-relaxed text-muted">{copy}</p></div>)}</div></article>
            <article className="rounded-card bg-primary-shade-4 p-card text-white"><ShieldCheck size={23} aria-hidden="true" /><p className="mt-8 text-eyebrow font-bold uppercase tracking-wider text-primary-tint-3">Permission-aware</p><h2 className="mt-2 font-display text-heading-md">Only relevant work appears.</h2><p className="mt-3 text-body-sm leading-relaxed text-primary-tint-4">Navigation requires both a permission code and an enabled entitlement. Org Admins can only work inside the pack selected by Heftin.</p><div className="mt-8 border-t border-primary-shade-3 pt-4 text-caption text-primary-tint-4">Role: <strong className="text-white">{ROLE_LABELS[user.role]}</strong><br />Visible: <strong className="text-white">{visibleNavigation.length} of 11 modules</strong></div></article>
          </section>

          <section className="mt-8 rounded-card border border-border bg-surface-elevated p-card">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div><p className="text-eyebrow font-bold uppercase tracking-wider text-muted">All capabilities</p><h2 className="mt-1 font-display text-heading-md text-foreground-strong">Access matrix</h2></div>
              <p className="text-body-sm text-muted">Visible for {ROLE_LABELS[user.role]} · {PLAN_LABELS[user.plan]}</p>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {NAVIGATION_ITEMS.map((item) => {
                const enabled = canAccess(user, item)
                return <div key={item.id} className={cn('flex items-center gap-3 rounded-control border p-3', enabled ? 'border-primary-tint-4 bg-primary-soft' : 'border-border bg-surface')}><span className={cn('grid size-7 shrink-0 place-items-center rounded-full', enabled ? 'bg-primary text-primary-foreground' : 'bg-border text-muted')}>{enabled ? <Check size={15} aria-hidden="true" /> : <LockKeyhole size={14} aria-hidden="true" />}</span><span className="min-w-0"><span className={cn('block truncate text-body-sm font-semibold', enabled ? 'text-primary-dark' : 'text-muted')}>{item.label}</span><span className="block truncate text-caption text-muted">{enabled ? 'Enabled' : 'Requires access'}</span></span></div>
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

function renderRoleSpecificPanel(role: keyof typeof ROLE_HOME, activeTab: string) {
  if (role === 'super_admin') {
    return (
      <section className="mt-8 rounded-card border border-border bg-surface-elevated p-card">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-eyebrow font-bold uppercase tracking-wider text-muted">Platform queue</p>
            <h2 className="mt-1 font-display text-heading-md text-foreground-strong">Onboarding requests</h2>
          </div>
          <span className="rounded-full bg-primary-soft px-3 py-1 text-caption font-semibold text-primary-dark">3 pending</span>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {[
            ['Apex Coaching', 'UPSC • New request', 'Needs approval'],
            ['Sarthi Institute', 'SSC • In review', 'Reviewing bundle'],
            ['Dharma Academy', 'NEET • Approved', 'Org admin created'],
          ].map(([org, meta, status]) => (
            <div key={org} className="rounded-control border border-border bg-surface p-4">
              <p className="text-body-sm font-semibold text-foreground-strong">{org}</p>
              <p className="mt-1 text-caption text-muted">{meta}</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="rounded-full bg-primary-soft px-2 py-1 text-caption font-semibold text-primary-dark">{status}</span>
                <Clock3 size={14} className="text-muted" aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (role === 'org_admin' || role === 'faculty') {
    const currentTab = activeTab === 'people' || activeTab === 'organization' || activeTab === 'overview' ? 'access' : activeTab

    return (
      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-card border border-border bg-surface-elevated p-card">
          <p className="text-eyebrow font-bold uppercase tracking-wider text-muted">Org operations</p>
          <h2 className="mt-1 font-display text-heading-md text-foreground-strong">Roles and ceiling</h2>
          <div className="mt-5 space-y-3">
            {[
              ['Org Admin', '70 / 70 rights', 'Full ceiling'],
              ['Faculty Manager', '18 / 70 rights', 'Scope: Department'],
              ['Student Role', '6 / 70 rights', 'Basic student access'],
            ].map(([name, rights, note]) => (
              <div key={name} className="flex items-center justify-between gap-3 rounded-control border border-border bg-surface p-3">
                <div>
                  <p className="text-body-sm font-semibold text-foreground-strong">{name}</p>
                  <p className="mt-1 text-caption text-muted">{note}</p>
                </div>
                <span className="rounded-full bg-primary-soft px-2 py-1 text-caption font-semibold text-primary-dark">{rights}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-card border border-border bg-surface-elevated p-card">
          <p className="text-eyebrow font-bold uppercase tracking-wider text-muted">Current focus</p>
          <h2 className="mt-1 font-display text-heading-md text-foreground-strong">{currentTab === 'people' ? 'User assignment' : 'Org overview'}</h2>
          <div className="mt-5 space-y-3">
            {[
              ['Departments', '4 active units'],
              ['Batches', '6 enrolled cohorts'],
              ['Faculty', '12 assigned to batches'],
              ['Students', '148 active learners'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3 rounded-control border border-border bg-surface p-3">
                <span className="text-body-sm font-medium text-foreground-strong">{label}</span>
                <span className="text-caption font-semibold text-primary-dark">{value}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    )
  }

  if (role === 'student' || role === 'individual') {
    return (
      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        {[
          ['My tests', 'UPSC Prelims Mock 04 • Due in 2 days'],
          ['Subjects', 'Polity, History, Geography'],
          ['Results', 'Review last mock and improve weak areas'],
        ].map(([label, detail]) => (
          <article key={label} className="rounded-card border border-border bg-surface-elevated p-card">
            <p className="text-eyebrow font-bold uppercase tracking-wider text-muted">{label}</p>
            <h2 className="mt-2 font-display text-heading-md text-foreground-strong">Ready to act</h2>
            <p className="mt-3 text-body-sm text-muted">{detail}</p>
          </article>
        ))}
      </section>
    )
  }

  return null
}

function getFeatureCards(role: keyof typeof ROLE_HOME, activeTab: string) {
  const cards: Record<string, [string, string][]> = {
    overview: [['Today\'s focus', 'A prioritized view of the next action for this workspace.'], ['Recent activity', 'Latest exams, lessons, or administration actions in one timeline.']],
    exams: [['UPSC exam queue', 'Start scheduled UPSC tests and revisit completed attempts.'], ['UPSC readiness signal', 'Use recent results to choose the next useful challenge.']],
    learning: [['Continue learning', 'Pick up lessons and materials from the last active session.'], ['Recommended material', 'Content is selected from the user or organization context.']],
    microtasks: [['Quick practice', 'Short tasks make it easier to build a daily study habit.'], ['Weak-area drill', 'Turn performance signals into a focused next exercise.']],
    knowledge: [['Reference library', 'Search the shared knowledge base without leaving the workspace.'], ['New material', 'See what faculty or platform admins have recently published.']],
    analytics: [['Progress view', 'Compare activity and outcomes across the current period.'], ['Actionable signal', 'Translate performance into the next assignment or lesson.']],
    content: [['Material builder', 'Create structured learning material with reusable tokens.'], ['Publishing queue', 'Review what is ready for learners and what needs attention.']],
    assignments: [['Assignment queue', 'Set, distribute, and review work for assigned learners.'], ['Feedback loop', 'Surface the learners who need a timely intervention.']],
    people: [['People directory', 'Manage users and see their current organization access.'], ['Rights matrix', 'Assign only permission codes available in the org pack.']],
    organization: [['Org pack', 'Review capabilities selected by Heftin for this workspace.'], ['Workspace health', 'Keep batches, faculty, and learners organized.']],
    subscriptions: [['Plan catalog', 'Define what each subscription makes available.'], ['Entitlement control', 'Connect paid capabilities to visible product areas.']],
  }
  const note = role === 'student' ? 'Student defaults keep the focus on exams and learning.' : role === 'super_admin' ? 'Platform controls are visible because this role governs Heftin.' : 'This view is filtered to the role, organization pack, and plan.'
  return [...(cards[activeTab] ?? cards.overview), ['Access rule', note]]
}
