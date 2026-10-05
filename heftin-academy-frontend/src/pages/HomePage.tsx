import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Building2,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Shield,
  Sliders,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import logoImg from '@/assets/logo.jpeg'

export function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()
  const [navOpen, setNavOpen] = useState(false)
  const [activeRoleKey, setActiveRoleKey] = useState<'admin' | 'hod' | 'teacher' | 'student' | 'superadmin'>('admin')
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const cursorRingRef = useRef<HTMLDivElement>(null)

  // Cursor movement & reveal observer effect
  useEffect(() => {
    // Custom cursor follower
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorDotRef.current && cursorRingRef.current) {
        cursorDotRef.current.style.left = `${e.clientX}px`
        cursorDotRef.current.style.top = `${e.clientY}px`
        cursorRingRef.current.style.left = `${e.clientX}px`
        cursorRingRef.current.style.top = `${e.clientY}px`
      }
    }

    if (window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('mousemove', handleMouseMove)
    }

    // Scroll reveal observer
    const targets = document.querySelectorAll('.reveal')
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach((el) => el.classList.add('is-visible'))
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
      )
      targets.forEach((el) => observer.observe(el))
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        observer.disconnect()
      }
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const roleDefinitions = {
    admin: {
      title: 'Organization Admin',
      scope: 'Delhi Public Academy',
      intro: 'Manages staff accounts, dynamic roles, academic departments, and audit logs.',
      permissionsLine: 'Permissions: View and create users, manage roles and permissions, configure org profile.',
      path: '/dashboard',
      actionLabel: 'Launch Admin View',
    },
    hod: {
      title: 'Head of Department',
      scope: 'Science & Engineering Dept',
      intro: 'Oversees faculty assignments, batch curriculum tracks, and department performance.',
      permissionsLine: 'Permissions: View users, view departments, and manage department batches.',
      path: '/departments',
      actionLabel: 'Launch HOD View',
    },
    teacher: {
      title: 'Faculty / Educator',
      scope: 'Batch 101 Faculty',
      intro: 'Builds mock tests, reviews question analytics, and tracks batch test rankings.',
      permissionsLine: 'Permissions: View users and manage assigned batch exams.',
      path: '/roles/teacher',
      actionLabel: 'Launch Teacher View',
    },
    student: {
      title: 'Student / Aspirant',
      scope: 'Batch 101 · Roll #849',
      intro: 'Takes scheduled mock tests, views live ranking leaderboard, and tracks weakness diagnostic.',
      permissionsLine: 'Permissions: View assigned batch exams and rank results.',
      path: '/workspace/student',
      actionLabel: 'Launch Student Portal',
    },
    superadmin: {
      title: 'Platform SuperAdmin',
      scope: 'Heftin Central Governance',
      intro: 'Controls multi-tenant quotas, enforces organization rights ceilings, and provisions academies.',
      permissionsLine: 'Permissions: Full platform administration across all organizations.',
      path: '/platform/organizations',
      actionLabel: 'Launch Platform Ceilings',
    },
  }

  const currentRole = roleDefinitions[activeRoleKey]

  return (
    <div className="homepage-wrapper" style={{ position: 'relative', overflowX: 'hidden' }}>
      {/* Custom interactive cursor matching lets-go */}
      <div ref={cursorDotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={cursorRingRef} className="cursor-ring" aria-hidden="true" />

      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="brand">
            <img src={logoImg} alt="Heftin Academy" className="brand-logo" />
            <span className="brand-name">Heftin Academy</span>
          </Link>

          <button
            type="button"
            className={`nav-toggle ${navOpen ? 'is-open' : ''}`}
            aria-label="Toggle menu"
            aria-expanded={navOpen}
            onClick={() => setNavOpen(!navOpen)}
          >
            <span />
            <span />
            <span />
          </button>

          <div className={`navbar-collapse ${navOpen ? 'open' : ''}`}>
            <ul>
              <li>
                <a href="#exams" onClick={() => setNavOpen(false)} style={{ whiteSpace: 'nowrap' }}>
                  Exams
                </a>
              </li>
              <li>
                <a href="#how-it-works" onClick={() => setNavOpen(false)} style={{ whiteSpace: 'nowrap' }}>
                  How It Works
                </a>
              </li>
              <li>
                <a href="#why" onClick={() => setNavOpen(false)} style={{ whiteSpace: 'nowrap' }}>
                  Why Heftin
                </a>
              </li>
              <li>
                <a href="#blueprints" onClick={() => setNavOpen(false)} style={{ whiteSpace: 'nowrap' }}>
                  Blueprints
                </a>
              </li>
              <li>
                <a href="#roles" onClick={() => setNavOpen(false)} style={{ whiteSpace: 'nowrap' }}>
                  Roles
                </a>
              </li>
              <li>
                <Link to="/tokens" onClick={() => setNavOpen(false)} style={{ whiteSpace: 'nowrap' }}>
                  Tokens
                </Link>
              </li>
            </ul>
            <div className="nav-actions-inner">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="login" style={{ fontWeight: 700, fontSize: '12.5px', whiteSpace: 'nowrap' }}>
                    Workspace
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      navigate('/login?logged_out=true')
                    }}
                    className="login"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontWeight: 700,
                      fontSize: '12.5px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <LogOut size={14} style={{ color: 'var(--primary)' }} />
                    <span>Log Out</span>
                  </button>
                  <Link to="/dashboard" className="start-button" style={{ whiteSpace: 'nowrap' }}>
                    Dashboard →
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login?mode=student"
                    className="login"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: 700,
                      fontSize: '12.5px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <GraduationCap size={15} style={{ color: 'var(--primary)' }} />
                    <span>Student Login</span>
                  </Link>
                  <Link to="/signup" className="login" style={{ fontWeight: 700, fontSize: '12.5px', whiteSpace: 'nowrap' }}>
                    Sign Up
                  </Link>
                  <Link to="/login" className="login" style={{ fontWeight: 700, fontSize: '12.5px', whiteSpace: 'nowrap' }}>
                    Sign In
                  </Link>
                  <Link to="/dashboard" className="start-button" style={{ whiteSpace: 'nowrap' }}>
                    Get Started →
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section with gemini.mp4 video background */}
        <section className="hero">
          <video
            className="section-bg-video reveal is-visible"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          >
            <source src="/videos/gemini.mp4" type="video/mp4" />
          </video>
          <span className="section-bg-overlay reveal is-visible" aria-hidden="true" />

          <div className="hero-inner">
            <span className="hero-glow" aria-hidden="true" />
            <h1>
              <span className="line-1">Every Mock Test, Bring Closer</span>
              <span className="line-2">to Rank One</span>
            </h1>
            <p>
              Real exam conditions, honest scoring, and institutional governance
              <br />
              with zero-trust roles — built for aspirants and academies who take their rank seriously.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginTop: '18px',
              }}
            >
              <Link to="/dashboard" className="start-button">
                Enter Workspace
              </Link>
              <Link
                to="/login"
                className="start-button"
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(6px)',
                  border: '1px solid var(--border)',
                  color: 'var(--white)',
                }}
              >
                Student Portal →
              </Link>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <strong>50K+</strong>
                <span>Students preparing</span>
              </div>
              <div className="hero-stat">
                <strong>250+</strong>
                <span>Institutions</span>
              </div>
              <div className="hero-stat">
                <strong>99.9%</strong>
                <span>Report accuracy</span>
              </div>
            </div>
          </div>
        </section>

        {/* Marquee Banner */}
        <div className="marquee">
          <div className="marquee-track">
            <span>50K+ Students Preparing</span>
            <span className="marquee-dot">&bull;</span>
            <span>2.4M+ Tests Attempted</span>
            <span className="marquee-dot">&bull;</span>
            <span>Delhi Public Academy</span>
            <span className="marquee-dot">&bull;</span>
            <span>Dynamic Roles &amp; Rights</span>
            <span className="marquee-dot">&bull;</span>
            <span>Ceiling Safeguards</span>
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
            <span>Delhi Public Academy</span>
            <span className="marquee-dot">&bull;</span>
            <span>Dynamic Roles &amp; Rights</span>
            <span className="marquee-dot">&bull;</span>
            <span>Ceiling Safeguards</span>
            <span className="marquee-dot">&bull;</span>
            <span>98% Report Accuracy</span>
            <span className="marquee-dot">&bull;</span>
            <span>Every Mock Test Counts</span>
            <span className="marquee-dot">&bull;</span>
          </div>
        </div>

        {/* Process Section (How It Works) */}
        <section className="process" id="how-it-works">
          <span className="section-texture texture-diamond reveal is-visible" aria-hidden="true" />
          <div className="process-inner reveal is-visible">
            <p className="eyebrow">HOW IT WORKS</p>
            <h2 className="split-heading">
              <span className="split-heading-lead">Three steps to your</span>
              <span className="split-heading-bold">Rank</span>
            </h2>
            <span className="rule-accent" aria-hidden="true" />

            <div className="process-steps">
              <div className="process-step reveal is-visible">
                <div className="process-bubble-cluster">
                  <span className="process-bubble-mini mini-1" aria-hidden="true" />
                  <span className="process-bubble-mini mini-2" aria-hidden="true" />
                  <div className="process-icon icon-1">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M4 20l1-4L15.5 5.5a1.5 1.5 0 0 1 2.12 0l.88.88a1.5 1.5 0 0 1 0 2.12L8 19l-4 1Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M13.5 7.5l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
                <div className="process-step-body">
                  <span className="process-step-pill">STEP 01</span>
                  <h3>Pick Your Exam &amp; Batch</h3>
                  <p>Banking, SSC, Railways, or custom institutional cohorts — start with a path built for your goal.</p>
                  <span className="process-step-stat">12+ exam categories</span>
                </div>
              </div>

              <div className="process-step reveal is-visible">
                <div className="process-bubble-cluster">
                  <span className="process-bubble-mini mini-1" aria-hidden="true" />
                  <span className="process-bubble-mini mini-2" aria-hidden="true" />
                  <div className="process-icon icon-2">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M4 20V10M12 20V4M20 20v-7"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
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
                  <span className="process-bubble-mini mini-1" aria-hidden="true" />
                  <span className="process-bubble-mini mini-2" aria-hidden="true" />
                  <div className="process-icon icon-3">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M4 17l5-5 4 4 7-9"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14 7h6v6"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
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

            <Link to="/dashboard" className="process-cta">
              Start Practicing &rarr;
            </Link>
          </div>
        </section>

        {/* Why Heftin Section with video and floating cards */}
        <section className="why" id="why">
          <video
            className="section-bg-video reveal is-visible"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          >
            <source src="/videos/gemini.mp4" type="video/mp4" />
          </video>
          <span className="section-bg-overlay light reveal is-visible" aria-hidden="true" />

          <div className="why-inner reveal is-visible">
            <div className="why-copy">
              <p className="eyebrow">THE HEFTIN DIFFERENCE</p>
              <h2 className="split-heading">
                <span className="split-heading-lead">Why</span>
                <span className="split-heading-bold">Heftin Academy</span>
              </h2>
              <p>
                Heftin Academy combines high-fidelity mock test series with institutional role governance,
                giving academies full control over batches, rights, and performance intelligence.
              </p>
              <Link to="/dashboard" className="why-cta">
                See your dashboard &rarr;
              </Link>
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

        {/* Stat Band Section */}
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
                  <div className="stat">
                    <strong>2.4M+</strong>
                    <span>Tests attempted</span>
                  </div>
                  <div className="stat">
                    <strong>18</strong>
                    <span>Exam categories</span>
                  </div>
                  <div className="stat">
                    <strong>92%</strong>
                    <span>Say scoring felt honest</span>
                  </div>
                  <div className="stat">
                    <strong>4.8/5</strong>
                    <span>Average rating</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-mock corner-marks on-dark">
                <div className="dashboard-mock-header">
                  <div className="dashboard-mock-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="dashboard-mock-title">Your Performance</span>
                </div>
                <div className="dashboard-mock-body">
                  <div className="dashboard-mock-score">
                    <div className="score-ring">
                      <strong>84%</strong>
                    </div>
                    <span>Overall accuracy</span>
                  </div>
                  <div className="dashboard-mock-chart">
                    <div className="bar bar-tone-0" style={{ '--h': '38%', height: '38%' } as React.CSSProperties} />
                    <div className="bar bar-tone-1" style={{ '--h': '52%', height: '52%' } as React.CSSProperties} />
                    <div className="bar bar-tone-2" style={{ '--h': '45%', height: '45%' } as React.CSSProperties} />
                    <div className="bar bar-tone-3" style={{ '--h': '60%', height: '60%' } as React.CSSProperties} />
                    <div className="bar bar-tone-4" style={{ '--h': '48%', height: '48%' } as React.CSSProperties} />
                    <div className="bar bar-tone-0" style={{ '--h': '65%', height: '65%' } as React.CSSProperties} />
                    <div className="bar bar-tone-1" style={{ '--h': '58%', height: '58%' } as React.CSSProperties} />
                    <div className="bar bar-tone-2" style={{ '--h': '72%', height: '72%' } as React.CSSProperties} />
                    <div className="bar bar-tone-3" style={{ '--h': '68%', height: '68%' } as React.CSSProperties} />
                    <div className="bar bar-tone-4" style={{ '--h': '78%', height: '78%' } as React.CSSProperties} />
                    <div className="bar bar-tone-0" style={{ '--h': '74%', height: '74%' } as React.CSSProperties} />
                    <div className="bar bar-current" style={{ '--h': '90%', height: '90%' } as React.CSSProperties} />
                  </div>
                </div>
                <p className="dashboard-mock-foot">↑ 12% from last test</p>
              </div>
            </div>
          </div>
        </section>

        {/* Exams Section with GRPSTUDY.mp4 background */}
        <section className="exams" id="exams">
          <video
            className="section-bg-video reveal is-visible"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          >
            <source src="/videos/GRPSTUDY.mp4" type="video/mp4" />
          </video>
          <span className="section-bg-overlay light reveal is-visible" aria-hidden="true" />
          <span className="section-texture texture-dots reveal is-visible" aria-hidden="true" />

          <div className="exams-inner reveal is-visible">
            <p className="eyebrow">PREPARE FOR YOUR GOAL</p>
            <h2 className="split-heading">
              <span className="split-heading-lead">Choose your</span>
              <span className="split-heading-bold">Exam</span>
            </h2>
            <p className="exams-competitive-line">
              <span className="live-dot" aria-hidden="true" />
              2.4M+ aspirants are already racing for Rank One — where do you stand?
            </p>

            <div className="exam-grid">
              <Link to="/dashboard" className="exam-card reveal is-visible">
                <span className="exam-card-rank">01</span>
                <img src="/images/img1.jpg" alt="Banking exam preparation" className="exam-card-img" />
                <h3>Banking</h3>
                <p>IBPS, SBI, RRB and more.</p>
                <span className="exam-card-stat">
                  <span className="live-dot" aria-hidden="true" />
                  8,240 competing this week
                </span>
                <span className="exam-card-cta">Enter the race &rarr;</span>
              </Link>

              <Link to="/dashboard" className="exam-card reveal is-visible">
                <span className="exam-card-rank">02</span>
                <img src="/images/img3.jpg" alt="SSC exam preparation" className="exam-card-img" />
                <h3>SSC</h3>
                <p>CGL, CHSL, CPO and more.</p>
                <span className="exam-card-stat">
                  <span className="live-dot" aria-hidden="true" />
                  6,150 competing this week
                </span>
                <span className="exam-card-cta">Enter the race &rarr;</span>
              </Link>

              <Link to="/dashboard" className="exam-card reveal is-visible">
                <span className="exam-card-rank">03</span>
                <img src="/images/img4.jpg" alt="Railways exam preparation" className="exam-card-img" />
                <h3>Railways</h3>
                <p>Prepare for railway exams.</p>
                <span className="exam-card-stat">
                  <span className="live-dot" aria-hidden="true" />
                  4,920 competing this week
                </span>
                <span className="exam-card-cta">Enter the race &rarr;</span>
              </Link>
            </div>

            <Link to="/dashboard" className="exams-view-all">
              View all competitive &amp; government exams &rarr;
            </Link>
          </div>
        </section>

        {/* Features Section with STUDY.mp4 background */}
        <section className="features">
          <div className="features-inner reveal is-visible">
            <div className="features-media corner-marks">
              <video
                className="features-video reveal is-visible"
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
              >
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
                      <path
                        d="M8 12.5l2.5 2.5L16 9.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3>Real exam simulation</h3>
                  <p>Timed sections, negative marking, and the same interface you'll see on test day.</p>
                </div>

                <div className="feature reveal is-visible">
                  <span className="feature-num">02</span>
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M4 20V10M12 20V4M20 20v-7"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3>Detailed analytics</h3>
                  <p>See exactly which topics are costing you marks, not just your overall score.</p>
                </div>

                <div className="feature reveal is-visible">
                  <span className="feature-num">03</span>
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5 4.5h9a2.5 2.5 0 012.5 2.5v12.5H7.5A2.5 2.5 0 015 16.9V4.5z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
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

        {/* The 3 Core Blueprints Showcase */}
        <section
          className="blueprints-section"
          id="blueprints"
          style={{
            padding: '80px 20px',
            background: 'var(--primary)',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            position: 'relative',
          }}
        >
          <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(204, 230, 232, 0.3)',
                  marginBottom: '12px',
                }}
              >
                <Sparkles size={12} color="#ffffff" />
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#ffffff',
                    fontFamily: 'monospace',
                  }}
                >
                  Phase 1 Architecture
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
                <span style={{ color: 'var(--border)', fontWeight: 500 }}>The 3 Core </span>
                <span>Blueprints</span>
              </h2>
              <div
                style={{
                  width: '48px',
                  height: '2px',
                  background: 'var(--border)',
                  margin: '14px auto',
                  borderRadius: '9999px',
                }}
              />
              <p
                style={{
                  fontSize: '13.5px',
                  color: '#ffffff',
                  opacity: 0.92,
                  margin: '0 auto',
                  lineHeight: 1.6,
                }}
              >
                Strict rights-based navigation, immutable ceilings, and zero-trust role boundaries.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '24px',
              }}
            >
              {/* Blueprint 01: Organization Admin Dashboard */}
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
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'var(--primary)',
                        display: 'grid',
                        placeItems: 'center',
                        color: '#ffffff',
                      }}
                    >
                      <LayoutDashboard size={18} />
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

                  <h3
                    style={{
                      fontSize: '17px',
                      fontWeight: 700,
                      color: 'var(--error)',
                      margin: '0 0 8px',
                      lineHeight: 1.3,
                    }}
                  >
                    Organization Admin Dashboard
                  </h3>
                  <p
                    style={{
                      fontSize: '12.5px',
                      color: 'var(--error)',
                      opacity: 0.85,
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    Real-time workspace for People, Roles, Departments, Batches, and Audit logs driven by effective rights.
                  </p>

                  <div
                    style={{
                      marginTop: '16px',
                      paddingTop: '14px',
                      borderTop: '1px solid var(--border)',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: 'var(--primary)',
                        background: 'rgba(204, 230, 232, 0.3)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      Effective Rights
                    </span>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: 'var(--error)',
                        background: '#f8fcfe',
                        border: '1px solid var(--border)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      Live Workspace
                    </span>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#ffffff',
                    background: 'var(--primary)',
                    borderRadius: '12px',
                    padding: '10px 16px',
                    textDecoration: 'none',
                    marginTop: '22px',
                    transition: 'opacity 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.92')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  <span>Open Admin Dashboard</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Blueprint 02: Role & Rights Builder */}
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
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'var(--primary)',
                        display: 'grid',
                        placeItems: 'center',
                        color: '#ffffff',
                      }}
                    >
                      <Sliders size={18} />
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

                  <h3
                    style={{
                      fontSize: '17px',
                      fontWeight: 700,
                      color: 'var(--error)',
                      margin: '0 0 8px',
                      lineHeight: 1.3,
                    }}
                  >
                    Role &amp; Rights Builder
                  </h3>
                  <p
                    style={{
                      fontSize: '12.5px',
                      color: 'var(--error)',
                      opacity: 0.85,
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    Dynamic custom role editor featuring immutable ceiling barriers that stop privilege self-escalation.
                  </p>

                  <div
                    style={{
                      marginTop: '16px',
                      paddingTop: '14px',
                      borderTop: '1px solid var(--border)',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: 'var(--primary)',
                        background: 'rgba(204, 230, 232, 0.3)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      Immutable Ceilings
                    </span>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: 'var(--error)',
                        background: '#f8fcfe',
                        border: '1px solid var(--border)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      Anti-Escalation
                    </span>
                  </div>
                </div>

                <Link
                  to="/roles/teacher"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#ffffff',
                    background: 'var(--primary)',
                    borderRadius: '12px',
                    padding: '10px 16px',
                    textDecoration: 'none',
                    marginTop: '22px',
                    transition: 'opacity 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.92')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  <span>Open Role Builder</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Blueprint 03: SuperAdmin Organization Control */}
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
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'var(--primary)',
                        display: 'grid',
                        placeItems: 'center',
                        color: '#ffffff',
                      }}
                    >
                      <Building2 size={18} />
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

                  <h3
                    style={{
                      fontSize: '17px',
                      fontWeight: 700,
                      color: 'var(--error)',
                      margin: '0 0 8px',
                      lineHeight: 1.3,
                    }}
                  >
                    SuperAdmin Organization Control
                  </h3>
                  <p
                    style={{
                      fontSize: '12.5px',
                      color: 'var(--error)',
                      opacity: 0.85,
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    Multi-tenant provisioner with organization seat limits, quota bars, and master rights allocation.
                  </p>

                  <div
                    style={{
                      marginTop: '16px',
                      paddingTop: '14px',
                      borderTop: '1px solid var(--border)',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: 'var(--primary)',
                        background: 'rgba(204, 230, 232, 0.3)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      Tenant Quotas
                    </span>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: 'var(--error)',
                        background: '#f8fcfe',
                        border: '1px solid var(--border)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      Platform Ceilings
                    </span>
                  </div>
                </div>

                <Link
                  to="/platform/organizations"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#ffffff',
                    background: 'var(--primary)',
                    borderRadius: '12px',
                    padding: '10px 16px',
                    textDecoration: 'none',
                    marginTop: '22px',
                    transition: 'opacity 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.92')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  <span>Open SuperAdmin Ceilings</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Dynamic Roles & Single-Line English Permissions */}
        <section className="roles-sandbox-section" id="roles" style={{ padding: '70px 20px', background: '#f8fcfe', borderTop: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
              <div>
                <p className="eyebrow">ACCESS CONTROL</p>
                <h2 className="split-heading" style={{ margin: '4px 0' }}>
                  <span className="split-heading-lead">Dynamic Roles &amp;</span>
                  <span className="split-heading-bold">Rights</span>
                </h2>
                <p style={{ fontSize: '12.5px', color: 'var(--error)', opacity: 0.85, margin: '4px 0 0' }}>
                  Select a role to verify its effective rights summary in plain English.
                </p>
              </div>

              {/* Role switcher buttons */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {(['admin', 'hod', 'teacher', 'student', 'superadmin'] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveRoleKey(key)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      border: activeRoleKey === key ? '1px solid var(--primary)' : '1px solid var(--border)',
                      background: activeRoleKey === key ? 'var(--primary)' : '#ffffff',
                      color: activeRoleKey === key ? '#ffffff' : 'var(--error)',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {key === 'admin'
                      ? 'Admin'
                      : key === 'hod'
                      ? 'HOD'
                      : key === 'teacher'
                      ? 'Teacher'
                      : key === 'student'
                      ? 'Student'
                      : 'SuperAdmin'}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                <div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'var(--primary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      fontFamily: 'monospace',
                    }}
                  >
                    {currentRole.scope}
                  </span>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--error)', margin: '4px 0 0' }}>
                    {currentRole.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(currentRole.path)}
                  className="start-button"
                  style={{
                    padding: '8px 16px',
                    fontSize: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{currentRole.actionLabel}</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--error)', opacity: 0.9, lineHeight: 1.5, margin: '16px 0 12px' }}>
                {currentRole.intro}
              </p>

              {/* Single line English telling the rights */}
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
                <Shield size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span style={{ fontSize: '12.5px', color: 'var(--error)', fontWeight: 600 }}>
                  {currentRole.permissionsLine}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="testimonial">
          <div className="testimonial-inner reveal is-visible corner-marks on-dark">
            <span className="quote-mark">&ldquo;</span>
            <p className="quote">
              Heftin's mocks felt closer to my actual exam than anything else I tried. The analytics told me exactly
              where I was losing marks.
            </p>
            <div className="testimonial-author">
              <span className="name">Ananya R.</span>
              <span className="role">SSC CGL, Rank 214</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer matching lets-go site-footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">
              <img src={logoImg} alt="Heftin Academy" className="brand-logo" />
              <span>Heftin Academy</span>
            </div>
            <p>Every mock test brings you closer to rank one.</p>
            <p className="footer-contact">
              Contact: <a href="mailto:contact@heftin.com">contact@heftin.com</a>
            </p>
          </div>

          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li>
                <a href="#exams">Test Series</a>
              </li>
              <li>
                <Link to="/dashboard">Performance</Link>
              </li>
              <li>
                <Link to="/roles">Role Builder</Link>
              </li>
              <li>
                <Link to="/platform/organizations">Ceilings</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Workspaces</h4>
            <ul>
              <li>
                <Link to="/dashboard">Org Admin</Link>
              </li>
              <li>
                <Link to="/departments">Department HOD</Link>
              </li>
              <li>
                <Link to="/roles/teacher">Faculty View</Link>
              </li>
              <li>
                <Link to="/login">Student Access</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Resources</h4>
            <ul>
              <li>
                <Link to="/tokens">Design Tokens (tokens.css)</Link>
              </li>
              <li>
                <a href="#blueprints">Architecture Blueprints</a>
              </li>
              <li>
                <Link to="/roles">Rights Catalog</Link>
              </li>
              <li>
                <a href="#how-it-works">How It Works</a>
              </li>
              <li>
                <a href="#why">Why Heftin</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li>
                <a href="#blueprints">Privacy Policy</a>
              </li>
              <li>
                <a href="#blueprints">Terms of Service</a>
              </li>
              <li>
                <a href="#blueprints">Phase 1 Governance</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Heftin Academy Technologies. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
