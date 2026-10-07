import { useEffect, useRef, useState } from 'react'
import { ROUTES } from '@/lib/constants'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import '@/landing.css'

export function HomePage() {
  const { isAuthenticated, logout } = useAuth()
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
              <li><a href="#exams" style={{ whiteSpace: 'nowrap' }} onClick={() => setIsMobileMenuOpen(false)}>Explore</a></li>
              <li><Link to={ROUTES.REQUEST_ACCESS} style={{ whiteSpace: 'nowrap' }} onClick={() => setIsMobileMenuOpen(false)}>For Institutes</Link></li>
              <li><a href="#about" style={{ whiteSpace: 'nowrap' }} onClick={() => setIsMobileMenuOpen(false)}>About</a></li>
              <li><a href="#product" style={{ whiteSpace: 'nowrap' }} onClick={() => setIsMobileMenuOpen(false)}>Product</a></li>
              <li><Link to={ROUTES.CONTACT} style={{ whiteSpace: 'nowrap' }} onClick={() => setIsMobileMenuOpen(false)}>Contact</Link></li>
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

        {/* 5. About / Why Section */}
        <section className="why" id="about">
          <video className="section-bg-video reveal is-visible" data-pool="fixed" autoPlay muted loop playsInline aria-hidden="true">
            <source src="/videos/gemini.mp4" type="video/mp4" />
          </video>
          <span className="section-bg-overlay light reveal is-visible" aria-hidden="true"></span>

          <div className="why-inner reveal is-visible">
            <div className="why-copy">
              <p className="eyebrow">ABOUT US &bull; THE HEFTIN DIFFERENCE</p>
              <h2 className="split-heading">
                <span className="split-heading-lead">Why </span>
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

        {/* 8. Product Intro / Features Section */}
        <section className="features" id="product">
          <div className="features-inner reveal is-visible">
            <div className="features-media corner-marks">
              <video className="features-video reveal is-visible" data-pool="random" autoPlay muted loop playsInline aria-hidden="true">
                <source src="/videos/STUDY.mp4" type="video/mp4" />
              </video>
            </div>

            <div className="features-copy">
              <p className="eyebrow">PRODUCT TOUR &bull; WHY IT WORKS</p>
              <h2 className="split-heading">
                <span className="split-heading-lead">Everything you need, </span>
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

        {/* 9. Testimonial Section */}
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

      {/* 10. Site Footer */}
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
              <li><a href="#product">Product Overview</a></li>
              <li><Link to={`${ROUTES.LOGIN}?role=student`}>Test Series</Link></li>
              <li><Link to={ROUTES.WORKSPACE}>Performance</Link></li>
              <li><Link to={ROUTES.REQUEST_ACCESS}>Pricing</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><Link to={ROUTES.REQUEST_ACCESS}>For Institutes</Link></li>
              <li><Link to={ROUTES.REQUEST_ACCESS}>Activate Invite / Onboarding</Link></li>
              <li><Link to={ROUTES.HOME}>Careers</Link></li>
              <li><Link to={ROUTES.CONTACT}>Contact</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Platform</h4>
            <ul>
              <li><Link to={ROUTES.LOGIN}>Organizational Portal</Link></li>
              <li><Link to={ROUTES.REQUEST_ACCESS}>Enterprise Solutions</Link></li>
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
