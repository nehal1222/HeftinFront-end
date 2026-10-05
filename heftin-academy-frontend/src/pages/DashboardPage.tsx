import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/lib/constants'

// Dashboard components ported from lets-go UI design
import Sidebar from '@/components/dashboard/Sidebar.jsx'
import TopBar from '@/components/dashboard/TopBar.jsx'
import StatCardGrid from '@/components/dashboard/StatCardGrid.jsx'
import PerformanceChartPanel from '@/components/dashboard/PerformanceChartPanel.jsx'
import AccuracyRingPanel from '@/components/dashboard/AccuracyRingPanel.jsx'
import PieChartPanel from '@/components/dashboard/PieChartPanel.jsx'
import AttemptsTable from '@/components/dashboard/AttemptsTable.jsx'
import ZoomOverlay from '@/components/dashboard/ZoomOverlay.jsx'
import TestSeriesPage from '@/components/dashboard/TestSeriesPage.jsx'
import PracticePage from '@/components/dashboard/PracticePage.jsx'
import ResultsPage from '@/components/dashboard/ResultsPage.jsx'
import SettingsPage from '@/components/dashboard/SettingsPage.jsx'
import LeaderboardPage from '@/components/dashboard/LeaderboardPage.jsx'
import QuizOverlay from '@/components/dashboard/QuizOverlay.jsx'
import AssignmentsPage from '@/components/dashboard/AssignmentsPage.jsx'
import StreakCalendar from '@/components/dashboard/StreakCalendar.jsx'
import WelcomeBanner from '@/components/dashboard/WelcomeBanner.jsx'
import TeacherSubmissionsPage from '@/components/dashboard/TeacherSubmissionsPage.jsx'
import PaperReviewOverlay from '@/components/dashboard/PaperReviewOverlay.jsx'
import DesignSystemPage from '@/components/dashboard/DesignSystemPage.jsx'
import B2BServicesPage from '@/components/dashboard/B2BServicesPage.jsx'
import RoleLandingPage from '@/components/dashboard/RoleLandingPage.jsx'
import SubscriptionServicesPage from '@/components/dashboard/SubscriptionServicesPage.jsx'
import { SUBMISSIONS } from '@/data/teacherData.js'

function getInitialView(userRole: string): string {
  if (userRole === 'student' || userRole === 'individual') return 'overview'
  if (userRole === 'faculty' || userRole === 'teacher') return 'submissions'
  if (userRole === 'org_admin' || userRole === 'organization') return 'organization'
  if (userRole === 'super_admin' || userRole === 'admin') return 'organization'
  return 'overview'
}

interface SubmissionItem {
  id: string | number
  [key: string]: unknown
}

interface QuizItem {
  id: string | number
  [key: string]: unknown
}

export function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [role, setRole] = useState<string>(() => user?.role ?? 'student')
  const [view, setView] = useState<string>(() => (user ? getInitialView(user.role) : 'overview'))
  const [zoomedPanel, setZoomedPanel] = useState<string | null>(null)
  const [activeQuiz, setActiveQuiz] = useState<QuizItem | null>(null)
  const [submissions, setSubmissions] = useState<SubmissionItem[]>(SUBMISSIONS as SubmissionItem[])
  const [reviewing, setReviewing] = useState<SubmissionItem | null>(null)

  if (!user) return null

  const firstName = user.displayName?.trim().split(' ')[0] || 'Learner'

  const viewCopy: Record<string, { title: string; subtitle: string }> = {
    overview: { title: `Welcome back, ${firstName}`, subtitle: "Here's how your prep is going." },
    assignments: { title: 'Your Assignments', subtitle: 'Tasks picked for you based on your weak areas.' },
    'test-series': { title: 'Test Series', subtitle: 'Pick a series and keep the streak going.' },
    practice: { title: 'Practice', subtitle: 'Chapter-wise drills, or a quick speed test.' },
    results: { title: 'All Results', subtitle: 'Every attempt, in one place.' },
    leaderboard: { title: 'Leaderboard', subtitle: 'See where you rank against everyone else.' },
    settings: { title: 'Settings', subtitle: 'Your profile and notification preferences.' },
    submissions: { title: 'Paper Submissions', subtitle: 'Review prelims scores and grade mains answer sheets.' },
    'design-system': { title: 'Design System', subtitle: 'Tailwind + CSS tokens - Sprint 1 (FE-01).' },
    organization: { title: 'Organization Services', subtitle: 'Manage UPSC batches, faculty, learners, and exam delivery.' },
    subscriptions: { title: 'Subscriptions and Rights', subtitle: 'Define plan access and organization capability packs.' },
    landing: { title: 'Workspace', subtitle: 'Everything you need for your next step.' },
  }

  const copy = viewCopy[view] || {
    title: `Welcome, ${firstName}`,
    subtitle: 'Manage your academy workspace and learning progress.',
  }

  function handleToggleRole() {
    const order = ['student', 'individual', 'faculty', 'org_admin', 'super_admin']
    const nextRole = order[(order.indexOf(role) + 1) % order.length]
    setRole(nextRole)
    if (nextRole === 'student' || nextRole === 'individual') {
      setView('overview')
    } else if (nextRole === 'faculty') {
      setView('submissions')
    } else {
      setView('organization')
    }
  }

  function handleSignOut() {
    logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  function handleNavigate(targetView: string) {
    if (targetView === 'home') {
      navigate(ROUTES.HOME)
    } else if (targetView === 'design-system') {
      setView('design-system')
    } else {
      setView(targetView)
    }
  }

  function handleSaveReview(id: unknown, updates: Record<string, unknown>) {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)))
  }

  function handleSubmitPaper(entry: SubmissionItem) {
    setSubmissions((prev) => [entry, ...prev])
  }

  return (
    <>
      <div className="dash-shell bg-surface text-ink min-h-screen">
        <Sidebar
          view={view}
          onNavigate={handleNavigate}
          role={role}
          onToggleRole={handleToggleRole}
          onSignOut={handleSignOut}
        />

        <div className="dash-main">
          <div className="dash-main-inner text-muted">
            <TopBar
              title={copy.title}
              subtitle={copy.subtitle}
              role={role}
              authUser={user}
              onLogout={handleSignOut}
            />

            {view === 'landing' && (
              <RoleLandingPage role={role} onNavigate={setView} authUser={user} />
            )}

            {(role === 'student' || role === 'individual') && view === 'overview' && (
              <>
                <WelcomeBanner />
                <StatCardGrid />
                <StreakCalendar />

                <section className="dash-panels">
                  <PerformanceChartPanel onZoomIn={() => setZoomedPanel('trend')} />
                  <AccuracyRingPanel onZoomIn={() => setZoomedPanel('accuracy')} />
                </section>

                <PieChartPanel onZoomIn={() => setZoomedPanel('subjects')} />
                <AttemptsTable />
              </>
            )}

            {role !== 'student' && role !== 'individual' && view === 'overview' && (
              <RoleLandingPage role={role} onNavigate={setView} authUser={user} />
            )}

            {view === 'assignments' && <AssignmentsPage onStartQuiz={setActiveQuiz} />}
            {view === 'test-series' && <TestSeriesPage onStartQuiz={setActiveQuiz} />}
            {view === 'practice' && <PracticePage onStartQuiz={setActiveQuiz} />}
            {view === 'results' && <ResultsPage />}
            {view === 'leaderboard' && <LeaderboardPage />}
            {view === 'settings' && <SettingsPage />}
            {view === 'submissions' && (
              <TeacherSubmissionsPage submissions={submissions} onReview={setReviewing} />
            )}
            {view === 'design-system' && <DesignSystemPage />}
            {view === 'organization' && <B2BServicesPage />}
            {view === 'subscriptions' && <SubscriptionServicesPage />}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {zoomedPanel && (
          <ZoomOverlay onClose={() => setZoomedPanel(null)}>
            {zoomedPanel === 'trend' && <PerformanceChartPanel zoomed onZoomIn={() => {}} />}
            {zoomedPanel === 'accuracy' && <AccuracyRingPanel zoomed onZoomIn={() => {}} />}
            {zoomedPanel === 'subjects' && <PieChartPanel zoomed onZoomIn={() => {}} />}
          </ZoomOverlay>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeQuiz && (
          <QuizOverlay
            quiz={activeQuiz}
            onClose={() => setActiveQuiz(null)}
            onSubmit={handleSubmitPaper}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reviewing && (
          <PaperReviewOverlay
            submission={reviewing}
            onClose={() => setReviewing(null)}
            onSave={handleSaveReview}
          />
        )}
      </AnimatePresence>
    </>
  )
}
