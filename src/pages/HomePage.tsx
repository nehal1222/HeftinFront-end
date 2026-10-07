import { useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  GraduationCap,
  Menu,
  ShieldCheck,
  User,
  X,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'

export function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-surface font-sans text-foreground">
      {/* ========================================================================= */}
      {/* 1. TOP NAVBAR */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface-elevated/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-control bg-primary text-primary-foreground shadow-sm">
              <GraduationCap size={20} aria-hidden="true" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-heading-sm font-semibold text-foreground-strong">
                Heftin
              </span>
              <span className="text-caption font-medium text-primary">Academy</span>
            </div>
          </Link>

          {/* Center Navigation Links (Clean product links, NO auth sample) */}
          <nav className="hidden md:flex items-center gap-7 text-body-sm font-medium text-muted">
            <a href="#categories" className="transition-colors hover:text-foreground">
              Categories
            </a>
            <a href="#features" className="transition-colors hover:text-foreground">
              Platform Features
            </a>
            <a href="#test-series" className="transition-colors hover:text-foreground">
              Test Series
            </a>
            <a href="#institutions" className="transition-colors hover:text-foreground">
              For Institutions
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to={ROUTES.LOGIN}
              className="rounded-control border border-border bg-surface px-4 py-2 text-body-sm font-semibold text-foreground-strong transition-colors hover:border-primary hover:text-primary"
            >
              Sign In
            </Link>
            <Link
              to={ROUTES.REQUEST_ACCESS}
              className="rounded-control bg-primary px-4 py-2 text-body-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark shadow-sm"
            >
              Request Access
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-control p-2 text-muted hover:text-foreground hover:bg-surface"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="border-b border-border bg-surface-elevated px-4 pt-2 pb-6 md:hidden">
            <nav className="flex flex-col space-y-3 text-body-sm font-medium">
              <a
                href="#categories"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-foreground-strong hover:text-primary"
              >
                Categories
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-foreground-strong hover:text-primary"
              >
                Platform Features
              </a>
              <a
                href="#test-series"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-foreground-strong hover:text-primary"
              >
                Test Series
              </a>
              <a
                href="#institutions"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-foreground-strong hover:text-primary"
              >
                For Institutions
              </a>
            </nav>

            <div className="mt-5 flex flex-col gap-2 pt-4 border-t border-border">
              <Link
                to={ROUTES.LOGIN}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded-control border border-border bg-surface py-2.5 text-body-sm font-semibold text-foreground-strong"
              >
                Sign In
              </Link>
              <Link
                to={ROUTES.REQUEST_ACCESS}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded-control bg-primary py-2.5 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark"
              >
                Request Access
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-surface-elevated to-surface py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1 text-caption font-semibold text-primary shadow-xs">
            <ShieldCheck size={14} />
            UPSC CSE 2026 Examination & Evaluation Platform
          </div>

          <h1 className="mx-auto mt-6 max-w-4xl font-display text-heading-xl font-semibold tracking-tight text-foreground-strong sm:text-display">
            Precision Exam Simulation & Faculty Evaluation for Civil Services
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-body text-muted leading-relaxed">
            Empowering premier coaching institutions and independent aspirants with timed UPSC mock drills,
            faculty-guided mains answer evaluation, and diagnostic preparation analytics.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              to={`${ROUTES.LOGIN}?role=student`}
              className="inline-flex items-center gap-2 rounded-control bg-primary px-6 py-3 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors shadow-sm"
            >
              Enter Learning Workspace <ArrowRight size={15} />
            </Link>
            <Link
              to={ROUTES.REQUEST_ACCESS}
              className="inline-flex items-center gap-2 rounded-control border border-border bg-surface px-5 py-3 text-body-sm font-semibold text-foreground-strong hover:border-primary hover:text-primary transition-colors"
            >
              Institutional Onboarding
            </Link>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4 text-left">
            <div className="rounded-card border border-border bg-surface-elevated p-4">
              <span className="text-caption font-semibold text-muted uppercase">Question Bank</span>
              <p className="mt-1 font-display text-heading-sm font-bold text-foreground-strong">10,000+</p>
              <p className="text-caption text-muted">UPSC Prelims & Mains</p>
            </div>
            <div className="rounded-card border border-border bg-surface-elevated p-4">
              <span className="text-caption font-semibold text-muted uppercase">Two Categories</span>
              <p className="mt-1 font-display text-heading-sm font-bold text-primary">Org & Individual</p>
              <p className="text-caption text-muted">Dedicated workflows</p>
            </div>
            <div className="rounded-card border border-border bg-surface-elevated p-4">
              <span className="text-caption font-semibold text-muted uppercase">Faculty Turnaround</span>
              <p className="mt-1 font-display text-heading-sm font-bold text-foreground-strong">&lt; 48 Hours</p>
              <p className="text-caption text-muted">Mains essay grading</p>
            </div>
            <div className="rounded-card border border-border bg-surface-elevated p-4">
              <span className="text-caption font-semibold text-muted uppercase">Simulation Accuracy</span>
              <p className="mt-1 font-display text-heading-sm font-bold text-primary">100%</p>
              <p className="text-caption text-muted">Negative mark calculus</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. TWO DEDICATED CATEGORIES */}
      {/* ========================================================================= */}
      <section id="categories" className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-caption font-semibold uppercase tracking-wider text-primary">
              Core Architecture
            </span>
            <h2 className="mt-2 font-display text-heading-lg font-semibold text-foreground-strong">
              Built for Two Distinct User Categories
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-body-sm text-muted">
              Choose your dedicated workspace tailored to your preparation style or institutional role.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {/* Category 1: Organizational */}
            <div className="flex flex-col justify-between rounded-card border border-border bg-surface-elevated p-6 sm:p-8 shadow-sm transition-all hover:border-primary">
              <div>
                <div className="flex items-center justify-between">
                  <div className="grid size-11 place-items-center rounded-control bg-primary-soft text-primary-dark">
                    <Building2 size={22} />
                  </div>
                  <span className="rounded-full bg-surface px-3 py-1 text-caption font-semibold text-muted uppercase">
                    Institutions & Cohorts
                  </span>
                </div>

                <h3 className="mt-5 font-display text-heading-sm font-semibold text-foreground-strong">
                  Organizational Category
                </h3>
                <p className="mt-2 text-body-sm text-muted leading-relaxed">
                  Tailored for civil services coaching academies, colleges, and structured faculty batches.
                  Enables synchronized mock schedules, faculty evaluation desks, and batch attendance.
                </p>

                <div className="mt-6 space-y-2.5 border-t border-border pt-5">
                  <div className="flex items-start gap-2.5 text-body-sm text-foreground-strong">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
                    <span>Synchronized batch schedules & cohort performance rankings</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-body-sm text-foreground-strong">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
                    <span>Faculty evaluation queue with rubric scoring & mentor feedback</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-body-sm text-foreground-strong">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
                    <span>Administrative seat allocation and student roster management</span>
                  </div>
                </div>

                {/* Quick Role Fill Pills */}
                <div className="mt-6 rounded-control border border-border bg-surface p-3">
                  <span className="text-caption font-semibold text-muted uppercase">Select Persona:</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Link
                      to={`${ROUTES.LOGIN}?role=student`}
                      className="rounded-control border border-border bg-surface-elevated px-3 py-1 text-caption font-semibold text-foreground-strong hover:border-primary hover:text-primary transition-colors"
                    >
                      Enrolled Student
                    </Link>
                    <Link
                      to={`${ROUTES.LOGIN}?role=faculty`}
                      className="rounded-control border border-border bg-surface-elevated px-3 py-1 text-caption font-semibold text-foreground-strong hover:border-primary hover:text-primary transition-colors"
                    >
                      Faculty Evaluator
                    </Link>
                    <Link
                      to={`${ROUTES.LOGIN}?role=org_admin`}
                      className="rounded-control border border-border bg-surface-elevated px-3 py-1 text-caption font-semibold text-foreground-strong hover:border-primary hover:text-primary transition-colors"
                    >
                      Academy Admin
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-border pt-5">
                <Link
                  to={`${ROUTES.LOGIN}?role=student`}
                  className="flex w-full items-center justify-center gap-2 rounded-control bg-primary py-2.5 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors shadow-sm"
                >
                  Enter Organizational Workspace <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Category 2: Individual */}
            <div className="flex flex-col justify-between rounded-card border border-border bg-surface-elevated p-6 sm:p-8 shadow-sm transition-all hover:border-primary">
              <div>
                <div className="flex items-center justify-between">
                  <div className="grid size-11 place-items-center rounded-control bg-primary-soft text-primary-dark">
                    <User size={22} />
                  </div>
                  <span className="rounded-full bg-surface px-3 py-1 text-caption font-semibold text-muted uppercase">
                    Self-Paced Aspirants
                  </span>
                </div>

                <h3 className="mt-5 font-display text-heading-sm font-semibold text-foreground-strong">
                  Individual Category
                </h3>
                <p className="mt-2 text-body-sm text-muted leading-relaxed">
                  Crafted for independent aspirants preparing for UPSC CSE at their own pace.
                  Features self-administered exam drills, study streak mechanics, and subject accuracy diagnostics.
                </p>

                <div className="mt-6 space-y-2.5 border-t border-border pt-5">
                  <div className="flex items-start gap-2.5 text-body-sm text-foreground-strong">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
                    <span>Personalized study streak tracking and daily check-in motivation</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-body-sm text-foreground-strong">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
                    <span>On-demand full-length mocks and sectional question drills</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-body-sm text-foreground-strong">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
                    <span>Comprehensive answer key breakdowns with detailed constitutional notes</span>
                  </div>
                </div>

                {/* Single Learner Profile */}
                <div className="mt-6 rounded-control border border-border bg-surface p-3">
                  <span className="text-caption font-semibold text-muted uppercase">Aspirant Profile:</span>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-body-sm font-semibold text-foreground-strong">
                      Independent Civil Services Aspirant
                    </span>
                    <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-caption font-bold text-primary-dark">
                      Scholar Plan
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-border pt-5">
                <Link
                  to={`${ROUTES.LOGIN}?role=individual`}
                  className="flex w-full items-center justify-center gap-2 rounded-control bg-primary py-2.5 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors shadow-sm"
                >
                  Enter Individual Workspace <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PLATFORM FEATURES */}
      {/* ========================================================================= */}
      <section id="features" className="border-b border-border bg-surface-elevated py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-caption font-semibold uppercase tracking-wider text-primary">
              Core Capabilities
            </span>
            <h2 className="mt-2 font-display text-heading-lg font-semibold text-foreground-strong">
              Engineered for Rigorous Exam Preparation
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-body-sm text-muted">
              Everything needed to simulate, evaluate, and master the UPSC syllabus.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-card border border-border bg-surface p-5 shadow-xs">
              <div className="grid size-10 place-items-center rounded-control bg-primary-soft text-primary-dark">
                <FileText size={20} />
              </div>
              <h3 className="mt-4 font-semibold text-body text-foreground-strong">
                Live Exam Simulator
              </h3>
              <p className="mt-1.5 text-caption text-muted leading-relaxed">
                Experience authentic Prelims drills with countdown timers, question palettes, and negative marks calculation.
              </p>
            </div>

            <div className="rounded-card border border-border bg-surface p-5 shadow-xs">
              <div className="grid size-10 place-items-center rounded-control bg-primary-soft text-primary-dark">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="mt-4 font-semibold text-body text-foreground-strong">
                Faculty Grading Desk
              </h3>
              <p className="mt-1.5 text-caption text-muted leading-relaxed">
                Structured mains evaluation workflow for faculties to assign marks, annotate answers, and write feedback.
              </p>
            </div>

            <div className="rounded-card border border-border bg-surface p-5 shadow-xs">
              <div className="grid size-10 place-items-center rounded-control bg-primary-soft text-primary-dark">
                <BookOpen size={20} />
              </div>
              <h3 className="mt-4 font-semibold text-body text-foreground-strong">
                High-Yield Modules
              </h3>
              <p className="mt-1.5 text-caption text-muted leading-relaxed">
                Structured revision digests for Indian Polity, CSAT speed methods, Environment protocols, and Modern History.
              </p>
            </div>

            <div className="rounded-card border border-border bg-surface p-5 shadow-xs">
              <div className="grid size-10 place-items-center rounded-control bg-primary-soft text-primary-dark">
                <BarChart3 size={20} />
              </div>
              <h3 className="mt-4 font-semibold text-body text-foreground-strong">
                Performance Diagnostics
              </h3>
              <p className="mt-1.5 text-caption text-muted leading-relaxed">
                Detailed breakdowns of subject accuracy percentages, average seconds per question, and high-yield focus areas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. TEST SERIES PREVIEW */}
      {/* ========================================================================= */}
      <section id="test-series" className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-caption font-semibold uppercase tracking-wider text-primary">
                Test Series Catalog
              </span>
              <h2 className="mt-2 font-display text-heading-lg font-semibold text-foreground-strong">
                Scheduled UPSC Mock Papers
              </h2>
              <p className="mt-1 text-body-sm text-muted">
                Standard full-length papers and sectional drills ready to attempt in the simulator.
              </p>
            </div>

            <Link
              to={`${ROUTES.LOGIN}?role=student`}
              className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-primary hover:underline"
            >
              View all test series <ChevronRight size={16} />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="flex flex-col justify-between rounded-card border border-border bg-surface-elevated p-5 shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-primary-soft text-primary-dark px-2.5 py-0.5 text-caption font-bold">
                    General Studies I
                  </span>
                  <span className="rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-caption font-bold">
                    LIVE
                  </span>
                </div>
                <h3 className="mt-3 font-semibold text-body text-foreground-strong">
                  UPSC GS Paper I - Full Length Mock 04
                </h3>
                <div className="mt-3 flex items-center gap-3 text-caption text-muted">
                  <span className="flex items-center gap-1"><Clock size={13} /> 120 mins</span>
                  <span>·</span>
                  <span>100 Questions</span>
                  <span>·</span>
                  <span>200 Marks</span>
                </div>
              </div>

              <div className="mt-5 border-t border-border pt-4">
                <Link
                  to={`${ROUTES.LOGIN}?role=student`}
                  className="flex w-full items-center justify-center rounded-control bg-primary py-2 text-caption font-semibold text-primary-foreground hover:bg-primary-dark transition-colors"
                >
                  Attempt Mock Drill
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-card border border-border bg-surface-elevated p-5 shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-primary-soft text-primary-dark px-2.5 py-0.5 text-caption font-bold">
                    CSAT Paper II
                  </span>
                  <span className="text-caption text-muted">Tomorrow 10:00 AM</span>
                </div>
                <h3 className="mt-3 font-semibold text-body text-foreground-strong">
                  CSAT Aptitude & Comprehension Drill 02
                </h3>
                <div className="mt-3 flex items-center gap-3 text-caption text-muted">
                  <span className="flex items-center gap-1"><Clock size={13} /> 60 mins</span>
                  <span>·</span>
                  <span>50 Questions</span>
                  <span>·</span>
                  <span>100 Marks</span>
                </div>
              </div>

              <div className="mt-5 border-t border-border pt-4">
                <Link
                  to={`${ROUTES.LOGIN}?role=student`}
                  className="flex w-full items-center justify-center rounded-control border border-border bg-surface py-2 text-caption font-semibold text-foreground-strong hover:border-primary hover:text-primary transition-colors"
                >
                  View Paper Syllabus
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-card border border-border bg-surface-elevated p-5 shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-primary-soft text-primary-dark px-2.5 py-0.5 text-caption font-bold">
                    Sectional Drill
                  </span>
                  <span className="text-caption text-muted">Oct 9, 2026</span>
                </div>
                <h3 className="mt-3 font-semibold text-body text-foreground-strong">
                  Indian Polity & Constitutional Framework
                </h3>
                <div className="mt-3 flex items-center gap-3 text-caption text-muted">
                  <span className="flex items-center gap-1"><Clock size={13} /> 45 mins</span>
                  <span>·</span>
                  <span>35 Questions</span>
                  <span>·</span>
                  <span>70 Marks</span>
                </div>
              </div>

              <div className="mt-5 border-t border-border pt-4">
                <Link
                  to={`${ROUTES.LOGIN}?role=student`}
                  className="flex w-full items-center justify-center rounded-control border border-border bg-surface py-2 text-caption font-semibold text-foreground-strong hover:border-primary hover:text-primary transition-colors"
                >
                  View Paper Syllabus
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FOR INSTITUTIONS CALLOUT */}
      {/* ========================================================================= */}
      <section id="institutions" className="border-b border-border bg-surface-elevated py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-card border border-border bg-surface p-8 sm:p-12 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-caption font-semibold uppercase tracking-wider text-primary">
                Institutional Partnerships
              </span>
              <h2 className="mt-2 font-display text-heading-md font-semibold text-foreground-strong">
                Ready to Upgrade Your Academy's Exam Infrastructure?
              </h2>
              <p className="mt-2 text-body-sm text-muted leading-relaxed">
                Connect your coaching center cohorts, onboard faculty evaluators, and deliver institutional
                mock tests under your academy branding with automated license quotas and ceiling governance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                to={ROUTES.REQUEST_ACCESS}
                className="inline-flex items-center justify-center rounded-control bg-primary px-6 py-3 text-body-sm font-semibold text-primary-foreground hover:bg-primary-dark transition-colors shadow-sm"
              >
                Request Academy Access
              </Link>
              <Link
                to={`${ROUTES.LOGIN}?role=org_admin`}
                className="inline-flex items-center justify-center rounded-control border border-border bg-surface-elevated px-5 py-3 text-body-sm font-semibold text-foreground-strong hover:border-primary transition-colors"
              >
                Administrator Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PRODUCTION FOOTER */}
      {/* ========================================================================= */}
      <footer className="bg-surface py-12 text-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 pb-10 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                <div className="grid size-8 place-items-center rounded-control bg-primary text-primary-foreground shadow-sm">
                  <GraduationCap size={18} />
                </div>
                <span className="font-display text-heading-xs font-semibold text-foreground-strong">
                  Heftin Academy
                </span>
              </div>
              <p className="mt-3 text-caption text-muted leading-relaxed">
                Specialized exam management and evaluation infrastructure for UPSC civil services coaching.
              </p>
            </div>

            <div>
              <p className="text-caption font-semibold uppercase tracking-wider text-foreground-strong">
                Categories
              </p>
              <ul className="mt-3 space-y-2 text-caption text-muted">
                <li>
                  <Link to={`${ROUTES.LOGIN}?role=student`} className="hover:text-primary">
                    Organizational Student
                  </Link>
                </li>
                <li>
                  <Link to={`${ROUTES.LOGIN}?role=faculty`} className="hover:text-primary">
                    Faculty Evaluator
                  </Link>
                </li>
                <li>
                  <Link to={`${ROUTES.LOGIN}?role=org_admin`} className="hover:text-primary">
                    Academy Administrator
                  </Link>
                </li>
                <li>
                  <Link to={`${ROUTES.LOGIN}?role=individual`} className="hover:text-primary">
                    Independent Learner
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-caption font-semibold uppercase tracking-wider text-foreground-strong">
                Portal Access
              </p>
              <ul className="mt-3 space-y-2 text-caption text-muted">
                <li>
                  <Link to={ROUTES.LOGIN} className="hover:text-primary">
                    Sign In to Workspace
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.REQUEST_ACCESS} className="hover:text-primary">
                    Request Institutional Access
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.FORGOT_PASSWORD} className="hover:text-primary">
                    Password Recovery
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.WORKSPACE} className="hover:text-primary">
                    Active Workspace Shell
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-caption font-semibold uppercase tracking-wider text-foreground-strong">
                Standards
              </p>
              <ul className="mt-3 space-y-2 text-caption text-muted">
                <li>UPSC CSE Prelims Standard</li>
                <li>GS Papers I, II, III, IV Mains</li>
                <li>Negative Marking Calculus (-0.66)</li>
                <li>48-Hour Mentor Evaluation SLA</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-caption text-muted">
            <p>&copy; 2026 Heftin Academy Platform. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <Link to={ROUTES.LOGIN} className="hover:text-primary">
                Portal Login
              </Link>
              <Link to={ROUTES.REQUEST_ACCESS} className="hover:text-primary">
                Institutional Onboarding
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
