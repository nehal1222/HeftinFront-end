import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { useAuth } from '@/hooks/useAuth'
import '@/landing.css'
import { CATEGORY_THUMBNAILS, MOSAIC_IMAGES, BRAND_LOGO_SRC } from './landingImages'

const SIGNUP_ROUTE = (ROUTES as Record<string, string>).SIGNUP || '/signup'
const REQUEST_ACCESS_ROUTE = (ROUTES as Record<string, string>).REQUEST_ACCESS || '/request-access'
const WORKSPACE_ROUTE = (ROUTES as Record<string, string>).WORKSPACE || ROUTES.DASHBOARD || '/dashboard'

interface ExamCardData {
  title: string
  subtitle: string
  category: 'upsc' | 'ssc' | 'banking' | 'state'
  tag: string
  seats: string
  testsCount: number
  enrolled: string
  features: string[]
  badgeColor: string
  difficulty: string
}

const EXAM_CATALOG: ExamCardData[] = [
  {
    title: 'UPSC Civil Services (CSE)',
    subtitle: 'Prelims GS-1 & CSAT with official TCS-iON simulation and All-India Rank telemetry',
    category: 'upsc',
    tag: 'National Flagship',
    seats: '1,056 Cadre Seats',
    testsCount: 48,
    enrolled: '14,820 Aspirants',
    features: ['Multi-statement elimination drills', 'Civil Services GS-1 & CSAT Simulator'],
    badgeColor: 'border-teal-400/40 bg-teal-500/10 text-teal-800',
    difficulty: 'Very High',
  },
  {
    title: 'SSC CGL Tier-I & Tier-II',
    subtitle: 'Sectional speed drills with negative marking trap warnings and normalization',
    category: 'ssc',
    tag: 'Highest Volume',
    seats: '17,727 Vacancies',
    testsCount: 65,
    enrolled: '22,410 Aspirants',
    features: ['45-second pacing countdown', 'All-India shift normalized percentiles'],
    badgeColor: 'border-cyan-400/40 bg-cyan-500/10 text-cyan-800',
    difficulty: 'High',
  },
  {
    title: 'IBPS PO & SBI PO Prelims',
    subtitle: 'Speed-critical banking mock engine with strict 20-minute sectional locks',
    category: 'banking',
    tag: 'Speed Critical',
    seats: '8,400 Vacancies',
    testsCount: 52,
    enrolled: '11,350 Aspirants',
    features: ['Strict 20-minute sectional lock', 'DI calculation shortcut analyzer'],
    badgeColor: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-800',
    difficulty: 'High',
  },
  {
    title: 'State PSCs (UPPSC, BPSC, MPPSC)',
    subtitle: 'State-specific GK, bilingual interfaces, and negative marking matrices',
    category: 'state',
    tag: 'State Specialized',
    seats: '4,200+ Openings',
    testsCount: 36,
    enrolled: '7,920 Aspirants',
    features: ['State statute syllabus tracking', 'Bilingual Hindi/English toggle'],
    badgeColor: 'border-amber-400/40 bg-amber-500/10 text-amber-800',
    difficulty: 'Moderate',
  },
]

interface SimulationQuestion {
  subject: string
  exam: string
  paper: string
  marks: string
  negativeMarks: string
  questionNo: number
  questionText: string
  statements: string[]
  questionPrompt: string
  options: string[]
  correctIndex: number
  explanation: string
}

const SIMULATION_QUESTIONS: Record<'upsc' | 'ssc' | 'banking', SimulationQuestion> = {
  upsc: {
    subject: 'Indian Polity & Governance',
    exam: 'UPSC Civil Services Prelims',
    paper: 'General Studies Paper I (GS-1)',
    marks: '+2.00',
    negativeMarks: '-0.66',
    questionNo: 14,
    questionText: 'With reference to the Finance Commission of India constituted under Article 280 of the Constitution, consider the following statements:',
    statements: [
      '1. The Finance Commission is a quasi-judicial statutory body constituted by the President every fifth year or earlier.',
      '2. The qualifications of its Chairman and four members are determined by Parliament by law.',
      '3. The recommendations regarding vertical tax devolution to States are legally binding on the Union Cabinet.',
    ],
    questionPrompt: 'Which of the statements given above is/are correct?',
    options: ['1 and 2 only', '2 and 3 only', '1 and 3 only', '1, 2 and 3'],
    correctIndex: 0,
    explanation: 'Statements 1 and 2 are correct. Under Article 280(1), the President constitutes the Commission. Under Article 280(2), Parliament enacted the Finance Commission Act, 1951, determining qualifications. Statement 3 is incorrect because recommendations under Article 281 are purely advisory and not binding on the government.',
  },
  ssc: {
    subject: 'Quantitative Aptitude & Profit-Loss',
    exam: 'SSC CGL Tier-I Official Pattern',
    paper: 'Section I: Mathematical Abilities',
    marks: '+2.00',
    negativeMarks: '-0.50',
    questionNo: 28,
    questionText: 'An authorized vendor marks goods 35% above cost price and offers a festive discount of 20% on the marked price. Due to an uncalibrated scale, he delivers 900 grams instead of 1,000 grams. Calculate his net profit percentage:',
    statements: [
      'Pricing Ratio: Marked price is pegged at 135% of Cost Price (CP)',
      'Customer Concession: Direct cash discount of 20% applied at checkout',
      'Weight Differential: 1,000g billed while disbursing 900g inventory',
    ],
    questionPrompt: 'Select the exact net profit percentage realized by the vendor:',
    options: ['18.5%', '20.0%', '22.5%', '25.0%'],
    correctIndex: 1,
    explanation: 'Net multiplier = (135 / 100) × (80 / 100) × (1000 / 900) = 1.35 × 0.80 × 1.1111 = 1.08 × (10 / 9) = 1.20. Therefore, the net overall profit is exactly 20.0%.',
  },
  banking: {
    subject: 'Reasoning & Syllogistic Deductions',
    exam: 'IBPS PO Prelims Actual Shift',
    paper: 'Section II: Analytical Reasoning',
    marks: '+1.00',
    negativeMarks: '-0.25',
    questionNo: 22,
    questionText: 'In the question below, three definitive premises are followed by two logical conclusions. Select the conclusion that validly follows:',
    statements: [
      'Premise 1: Only a few commercial loans are sovereign deposits.',
      'Premise 2: All sovereign deposits are statutory reserves.',
      'Premise 3: No statutory reserve is a speculative credit asset.',
    ],
    questionPrompt: 'Evaluate which conclusion logically follows from the premises:',
    options: [
      'Only Conclusion I follows',
      'Only Conclusion II follows',
      'Both Conclusions I and II follow',
      'Neither Conclusion I nor II follows',
    ],
    correctIndex: 2,
    explanation: 'Conclusion I (Some commercial loans are not speculative credit) follows because the overlapping deposit portion cannot intersect credit. Conclusion II (All sovereign deposits can never be speculative credit) follows directly because all deposits are enclosed within reserves, which share zero overlap with speculative credit.',
  },
}

interface FormulaStep {
  step: string
  stage: string
  title: string
  lead: string
  points: string[]
  imageSrc: string
  imageTag: string
}

const FORMULA_STEPS: FormulaStep[] = [
  {
    step: '01',
    stage: 'STAGE 01 · BASELINE',
    title: 'Map Every Blindspot',
    lead: 'Isolate conceptual leakages before the commission hall finds them.',
    points: [
      'Topic-level diagnostic scorecards across all modules',
      'Daily 20-minute timed precision drill sets',
      'Cognitive error tagging for deceptive trap questions',
    ],
    imageSrc: '/images/timeline_step1_diagnostic.jpg',
    imageTag: 'Diagnostic Grounding',
  },
  {
    step: '02',
    stage: 'STAGE 02 · SIMULATION',
    title: 'TCS-iON Muscle Memory',
    lead: 'Zero surprises on exam morning. Train under true terminal conditions.',
    points: [
      '1:1 official TCS-iON palette, timer & hotkeys',
      'Sub-20ms instant button response loop',
      'Authentic countdown pressure with negative marking',
    ],
    imageSrc: '/images/timeline_step2_simulation.jpg',
    imageTag: 'Terminal Emulation',
  },
  {
    step: '03',
    stage: 'STAGE 03 · FORENSICS',
    title: 'Turn Leaks into Ranks',
    lead: 'Calibrate elimination speed, hesitation patterns, and All-India standing.',
    points: [
      'Hesitation heatmaps that expose second-guessing',
      'Strategic skip matrix to eliminate unforced penalties',
      'Shift-normalized All-India Rank forecasting',
    ],
    imageSrc: '/images/timeline_step3_analytics.jpg',
    imageTag: 'Cognitive Telemetry',
  },
]

interface TimelineStage {
  step: string
  phase: string
  title: string
  tag: string
  focus: string
  deliverables: string[]
  milestoneMetric: string
  pacingNote: string
}

const TIMELINE_STAGES: TimelineStage[] = [
  {
    step: '01',
    phase: 'Months 1 - 3',
    title: 'Diagnostic Grounding',
    tag: 'Phase 1: Baseline',
    focus: 'Comprehensive baseline testing to map subject vulnerabilities across static syllabus modules.',
    deliverables: [
      'Module-by-module diagnostic scorecard identifying weak topics',
      'Daily 20-minute timed concept drill sets to build speed foundation',
    ],
    milestoneMetric: '50%+ Syllabus Mapped',
    pacingNote: 'Prioritize precision and conceptual grounding over raw speed.',
  },
  {
    step: '02',
    phase: 'Months 4 - 6',
    title: 'Sectional Velocity',
    tag: 'Phase 2: Speed',
    focus: 'Intensive high-pressure drills targeting time leaks and elimination heuristics under negative marking.',
    deliverables: [
      'Sub-60 second question elimination drills with trap warnings',
      'Subject sectional mocks with negative-marking risk calibration',
    ],
    milestoneMetric: '72% Speed Accuracy',
    pacingNote: 'Eliminate coin-flip guesses and reduce unforced negative marks.',
  },
  {
    step: '03',
    phase: 'Months 7 - 9',
    title: 'Exam Hall Simulation',
    tag: 'Phase 3: Simulation',
    focus: 'Full-length 100-question papers delivered in strict TCS-iON environments with All-India ranks.',
    deliverables: [
      'Bi-weekly national mocks matching commission slot timings',
      'Shift-normalized percentiles across 12,000+ simultaneous test takers',
    ],
    milestoneMetric: '85% Rank Band',
    pacingNote: 'Condition psychological resilience and stamina for 2-hour slots.',
  },
  {
    step: '04',
    phase: 'Months 10 - 12',
    title: 'Peak Precision',
    tag: 'Phase 4: Merit Ready',
    focus: 'High-yield revision, predictive question trends, and error log remediation for rank optimization.',
    deliverables: [
      'Targeted revision drills addressing personal error logs',
      'Final All-India Grand Mocks mirroring exam conditions',
    ],
    milestoneMetric: '99%+ Top 1% Merit Ready',
    pacingNote: 'Consolidate strengths and protect rank threshold.',
  },
]

interface CompanyInnovation {
  stat: string
  statLabel: string
  title: string
  tag: string
  points: string[]
}

const COMPANY_INNOVATIONS: CompanyInnovation[] = [
  {
    stat: '0.02s',
    statLabel: 'hardware response latency',
    title: 'Silicon Simulation Engine',
    tag: 'Physics Fidelity',
    points: [
      'Sub-millisecond keyboard hotkey and button event loop mirroring official TCS-iON nodes',
      'Crash-resilient offline buffer preserving every marked answer through network flickers',
      'Cognitive pressure conditioning with authentic commission countdown clocks and audio cues',
    ],
  },
  {
    stat: '99.4%',
    statLabel: 'predictive rank fidelity',
    title: 'Cognitive Behavioral Telemetry',
    tag: 'Performance Forensics',
    points: [
      'Micro-hesitation heatmaps that expose second-guessing traps and panic-induced changes',
      'Negative-marking prevention algorithms showing exact marks saved by strategic skips',
      'Shift-normalized All-India Rank projection mapped against official commission cutoffs',
    ],
  },
  {
    stat: '100%',
    statLabel: 'ranker-curated question vault',
    title: 'The Merit-First Philosophy',
    tag: 'Company DNA',
    points: [
      'Zero filler questions: every mock is authored and vetted by verified top rankers',
      'Multi-statement elimination drills and deceptive distractor diagnostic breakdowns',
      'Zero advertising, zero gamification gimmicks: pure focus on merit and Rank One execution',
    ],
  },
]

interface InnovationComparison {
  key: 'engine' | 'telemetry' | 'pedagogy'
  tabLabel: string
  metricPill: string
  title: string
  heftinLabel: string
  heftinPoints: string[]
  conventionalLabel: string
  conventionalPoints: string[]
}

const INNOVATION_COMPARISONS: InnovationComparison[] = [
  {
    key: 'engine',
    tabLabel: 'Silicon Engine',
    metricPill: '22x Faster Input Response',
    title: 'Hardware-Level TCS-iON Emulation',
    heftinLabel: 'Heftin Simulation Engine',
    heftinPoints: [
      'Sub-20ms instant hotkey response matching official exam halls',
      'Crash-resilient offline buffer preserves responses across network drops',
      'True TCS-iON palette grid layout, countdown clocks, and button mechanics',
    ],
    conventionalLabel: 'Conventional Test Websites',
    conventionalPoints: [
      'Laggy HTML web forms with 400ms+ network round-trip delays',
      'Connection drop resets your entire test or loses unsaved questions',
      'Inauthentic design with generic radio buttons and wrong button placements',
    ],
  },
  {
    key: 'telemetry',
    tabLabel: 'Cognitive Telemetry',
    metricPill: '4-Dimensional Analytics',
    title: 'Deep Behavioral & Elimination Forensics',
    heftinLabel: 'Heftin Telemetric Forensics',
    heftinPoints: [
      'Hesitation heatmaps expose second-guessing and coin-flip panic traps',
      'Negative-marking risk matrix shows exact marks saved by strategic skips',
      'Shift-normalized All-India Rank projection calibrated to official commission percentiles',
    ],
    conventionalLabel: 'Conventional Test Websites',
    conventionalPoints: [
      'Crude right vs wrong counters with zero time-per-question analysis',
      'Misleading raw percentiles that ignore multi-shift normalization',
      'No behavioral diagnosis: you never learn why you lost marks',
    ],
  },
  {
    key: 'pedagogy',
    tabLabel: 'Ranker Curation',
    metricPill: '100% Peer-Reviewed',
    title: 'Commission-Grade Question Craftsmanship',
    heftinLabel: 'Heftin Merit-First Vault',
    heftinPoints: [
      'Every question authored & verified by verified UPSC/SSC top rankers',
      'Multi-statement elimination traps and deceptive distractor diagnostics',
      'Strictly zero promotional clutter, zero spam, 100% merit-driven focus',
    ],
    conventionalLabel: 'Conventional Test Websites',
    conventionalPoints: [
      'Recycled questions scraped from decade-old outdated textbooks',
      'Superficial one-line explanations without conceptual error traps',
      'Cluttered with ads, discount banners, and gamification distractions',
    ],
  },
]

const PALETTE_GREEN = [1, 2, 4, 5, 8, 9, 10, 11, 13, 16, 17, 20, 22, 23, 26]
const PALETTE_RED = [3, 7, 12, 18, 24]
const PALETTE_PURPLE = [6, 15, 25]

const PALETTE_ITEMS = Array.from({ length: 30 }, (_, idx) => {
  const num = idx + 1
  const status =
    num === 14
      ? 'now'
      : PALETTE_GREEN.includes(num)
      ? 'ans'
      : PALETTE_RED.includes(num)
      ? 'no'
      : PALETTE_PURPLE.includes(num)
      ? 'rev'
      : 'new'
  return { n: num, s: status }
})


const MARQUEE_ITEMS = [
  '50K+ Students Preparing',
  '2.4M+ Tests Attempted',
  'Banking',
  'SSC',
  'Railways',
  'State PSC',
  'UPSC',
  '98% Report Accuracy',
  'Every Mock Test Counts',
]

const FAQ_ITEMS = [
  {
    q: 'Is the interface identical to the official exam?',
    a: 'Yes. It mirrors the exact TCS-iON color palette, countdown clock, button positions, and palette grid with 99.4% precision.',
  },
  {
    q: 'How are percentiles calculated across shifts?',
    a: 'Scores are normalized across multiple test shifts and batches using official commission formula to provide true All-India rank standing.',
  },
  {
    q: 'What is Cognitive Behavioral Telemetry?',
    a: 'Heftin tracks your hesitation delays, second-guessing patterns, and negative-marking risks to pinpoint where you lose marks before actual exam morning.',
  },
  {
    q: 'Can I try it before enrolling in a complete series?',
    a: 'Yes. Practice freely on our live simulation console and upgrade only when you are ready for full-length test papers.',
  },
]


const parseNumeric = (val: string | number) => Number(String(val).replace(/[^0-9.]/g, '')) || 0
const getSuffixPlus = (val: string | number) => (String(val).includes('+') ? '+' : '')

function CounterNumber({
  to,
  decimals = 0,
  suffix = '',
  sep = false,
}: {
  to: number
  decimals?: number
  suffix?: string
  sep?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [currentVal, setCurrentVal] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrentVal(to)
      return
    }
    let animId = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const update = (now: number) => {
          const progress = Math.min((now - start) / 2800, 1)
          setCurrentVal(to * (1 - Math.pow(1 - progress, 3)))
          if (progress < 1) {
            animId = requestAnimationFrame(update)
          }
        }
        animId = requestAnimationFrame(update)
      },
      { threshold: 0.35 }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(animId)
    }
  }, [to])

  const formatted = sep
    ? Math.round(currentVal).toLocaleString('en-IN')
    : currentVal.toFixed(decimals)
  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  )
}

export function HomePage() {
  const { user } = useAuth()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [simulationExam, setSimulationExam] = useState<'upsc' | 'ssc' | 'banking'>('upsc')
  const [simSelectedOption, setSimSelectedOption] = useState<number | null>(null)
  const [simQuestionStatus, setSimQuestionStatus] = useState<'not-answered' | 'answered'>('not-answered')
  const [activeInnovTab, setActiveInnovTab] = useState<'engine' | 'telemetry' | 'pedagogy'>('engine')


  useEffect(() => {
    const timer = setTimeout(() => {
      const el = document.getElementById('preloader')
      if (el) {
        el.classList.add('hide')
        setTimeout(() => {
          el.style.display = 'none'
        }, 600)
      }
    }, 2600)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed', 'revealed')
          }
        })
      },
      { threshold: 0.01, rootMargin: '100px 0px 100px 0px' }
    )

    const elements = document.querySelectorAll('.cinematic-reveal, .reveal-item')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])


  const currentSimulation = SIMULATION_QUESTIONS[simulationExam]
  const activeComparison =
    INNOVATION_COMPARISONS.find((c) => c.key === activeInnovTab) || INNOVATION_COMPARISONS[0]
  const filteredExams =
    selectedCategory === 'all'
      ? EXAM_CATALOG
      : EXAM_CATALOG.filter((ex) => ex.category === selectedCategory)

  const handleSaveAndNext = () => {
    if (simSelectedOption !== null) {
      setSimQuestionStatus('answered')
    }
  }

  const handleClearResponse = () => {
    setSimSelectedOption(null)
    setSimQuestionStatus('not-answered')
  }


  return (
    <div className="landing-page-root landing-theme">
      <div id="preloader" className="preloader">
        <div className="preloader-word">
          {'HEFTIN ACADEMY'.split('').map((char, index) =>
            char === ' ' ? (
              <span key={index} className="space" />
            ) : (
              <span key={index}>{char}</span>
            )
          )}
        </div>
      </div>



      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="brand">
            <img className="brand-logo" src={BRAND_LOGO_SRC} alt="" />
            <span className="brand-name">Heftin Academy</span>
          </Link>

          <button
            type="button"
            className={`nav-toggle ${isMobileMenuOpen ? 'is-open' : ''}`}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span />
            <span />
            <span />
          </button>

          <div className={`navbar-collapse ${isMobileMenuOpen ? 'open is-open' : ''}`}>
            <ul onClick={() => setIsMobileMenuOpen(false)}>
              <li>
                <a href="#explore">Arena</a>
              </li>
              <li>
                <a href="#arena">Console</a>
              </li>
              <li>
                <a href="#about">Telemetry</a>
              </li>
              <li>
                <a href="#timeline">Roadmap</a>
              </li>
              <li>
                <a href="#company">Company</a>
              </li>
              <li>
                <a href="#faq">FAQ</a>
              </li>
              <li>
                <Link to={ROUTES.CONTACT}>Contact</Link>
              </li>
            </ul>

            <div className="nav-actions-inner" onClick={() => setIsMobileMenuOpen(false)}>
              {user ? (
                <Link to={WORKSPACE_ROUTE} className="start-button">
                  Open Workspace
                </Link>
              ) : (
                <>
                  <Link to={SIGNUP_ROUTE} className="go-premium">
                    Go Premium
                  </Link>
                  <Link to={ROUTES.LOGIN} className="login">
                    Login
                  </Link>
                  <Link to={SIGNUP_ROUTE} className="login">
                    Sign Up
                  </Link>
                  <Link to={SIGNUP_ROUTE} className="start-button">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-inner">
            <span className="hmh-badge on-dark cinematic-reveal">
              <span className="hmh-pulse-dot" />
              <span>EXECUTIVE EXAMINATION ARCHITECTURE</span>
            </span>

            <h1 className="cinematic-reveal">
              <span className="line-1">High-Stakes Exams.</span>
              <span className="line-2">Engineered for Rank One.</span>
            </h1>

            <p className="cinematic-reveal cinematic-delay-1">
              Zero fluff. The exact TCS-iON exam hall console, telemetric speed analytics, and AIR pacing roadmaps — built for serious rank contenders.
            </p>

            <div className="cinematic-reveal cinematic-delay-2" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link
                to={user ? WORKSPACE_ROUTE : SIGNUP_ROUTE}
                className="start-button hmh-btn-arrow"
              >
                <span>{user ? 'Open Workspace' : 'Simulate Exam Now'}</span>
                <span className="arrow">→</span>
              </Link>
              <a
                href="#explore"
                className="go-premium hmh-btn-arrow"
                style={{ padding: '14px 26px' }}
              >
                <span>Explore Series</span>
                <span className="arrow">↓</span>
              </a>
            </div>

            <div className="hero-stats cinematic-reveal cinematic-delay-3">
              <div className="hero-stat">
                <strong>
                  <CounterNumber to={120} suffix="K+" />
                </strong>
                <span>Aspirants tested</span>
              </div>
              <div className="hero-stat">
                <strong>
                  <CounterNumber to={0.02} decimals={2} suffix="s" />
                </strong>
                <span>TCS-iON console latency</span>
              </div>
              <div className="hero-stat">
                <strong>
                  <CounterNumber to={99.4} decimals={1} suffix="%" />
                </strong>
                <span>Simulation fidelity</span>
              </div>
            </div>
          </div>
        </section>

        <div className="marquee" aria-hidden="true">
          {[0, 1].map((p) => (
            <div className="marquee-track" key={p}>
              {MARQUEE_ITEMS.map((item) => (
                <span key={item + p}>{item}</span>
              ))}
            </div>
          ))}
        </div>

        <section className="process" id="product">
          <div className="process-inner">
            <div className="reveal-item" style={{ textAlign: 'center' }}>
              <span className="hmh-badge">
                <span className="hmh-pulse-dot" />
                <span>01 · THE FORMULA</span>
              </span>
              <h2 className="split-heading" style={{ marginTop: 12 }}>
                <span className="split-heading-lead">Three disciplined moves to</span>
                <span className="split-heading-bold">The Merit List</span>
              </h2>
              <p className="hx-sec-sub" style={{ margin: '14px auto 0' }}>
                Simple mechanics. Unrelenting execution. Every move designed to eliminate error.
              </p>
            </div>

            <div className="timeline-alt-track">
              {FORMULA_STEPS.map((milestone, idx) => {
                const isEven = idx % 2 === 1

                const contentCard = (
                  <div className="timeline-card-content reveal-item">
                    <span className="timeline-stage-tag">{milestone.stage}</span>
                    <h3>{milestone.title}</h3>
                    <p className="lead">{milestone.lead}</p>
                    <ul>
                      {milestone.points.map((pt) => (
                        <li key={pt}>
                          <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )

                const mediaCard = (
                  <div className="timeline-card-media reveal-item">
                    <div className="timeline-media-frame">
                      <img src={milestone.imageSrc} alt={milestone.title} loading="lazy" />
                      <span className="timeline-media-badge">{milestone.imageTag}</span>
                    </div>
                  </div>
                )

                return (
                  <div key={milestone.step} className="timeline-alt-row">
                    <div className="timeline-col-left">
                      {isEven ? mediaCard : contentCard}
                    </div>

                    <div className="timeline-node-center">
                      <span>{milestone.step}</span>
                    </div>

                    <div className="timeline-col-right">
                      {isEven ? contentCard : mediaCard}
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ textAlign: 'center', marginTop: 56 }}>
              <Link
                to={SIGNUP_ROUTE}
                className="process-cta reveal-item hmh-btn-arrow"
              >
                <span>Begin Your Diagnostics</span>
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="hx-sec hx-tint" id="explore">
          <div className="hx-wrap">
            <div className="hx-center reveal-item">
              <span className="hmh-badge">
                <span className="hmh-pulse-dot" />
                <span>02 · THE ARENA</span>
              </span>
              <h2 className="split-heading" style={{ marginTop: 12 }}>
                <span className="split-heading-lead">Choose your</span>
                <span className="split-heading-bold">National Arena</span>
              </h2>
              <p className="hx-sec-sub" style={{ margin: '14px auto 0' }}>
                Four national battlegrounds. Calibrated down to the syllabus clause.
              </p>
            </div>

            <div className="hx-tabs light reveal-item">
              {[
                ['all', 'All Arenas'],
                ['upsc', 'UPSC CSE'],
                ['ssc', 'SSC CGL'],
                ['banking', 'Banking (PO/Clerk)'],
                ['state', 'State PSCs'],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={selectedCategory === key ? 'on' : ''}
                  onClick={() => setSelectedCategory(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="hx-cat hx-stagger reveal-item">
              {filteredExams.map((exam) => (
                <article
                  key={exam.title}
                  className="hx-catcard corner-marks"
                >
                  <div
                    className="hx-catimg"
                    style={{ backgroundImage: `url(${CATEGORY_THUMBNAILS[exam.category] || CATEGORY_THUMBNAILS.upsc})` }}
                  >
                    <span>{exam.tag}</span>
                  </div>
                  <h3>{exam.title.split(' (')[0]}</h3>
                  <div className="hx-nums">
                    <div>
                      <b>
                        <CounterNumber to={parseNumeric(exam.testsCount)} suffix={getSuffixPlus(exam.testsCount)} />
                      </b>
                      <span>mocks</span>
                    </div>
                    <div>
                      <b>
                        <CounterNumber to={parseNumeric(exam.enrolled.split(' ')[0])} sep suffix={getSuffixPlus(exam.enrolled)} />
                      </b>
                      <span>aspirants</span>
                    </div>
                    <div>
                      <b>
                        <CounterNumber to={parseNumeric(exam.seats.split(' ')[0])} sep suffix={getSuffixPlus(exam.seats)} />
                      </b>
                      <span>{exam.seats.split(' ').slice(1).join(' ').toLowerCase()}</span>
                    </div>
                  </div>
                  <Link to={SIGNUP_ROUTE} className="hx-save hmh-btn-arrow">
                    <span>Enter Arena</span>
                    <span className="arrow">→</span>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="hx-sec hx-navy" id="arena">
          <div className="hx-wrap">
            <div className="hx-center reveal-item">
              <span className="hmh-badge on-dark">
                <span className="hmh-pulse-dot" />
                <span>03 · LIVE HARDWARE SIMULATION</span>
              </span>
              <h2 className="split-heading on-dark" style={{ marginTop: 12 }}>
                <span className="split-heading-lead">The actual exam hall</span>
                <span className="split-heading-bold">Console</span>
              </h2>
              <p className="hx-sec-sub" style={{ margin: '14px auto 0', color: 'rgba(255,255,255,0.72)' }}>
                Zero surprises on exam morning. Identical palette, clock pressure, and negative marking drills.
              </p>
            </div>

            <div className="hx-tabs reveal-item">
              {[
                ['upsc', 'UPSC Civil Services'],
                ['ssc', 'SSC CGL Tier-I'],
                ['banking', 'IBPS / SBI PO'],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={simulationExam === key ? 'on' : ''}
                  onClick={() => {
                    setSimulationExam(key as 'upsc' | 'ssc' | 'banking')
                    setSimSelectedOption(null)
                    setSimQuestionStatus('not-answered')
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="hx-arena reveal-item">
              <div className="hx-exam corner-marks">
                <div className="hx-exam-top">
                  <span className="hx-exam-paper">{currentSimulation.paper}</span>
                  <span className="hx-marks">
                    <b>{currentSimulation.marks}</b> / <i>{currentSimulation.negativeMarks}</i>
                  </span>
                  <span className="hx-timer-pill">
                    <span className="live-dot" />
                    <span>01:45:20</span>
                  </span>
                </div>

                <div className="hx-q-box">
                  <div className="hx-q-header">
                    <span className="hx-q-num">Q{currentSimulation.questionNo}</span>
                    <span className="hx-q-subject">{currentSimulation.subject}</span>
                  </div>
                  <p className="hx-q-text">{currentSimulation.questionText}</p>

                  {currentSimulation.statements && currentSimulation.statements.length > 0 && (
                    <div className="hx-q-statements">
                      {currentSimulation.statements.map((stmt, sIdx) => (
                        <div key={sIdx} className="hx-q-stmt-item">
                          <span>{stmt}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {currentSimulation.questionPrompt && (
                    <p className="hx-q-prompt">{currentSimulation.questionPrompt}</p>
                  )}
                </div>

                <div className="hx-opts">
                  {currentSimulation.options.map((opt, idx) => (
                    <button
                      key={opt}
                      type="button"
                      className={simSelectedOption === idx ? 'on' : ''}
                      onClick={() => setSimSelectedOption(idx)}
                    >
                      <span>{String.fromCharCode(65 + idx)}</span>
                      {opt}
                    </button>
                  ))}
                </div>

                {simQuestionStatus === 'answered' && (
                  <div className="hx-q-explanation">
                    <div className="hx-q-expl-head">
                      <span className={simSelectedOption === currentSimulation.correctIndex ? 'expl-badge ok' : 'expl-badge bad'}>
                        {simSelectedOption === currentSimulation.correctIndex ? '✓ Correct Answer' : '✕ Incorrect Selection'}
                      </span>
                      <span className="expl-note">Commission Model Solution:</span>
                    </div>
                    <p className="hx-q-expl-text">{currentSimulation.explanation}</p>
                  </div>
                )}

                <div className="hx-exam-foot">
                  {simQuestionStatus === 'answered' ? (
                    <span className={simSelectedOption === currentSimulation.correctIndex ? 'hx-res ok' : 'hx-res bad'}>
                      {simSelectedOption === currentSimulation.correctIndex
                        ? `Scored ${currentSimulation.marks} marks`
                        : `Deducted ${currentSimulation.negativeMarks} marks`}
                    </span>
                  ) : (
                    <span className="hx-hint">Select your option, then click Save & Next</span>
                  )}
                  <div>
                    <button type="button" className="hx-ghost" onClick={handleClearResponse}>
                      Clear Response
                    </button>
                    <button type="button" className="hx-save" onClick={handleSaveAndNext}>
                      Save & Next
                    </button>
                  </div>
                </div>
              </div>

              <div className="hx-arena-side">
                <div className="hx-stat-tile">
                  <b>
                    <CounterNumber to={99.4} decimals={1} suffix="%" />
                  </b>
                  <span>TCS-iON Console Fidelity</span>
                </div>
                <div className="hx-stat-tile">
                  <b>{currentSimulation.negativeMarks}</b>
                  <span>Negative Marking Penalty</span>
                </div>
                <div className="hx-pal-box">
                  <div className="hx-pal-head">
                    <span>Question Palette (30 Qs)</span>
                  </div>
                  <div className="hx-pal-legend">
                    <div className="hx-pal-legend-item">
                      <span className="hx-pal-legend-dot" style={{ background: '#16a34a' }} />
                      <span>Answered</span>
                    </div>
                    <div className="hx-pal-legend-item">
                      <span className="hx-pal-legend-dot" style={{ background: '#e11d48' }} />
                      <span>Unanswered</span>
                    </div>
                    <div className="hx-pal-legend-item">
                      <span className="hx-pal-legend-dot" style={{ background: '#7c3aed' }} />
                      <span>Review</span>
                    </div>
                  </div>
                  <div className="hx-pal">
                    {PALETTE_ITEMS.map((item) => {
                      const isCurrent = item.n === currentSimulation.questionNo
                      const state = isCurrent
                        ? (simQuestionStatus === 'answered' ? 'ans' : 'now')
                        : (item.s === 'now' ? 'ans' : item.s)
                      return (
                        <span key={item.n} className={`p-${state}`}>
                          {item.n}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="why" id="about">
          <div className="why-inner">
            <div className="why-copy reveal-item">
              <span className="hmh-badge">
                <span className="hmh-pulse-dot" />
                <span>04 · THE ADVANTAGE</span>
              </span>
              <h2 className="split-heading" style={{ marginTop: 10 }}>
                <span className="split-heading-lead">Precision is not</span>
                <span className="split-heading-bold">An Accident</span>
              </h2>
              <div className="rule-accent" />
              <p>
                Every attempt converts into telemetric clarity — hesitation speed, coin-flip traps, and All-India percentile trajectory.
              </p>
              <Link to={user ? WORKSPACE_ROUTE : SIGNUP_ROUTE} className="why-cta hmh-btn-arrow">
                <span>Inspect Your Telemetry</span>
                <span className="arrow">→</span>
              </Link>
            </div>

            <div className="hero-visual reveal-item">
              <div className="dashboard-card card-1">
                <p>Overall Accuracy</p>
                <h2>
                  <CounterNumber to={84} suffix="%" />
                </h2>
                <span>↑ 12% vs national average</span>
              </div>
              <div className="dashboard-card card-2">
                <p>Projected Merit Rank</p>
                <h2>
                  #<CounterNumber to={214} />
                </h2>
                <span>Top 0.8% percentile band</span>
              </div>
              <div className="dashboard-card card-3">
                <p>Consistency Streak</p>
                <h2>
                  <CounterNumber to={18} suffix=" days" />
                </h2>
                <span>Daily timed discipline</span>
              </div>
            </div>
          </div>
        </section>

        <section className="hx-sec hx-tint" id="timeline">
          <div className="hx-wrap">
            <div className="hx-center reveal-item">
              <span className="hmh-badge">
                <span className="hmh-pulse-dot" />
                <span>05 · PACING ROADMAP</span>
              </span>
              <h2 className="split-heading" style={{ marginTop: 12 }}>
                <span className="split-heading-lead">Four phases to</span>
                <span className="split-heading-bold">Peak Rank</span>
              </h2>
              <p className="hx-sec-sub" style={{ margin: '14px auto 0' }}>
                A disciplined progression from concept grounding to merit list execution.
              </p>
            </div>

            <div className="hx-phases hx-stagger reveal-item">
              {TIMELINE_STAGES.map((stage, idx) => {
                const match = stage.milestoneMetric.match(/(\d+)([%+]*)/)
                const numericVal = match ? parseInt(match[1], 10) : 99
                const metricSuffix = match ? match[2] : '%'
                const labelText = stage.milestoneMetric.replace(new RegExp('^\\d+[%+]*\\s*'), '')
                return (
                  <div key={stage.step} className="hx-phase corner-marks">
                    <span className="hx-phase-when">
                      {stage.tag.split(':')[0]} · {stage.phase}
                    </span>
                    <b className="hx-phase-big">
                      <CounterNumber to={numericVal} suffix={metricSuffix} />
                    </b>
                    <span className="hx-phase-label">{labelText}</span>
                    <h3>{stage.title}</h3>
                    <i className="hx-phase-bar">
                      <u style={{ '--w': `${(idx + 1) * 25}%` } as React.CSSProperties} />
                    </i>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="stat-band">
          <div className="stat-band-inner">
            <div className="stat-band-split">
              <div className="stat-band-copy reveal-item">
                <span className="hmh-badge on-dark">
                  <span className="hmh-pulse-dot" />
                  <span>06 · THE PROOF</span>
                </span>
                <h2 className="split-heading on-dark" style={{ marginTop: 10 }}>
                  <span className="split-heading-lead">Measurable ascent.</span>
                  <span className="split-heading-bold">Backed by Data.</span>
                </h2>
                <p className="stat-band-lead" style={{ marginTop: 14 }}>
                  Real numbers from serious aspirants, not marketing estimates.
                </p>
                <div className="stat-row">
                  <div className="stat">
                    <strong>
                      <CounterNumber to={2.4} decimals={1} suffix="M+" />
                    </strong>
                    <span>Tests attempted</span>
                  </div>
                  <div className="stat">
                    <strong>
                      <CounterNumber to={18} />
                    </strong>
                    <span>Exam categories</span>
                  </div>
                  <div className="stat">
                    <strong>
                      <CounterNumber to={99.4} decimals={1} suffix="%" />
                    </strong>
                    <span>Interface match fidelity</span>
                  </div>
                  <div className="stat">
                    <strong>
                      <CounterNumber to={4.9} decimals={1} suffix="/5" />
                    </strong>
                    <span>Candidate rating</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-mock reveal-item corner-marks">
                <div className="dashboard-mock-header">
                  <div className="dashboard-mock-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="dashboard-mock-title">Aspirant Telemetry Matrix</span>
                </div>
                <div className="dashboard-mock-body">
                  <div className="dashboard-mock-score">
                    <div className="score-ring">
                      <strong>
                        <CounterNumber to={84} suffix="%" />
                      </strong>
                    </div>
                    <span>Overall accuracy</span>
                  </div>
                  <div className="dashboard-mock-chart">
                    {[38, 52, 46, 64, 58, 76, 84].map((pct, idx) => (
                      <div
                        key={idx}
                        className={`bar bar-tone-${idx === 6 ? 4 : Math.min(idx, 3)}${idx === 6 ? ' bar-current' : ''}`}
                        style={{ '--h': `${pct}%` } as React.CSSProperties}
                      />
                    ))}
                  </div>
                </div>
                <div className="dashboard-mock-foot">↑ 12% improvement from last full mock</div>
              </div>
            </div>
          </div>
        </section>

        <section className="hx-sec hx-white">
          <div className="hx-wrap">
            <div className="hx-center reveal-item">
              <span className="hmh-badge">
                <span className="hmh-pulse-dot" />
                <span>07 · CANDIDATE VOICES</span>
              </span>
              <h2 className="split-heading" style={{ marginTop: 12 }}>
                <span className="split-heading-lead">Tested under fire.</span>
                <span className="split-heading-bold">Proven in Merit Lists</span>
              </h2>
            </div>

            <div className="hx-mosaic hx-stagger reveal-item">
              <figure className="m1 corner-marks">
                <img src={MOSAIC_IMAGES.m1} alt="Aspirant reviewing a mock test" loading="lazy" />
                <figcaption>
                  <b>
                    +<CounterNumber to={11.4} decimals={1} />
                  </b>
                  <span>percentile surge in 6 mocks</span>
                </figcaption>
              </figure>

              <figure className="m2 corner-marks">
                <img src={MOSAIC_IMAGES.m2} alt="Taking an online exam" loading="lazy" />
                <figcaption>
                  <b>
                    <CounterNumber to={18} suffix=" days" />
                  </b>
                  <span>unbroken study streak</span>
                </figcaption>
              </figure>

              <div className="m3 corner-marks">
                <b>
                  <CounterNumber to={92} suffix="%" />
                </b>
                <span>confirm real exam calibration</span>
              </div>

              <figure className="m4 corner-marks">
                <img src={MOSAIC_IMAGES.m4} alt="Online test illustration" loading="lazy" />
                <figcaption>
                  <b>
                    #<CounterNumber to={214} />
                  </b>
                  <span>All-India Rank qualified</span>
                </figcaption>
              </figure>

              <div className="m5 corner-marks">
                <b>
                  <CounterNumber to={4.9} decimals={1} suffix="/5" />
                </b>
                <span>average candidate rating</span>
              </div>
            </div>
          </div>
        </section>

        <section className="hx-sec hx-navy" id="company">
          <div className="hx-wrap">
            <div className="hx-center reveal-item">
              <span className="hmh-badge on-dark">
                <span className="hmh-pulse-dot" />
                <span>08 · THE HEFTIN STANDARD</span>
              </span>
              <h2 className="split-heading on-dark" style={{ marginTop: 12 }}>
                <span className="split-heading-lead">How we re-engineered</span>
                <span className="split-heading-bold">Examination Science</span>
              </h2>
              <p className="hx-sec-sub" style={{ margin: '14px auto 0', color: 'rgba(255,255,255,0.72)' }}>
                Born out of frustration with generic mock test portals, Heftin builds India's highest-fidelity exam simulation technology from first principles.
              </p>
            </div>

            <div className="hx-roles hx-stagger reveal-item">
              {COMPANY_INNOVATIONS.map((innov) => (
                <article key={innov.title} className="hx-role corner-marks on-dark">
                  <b className="hx-role-big">{innov.stat}</b>
                  <span className="hx-role-label">{innov.statLabel}</span>
                  <h3>{innov.title}</h3>
                  <ul>
                    {innov.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="hx-innov-box reveal-item">
              <div className="hx-innov-head">
                <div className="hx-innov-tabs">
                  {INNOVATION_COMPARISONS.map((comp) => (
                    <button
                      key={comp.key}
                      type="button"
                      className={`hx-innov-tab-btn ${activeInnovTab === comp.key ? 'is-active' : ''}`}
                      onClick={() => setActiveInnovTab(comp.key)}
                    >
                      {comp.tabLabel}
                    </button>
                  ))}
                </div>
                <span className="hx-innov-pill">{activeComparison.metricPill}</span>
              </div>

              <div className="hx-innov-body">
                <div className="hx-innov-col heftin-col">
                  <div className="hx-innov-col-head">
                    <span className="badge-heftin">Heftin Academy</span>
                    <h4>{activeComparison.heftinLabel}</h4>
                  </div>
                  <ul>
                    {activeComparison.heftinPoints.map((pt) => (
                      <li key={pt}>
                        <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="hx-innov-col other-col">
                  <div className="hx-innov-col-head">
                    <span className="badge-other">Generic Portals</span>
                    <h4>{activeComparison.conventionalLabel}</h4>
                  </div>
                  <ul>
                    {activeComparison.conventionalPoints.map((pt) => (
                      <li key={pt}>
                        <svg className="cross-icon" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="hx-center reveal-item" style={{ marginTop: 40 }}>
              <Link to={user ? WORKSPACE_ROUTE : SIGNUP_ROUTE} className="start-button hmh-btn-arrow">
                <span>Experience The Heftin Standard</span>
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="testimonial">
          <div className="testimonial-inner reveal-item">
            <span className="quote-mark">“</span>
            <p className="quote">
              Heftin mocks felt indistinguishable from my actual exam morning. The telemetric analytics told me exactly where I was leaking marks.
            </p>
            <div className="testimonial-author">
              <span className="name">Ananya R.</span>
              <span className="role">SSC CGL, All-India Rank 214</span>
            </div>
            <Link to={SIGNUP_ROUTE} className="start-button hmh-btn-arrow" style={{ marginTop: 36 }}>
              <span>Start Your First Simulation</span>
              <span className="arrow">→</span>
            </Link>
          </div>
        </section>

        <section className="hx-sec hx-white" id="faq">
          <div className="hx-faq">
            <div className="reveal-item" style={{ textAlign: 'center' }}>
              <span className="hmh-badge">
                <span className="hmh-pulse-dot" />
                <span>09 · CLARITY</span>
              </span>
              <h2 className="split-heading" style={{ marginTop: 12 }}>
                <span className="split-heading-lead">Frequently</span>
                <span className="split-heading-bold">Clarified</span>
              </h2>
            </div>

            <div className="reveal-item" style={{ marginTop: 40 }}>
              {FAQ_ITEMS.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>

          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img className="brand-logo" src={BRAND_LOGO_SRC} alt="" />
              <span>Heftin Academy</span>
            </Link>
            <p>Every mock test brings you closer to Rank One.</p>
          </div>

          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li>
                <a href="#product">Architecture</a>
              </li>
              <li>
                <a href="#explore">Test Series</a>
              </li>
              <li>
                <a href="#arena">Exam Console</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li>
                <a href="#company">Our Innovations</a>
              </li>
              <li>
                <a href="#company">The Heftin Standard</a>
              </li>
              <li>
                <Link to={REQUEST_ACCESS_ROUTE}>Request Access</Link>
              </li>
              <li>
                <Link to={ROUTES.CONTACT}>Contact</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Get Started</h4>
            <ul>
              <li>
                <Link to={ROUTES.LOGIN}>Login</Link>
              </li>
              <li>
                <Link to={SIGNUP_ROUTE}>Sign Up</Link>
              </li>
              <li>
                <a href="#faq">FAQ</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li>
                <a href="#faq">Privacy Policy</a>
              </li>
              <li>
                <a href="#faq">Terms of Service</a>
              </li>
              <li>
                <a href="#faq">Refund Policy</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Heftin Academy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
