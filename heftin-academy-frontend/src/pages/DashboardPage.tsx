import { useState } from 'react'
import {
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Sparkles,
  Users,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/lib/constants'

type NavTab = 'overview' | 'exams' | 'courses' | 'analytics' | 'batches' | 'grading'

interface ExamItem {
  id: string
  title: string
  subject: string
  duration: string
  questions: number
  date: string
  status: 'live' | 'upcoming' | 'completed'
  score?: string
}

interface SubmissionItem {
  id: string
  student: string
  batch: string
  paper: string
  submittedAt: string
  status: 'pending' | 'graded'
  score?: string
}

const UPCOMING_EXAMS: ExamItem[] = [
  {
    id: 'ex-01',
    title: 'UPSC GS Paper I - Full Length Mock 04',
    subject: 'General Studies I',
    duration: '120 mins',
    questions: 100,
    date: 'Today, 2:00 PM',
    status: 'live',
  },
  {
    id: 'ex-02',
    title: 'CSAT Aptitude & Comprehension Drill 02',
    subject: 'CSAT Paper II',
    duration: '60 mins',
    questions: 50,
    date: 'Tomorrow, 10:00 AM',
    status: 'upcoming',
  },
  {
    id: 'ex-03',
    title: 'Indian Polity & Constitutional Framework',
    subject: 'Sectional Drill',
    duration: '45 mins',
    questions: 35,
    date: 'Oct 9, 2026',
    status: 'upcoming',
  },
  {
    id: 'ex-04',
    title: 'Modern Indian History & Freedom Struggle',
    subject: 'Sectional Drill',
    duration: '60 mins',
    questions: 50,
    date: 'Oct 4, 2026',
    status: 'completed',
    score: '78 / 100',
  },
]

const FACULTY_SUBMISSIONS: SubmissionItem[] = [
  {
    id: 'sub-01',
    student: 'Arjun Kumar',
    batch: 'Batch 101 · Prelims 2026',
    paper: 'GS Mains Ethics Case Study Essay',
    submittedAt: 'Today, 11:30 AM',
    status: 'pending',
  },
  {
    id: 'sub-02',
    student: 'Priya Sharma',
    batch: 'Batch 101 · Prelims 2026',
    paper: 'Geography Sectional Mains Test',
    submittedAt: 'Today, 9:15 AM',
    status: 'pending',
  },
  {
    id: 'sub-03',
    student: 'Rahul Verma',
    batch: 'Batch 102 · Foundation',
    paper: 'Governance & Constitution Answer Sheet',
    submittedAt: 'Yesterday',
    status: 'graded',
    score: '74 / 100',
  },
]

export function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<NavTab>('overview')

  if (!user) return null

  const isStaff = user.role === 'faculty' || user.role === 'org_admin' || user.role === 'super_admin'
  const isIndividual = user.role === 'individual'
  const orgName = isIndividual ? 'Personal Learning' : 'Delhi Public Academy'

  async function handleLogout() {
    await logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-surface font-sans text-foreground">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface-elevated md:flex">
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <div className="grid size-9 place-items-center rounded-control bg-primary text-primary-foreground shadow-sm">
            <GraduationCap size={20} aria-hidden="true" />
          </div>
          <div>
            <span className="font-display text-heading-sm font-semibold text-foreground-strong">Heftin</span>
            <span className="ml-1 text-caption text-primary">Academy</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between p-4">
          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-body-sm font-semibold transition-colors ${
                activeTab === 'overview'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted hover:bg-surface hover:text-foreground'
              }`}
            >
              <LayoutDashboard size={17} />
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('exams')}
              className={`flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-body-sm font-semibold transition-colors ${
                activeTab === 'exams'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted hover:bg-surface hover:text-foreground'
              }`}
            >
              <FileText size={17} />
              Test Series
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('courses')}
              className={`flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-body-sm font-semibold transition-colors ${
                activeTab === 'courses'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted hover:bg-surface hover:text-foreground'
              }`}
            >
              <BookOpen size={17} />
              Study Material
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-body-sm font-semibold transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted hover:bg-surface hover:text-foreground'
              }`}
            >
              <BarChart3 size={17} />
              Performance
            </button>

            {isStaff && (
              <>
                <div className="pt-4 pb-1">
                  <span className="px-3 text-caption font-semibold uppercase tracking-wider text-muted">
                    Management
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('batches')}
                  className={`flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-body-sm font-semibold transition-colors ${
                    activeTab === 'batches'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted hover:bg-surface hover:text-foreground'
                  }`}
                >
                  <Users size={17} />
                  Batches & Cohorts
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('grading')}
                  className={`flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-body-sm font-semibold transition-colors ${
                    activeTab === 'grading'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted hover:bg-surface hover:text-foreground'
                  }`}
                >
                  <CheckCircle2 size={17} />
                  Paper Grading
                </button>
              </>
            )}
          </nav>

          <div className="rounded-control border border-border bg-surface p-3">
            <span className="text-caption font-semibold text-muted">Organization</span>
            <p className="mt-1 truncate text-body-sm font-semibold text-foreground-strong">{orgName}</p>
            <p className="text-caption text-primary font-medium capitalize">{user.role.replace('_', ' ')}</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface-elevated px-6">
          <div className="flex items-center gap-3">
            <span className="text-body-sm font-medium text-muted">Dashboard</span>
            <span className="text-muted">/</span>
            <span className="text-body-sm font-semibold capitalize text-foreground-strong">
              {activeTab}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 rounded-control border border-border bg-surface px-3 py-1.5">
              <span className="grid size-7 place-items-center rounded-full bg-primary-soft text-caption font-bold text-primary-dark">
                {user.displayName.slice(0, 2).toUpperCase()}
              </span>
              <div className="text-left leading-tight">
                <span className="block text-body-sm font-semibold text-foreground-strong">
                  {user.displayName}
                </span>
                <span className="block text-caption text-muted capitalize">
                  {user.role.replace('_', ' ')}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Sign out"
              className="flex items-center gap-1.5 rounded-control border border-border bg-surface px-3 py-1.5 text-body-sm font-medium text-muted transition-colors hover:border-primary hover:text-primary-dark"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {/* Welcome Message */}
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h1 className="font-display text-heading-md font-semibold text-foreground-strong">
                Welcome back, {user.displayName.split(' ')[0]}
              </h1>
              <p className="mt-0.5 text-body-sm text-muted">
                {isStaff
                  ? 'Overview of assigned batches, upcoming exams, and student submissions.'
                  : 'Track your UPSC preparation, attempt scheduled mocks, and review performance.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-3 py-1 text-caption font-medium text-muted">
                <Calendar size={13} className="text-primary" />
                Session 2026
              </span>
            </div>
          </div>

          {/* Metric Stats Cards */}
          <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {!isStaff ? (
              <>
                <StatCard title="Scheduled Tests" value="3 Upcoming" subtitle="Next in 4 hours" />
                <StatCard title="Tests Completed" value="14 Attempted" subtitle="+2 this week" />
                <StatCard title="Average Score" value="76.4%" subtitle="+3.2% vs last month" />
                <StatCard title="Study Streak" value="5 Days" subtitle="Personal best: 12 days" />
              </>
            ) : user.role === 'faculty' ? (
              <>
                <StatCard title="Assigned Batches" value="2 Cohorts" subtitle="Batch 101 & 102" />
                <StatCard title="Pending Reviews" value="8 Papers" subtitle="3 due today" />
                <StatCard title="Active Students" value="54 Learners" subtitle="98% attendance" />
                <StatCard title="Class Average" value="71.8%" subtitle="UPSC GS Paper I" />
              </>
            ) : (
              <>
                <StatCard title="Active Batches" value="6 Batches" subtitle="All cohorts live" />
                <StatCard title="Total Enrolled" value="148 Learners" subtitle="+12 this month" />
                <StatCard title="Faculty Members" value="12 Active" subtitle="4 evaluating" />
                <StatCard title="License Utilization" value="70 / 70" subtitle="Pack capacity full" />
              </>
            )}
          </section>

          {/* Main Grid: Left Primary List & Right Sidebar */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Primary Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Exams / Tasks Table */}
              <div className="rounded-card border border-border bg-surface-elevated p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-body font-semibold text-foreground-strong">
                      {isStaff ? 'Pending Submissions for Review' : 'Active & Upcoming Test Series'}
                    </h2>
                    <p className="text-caption text-muted">
                      {isStaff
                        ? 'Student mains papers awaiting evaluation and grading.'
                        : 'Scheduled full-length UPSC mock tests and sectional drills.'}
                    </p>
                  </div>
                  <span className="text-caption font-semibold text-primary">View all</span>
                </div>

                <div className="divide-y divide-border">
                  {!isStaff
                    ? UPCOMING_EXAMS.map((exam) => (
                        <div
                          key={exam.id}
                          className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-body-sm text-foreground-strong">
                                {exam.title}
                              </span>
                              {exam.status === 'live' && (
                                <span className="rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-caption font-bold">
                                  LIVE
                                </span>
                              )}
                            </div>
                            <div className="mt-1 flex items-center gap-3 text-caption text-muted">
                              <span>{exam.subject}</span>
                              <span>·</span>
                              <span className="flex items-center gap-1">
                                <Clock size={12} /> {exam.duration}
                              </span>
                              <span>·</span>
                              <span>{exam.questions} Questions</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {exam.status === 'completed' ? (
                              <span className="text-caption font-semibold text-muted">
                                Score: {exam.score}
                              </span>
                            ) : (
                              <button
                                type="button"
                                className={`rounded-control px-3.5 py-1.5 text-caption font-semibold transition-colors ${
                                  exam.status === 'live'
                                    ? 'bg-primary text-primary-foreground hover:bg-primary-dark shadow-sm'
                                    : 'border border-border bg-surface text-foreground hover:border-primary hover:text-primary'
                                }`}
                              >
                                {exam.status === 'live' ? 'Start Test' : 'View Schedule'}
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    : FACULTY_SUBMISSIONS.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <span className="font-medium text-body-sm text-foreground-strong">
                              {sub.student}
                            </span>
                            <div className="mt-1 flex items-center gap-3 text-caption text-muted">
                              <span>{sub.batch}</span>
                              <span>·</span>
                              <span>{sub.paper}</span>
                              <span>·</span>
                              <span>{sub.submittedAt}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            className={`rounded-control px-3.5 py-1.5 text-caption font-semibold transition-colors ${
                              sub.status === 'pending'
                                ? 'bg-primary text-primary-foreground hover:bg-primary-dark'
                                : 'border border-border bg-surface text-muted'
                            }`}
                          >
                            {sub.status === 'pending' ? 'Evaluate Paper' : `Reviewed (${sub.score})`}
                          </button>
                        </div>
                      ))}
                </div>
              </div>

              {/* Study Materials / Reference List */}
              <div className="rounded-card border border-border bg-surface-elevated p-5 shadow-sm">
                <h3 className="text-body font-semibold text-foreground-strong">
                  Latest Study Modules & Notes
                </h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-control border border-border bg-surface p-3">
                    <p className="text-body-sm font-semibold text-foreground-strong">
                      Indian Polity: Key Judicial Precedents
                    </p>
                    <p className="mt-1 text-caption text-muted">
                      Updated summary of 2026 landmark Supreme Court judgments.
                    </p>
                  </div>
                  <div className="rounded-control border border-border bg-surface p-3">
                    <p className="text-body-sm font-semibold text-foreground-strong">
                      CSAT Logical Reasoning Short Methods
                    </p>
                    <p className="mt-1 text-caption text-muted">
                      Essential formulas and shortcuts for paper II aptitude.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar: Subject Progress & Notices */}
            <div className="space-y-6">
              {/* Performance Breakdown */}
              <div className="rounded-card border border-border bg-surface-elevated p-5 shadow-sm">
                <h3 className="text-body font-semibold text-foreground-strong">Subject Accuracy</h3>
                <p className="text-caption text-muted">Based on your recent sectional attempts</p>

                <div className="mt-4 space-y-3.5">
                  <ProgressBar label="Indian Polity" percent={82} />
                  <ProgressBar label="Modern History" percent={68} />
                  <ProgressBar label="Indian Economy" percent={74} />
                  <ProgressBar label="Geography & Environment" percent={61} />
                </div>
              </div>

              {/* Notice Board */}
              <div className="rounded-card border border-border bg-surface-elevated p-5 shadow-sm">
                <div className="flex items-center gap-2 text-body font-semibold text-foreground-strong">
                  <Sparkles size={16} className="text-primary" />
                  Important Notices
                </div>

                <div className="mt-3 space-y-3 text-caption">
                  <div className="border-l-2 border-primary pl-2.5">
                    <p className="font-semibold text-foreground-strong">GS Mains Answer Key Released</p>
                    <p className="text-muted">Reviewed by Dr. Meera Patel for Batch 101.</p>
                  </div>
                  <div className="border-l-2 border-border pl-2.5">
                    <p className="font-semibold text-foreground-strong">Live Doubt Clearing Session</p>
                    <p className="text-muted">Scheduled for Friday at 4:00 PM via portal.</p>
                  </div>
                  <div className="border-l-2 border-border pl-2.5">
                    <p className="font-semibold text-foreground-strong">UPSC Prelims Strategy Webinar</p>
                    <p className="text-muted">Recording available in the reference library.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function StatCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <div className="rounded-card border border-border bg-surface-elevated p-4 shadow-sm">
      <span className="text-caption font-medium text-muted">{title}</span>
      <p className="mt-1 font-display text-heading-md font-semibold text-foreground-strong">{value}</p>
      <p className="mt-0.5 text-caption text-primary">{subtitle}</p>
    </div>
  )
}

function ProgressBar({ label, percent }: { label: string; percent: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-caption font-medium">
        <span className="text-foreground-strong">{label}</span>
        <span className="text-muted">{percent}%</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface">
        <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
