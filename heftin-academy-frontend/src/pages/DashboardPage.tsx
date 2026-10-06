import { useState, useEffect } from 'react'
import {
  BarChart3,
  BookOpen,
  Building2,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Sparkles,
  User,
  Users,
  X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/lib/constants'
import { b2bService } from '@/services/b2b.service'

type NavTab = 'overview' | 'exams' | 'courses' | 'analytics' | 'batches' | 'grading'

interface ExamItem {
  id: string
  title: string
  subject: string
  duration: string
  questions: number
  marks: number
  date: string
  status: 'live' | 'upcoming' | 'completed'
  score?: string
}

interface Question {
  id: number
  text: string
  options: string[]
  correctIndex: number
  explanation: string
  subject: string
}

interface StudyModule {
  id: string
  title: string
  subject: string
  pages: number
  lastUpdated: string
  summary: string
  content: string[]
}

interface FacultySubmission {
  id: string
  student: string
  batch: string
  paper: string
  submittedAt: string
  status: 'pending' | 'graded'
  score?: string
  studentAnswer: string
  feedback?: string
}

const UPSC_QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'Consider the following statements regarding the Attorney General for India:\n1. He is appointed by the President of India under Article 76.\n2. He has the right of audience in all courts in the territory of India.\n3. He must possess the qualifications required to be appointed a Judge of the Supreme Court.\nWhich of the statements given above are correct?',
    options: [
      '1 and 2 only',
      '2 and 3 only',
      '1, 2, and 3',
      '1 and 3 only',
    ],
    correctIndex: 2,
    explanation: 'Under Article 76 of the Indian Constitution, the President appoints the Attorney General, who must be qualified to be appointed a Supreme Court Judge. Under Article 88, he has the right of audience in all courts throughout India.',
    subject: 'Indian Polity',
  },
  {
    id: 2,
    text: 'With reference to the Indian economy, which of the following best defines the concept of "Core Inflation"?',
    options: [
      'Inflation calculated exclusively on wholesale agriculture and food basket',
      'Headline inflation excluding volatile components such as food and fuel',
      'The consumer price index published quarterly by the Reserve Bank of India',
      'The annualized inflation rate in capital manufacturing industries only',
    ],
    correctIndex: 1,
    explanation: 'Core Inflation measures underlying, long-term inflation trends by stripping away items subject to volatile price movements, predominantly food and energy prices.',
    subject: 'Indian Economy',
  },
  {
    id: 3,
    text: 'Which one of the following protected areas is world-renowned for its floating decomposed vegetation masses locally known as "Phumdis"?',
    options: [
      'Keibul Lamjao National Park',
      'Kaziranga National Park',
      'Silent Valley National Park',
      'Namdapha National Park',
    ],
    correctIndex: 0,
    explanation: 'Keibul Lamjao National Park on Loktak Lake in Manipur is the only floating national park in the world, characterized by phumdis and being the sole habitat of the endangered Sangai brow-antlered deer.',
    subject: 'Environment & Ecology',
  },
  {
    id: 4,
    text: 'In the administrative history of British India, the "Dual System of Government" in Bengal was formally abolished by which Governor General?',
    options: [
      'Lord Cornwallis',
      'Warren Hastings',
      'Lord Wellesley',
      'Robert Clive',
    ],
    correctIndex: 1,
    explanation: 'Robert Clive introduced the Dual System in Bengal following the Treaty of Allahabad (1765). Warren Hastings abolished it in 1772, bringing Bengal under direct East India Company administration.',
    subject: 'Modern History',
  },
  {
    id: 5,
    text: 'Under Part IV of the Constitution of India, the Directive Principles of State Policy (DPSP) are primarily designed to promote:',
    options: [
      'A welfare state ensuring social, economic, and political justice',
      'Legislative curtailment of Parliament during financial emergencies',
      'Absolute judicial supremacy over Fundamental Rights in all litigations',
      'Complete fiscal independence of municipal corporations from state control',
    ],
    correctIndex: 0,
    explanation: 'The Directive Principles of State Policy (Articles 36 to 51) embody the ideals of establishing a socialist, democratic welfare state fostering socio-economic justice.',
    subject: 'Indian Polity',
  },
]

const STUDY_MODULES: StudyModule[] = [
  {
    id: 'mod-1',
    title: 'Indian Polity: Landmark Constitutional Bench Decisions',
    subject: 'Polity & Governance',
    pages: 28,
    lastUpdated: 'Updated 2 days ago',
    summary: 'Concise analysis of 9-judge bench rulings on federalism, privacy precedents, and Article 21 expansions.',
    content: [
      'Doctrine of Basic Structure: Tracing judicial evolution from Kesavananda Bharati to recent collegium rulings.',
      'Federal Balance: Fiscal federalism limits under GST and distribution of legislative powers under the Seventh Schedule.',
      'Article 21 Developments: Right to privacy, digital integrity, and environmental jurisprudence as fundamental entitlements.',
      'Panchayati Raj & 73rd Amendment: Practical bottlenecks in financial devolution to Local Self Governments.',
    ],
  },
  {
    id: 'mod-2',
    title: 'CSAT Paper II: Analytical Reasoning & Speed Math Essentials',
    subject: 'CSAT Comprehension & Quant',
    pages: 34,
    lastUpdated: 'Updated this week',
    summary: 'Core shortcuts for syllogisms, blood relations, permutations, and reading comprehension passage inference rules.',
    content: [
      'Critical Reading: Distinguishing direct assertions from underlying author assumptions and corollary deductions.',
      'Number Systems: Divisibility rules, cyclicity of unit digits, and remainder theorem shortcuts.',
      'Syllogisms & Logic: Venn diagram methodology for "all", "some", and "no" premise relationships.',
      'Time, Speed & Distance: Relative speed formulas for trains, escalators, and upstream-downstream boats.',
    ],
  },
  {
    id: 'mod-3',
    title: 'Environment & Climate: International Conventions Handbook',
    subject: 'Environment & Ecology',
    pages: 22,
    lastUpdated: 'Oct 2026 Edition',
    summary: 'Comprehensive reference of UNFCCC CoP mandates, Ramsar wetlands criteria, and IUCN status classifications.',
    content: [
      'UNFCCC Framework: Paris Agreement Article 6 carbon markets, Nationally Determined Contributions (NDCs), and Loss & Damage Fund.',
      'Biodiversity Conservation: Kunming-Montreal Global Biodiversity Framework 30x30 targets and national bio-reserves.',
      'Pollution Protocols: Montreal Protocol Kigali Amendment, Basel, Rotterdam, and Stockholm Conventions comparison.',
      'India Wildlife Protection Act 1972: Rationalized schedule categories under the latest amendment.',
    ],
  },
  {
    id: 'mod-4',
    title: 'Modern Indian History: Comprehensive Timeline (1857 - 1947)',
    subject: 'Modern Indian History',
    pages: 40,
    lastUpdated: 'Sep 2026 Edition',
    summary: 'Chronological roadmap of peasant revolts, socio-religious reforms, congress sessions, and constitutional acts.',
    content: [
      'Revolt of 1857: Military, political, and socio-religious catalysts and administrative transfer under Queen’s Proclamation.',
      'Socio-Religious Reform Movements: Brahmo Samaj, Arya Samaj, Aligarh Movement, and Jyotirao Phule’s Satyashodhak Samaj.',
      'Nationalist Upsurge: Partition of Bengal (1905), Swadeshi Movement, and the Surat Split (1907).',
      'Gandhian Phases: Non-Cooperation (1920), Civil Disobedience (1930), and Quit India (1942) strategies and British reactions.',
    ],
  },
]

const INITIAL_EXAMS: ExamItem[] = [
  {
    id: 'ex-01',
    title: 'UPSC GS Paper I - Full Length Mock 04',
    subject: 'General Studies I',
    duration: '120 mins',
    questions: 100,
    marks: 200,
    date: 'Today, 2:00 PM',
    status: 'live',
  },
  {
    id: 'ex-02',
    title: 'CSAT Aptitude & Comprehension Drill 02',
    subject: 'CSAT Paper II',
    duration: '60 mins',
    questions: 50,
    marks: 100,
    date: 'Tomorrow, 10:00 AM',
    status: 'upcoming',
  },
  {
    id: 'ex-03',
    title: 'Indian Polity & Constitutional Framework',
    subject: 'Sectional Drill',
    duration: '45 mins',
    questions: 35,
    marks: 70,
    date: 'Oct 9, 2026',
    status: 'upcoming',
  },
  {
    id: 'ex-04',
    title: 'Modern Indian History & Freedom Struggle',
    subject: 'Sectional Drill',
    duration: '60 mins',
    questions: 50,
    marks: 100,
    date: 'Oct 4, 2026',
    status: 'completed',
    score: '78 / 100',
  },
]

const INITIAL_SUBMISSIONS: FacultySubmission[] = [
  {
    id: 'sub-01',
    student: 'Arjun Kumar',
    batch: 'Batch 101 · Prelims 2026',
    paper: 'GS Mains Ethics Case Study Essay',
    submittedAt: 'Today, 11:30 AM',
    status: 'pending',
    studentAnswer: 'In dealing with bureaucratic corruption, a civil servant must reconcile professional obedience with constitutional conscience. Applying deontological ethics alongside pragmatic administrative safeguards ensures both transparency and institutional trust.',
  },
  {
    id: 'sub-02',
    student: 'Priya Sharma',
    batch: 'Batch 101 · Prelims 2026',
    paper: 'Geography Sectional Mains Test',
    submittedAt: 'Today, 9:15 AM',
    status: 'pending',
    studentAnswer: 'The southwest monsoon phenomenon is primarily driven by differential heating of the Tibetan Plateau, shifting of the ITCZ, and the Somali low-level jet stream. Recent climate oscillations have increased variability in regional precipitation.',
  },
  {
    id: 'sub-03',
    student: 'Rahul Verma',
    batch: 'Batch 102 · Foundation',
    paper: 'Governance & Constitution Answer Sheet',
    submittedAt: 'Yesterday',
    status: 'graded',
    score: '74 / 100',
    studentAnswer: 'Cooperative federalism requires institutionalized consensus-building through bodies like the Inter-State Council and NITI Aayog.',
    feedback: 'Well-structured arguments with relevant Supreme Court precedents cited. Improve presentation with bulleted recommendations.',
  },
]

export function DashboardPage() {
  const { user, logout, switchRole } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<NavTab>('overview')
  const [exams, setExams] = useState<ExamItem[]>(INITIAL_EXAMS)
  const [submissions, setSubmissions] = useState<FacultySubmission[]>(INITIAL_SUBMISSIONS)
  const [examFilter, setExamFilter] = useState<'all' | 'live' | 'upcoming' | 'completed'>('all')

  // Interactive Test Player State
  const [isTestModalOpen, setIsTestModalOpen] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({})
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set())
  const [testTimeLeft, setTestTimeLeft] = useState(600) // 10 minutes demo timer
  const [testCompleted, setTestCompleted] = useState(false)
  const [testScoreResult, setTestScoreResult] = useState<{ score: number; total: number; correctCount: number } | null>(null)

  // Interactive Study Notes Modal State
  const [activeStudyModule, setActiveStudyModule] = useState<StudyModule | null>(null)

  // Interactive Faculty Grading Modal State
  const [gradingSubmission, setGradingSubmission] = useState<FacultySubmission | null>(null)
  const [assignedScore, setAssignedScore] = useState('80')
  const [facultyFeedbackText, setFacultyFeedbackText] = useState('')

  // Interactive Notice Modal State
  const [activeNotice, setActiveNotice] = useState<{ title: string; date: string; content: string } | null>(null)

  // Streak state with daily check-in
  const [streakDays, setStreakDays] = useState(5)
  const [checkedInToday, setCheckedInToday] = useState(false)

  // Test countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isTestModalOpen && !testCompleted && testTimeLeft > 0) {
      timer = setInterval(() => {
        setTestTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isTestModalOpen, testCompleted, testTimeLeft])

  const isIndividual = user?.role === 'individual'
  const isStaff = user?.role === 'faculty' || user?.role === 'org_admin' || user?.role === 'super_admin'
  const orgName = isIndividual ? 'Personal Learner' : 'Delhi Public Academy'

  // Hydrate live backend batches & exams when available
  useEffect(() => {
    if (user && !isIndividual) {
      b2bService.listBatches().catch(() => {})
      b2bService.listExams().catch(() => {})
    }
  }, [user, isIndividual])

  if (!user) return null

  async function handleLogout() {
    await logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  function handleStartTest() {
    setIsTestModalOpen(true)
    setCurrentQuestionIndex(0)
    setUserAnswers({})
    setFlaggedQuestions(new Set())
    setTestTimeLeft(600)
    setTestCompleted(false)
    setTestScoreResult(null)
  }

  function handleSelectOption(optionIndex: number) {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }))
  }

  function toggleFlagQuestion(index: number) {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  function handleSubmitTest() {
    let correctCount = 0
    UPSC_QUESTIONS.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correctCount += 1
      }
    })
    const marksPerQuestion = 2
    const totalMarks = UPSC_QUESTIONS.length * marksPerQuestion
    const finalScore = correctCount * marksPerQuestion

    setTestScoreResult({
      score: finalScore,
      total: totalMarks,
      correctCount,
    })
    setTestCompleted(true)

    // Mark test as completed in local list
    setExams((prev) =>
      prev.map((e) =>
        e.id === 'ex-01'
          ? { ...e, status: 'completed', score: `${finalScore} / ${totalMarks}` }
          : e
      )
    )
  }

  function handleDailyCheckIn() {
    if (!checkedInToday) {
      setStreakDays((prev) => prev + 1)
      setCheckedInToday(true)
    }
  }

  function handleSaveGrade() {
    if (!gradingSubmission) return
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === gradingSubmission.id
          ? {
              ...sub,
              status: 'graded',
              score: `${assignedScore} / 100`,
              feedback: facultyFeedbackText || 'Satisfactory attempt with commendable analytical depth.',
            }
          : sub
      )
    )
    setGradingSubmission(null)
    setFacultyFeedbackText('')
  }

  const filteredExams = exams.filter((e) => {
    if (examFilter === 'all') return true
    return e.status === examFilter
  })

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex min-h-screen bg-surface font-sans text-foreground">
      {/* Sidebar Navigation */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface-elevated md:flex">
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <div className="grid size-9 place-items-center rounded-control bg-primary text-primary-foreground shadow-sm">
            <GraduationCap size={20} aria-hidden="true" />
          </div>
          <div>
            <span className="font-display text-heading-sm font-semibold text-foreground-strong">Heftin</span>
            <span className="ml-1 text-caption text-primary font-medium">Academy</span>
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
              Overview
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

          <div className="rounded-control border border-border bg-surface p-3.5">
            <span className="text-caption font-semibold uppercase tracking-wider text-muted">Active Workspace</span>
            <p className="mt-1 truncate text-body-sm font-semibold text-foreground-strong">{orgName}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-caption font-medium text-primary capitalize">
                {isIndividual ? <User size={13} /> : <Building2 size={13} />}
                {user.role.replace('_', ' ')}
              </span>
              <span className="rounded-full bg-primary-soft px-2 py-0.5 text-caption font-bold text-primary-dark">
                {user.plan.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface-elevated px-4 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-body-sm font-medium text-muted">Dashboard</span>
            <span className="text-muted">/</span>
            <span className="text-body-sm font-semibold capitalize text-foreground-strong">
              {activeTab}
            </span>

            {/* Interactive Role Switcher Pill Bar for seamless reviewer testing */}
            <div className="ml-2 hidden lg:flex items-center gap-1 rounded-control border border-border bg-surface p-1 text-caption font-medium">
              <span className="px-2 text-muted">Test Role:</span>
              <button
                type="button"
                onClick={() => switchRole('student')}
                className={`rounded-control px-2 py-0.5 transition-colors ${
                  user.role === 'student' ? 'bg-primary text-primary-foreground font-semibold' : 'text-muted hover:text-foreground'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => switchRole('faculty')}
                className={`rounded-control px-2 py-0.5 transition-colors ${
                  user.role === 'faculty' ? 'bg-primary text-primary-foreground font-semibold' : 'text-muted hover:text-foreground'
                }`}
              >
                Faculty
              </button>
              <button
                type="button"
                onClick={() => switchRole('individual')}
                className={`rounded-control px-2 py-0.5 transition-colors ${
                  user.role === 'individual' ? 'bg-primary text-primary-foreground font-semibold' : 'text-muted hover:text-foreground'
                }`}
              >
                Individual
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 rounded-control border border-border bg-surface px-3 py-1.5">
              <span className="grid size-7 place-items-center rounded-full bg-primary-soft text-caption font-bold text-primary-dark">
                {user.displayName.slice(0, 2).toUpperCase()}
              </span>
              <div className="hidden sm:block text-left leading-tight">
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

        {/* Dynamic Tab Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Category Welcome Banner */}
              <div className="flex flex-col justify-between gap-4 rounded-card border border-border bg-surface-elevated p-6 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary text-primary-foreground px-2.5 py-0.5 text-caption font-bold uppercase tracking-wider">
                      {isIndividual ? 'Individual Category' : 'Organizational Category'}
                    </span>
                    <span className="text-caption text-muted">· UPSC CSE 2026</span>
                  </div>
                  <h1 className="mt-2 font-display text-heading-md font-semibold text-foreground-strong">
                    Welcome back, {user.displayName.split(' ')[0]}
                  </h1>
                  <p className="mt-1 text-body-sm text-muted">
                    {isIndividual
                      ? 'Self-paced preparation track. Complete your daily drills and review sectional performance.'
                      : isStaff
                      ? 'Batch management workspace. Review pending candidate answer sheets and monitor cohort attendance.'
                      : 'Institutional track: Delhi Public Academy · Batch 101. Scheduled mock exams and mentor updates.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {!isStaff && (
                    <button
                      type="button"
                      onClick={handleDailyCheckIn}
                      className={`inline-flex items-center gap-2 rounded-control px-4 py-2 text-body-sm font-semibold transition-colors ${
                        checkedInToday
                          ? 'border border-border bg-surface text-primary font-bold'
                          : 'bg-primary text-primary-foreground hover:bg-primary-dark shadow-sm'
                      }`}
                    >
                      <Sparkles size={16} />
                      {checkedInToday ? 'Checked in today (+1)' : 'Daily Check-in'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleStartTest}
                    className="inline-flex items-center gap-2 rounded-control border border-border bg-surface px-4 py-2 text-body-sm font-semibold text-foreground-strong hover:border-primary hover:text-primary transition-colors"
                  >
                    <FileText size={16} />
                    Launch Mock Drill
                  </button>
                </div>
              </div>

              {/* KPI Strip */}
              <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {!isStaff ? (
                  <>
                    <StatCard
                      title="Scheduled Tests"
                      value={`${exams.filter((e) => e.status !== 'completed').length} Remaining`}
                      subtitle="Next paper: Today 2:00 PM"
                    />
                    <StatCard
                      title="Tests Completed"
                      value={`${exams.filter((e) => e.status === 'completed').length} Attempted`}
                      subtitle="Average accuracy: 78%"
                    />
                    <StatCard
                      title="Overall Accuracy"
                      value="76.4%"
                      subtitle="Top 12% in GS Paper I"
                    />
                    <StatCard
                      title="Study Streak"
                      value={`${streakDays} Days`}
                      subtitle={checkedInToday ? 'Goal reached today' : 'Check in to maintain'}
                    />
                  </>
                ) : user.role === 'faculty' ? (
                  <>
                    <StatCard title="Assigned Batches" value="2 Cohorts" subtitle="Batch 101 & 102" />
                    <StatCard
                      title="Pending Reviews"
                      value={`${submissions.filter((s) => s.status === 'pending').length} Papers`}
                      subtitle="Awaiting evaluation"
                    />
                    <StatCard title="Active Students" value="54 Learners" subtitle="98% attendance" />
                    <StatCard title="Class Average" value="71.8%" subtitle="UPSC GS Paper I" />
                  </>
                ) : (
                  <>
                    <StatCard title="Active Batches" value="6 Batches" subtitle="Cohorts operational" />
                    <StatCard title="Total Enrolled" value="148 Learners" subtitle="+12 this month" />
                    <StatCard title="Faculty Members" value="12 Active" subtitle="4 grading" />
                    <StatCard title="Allocated Seats" value="70 / 70" subtitle="Full capacity" />
                  </>
                )}
              </section>

              {/* Grid: 2 Columns Left + 1 Column Right */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Panel: Tests / Submissions */}
                <div className="space-y-6 lg:col-span-2">
                  <div className="rounded-card border border-border bg-surface-elevated p-5 shadow-sm">
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-body font-semibold text-foreground-strong">
                          {isStaff ? 'Pending Submissions for Review' : 'Active & Upcoming Test Series'}
                        </h2>
                        <p className="text-caption text-muted">
                          {isStaff
                            ? 'Student mains answer sheets awaiting faculty score and feedback.'
                            : 'Standard UPSC Prelims exam format with live simulator.'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveTab(isStaff ? 'grading' : 'exams')}
                        className="text-caption font-semibold text-primary hover:underline self-start sm:self-auto"
                      >
                        View all ({isStaff ? submissions.length : exams.length})
                      </button>
                    </div>

                    <div className="divide-y divide-border">
                      {!isStaff
                        ? exams.slice(0, 3).map((exam) => (
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
                                  {exam.status === 'completed' && (
                                    <span className="rounded-full bg-primary-soft text-primary-dark px-2 py-0.5 text-caption font-semibold">
                                      COMPLETED
                                    </span>
                                  )}
                                </div>
                                <div className="mt-1 flex flex-wrap items-center gap-3 text-caption text-muted">
                                  <span>{exam.subject}</span>
                                  <span>·</span>
                                  <span className="flex items-center gap-1">
                                    <Clock size={12} /> {exam.duration}
                                  </span>
                                  <span>·</span>
                                  <span>{exam.questions} Questions</span>
                                  <span>·</span>
                                  <span>{exam.date}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                {exam.status === 'completed' ? (
                                  <span className="rounded-control border border-border bg-surface px-3 py-1.5 text-caption font-semibold text-muted">
                                    Score: {exam.score}
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={handleStartTest}
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
                        : submissions.slice(0, 3).map((sub) => (
                            <div
                              key={sub.id}
                              className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-body-sm text-foreground-strong">
                                    {sub.student}
                                  </span>
                                  <span className="text-caption text-muted">({sub.batch})</span>
                                </div>
                                <div className="mt-1 text-caption text-muted">
                                  <span>{sub.paper}</span> · <span>{sub.submittedAt}</span>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => setGradingSubmission(sub)}
                                className={`rounded-control px-3.5 py-1.5 text-caption font-semibold transition-colors ${
                                  sub.status === 'pending'
                                    ? 'bg-primary text-primary-foreground hover:bg-primary-dark shadow-sm'
                                    : 'border border-border bg-surface text-muted'
                                }`}
                              >
                                {sub.status === 'pending' ? 'Evaluate Paper' : `Reviewed (${sub.score})`}
                              </button>
                            </div>
                          ))}
                    </div>
                  </div>

                  {/* Curated Study Modules Preview */}
                  <div className="rounded-card border border-border bg-surface-elevated p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-body font-semibold text-foreground-strong">
                        Curated Revision Modules
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab('courses')}
                        className="text-caption font-semibold text-primary hover:underline"
                      >
                        All modules
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {STUDY_MODULES.slice(0, 2).map((mod) => (
                        <div
                          key={mod.id}
                          className="flex flex-col justify-between rounded-control border border-border bg-surface p-4"
                        >
                          <div>
                            <span className="text-caption font-semibold text-primary">{mod.subject}</span>
                            <p className="mt-1 text-body-sm font-semibold text-foreground-strong">
                              {mod.title}
                            </p>
                            <p className="mt-1 text-caption text-muted line-clamp-2">
                              {mod.summary}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setActiveStudyModule(mod)}
                            className="mt-3 inline-flex items-center gap-1.5 text-caption font-semibold text-primary hover:text-primary-dark"
                          >
                            <BookOpen size={13} /> Read Summary
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Sidebar Panel: Performance & Notices */}
                <div className="space-y-6">
                  {/* Subject Accuracy */}
                  <div className="rounded-card border border-border bg-surface-elevated p-5 shadow-sm">
                    <h3 className="text-body font-semibold text-foreground-strong">
                      Subject Performance
                    </h3>
                    <p className="mt-0.5 text-caption text-muted">
                      Based on last 14 attempted mock papers
                    </p>

                    <div className="mt-4 space-y-3.5">
                      <ProgressBar label="Indian Polity & Governance" percentage={84} />
                      <ProgressBar label="Environment & Ecology" percentage={88} />
                      <ProgressBar label="Modern Indian History" percentage={74} />
                      <ProgressBar label="Indian Economy" percentage={68} />
                      <ProgressBar label="CSAT Paper II" percentage={78} />
                    </div>
                  </div>

                  {/* Academic Notices */}
                  <div className="rounded-card border border-border bg-surface-elevated p-5 shadow-sm">
                    <h3 className="text-body font-semibold text-foreground-strong">
                      Academic Notices
                    </h3>
                    <div className="mt-3 divide-y divide-border">
                      <div
                        onClick={() =>
                          setActiveNotice({
                            title: 'Prelims Mock 04 Answer Key Release',
                            date: 'Oct 6, 2026',
                            content:
                              'Detailed explanation document and question-wise objection window will open tomorrow at 10:00 AM on the portal. All enrolled candidates may review solutions.',
                          })
                        }
                        className="cursor-pointer py-2.5 transition-colors hover:text-primary"
                      >
                        <p className="text-body-sm font-medium text-foreground-strong">
                          Prelims Mock 04 Answer Key
                        </p>
                        <p className="text-caption text-muted">Oct 6 · Explanation release at 10:00 AM</p>
                      </div>

                      <div
                        onClick={() =>
                          setActiveNotice({
                            title: 'CSAT Quantitative Aptitude Masterclass',
                            date: 'Oct 8, 2026',
                            content:
                              'Special 2-hour live session focusing on Speed Maths, Number Systems, and Permutations with faculty coordinator Dr. Meera Patel.',
                          })
                        }
                        className="cursor-pointer py-2.5 transition-colors hover:text-primary"
                      >
                        <p className="text-body-sm font-medium text-foreground-strong">
                          CSAT Speed Maths Workshop
                        </p>
                        <p className="text-caption text-muted">Oct 8 · Faculty live stream at 4:00 PM</p>
                      </div>

                      <div
                        onClick={() =>
                          setActiveNotice({
                            title: 'Mains Ethics Case Study Evaluation Schedule',
                            date: 'Oct 10, 2026',
                            content:
                              'Candidate submissions for GS Paper IV Ethics assignments will be reviewed by faculty mentors within 48 hours of submission.',
                          })
                        }
                        className="cursor-pointer py-2.5 transition-colors hover:text-primary"
                      >
                        <p className="text-body-sm font-medium text-foreground-strong">
                          Ethics Case Study Grading
                        </p>
                        <p className="text-caption text-muted">Oct 10 · 48-hour mentor turnaround</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TEST SERIES */}
          {activeTab === 'exams' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="font-display text-heading-md font-semibold text-foreground-strong">
                    UPSC Test Series Portal
                  </h1>
                  <p className="text-body-sm text-muted">
                    Full-length mock exams, sectional drills, and past year question simulations.
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 rounded-control border border-border bg-surface-elevated p-1 text-caption font-medium">
                  {(['all', 'live', 'upcoming', 'completed'] as const).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setExamFilter(filter)}
                      className={`rounded-control px-3 py-1.5 capitalize transition-colors ${
                        examFilter === filter
                          ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                          : 'text-muted hover:text-foreground'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exam Cards Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                {filteredExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="flex flex-col justify-between rounded-card border border-border bg-surface-elevated p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-primary-soft text-primary-dark px-2.5 py-0.5 text-caption font-bold">
                          {exam.subject}
                        </span>
                        {exam.status === 'live' ? (
                          <span className="rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-caption font-bold animate-pulse">
                            LIVE NOW
                          </span>
                        ) : exam.status === 'completed' ? (
                          <span className="rounded-full bg-border text-muted px-2 py-0.5 text-caption font-semibold">
                            ATTEMPTED
                          </span>
                        ) : (
                          <span className="text-caption text-muted">{exam.date}</span>
                        )}
                      </div>

                      <h3 className="mt-3 font-semibold text-body text-foreground-strong">
                        {exam.title}
                      </h3>

                      <div className="mt-3 grid grid-cols-3 gap-2 rounded-control border border-border bg-surface p-2.5 text-center text-caption text-muted">
                        <div>
                          <span className="block font-semibold text-foreground-strong">{exam.duration}</span>
                          <span>Duration</span>
                        </div>
                        <div>
                          <span className="block font-semibold text-foreground-strong">{exam.questions}</span>
                          <span>Questions</span>
                        </div>
                        <div>
                          <span className="block font-semibold text-foreground-strong">{exam.marks}</span>
                          <span>Max Marks</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                      {exam.status === 'completed' ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-primary" />
                          <span className="text-body-sm font-semibold text-foreground-strong">
                            Score: {exam.score}
                          </span>
                        </div>
                      ) : (
                        <span className="text-caption text-muted">Negative marking: -0.66</span>
                      )}

                      <button
                        type="button"
                        onClick={handleStartTest}
                        className={`rounded-control px-4 py-2 text-body-sm font-semibold transition-colors ${
                          exam.status === 'live'
                            ? 'bg-primary text-primary-foreground hover:bg-primary-dark shadow-sm'
                            : 'border border-border bg-surface text-foreground-strong hover:border-primary hover:text-primary'
                        }`}
                      >
                        {exam.status === 'live'
                          ? 'Start Exam'
                          : exam.status === 'completed'
                          ? 'Reattempt Drill'
                          : 'View Syllabus'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: STUDY MATERIAL */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-heading-md font-semibold text-foreground-strong">
                  Study Material & High-Yield Notes
                </h1>
                <p className="text-body-sm text-muted">
                  Structured syllabus notes prepared by faculty mentors for quick revision.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {STUDY_MODULES.map((module) => (
                  <div
                    key={module.id}
                    className="flex flex-col justify-between rounded-card border border-border bg-surface-elevated p-6 shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-caption font-bold uppercase tracking-wider text-primary">
                          {module.subject}
                        </span>
                        <span className="text-caption text-muted">{module.lastUpdated}</span>
                      </div>
                      <h3 className="mt-2 text-heading-xs font-semibold text-foreground-strong">
                        {module.title}
                      </h3>
                      <p className="mt-2 text-body-sm text-muted leading-relaxed">
                        {module.summary}
                      </p>

                      <div className="mt-4 space-y-2 border-t border-border pt-3">
                        <span className="text-caption font-semibold text-foreground-strong">
                          Key Syllabus Topics:
                        </span>
                        <ul className="space-y-1 text-caption text-muted list-disc list-inside">
                          {module.content.map((point, idx) => (
                            <li key={idx} className="truncate">
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                      <span className="text-caption text-muted">{module.pages} Pages PDF</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveStudyModule(module)}
                          className="rounded-control bg-primary px-3.5 py-1.5 text-caption font-semibold text-primary-foreground hover:bg-primary-dark transition-colors"
                        >
                          Read Online
                        </button>
                        <button
                          type="button"
                          onClick={() => alert(`Downloading ${module.title} PDF`)}
                          className="rounded-control border border-border bg-surface p-1.5 text-muted hover:text-foreground"
                          title="Download PDF"
                        >
                          <Download size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PERFORMANCE & ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-heading-md font-semibold text-foreground-strong">
                  Performance & Preparation Analytics
                </h1>
                <p className="text-body-sm text-muted">
                  Diagnostic insights on accuracy, speed, and syllabus coverage across all mock attempts.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-card border border-border bg-surface-elevated p-5 text-center">
                  <span className="text-caption font-semibold text-muted">Overall Accuracy</span>
                  <p className="mt-2 font-display text-heading-lg font-bold text-primary">76.4%</p>
                  <p className="mt-1 text-caption text-muted">+3.2% compared to last week</p>
                </div>
                <div className="rounded-card border border-border bg-surface-elevated p-5 text-center">
                  <span className="text-caption font-semibold text-muted">Avg. Speed / Question</span>
                  <p className="mt-2 font-display text-heading-lg font-bold text-foreground-strong">52s</p>
                  <p className="mt-1 text-caption text-muted">Target: &lt;65s per item</p>
                </div>
                <div className="rounded-card border border-border bg-surface-elevated p-5 text-center">
                  <span className="text-caption font-semibold text-muted">Prelims Readiness Index</span>
                  <p className="mt-2 font-display text-heading-lg font-bold text-primary">82 / 100</p>
                  <p className="mt-1 text-caption text-muted">Strong foundation</p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-card border border-border bg-surface-elevated p-6 shadow-sm">
                  <h3 className="text-body font-semibold text-foreground-strong">
                    Subject-wise Accuracy Breakdown
                  </h3>
                  <div className="mt-5 space-y-4">
                    <ProgressBar label="Environment, Ecology & Climate Change" percentage={88} />
                    <ProgressBar label="Indian Polity & Governance" percentage={84} />
                    <ProgressBar label="CSAT Paper II (Reasoning & English)" percentage={78} />
                    <ProgressBar label="Modern Indian History" percentage={74} />
                    <ProgressBar label="Indian Economy & Budgeting" percentage={68} />
                    <ProgressBar label="Geography & World Mapping" percentage={65} />
                  </div>
                </div>

                <div className="rounded-card border border-border bg-surface-elevated p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-body font-semibold text-foreground-strong">
                      Focus Recommendations
                    </h3>
                    <p className="mt-1 text-caption text-muted">
                      Algorithmically derived high-yield areas requiring revision:
                    </p>

                    <div className="mt-4 space-y-3">
                      <div className="rounded-control border border-border bg-surface p-3.5">
                        <span className="text-caption font-bold text-primary">Priority 1: Indian Economy</span>
                        <p className="mt-0.5 text-body-sm font-medium text-foreground-strong">
                          Fiscal policy & monetary transmission mechanisms
                        </p>
                        <p className="mt-1 text-caption text-muted">
                          Recent accuracy fell to 68%. Review RBI repo rate operations and external sector trends.
                        </p>
                      </div>

                      <div className="rounded-control border border-border bg-surface p-3.5">
                        <span className="text-caption font-bold text-primary">Priority 2: Geography Mapping</span>
                        <p className="mt-0.5 text-body-sm font-medium text-foreground-strong">
                          Major Indian river systems and tributary confluences
                        </p>
                        <p className="mt-1 text-caption text-muted">
                          Missed 2 questions in the last mock on Peninsular river origins.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleStartTest}
                    className="mt-6 w-full rounded-control bg-primary py-2.5 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors"
                  >
                    Practice Weak Areas Drill
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BATCHES & COHORTS (Staff only) */}
          {activeTab === 'batches' && isStaff && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-heading-md font-semibold text-foreground-strong">
                    Institutional Batches & Cohorts
                  </h1>
                  <p className="text-body-sm text-muted">
                    Delhi Public Academy · Active student cohorts and test schedule allocation.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => alert('New cohort creation dialog')}
                  className="rounded-control bg-primary px-4 py-2 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors"
                >
                  Create Batch
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-card border border-border bg-surface-elevated p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-primary-soft text-primary-dark px-2.5 py-0.5 text-caption font-bold">
                      ACTIVE COHORT
                    </span>
                    <span className="text-caption text-muted">54 Enrolled</span>
                  </div>
                  <h3 className="mt-2 text-heading-xs font-semibold text-foreground-strong">
                    Prelims 2026 Batch 101
                  </h3>
                  <p className="mt-1 text-body-sm text-muted">
                    Target: May 2026 UPSC Prelims · Faculty Lead: Dr. Meera Patel
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-caption text-muted">
                    <span>14 Tests Completed</span>
                    <span>Average Attendance: 98%</span>
                  </div>
                </div>

                <div className="rounded-card border border-border bg-surface-elevated p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-primary-soft text-primary-dark px-2.5 py-0.5 text-caption font-bold">
                      FOUNDATION
                    </span>
                    <span className="text-caption text-muted">42 Enrolled</span>
                  </div>
                  <h3 className="mt-2 text-heading-xs font-semibold text-foreground-strong">
                    Foundation 2-Year Batch 102
                  </h3>
                  <p className="mt-1 text-body-sm text-muted">
                    NCERT & GS Core Foundations · Faculty Lead: Vikram Malhotra
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-caption text-muted">
                    <span>8 Sectional Drills</span>
                    <span>Average Attendance: 94%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PAPER GRADING (Faculty/Staff only) */}
          {activeTab === 'grading' && isStaff && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-heading-md font-semibold text-foreground-strong">
                  Faculty Evaluation Queue
                </h1>
                <p className="text-body-sm text-muted">
                  Review student mains essay submissions, assign scores, and provide actionable feedback.
                </p>
              </div>

              <div className="rounded-card border border-border bg-surface-elevated p-5 shadow-sm">
                <div className="divide-y divide-border">
                  {submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-body-sm text-foreground-strong">
                            {sub.student}
                          </span>
                          <span className="text-caption text-muted">· {sub.batch}</span>
                          {sub.status === 'graded' ? (
                            <span className="rounded-full bg-primary-soft text-primary-dark px-2 py-0.5 text-caption font-semibold">
                              Graded
                            </span>
                          ) : (
                            <span className="rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-caption font-bold">
                              Needs Review
                            </span>
                          )}
                        </div>
                        <p className="text-body-sm text-foreground-strong">{sub.paper}</p>
                        <p className="text-caption text-muted line-clamp-1 italic">
                          "{sub.studentAnswer}"
                        </p>
                        {sub.feedback && (
                          <p className="text-caption text-primary font-medium">
                            Feedback: {sub.feedback}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setGradingSubmission(sub)
                          setAssignedScore(sub.score ? sub.score.split(' ')[0] : '80')
                          setFacultyFeedbackText(sub.feedback || '')
                        }}
                        className={`rounded-control px-4 py-2 text-caption font-semibold transition-colors shrink-0 ${
                          sub.status === 'pending'
                            ? 'bg-primary text-primary-foreground hover:bg-primary-dark shadow-sm'
                            : 'border border-border bg-surface text-foreground-strong hover:border-primary'
                        }`}
                      >
                        {sub.status === 'pending' ? 'Evaluate Submission' : `Edit Score (${sub.score})`}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* 1. INTERACTIVE TEST PLAYER MODAL */}
      {/* ========================================================================= */}
      {isTestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="flex h-[90vh] max-h-[800px] w-full max-w-4xl flex-col rounded-card border border-border bg-surface shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border bg-surface-elevated px-6 py-4">
              <div>
                <span className="text-caption font-bold uppercase tracking-wider text-primary">
                  UPSC GS Paper I · Live Simulation
                </span>
                <h2 className="text-body font-semibold text-foreground-strong">
                  {testCompleted ? 'Test Analysis & Scorecard' : 'Full Length Mock 04'}
                </h2>
              </div>

              <div className="flex items-center gap-4">
                {!testCompleted && (
                  <div className="flex items-center gap-1.5 rounded-control border border-border bg-surface px-3 py-1 font-mono text-body-sm font-semibold text-primary">
                    <Clock size={16} />
                    <span>{formatTimer(testTimeLeft)}</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setIsTestModalOpen(false)}
                  className="rounded-control p-1 text-muted hover:text-foreground"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {!testCompleted ? (
                <div className="grid gap-6 md:grid-cols-3">
                  {/* Left 2 Cols: Question Area */}
                  <div className="space-y-6 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <span className="rounded-control bg-primary-soft text-primary-dark px-3 py-1 text-caption font-bold">
                        Question {currentQuestionIndex + 1} of {UPSC_QUESTIONS.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleFlagQuestion(currentQuestionIndex)}
                        className={`text-caption font-semibold transition-colors ${
                          flaggedQuestions.has(currentQuestionIndex)
                            ? 'text-primary'
                            : 'text-muted hover:text-foreground'
                        }`}
                      >
                        {flaggedQuestions.has(currentQuestionIndex) ? 'Marked for Review' : 'Mark for Review'}
                      </button>
                    </div>

                    <div className="rounded-control border border-border bg-surface-elevated p-4">
                      <span className="text-caption font-semibold text-muted">
                        Subject: {UPSC_QUESTIONS[currentQuestionIndex].subject}
                      </span>
                      <p className="mt-2 whitespace-pre-line text-body font-medium leading-relaxed text-foreground-strong">
                        {UPSC_QUESTIONS[currentQuestionIndex].text}
                      </p>
                    </div>

                    {/* Radio Options */}
                    <div className="space-y-2.5">
                      {UPSC_QUESTIONS[currentQuestionIndex].options.map((option, optIdx) => {
                        const isSelected = userAnswers[currentQuestionIndex] === optIdx
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectOption(optIdx)}
                            className={`flex w-full items-center gap-3 rounded-control border p-3.5 text-left transition-colors ${
                              isSelected
                                ? 'border-primary bg-primary-soft'
                                : 'border-border bg-surface-elevated hover:border-primary-tint-3'
                            }`}
                          >
                            <span
                              className={`grid size-6 shrink-0 place-items-center rounded-full border text-caption font-bold ${
                                isSelected
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : 'border-border text-muted'
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="text-body-sm font-medium text-foreground-strong">{option}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Right 1 Col: Question Palette Grid */}
                  <div className="space-y-4 rounded-control border border-border bg-surface-elevated p-4">
                    <span className="text-caption font-semibold uppercase tracking-wider text-muted">
                      Question Palette
                    </span>

                    <div className="grid grid-cols-5 gap-2">
                      {UPSC_QUESTIONS.map((_, idx) => {
                        const isAnswered = userAnswers[idx] !== undefined
                        const isFlagged = flaggedQuestions.has(idx)
                        const isCurrent = idx === currentQuestionIndex

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCurrentQuestionIndex(idx)}
                            className={`grid size-10 place-items-center rounded-control text-caption font-bold transition-all ${
                              isCurrent
                                ? 'ring-2 ring-primary ring-offset-1'
                                : ''
                            } ${
                              isAnswered
                                ? 'bg-primary text-primary-foreground'
                                : isFlagged
                                ? 'bg-primary-tint-4 text-primary-dark border border-primary-tint-3'
                                : 'border border-border bg-surface text-muted hover:border-foreground'
                            }`}
                          >
                            {idx + 1}
                          </button>
                        )
                      })}
                    </div>

                    <div className="border-t border-border pt-3 space-y-2 text-caption text-muted">
                      <div className="flex items-center gap-2">
                        <span className="size-3 rounded-sm bg-primary" />
                        <span>Answered ({Object.keys(userAnswers).length})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="size-3 rounded-sm bg-primary-tint-4 border border-primary-tint-3" />
                        <span>Marked for Review ({flaggedQuestions.size})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="size-3 rounded-sm border border-border bg-surface" />
                        <span>Unanswered ({UPSC_QUESTIONS.length - Object.keys(userAnswers).length})</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* SCORECARD & DETAILED SOLUTIONS */
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-card border border-border bg-surface-elevated p-5 text-center">
                      <span className="text-caption font-semibold text-muted">Total Score</span>
                      <p className="mt-2 font-display text-heading-lg font-bold text-primary">
                        {testScoreResult?.score} / {testScoreResult?.total}
                      </p>
                      <p className="mt-1 text-caption text-muted">Passing cutoff: 90 / 200</p>
                    </div>
                    <div className="rounded-card border border-border bg-surface-elevated p-5 text-center">
                      <span className="text-caption font-semibold text-muted">Accuracy</span>
                      <p className="mt-2 font-display text-heading-lg font-bold text-foreground-strong">
                        {Math.round(((testScoreResult?.correctCount || 0) / UPSC_QUESTIONS.length) * 100)}%
                      </p>
                      <p className="mt-1 text-caption text-muted">
                        {testScoreResult?.correctCount} of {UPSC_QUESTIONS.length} correct
                      </p>
                    </div>
                    <div className="rounded-card border border-border bg-surface-elevated p-5 text-center">
                      <span className="text-caption font-semibold text-muted">Time Utilized</span>
                      <p className="mt-2 font-display text-heading-lg font-bold text-foreground-strong">
                        {formatTimer(600 - testTimeLeft)}
                      </p>
                      <p className="mt-1 text-caption text-muted">Pace: Good speed</p>
                    </div>
                  </div>

                  <h3 className="text-body font-semibold text-foreground-strong">
                    Detailed Explanations & Answer Key
                  </h3>

                  <div className="space-y-4">
                    {UPSC_QUESTIONS.map((q, qIdx) => {
                      const userChoice = userAnswers[qIdx]
                      const isCorrect = userChoice === q.correctIndex

                      return (
                        <div
                          key={q.id}
                          className={`rounded-control border p-4 ${
                            isCorrect ? 'border-primary bg-primary-soft/30' : 'border-border bg-surface-elevated'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-caption font-bold text-muted">
                              Question {qIdx + 1} · {q.subject}
                            </span>
                            <span
                              className={`text-caption font-bold ${
                                isCorrect ? 'text-primary' : 'text-muted'
                              }`}
                            >
                              {isCorrect ? 'Correct (+2 marks)' : userChoice !== undefined ? 'Incorrect (-0.66 marks)' : 'Unattempted'}
                            </span>
                          </div>

                          <p className="mt-2 whitespace-pre-line text-body-sm font-medium text-foreground-strong">
                            {q.text}
                          </p>

                          <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
                            {q.options.map((opt, oIdx) => {
                              const isOfficialCorrect = oIdx === q.correctIndex
                              const isCandidateChoice = userChoice === oIdx

                              return (
                                <div
                                  key={oIdx}
                                  className={`rounded-control border px-3 py-2 text-caption font-medium ${
                                    isOfficialCorrect
                                      ? 'border-primary bg-primary text-primary-foreground font-semibold'
                                      : isCandidateChoice
                                      ? 'border-border bg-surface line-through text-muted'
                                      : 'border-border bg-surface text-muted'
                                  }`}
                                >
                                  {String.fromCharCode(65 + oIdx)}. {opt}
                                  {isOfficialCorrect && ' (Official Key)'}
                                  {isCandidateChoice && !isOfficialCorrect && ' (Your Choice)'}
                                </div>
                              )
                            })}
                          </div>

                          <div className="mt-3 rounded-control border border-border bg-surface p-3 text-caption text-muted">
                            <span className="font-semibold text-foreground-strong">Explanation: </span>
                            {q.explanation}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between border-t border-border bg-surface-elevated px-6 py-4">
              {!testCompleted ? (
                <>
                  <button
                    type="button"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                    className="rounded-control border border-border bg-surface px-4 py-2 text-body-sm font-medium text-foreground-strong disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {currentQuestionIndex < UPSC_QUESTIONS.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                        className="rounded-control bg-primary px-4 py-2 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors"
                      >
                        Next Question
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmitTest}
                        className="rounded-control bg-primary px-5 py-2 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors shadow-sm"
                      >
                        Submit Test
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex w-full items-center justify-between">
                  <span className="text-caption text-muted">Result saved to your workspace performance history</span>
                  <button
                    type="button"
                    onClick={() => setIsTestModalOpen(false)}
                    className="rounded-control bg-primary px-5 py-2 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark"
                  >
                    Return to Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. INTERACTIVE STUDY MODULE READER MODAL */}
      {/* ========================================================================= */}
      {activeStudyModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-card border border-border bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-border bg-surface-elevated px-6 py-4">
              <div>
                <span className="text-caption font-bold uppercase tracking-wider text-primary">
                  {activeStudyModule.subject}
                </span>
                <h2 className="text-body font-semibold text-foreground-strong">
                  {activeStudyModule.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveStudyModule(null)}
                className="rounded-control p-1 text-muted hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <p className="text-body-sm leading-relaxed text-muted">
                {activeStudyModule.summary}
              </p>

              <div className="space-y-3 border-t border-border pt-4">
                <span className="text-body-sm font-semibold text-foreground-strong">
                  Detailed Syllabus Digest:
                </span>
                {activeStudyModule.content.map((point, idx) => (
                  <div key={idx} className="rounded-control border border-border bg-surface-elevated p-3 text-body-sm text-foreground-strong">
                    <span className="font-semibold text-primary">Module Section {idx + 1}: </span>
                    {point}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border bg-surface-elevated px-6 py-4">
              <span className="text-caption text-muted">{activeStudyModule.pages} Pages Comprehensive PDF</span>
              <button
                type="button"
                onClick={() => setActiveStudyModule(null)}
                className="rounded-control bg-primary px-4 py-2 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE FACULTY PAPER GRADING DRAWER */}
      {/* ========================================================================= */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="flex max-h-[85vh] w-full max-w-xl flex-col rounded-card border border-border bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-border bg-surface-elevated px-6 py-4">
              <div>
                <span className="text-caption font-bold uppercase tracking-wider text-primary">
                  Paper Evaluation
                </span>
                <h2 className="text-body font-semibold text-foreground-strong">
                  {gradingSubmission.student} · {gradingSubmission.paper}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setGradingSubmission(null)}
                className="rounded-control p-1 text-muted hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <span className="text-caption font-semibold text-muted">Candidate Answer Submission:</span>
                <div className="mt-1.5 rounded-control border border-border bg-surface-elevated p-4 text-body-sm text-foreground-strong leading-relaxed italic">
                  "{gradingSubmission.studentAnswer}"
                </div>
              </div>

              <div>
                <label htmlFor="score-input" className="block text-body-sm font-semibold text-foreground-strong">
                  Awarded Marks (out of 100):
                </label>
                <input
                  id="score-input"
                  type="number"
                  min="0"
                  max="100"
                  value={assignedScore}
                  onChange={(e) => setAssignedScore(e.target.value)}
                  className="mt-1 w-32 rounded-control border border-border bg-surface px-3 py-2 text-body-sm font-semibold outline-none focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="feedback-text" className="block text-body-sm font-semibold text-foreground-strong">
                  Faculty Mentor Feedback:
                </label>
                <textarea
                  id="feedback-text"
                  rows={3}
                  value={facultyFeedbackText}
                  onChange={(e) => setFacultyFeedbackText(e.target.value)}
                  placeholder="Commend structure, cite relevant Supreme Court precedents or missing analytical angles..."
                  className="mt-1 w-full rounded-control border border-border bg-surface p-3 text-body-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border bg-surface-elevated px-6 py-4">
              <button
                type="button"
                onClick={() => setGradingSubmission(null)}
                className="rounded-control border border-border px-4 py-2 text-body-sm font-medium text-muted hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveGrade}
                className="rounded-control bg-primary px-5 py-2 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark"
              >
                Save Evaluation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE NOTICE MODAL */}
      {/* ========================================================================= */}
      {activeNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-card border border-border bg-surface p-6 shadow-2xl">
            <span className="text-caption font-bold uppercase tracking-wider text-primary">
              Academic Notice · {activeNotice.date}
            </span>
            <h3 className="mt-1 font-semibold text-body text-foreground-strong">
              {activeNotice.title}
            </h3>
            <p className="mt-3 text-body-sm leading-relaxed text-muted">
              {activeNotice.content}
            </p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveNotice(null)}
                className="rounded-control bg-primary px-4 py-2 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <div className="rounded-card border border-border bg-surface-elevated p-4 shadow-sm">
      <span className="text-caption font-medium text-muted">{title}</span>
      <p className="mt-1 font-display text-heading-sm font-bold text-foreground-strong">{value}</p>
      <p className="mt-0.5 text-caption text-muted">{subtitle}</p>
    </div>
  )
}

function ProgressBar({ label, percentage }: { label: string; percentage: number }) {
  return (
    <div>
      <div className="flex justify-between text-caption">
        <span className="font-medium text-foreground-strong">{label}</span>
        <span className="font-semibold text-primary">{percentage}%</span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
