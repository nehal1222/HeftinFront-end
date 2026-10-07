import { useEffect, useRef, useState } from 'react'
import { ROUTES } from '@/lib/constants'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import '@/landing.css'

type RoleKey = 'admin' | 'hod' | 'teacher' | 'student' | 'superadmin'

interface RoleDetail {
  title: string
  scope: string
  intro: string
  permissions: string
  route: string
  actionLabel: string
}

const ROLE_DATA: Record<RoleKey, RoleDetail> = {
  admin: {
    title: 'Organization Admin',
    scope: 'Delhi Public Academy',
    intro: 'Manages staff accounts, dynamic roles, academic departments, and audit logs.',
    permissions: 'Permissions: View and create users, manage roles and permissions, configure org profile.',
    route: `${ROUTES.LOGIN}?role=org_admin`,
    actionLabel: 'Launch Admin View',
  },
  hod: {
    title: 'Department HOD',
    scope: 'General Studies Department',
    intro: 'Oversees department curriculum, question bank audits, and faculty performance.',
    permissions: 'Permissions: View department faculties, review question banks, approve exam papers.',
    route: `${ROUTES.LOGIN}?role=faculty`,
    actionLabel: 'Launch HOD View',
  },
  teacher: {
    title: 'Faculty / Teacher',
    scope: 'Batch 101 Faculty',
    intro: 'Builds mock tests, reviews question analytics, and tracks batch test rankings.',
    permissions: 'Permissions: View users and manage assigned batch exams.',
    route: `${ROUTES.LOGIN}?role=faculty`,
    actionLabel: 'Launch Teacher View',
  },
  student: {
    title: 'Student Aspirant',
    scope: 'UPSC & SSC Candidate',
    intro: 'Attempts high-fidelity mock tests, analyses test scores, and tracks ranking percentiles.',
    permissions: 'Permissions: Attempt mock exams, view performance reports, track streaks.',
    route: `${ROUTES.LOGIN}?role=student`,
    actionLabel: 'Launch Student View',
  },
  superadmin: {
    title: 'Platform SuperAdmin',
    scope: 'Heftin Platform Central',
    intro: 'Oversees tenant academies, manages platform rights catalog, and enforces ceiling constraints.',
    permissions: 'Permissions: Full platform ceiling, provision organizations, manage system catalog.',
    route: `${ROUTES.LOGIN}?role=super_admin`,
    actionLabel: 'Launch SuperAdmin View',
  },
}

export function HomePage() {
  const { isAuthenticated, logout } = useAuth()
  const [activeRole, setActiveRole] = useState<RoleKey>('admin')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [preloaderHidden, setPreloaderHidden] = useState(false)

  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Hide preloader after intro animation
    const timer = setTimeout(() => {
      setPreloaderHidden(true)
    }, 1200)

    // Cursor tracking
    const handleMouseMove = (e: MouseEvent) => {
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`
        dotRef.current.style.top = `${e.clientY}px`
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${e.clientX}px`
        ringRef.current.style.top = `${e.clientY}px`
      }
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Intersection observer for reveals
    const targets = document.querySelectorAll('.reveal')
    targets.forEach((el) => el.classList.add('is-visible'))

    let observer: IntersectionObserver | null = null
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
            }
          })
        },
        { threshold: 0.1 }
      )
      targets.forEach((el) => observer?.observe(el))
    }

    return () => {
      clearTimeout(timer)
      window.removeEventListener('mousemove', handleMouseMove)
      observer?.disconnect()
    }
  }, [])

  const currentRole = ROLE_DATA[activeRole]

  return (
    <div className="landing-page-root">
      {/* Preloader */}
      <div className={`preloader ${preloaderHidden ? 'hide' : ''}`} aria-hidden="true">
        <div className="preloader-word">
          <span>H</span><span>E</span><span>F</span><span>T</span><span>I</span><span>N</span>
          <span className="space"> </span>
          <span>A</span><span>C</span><span>A</span><span>D</span><span>E</span><span>M</span><span>Y</span>
        </div>
      </div>

      {/* Custom cursor */}
      <div className="cursor-dot" aria-hidden="true" ref={dotRef}></div>
      <div className="cursor-ring" aria-hidden="true" ref={ringRef}></div>

      {/* 1. Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to={ROUTES.HOME} className="brand">
            <img src="/images/logo.jpeg" alt="Heftin Academy" className="brand-logo" />
            <span className="brand-name">Heftin Academy</span>
          </Link>

          <button
            type="button"
            className={`nav-toggle ${isMobileMenuOpen ? 'is-open' : ''}`}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span><span></span><span></span>
          </button>

          <div className={`navbar-collapse ${isMobileMenuOpen ? 'is-open' : ''}`} id="navCollapse">
            <ul>
              <li><a href="#exams" style={{ whiteSpace: 'nowrap' }}>Explore</a></li>
              <li><Link to={ROUTES.REQUEST_ACCESS} style={{ whiteSpace: 'nowrap' }}>For Institutes</Link></li>
              <li><a href="#blueprints" style={{ whiteSpace: 'nowrap' }}>Blueprints</a></li>
              <li><a href="#roles" style={{ whiteSpace: 'nowrap' }}>Roles</a></li>
              <li><Link to={ROUTES.CONTACT} style={{ whiteSpace: 'nowrap' }}>Contact</Link></li>
            </ul>
            <div className="nav-actions-inner" style={{ whiteSpace: 'nowrap' }}>
              <Link to={ROUTES.REQUEST_ACCESS} className="go-premium" style={{ whiteSpace: 'nowrap' }}>Go Premium</Link>
              {isAuthenticated ? (
                <>
                  <Link to={ROUTES.WORKSPACE} className="login" style={{ whiteSpace: 'nowrap' }}>Dashboard</Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="start-button"
                    style={{ whiteSpace: 'nowrap', cursor: 'pointer', border: 'none' }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to={ROUTES.LOGIN} className="login" style={{ whiteSpace: 'nowrap' }}>Login</Link>
                  <Link to={ROUTES.SIGNUP} className="start-button" style={{ whiteSpace: 'nowrap' }}>Get Started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* 2. Hero Section */}
        <section className="hero">
          <video className="section-bg-video reveal is-visible" data-pool="random" autoPlay muted loop playsInline aria-hidden="true">
            <source src="/videos/gemini.mp4" type="video/mp4" />
          </video>
          <span className="section-bg-overlay reveal is-visible" aria-hidden="true"></span>

          <div className="hero-inner">
            <span className="hero-glow" aria-hidden="true"></span>
            <h1>
              <span className="line-1">Every Mock Test, Bring Closer</span>
              <span className="line-2">to Rank One</span>
            </h1>
            <p>
              Real exam conditions, honest scoring, and analytics<br /> that actually tell you what to fix next — built <br /> for aspirants who take their rank seriously.
            </p>
            <Link to={ROUTES.SIGNUP} className="start-button">Get Started</Link>

            <div className="hero-stats">
              <div className="hero-stat"><strong>50K+</strong><span>Students preparing</span></div>
              <div className="hero-stat"><strong>12+</strong><span>Exam categories</span></div>
              <div className="hero-stat"><strong>98%</strong><span>Report accuracy</span></div>
            </div>
          </div>
        </section>

        {/* 3. Marquee */}
        <div className="marquee">
          <div className="marquee-track">
            <span>50K+ Students Preparing</span>
            <span className="marquee-dot">&bull;</span>
            <span>2.4M+ Tests Attempted</span>
            <span className="marquee-dot">&bull;</span>
            <span>Banking</span>
            <span className="marquee-dot">&bull;</span>
            <span>SSC</span>
            <span className="marquee-dot">&bull;</span>
            <span>Railways</span>
            <span className="marquee-dot">&bull;</span>
            <span>98% Report Accuracy</span>
            <span className="marquee-dot">&bull;</span>
            <span>Every Mock Test Counts</span>
            <span className="marquee-dot">&bull;</span>
          </div>
          <div className="marquee-track" aria-hidden="true">
            <span>50K+ Students Preparing</span>
            <span className="marquee-dot">&bull;</span>
            <span>2.4M+ Tests Attempted</span>
            <span className="marquee-dot">&bull;</span>
            <span>Banking</span>
            <span className="marquee-dot">&bull;</span>
            <span>SSC</span>
            <span className="marquee-dot">&bull;</span>
            <span>Railways</span>
            <span className="marquee-dot">&bull;</span>
            <span>98% Report Accuracy</span>
            <span className="marquee-dot">&bull;</span>
            <span>Every Mock Test Counts</span>
            <span className="marquee-dot">&bull;</span>
          </div>
        </div>

        {/* 4. Process Section */}
        <section className="process">
          <span className="section-texture texture-diamond reveal is-visible" aria-hidden="true"></span>
          <div className="process-inner reveal is-visible">
            <p className="eyebrow">HOW IT WORKS</p>
            <h2 className="split-heading">
              <span className="split-heading-lead">Three steps to your</span>
              <span className="split-heading-bold">Rank</span>
            </h2>
            <span className="rule-accent" aria-hidden="true"></span>

            <div className="process-steps">
              <div className="process-step reveal is-visible">
                <div className="process-bubble-cluster">
                  <span className="process-bubble-mini mini-1" aria-hidden="true"></span>
                  <span className="process-bubble-mini mini-2" aria-hidden="true"></span>
                  <div className="process-icon icon-1">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 20l1-4L15.5 5.5a1.5 1.5 0 0 1 2.12 0l.88.88a1.5 1.5 0 0 1 0 2.12L8 19l-4 1Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M13.5 7.5l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
                <div className="process-step-body">
                  <span className="process-step-pill">STEP 01</span>
                  <h3>Pick Your Exam</h3>
                  <p>Banking, SSC, Railways, and more — start with a path built for your goal.</p>
                  <span className="process-step-stat">12+ exam categories</span>
                </div>
              </div>

              <div className="process-step reveal is-visible">
                <div className="process-bubble-cluster">
                  <span className="process-bubble-mini mini-1" aria-hidden="true"></span>
                  <span className="process-bubble-mini mini-2" aria-hidden="true"></span>
                  <div className="process-icon icon-2">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 20V10M12 20V4M20 20v-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <div className="process-step-body">
                  <span className="process-step-pill">STEP 02</span>
                  <h3>Simulate &amp; Analyze</h3>
                  <p>Real exam conditions, then a breakdown of exactly where you lost marks.</p>
                  <span className="process-step-stat">98% report accuracy</span>
                </div>
              </div>

              <div className="process-step reveal is-visible">
                <div className="process-bubble-cluster">
                  <span className="process-bubble-mini mini-1" aria-hidden="true"></span>
                  <span className="process-bubble-mini mini-2" aria-hidden="true"></span>
                  <div className="process-icon icon-3">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 17l5-5 4 4 7-9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M14 7h6v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <div className="process-step-body">
                  <span className="process-step-pill">STEP 03</span>
                  <h3>Climb the Leaderboard</h3>
                  <p>Every attempt sharpens your accuracy and moves you closer to rank one.</p>
                  <span className="process-step-stat">2.4M+ tests attempted</span>
                </div>
              </div>
            </div>

            <Link to={ROUTES.LOGIN} className="process-cta">Start Practicing &rarr;</Link>
          </div>
        </section>

        {/* 5. Why Section */}
        <section className="why">
          <video className="section-bg-video reveal is-visible" data-pool="fixed" autoPlay muted loop playsInline aria-hidden="true">
            <source src="/videos/gemini.mp4" type="video/mp4" />
          </video>
          <span className="section-bg-overlay light reveal is-visible" aria-hidden="true"></span>

          <div className="why-inner reveal is-visible">
            <div className="why-copy">
              <p className="eyebrow">THE HEFTIN DIFFERENCE</p>
              <h2 className="split-heading">
                <span className="split-heading-lead">Why</span>
                <span className="split-heading-bold">Heftin Academy</span>
              </h2>
              <p>
                Heftin Academy is a leading online learning platform that provides high-quality educational content and resources for students of all ages. Our mission is to empower learners to achieve their academic goals and succeed in their chosen fields.
              </p>
              <Link to={ROUTES.WORKSPACE} className="why-cta">See your dashboard &rarr;</Link>
            </div>

            <div className="hero-visual corner-marks">
              <div className="dashboard-card card-1">
                <p>Overall Accuracy</p>
                <h2>84%</h2>
                <span>&uarr; 12% from last test</span>
              </div>
              <div className="dashboard-card card-2">
                <p>Current Rank</p>
                <h2>#214</h2>
                <span>&uarr; 36 ranks this week</span>
              </div>
              <div className="dashboard-card card-3">
                <p>Study Streak</p>
                <h2>18 days</h2>
                <span>Personal best</span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Stat Band */}
        <section className="stat-band">
          <div className="stat-band-inner reveal is-visible">
            <div className="stat-band-split">
              <div className="stat-band-copy">
                <p className="eyebrow eyebrow-light">TRACK RECORD</p>
                <h2 className="split-heading on-dark">
                  <span className="split-heading-lead">Every mock test,</span>
                  <span className="split-heading-bold">Accounted for.</span>
                </h2>
                <p className="stat-band-lead">Real numbers from real aspirants — not projections.</p>
                <div className="stat-row">
                  <div className="stat"><strong>2.4M+</strong><span>Tests attempted</span></div>
                  <div className="stat"><strong>18</strong><span>Exam categories</span></div>
                  <div className="stat"><strong>92%</strong><span>Say scoring felt honest</span></div>
                  <div className="stat"><strong>4.8/5</strong><span>Average rating</span></div>
                </div>
              </div>

              <div className="dashboard-mock corner-marks on-dark">
                <div className="dashboard-mock-header">
                  <div className="dashboard-mock-dots">
                    <span></span><span></span><span></span>
                  </div>
                  <span className="dashboard-mock-title">Your Performance</span>
                </div>
                <div className="dashboard-mock-body">
                  <div className="dashboard-mock-score">
                    <div className="score-ring"><strong>84%</strong></div>
                    <span>Overall accuracy</span>
                  </div>
                  <div className="dashboard-mock-chart">
                    <div className="bar bar-tone-0" style={{ ['--h' as string]: '38%' }}></div>
                    <div className="bar bar-tone-1" style={{ ['--h' as string]: '52%' }}></div>
                    <div className="bar bar-tone-2" style={{ ['--h' as string]: '45%' }}></div>
                    <div className="bar bar-tone-3" style={{ ['--h' as string]: '60%' }}></div>
                    <div className="bar bar-tone-4" style={{ ['--h' as string]: '48%' }}></div>
                    <div className="bar bar-tone-0" style={{ ['--h' as string]: '65%' }}></div>
                    <div className="bar bar-tone-1" style={{ ['--h' as string]: '58%' }}></div>
                    <div className="bar bar-tone-2" style={{ ['--h' as string]: '72%' }}></div>
                    <div className="bar bar-tone-3" style={{ ['--h' as string]: '68%' }}></div>
                    <div className="bar bar-tone-4" style={{ ['--h' as string]: '78%' }}></div>
                    <div className="bar bar-tone-0" style={{ ['--h' as string]: '74%' }}></div>
                    <div className="bar bar-current" style={{ ['--h' as string]: '90%' }}></div>
                  </div>
                </div>
                <p className="dashboard-mock-foot">&uarr; 12% from last test</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Choose Your Exam */}
        <section className="exams" id="exams">
          <video className="section-bg-video reveal is-visible" data-pool="grpstudy" autoPlay muted loop playsInline aria-hidden="true">
            <source src="/videos/GRPSTUDY.mp4" type="video/mp4" />
          </video>
          <span className="section-bg-overlay light reveal is-visible" aria-hidden="true"></span>
          <span className="section-texture texture-dots reveal is-visible" aria-hidden="true"></span>
          <div className="exams-inner reveal is-visible">
            <p className="eyebrow">PREPARE FOR YOUR GOAL</p>
            <h2 className="split-heading">
              <span className="split-heading-lead">Choose your</span>
              <span className="split-heading-bold">Exam</span>
            </h2>
            <p className="exams-competitive-line">
              <span className="live-dot" aria-hidden="true"></span>
              2.4M+ aspirants are already racing for Rank One — where do you stand?
            </p>

            <div className="exam-grid">
              <Link to={`${ROUTES.LOGIN}?role=student`} className="exam-card reveal is-visible">
                <span className="exam-card-rank">01</span>
                <img src="/images/img1.jpg" alt="Banking exam preparation" className="exam-card-img" />
                <h3>Banking</h3>
                <p>IBPS, SBI, RRB and more.</p>
                <span className="exam-card-stat"><span className="live-dot" aria-hidden="true"></span>8,240 competing this week</span>
                <span className="exam-card-cta">Enter the race &rarr;</span>
              </Link>

              <Link to={`${ROUTES.LOGIN}?role=student`} className="exam-card reveal is-visible">
                <span className="exam-card-rank">02</span>
                <img src="/images/img3.jpg" alt="SSC exam preparation" className="exam-card-img" />
                <h3>SSC</h3>
                <p>CGL, CHSL, CPO and more.</p>
                <span className="exam-card-stat"><span className="live-dot" aria-hidden="true"></span>6,150 competing this week</span>
                <span className="exam-card-cta">Enter the race &rarr;</span>
              </Link>

              <Link to={`${ROUTES.LOGIN}?role=student`} className="exam-card reveal is-visible">
                <span className="exam-card-rank">03</span>
                <img src="/images/img4.jpg" alt="Railways exam preparation" className="exam-card-img" />
                <h3>Railways</h3>
                <p>Prepare for railway exams.</p>
                <span className="exam-card-stat"><span className="live-dot" aria-hidden="true"></span>4,920 competing this week</span>
                <span className="exam-card-cta">Enter the race &rarr;</span>
              </Link>
            </div>

            <Link to={ROUTES.LOGIN} className="exams-view-all">View all competitive &amp; government exams &rarr;</Link>
          </div>
        </section>

        {/* 8. Features Section */}
        <section className="features">
          <div className="features-inner reveal is-visible">
            <div className="features-media corner-marks">
              <video className="features-video reveal is-visible" data-pool="random" autoPlay muted loop playsInline aria-hidden="true">
                <source src="/videos/STUDY.mp4" type="video/mp4" />
              </video>
            </div>

            <div className="features-copy">
              <p className="eyebrow">WHY IT WORKS</p>
              <h2 className="split-heading">
                <span className="split-heading-lead">Everything you need,</span>
                <span className="split-heading-bold">Nothing you don't.</span>
              </h2>

              <div className="feature-grid">
                <div className="feature reveal is-visible">
                  <span className="feature-num">01</span>
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3>Real exam simulation</h3>
                  <p>Timed sections, negative marking, and the same interface you'll see on test day.</p>
                </div>

                <div className="feature reveal is-visible">
                  <span className="feature-num">02</span>
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 20V10M12 20V4M20 20v-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3>Detailed analytics</h3>
                  <p>See exactly which topics are costing you marks, not just your overall score.</p>
                </div>

                <div className="feature reveal is-visible">
                  <span className="feature-num">03</span>
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 4.5h9a2.5 2.5 0 012.5 2.5v12.5H7.5A2.5 2.5 0 015 16.9V4.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                      <path d="M5 16.5h11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </div>
                  <h3>Expert-curated content</h3>
                  <p>Every question is written and reviewed by educators who've cleared these exams.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Blueprints Section */}
        <section
          className="blueprints-section"
          id="blueprints"
          style={{
            padding: '80px 0',
            background: 'var(--primary)',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            position: 'relative',
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 14px',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(204, 230, 232, 0.4)',
                  marginBottom: '12px',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#ffffff',
                    fontFamily: 'monospace',
                  }}
                >
                  Architecture Blueprints
                </span>
              </div>
              <h2
                style={{
                  fontSize: 'clamp(26px, 4vw, 36px)',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  margin: '4px 0 10px',
                  lineHeight: 1.15,
                }}
              >
                <span style={{ color: 'var(--primary-tint-5)', fontWeight: 500 }}>The 3 Core </span>
                <span>Blueprints</span>
              </h2>
              <div style={{ width: '48px', height: '2px', background: 'var(--primary-tint-5)', margin: '14px auto', borderRadius: '9999px' }}></div>
              <p style={{ fontSize: '13.5px', color: '#ffffff', opacity: 0.95, margin: '0 auto', lineHeight: 1.6 }}>
                Strict rights-based navigation, immutable ceilings, and zero-trust role boundaries.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {/* Blueprint 01 */}
              <div
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: '20px',
                  padding: '28px 24px',
                  background: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 16px 36px -12px rgba(0, 26, 28, 0.22)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--primary)', display: 'grid', placeItems: 'center', color: '#ffffff' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="7" height="9" x="3" y="3" rx="1" />
                        <rect width="7" height="5" x="14" y="3" rx="1" />
                        <rect width="7" height="9" x="14" y="12" rx="1" />
                        <rect width="7" height="5" x="3" y="16" rx="1" />
                      </svg>
                    </div>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        color: 'var(--primary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        fontFamily: 'monospace',
                        background: 'rgba(0, 130, 142, 0.08)',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                      }}
                    >
                      Blueprint 01
                    </span>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--primary-shade-4)', margin: '0 0 8px', lineHeight: 1.3 }}>
                    Organization Admin Dashboard
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--primary-shade-4)', opacity: 0.85, lineHeight: 1.55, margin: 0 }}>
                    Real-time workspace for People, Roles, Departments, Batches, and Audit logs driven by effective rights.
                  </p>

                  <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--primary)', background: 'rgba(204, 230, 232, 0.35)', padding: '3px 8px', borderRadius: '4px' }}>Dynamic Navigation</span>
                    <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--primary-shade-4)', background: '#f8fcfe', border: '1px solid var(--border)', padding: '3px 8px', borderRadius: '4px' }}>Audit Trail</span>
                    <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--primary-shade-4)', background: '#f8fcfe', border: '1px solid var(--border)', padding: '3px 8px', borderRadius: '4px' }}>Tenant Scoped</span>
                  </div>
                </div>

                <Link
                  to={`${ROUTES.LOGIN}?role=org_admin`}
                  className="start-button"
                  style={{ marginTop: '24px', padding: '10px 18px', fontSize: '12.5px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}
                >
                  <span>Open Admin Dashboard</span>
                  <span>&rarr;</span>
                </Link>
              </div>

              {/* Blueprint 02 */}
              <div
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: '20px',
                  padding: '28px 24px',
                  background: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 16px 36px -12px rgba(0, 26, 28, 0.22)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--primary)', display: 'grid', placeItems: 'center', color: '#ffffff' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="4" x2="20" y1="21" y2="21" />
                        <line x1="4" x2="20" y1="3" y2="3" />
                        <line x1="12" x2="12" y1="8" y2="16" />
                        <line x1="8" x2="16" y1="12" y2="12" />
                      </svg>
                    </div>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        color: 'var(--primary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        fontFamily: 'monospace',
                        background: 'rgba(0, 130, 142, 0.08)',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                      }}
                    >
                      Blueprint 02
                    </span>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--primary-shade-4)', margin: '0 0 8px', lineHeight: 1.3 }}>
                    Role &amp; Rights Builder
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--primary-shade-4)', opacity: 0.85, lineHeight: 1.55, margin: 0 }}>
                    Dynamic custom role editor featuring immutable ceiling barriers that stop privilege self-escalation.
                  </p>

                  <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--primary)', background: 'rgba(204, 230, 232, 0.35)', padding: '3px 8px', borderRadius: '4px' }}>Immutable Ceilings</span>
                    <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--primary-shade-4)', background: '#f8fcfe', border: '1px solid var(--border)', padding: '3px 8px', borderRadius: '4px' }}>No Escalation</span>
                    <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--primary-shade-4)', background: '#f8fcfe', border: '1px solid var(--border)', padding: '3px 8px', borderRadius: '4px' }}>Granular Matrix</span>
                  </div>
                </div>

                <Link
                  to={`${ROUTES.LOGIN}?role=org_admin`}
                  className="start-button"
                  style={{ marginTop: '24px', padding: '10px 18px', fontSize: '12.5px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}
                >
                  <span>Open Role Builder</span>
                  <span>&rarr;</span>
                </Link>
              </div>

              {/* Blueprint 03 */}
              <div
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: '20px',
                  padding: '28px 24px',
                  background: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 16px 36px -12px rgba(0, 26, 28, 0.22)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--primary)', display: 'grid', placeItems: 'center', color: '#ffffff' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
                        <path d="M9 22v-4h6v4" />
                        <path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M8 10h.01" /><path d="M16 10h.01" /><path d="M8 14h.01" /><path d="M16 14h.01" />
                      </svg>
                    </div>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        color: 'var(--primary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        fontFamily: 'monospace',
                        background: 'rgba(0, 130, 142, 0.08)',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                      }}
                    >
                      Blueprint 03
                    </span>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--primary-shade-4)', margin: '0 0 8px', lineHeight: 1.3 }}>
                    SuperAdmin Organization Control
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--primary-shade-4)', opacity: 0.85, lineHeight: 1.55, margin: 0 }}>
                    Multi-tenant provisioner with organization seat limits, quota bars, and master rights allocation.
                  </p>

                  <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--primary)', background: 'rgba(204, 230, 232, 0.35)', padding: '3px 8px', borderRadius: '4px' }}>Tenant Quotas</span>
                    <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--primary-shade-4)', background: '#f8fcfe', border: '1px solid var(--border)', padding: '3px 8px', borderRadius: '4px' }}>Master Ceiling</span>
                    <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--primary-shade-4)', background: '#f8fcfe', border: '1px solid var(--border)', padding: '3px 8px', borderRadius: '4px' }}>Central Governance</span>
                  </div>
                </div>

                <Link
                  to={`${ROUTES.LOGIN}?role=super_admin`}
                  className="start-button"
                  style={{ marginTop: '24px', padding: '10px 18px', fontSize: '12.5px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}
                >
                  <span>Open SuperAdmin Central</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 10. Roles Sandbox */}
        <section className="roles-sandbox-section" id="roles" style={{ padding: '70px 0', background: '#f8fcfe', borderTop: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
              <div>
                <p className="eyebrow" style={{ margin: 0 }}>ACCESS CONTROL</p>
                <h2 className="split-heading" style={{ margin: '4px 0', justifyContent: 'flex-start' }}>
                  <span className="split-heading-lead">Dynamic Roles &amp; </span>
                  <span className="split-heading-bold">Rights</span>
                </h2>
                <p style={{ fontSize: '12.5px', color: 'var(--primary-shade-4)', opacity: 0.85, margin: '4px 0 0' }}>
                  Select a role to verify its effective rights summary in plain English.
                </p>
              </div>

              {/* Role switcher buttons */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {(['admin', 'hod', 'teacher', 'student', 'superadmin'] as const).map((rk) => (
                  <button
                    key={rk}
                    type="button"
                    className={`role-tab-btn ${activeRole === rk ? 'active' : ''}`}
                    onClick={() => setActiveRole(rk)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      border: activeRole === rk ? '1px solid var(--primary)' : '1px solid var(--border)',
                      background: activeRole === rk ? 'var(--primary)' : '#ffffff',
                      color: activeRole === rk ? '#ffffff' : 'var(--primary-shade-4)',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {rk === 'superadmin' ? 'SuperAdmin' : rk.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Active role details card */}
            <div
              style={{
                borderRadius: '18px',
                border: '1px solid var(--border)',
                background: '#ffffff',
                padding: '26px',
                boxShadow: '0 12px 32px -16px rgba(0, 26, 28, 0.09)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  borderBottom: '1px solid var(--border)',
                  paddingBottom: '16px',
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'monospace' }}>
                    {currentRole.scope}
                  </span>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary-shade-4)', margin: '4px 0 0' }}>
                    {currentRole.title}
                  </h3>
                </div>

                <Link
                  to={currentRole.route}
                  className="start-button"
                  style={{ padding: '8px 16px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                >
                  <span>{currentRole.actionLabel}</span>
                  <span>&rarr;</span>
                </Link>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--primary-shade-4)', opacity: 0.9, lineHeight: 1.5, margin: '16px 0 12px' }}>
                {currentRole.intro}
              </p>

              <div
                style={{
                  background: '#f3fafb',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary)', flexShrink: 0 }}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span style={{ fontSize: '12.5px', color: 'var(--primary-shade-4)', fontWeight: 600 }}>
                  {currentRole.permissions}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 11. Testimonial Section */}
        <section className="testimonial">
          <div className="testimonial-inner reveal is-visible corner-marks on-dark">
            <span className="quote-mark">&ldquo;</span>
            <p className="quote">
              Heftin's mocks felt closer to my actual exam than anything else I tried. The analytics told me exactly where I was losing marks.
            </p>
            <div className="testimonial-author">
              <span className="name">Ananya R.</span>
              <span className="role">SSC CGL, Rank 214</span>
            </div>
          </div>
        </section>
      </main>

      {/* 12. Site Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <Link to={ROUTES.HOME} className="brand footer-brand-logo" style={{ marginBottom: '14px' }}>
              <img src="/images/logo.jpeg" alt="Heftin Academy" className="brand-logo" />
              <span className="brand-name">Heftin Academy</span>
            </Link>
            <p>Every mock test brings you closer to rank one.</p>
            <p className="footer-contact">Contact: <a href="mailto:hello@example.com">hello@example.com</a></p>
          </div>

          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li><Link to={`${ROUTES.LOGIN}?role=student`}>Test Series</Link></li>
              <li><Link to={ROUTES.WORKSPACE}>Performance</Link></li>
              <li><Link to={ROUTES.WORKSPACE}>Study Material</Link></li>
              <li><Link to={ROUTES.REQUEST_ACCESS}>Pricing</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link to={ROUTES.REQUEST_ACCESS}>For Institutes</Link></li>
              <li><Link to={ROUTES.REQUEST_ACCESS}>Activate Invite / Onboarding</Link></li>
              <li><Link to={ROUTES.HOME}>About Us</Link></li>
              <li><Link to={ROUTES.HOME}>Careers</Link></li>
              <li><Link to={ROUTES.CONTACT}>Contact</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Architecture</h4>
            <ul>
              <li><a href="#blueprints">Architecture Blueprints</a></li>
              <li><a href="#roles">Dynamic Roles Sandbox</a></li>
              <li><Link to={ROUTES.LOGIN}>Organizational Portal</Link></li>
              <li><Link to={ROUTES.REQUEST_ACCESS}>Tenant Governance</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Refund Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Heftin Academy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
