import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Sidebar from './components/Sidebar.jsx'
import TopBar from './components/TopBar.jsx'
import StatCardGrid from './components/StatCardGrid.jsx'
import PerformanceChartPanel from './components/PerformanceChartPanel.jsx'
import AccuracyRingPanel from './components/AccuracyRingPanel.jsx'
import PieChartPanel from './components/PieChartPanel.jsx'
import AttemptsTable from './components/AttemptsTable.jsx'
import ZoomOverlay from './components/ZoomOverlay.jsx'
import TestSeriesPage from './components/TestSeriesPage.jsx'
import PracticePage from './components/PracticePage.jsx'
import ResultsPage from './components/ResultsPage.jsx'
import SettingsPage from './components/SettingsPage.jsx'
import LeaderboardPage from './components/LeaderboardPage.jsx'
import QuizOverlay from './components/QuizOverlay.jsx'
import AssignmentsPage from './components/AssignmentsPage.jsx'
import StreakCalendar from './components/StreakCalendar.jsx'
import WelcomeBanner from './components/WelcomeBanner.jsx'
import TeacherSubmissionsPage from './components/TeacherSubmissionsPage.jsx'
import PaperReviewOverlay from './components/PaperReviewOverlay.jsx'
import DesignSystemPage from './components/DesignSystemPage.jsx'
import B2BServicesPage from './components/B2BServicesPage.jsx'
import RoleLandingPage from './components/RoleLandingPage.jsx'
import SubscriptionServicesPage from './components/SubscriptionServicesPage.jsx'
import { SUBMISSIONS } from './data/teacherData.js'

function storedFirstName() {
  try {
    const name = localStorage.getItem('heftinName')
    return name ? name.trim().split(' ')[0] : 'Ananya'
  } catch (e) {
    return 'Ananya'
  }
}

const VIEW_COPY = {
  overview: { title: `Welcome back, ${storedFirstName()}`, subtitle: "Here's how your prep is going." },
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
  landing: { title: 'Workspace', subtitle: 'Your role-based Heftin Academy home.' },
}

function initialRole() {
  try {
    const stored = localStorage.getItem('heftinRole')
    if (['individual', 'faculty', 'org_admin', 'organization', 'super_admin', 'admin'].includes(stored)) return stored === 'admin' ? 'super_admin' : stored === 'organization' ? 'org_admin' : stored
    return stored === 'teacher' ? 'teacher' : 'student'
  } catch (e) {
    return 'student'
  }
}

export default function App() {
  const [role, setRole] = useState(initialRole)
  const [view, setView] = useState('landing')
  const [zoomedPanel, setZoomedPanel] = useState(null)
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [submissions, setSubmissions] = useState(SUBMISSIONS)
  const [reviewing, setReviewing] = useState(null)
  const copy = VIEW_COPY[view]

  function toggleRole() {
    setRole((current) => {
      const order = ['student', 'individual', 'faculty', 'org_admin', 'super_admin']
      const currentRole = current === 'teacher' ? 'faculty' : current === 'organization' ? 'org_admin' : current
      const next = order[(order.indexOf(currentRole) + 1) % order.length]
      setView('landing')
      localStorage.setItem('heftinRole', next)
      return next
    })
  }

  function saveReview(id, updates) {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)))
  }

  function submitPaper(entry) {
    setSubmissions((prev) => [entry, ...prev])
  }

  return (
    <>
      <div className="dash-shell bg-surface text-ink">
        <Sidebar view={view} onNavigate={setView} role={role} onToggleRole={toggleRole} />

        <div className="dash-main">
          <div className="dash-main-inner text-muted">
            <TopBar title={copy.title} subtitle={copy.subtitle} role={role} />

            {view === 'landing' && <RoleLandingPage role={role} onNavigate={setView} />}

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
            {zoomedPanel === 'trend' && <PerformanceChartPanel zoomed />}
            {zoomedPanel === 'accuracy' && <AccuracyRingPanel zoomed />}
            {zoomedPanel === 'subjects' && <PieChartPanel zoomed />}
          </ZoomOverlay>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeQuiz && (
          <QuizOverlay quiz={activeQuiz} onClose={() => setActiveQuiz(null)} onSubmit={submitPaper} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reviewing && (
          <PaperReviewOverlay submission={reviewing} onClose={() => setReviewing(null)} onSave={saveReview} />
        )}
      </AnimatePresence>
    </>
  )
}
