import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, KeyRound, Mail, Sparkles } from 'lucide-react'
import logoImg from '@/assets/logo.jpeg'

interface StudentLoginCardProps {
  onSuccess: (info: { name: string; org: string; role: string; personaId: string }) => void
}

export function StudentLoginCard({ onSuccess }: StudentLoginCardProps) {
  const [email, setEmail] = useState('sana@dpa.edu')
  const [password, setPassword] = useState('password123')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function fillStudentPreset() {
    setEmail('sana@dpa.edu')
    setPassword('password123')
  }

  function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault()
    setIsSubmitting(true)

    try {
      localStorage.setItem('heftin-phase1-persona', 'student')
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsSubmitting(false)
      onSuccess({
        name: 'Sana Iqbal',
        org: 'Delhi Public Academy',
        role: 'Student',
        personaId: 'student',
      })
    }, 600)
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-md">
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 border-b border-border pb-3">
        <div className="size-8 overflow-hidden rounded-lg border border-border">
          <img src={logoImg} alt="Heftin" className="size-full object-cover" />
        </div>
        <div>
          <span className="block font-mono text-[9px] font-bold uppercase text-primary">
            Student Portal · Individual Access
          </span>
          <h2 className="text-sm font-bold text-error">Student Sign In</h2>
        </div>
      </div>

      <p className="mt-2.5 text-[11px] text-error/80 leading-relaxed">
        Access your enrolled batch tests, question reviews, and rank analytics.
      </p>

      {/* 1-Click Student Quick Preset */}
      <div className="mt-3 rounded-xl border border-primary/30 bg-primary/5 p-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-primary flex items-center gap-1">
            <Sparkles size={11} /> Quick Sign-In
          </span>
          <span className="text-[9px] font-mono text-primary font-semibold">Batch 101</span>
        </div>
        <button
          type="button"
          onClick={fillStudentPreset}
          className="mt-1.5 flex w-full items-center justify-between rounded-lg bg-white px-2.5 py-1.5 text-left border border-border hover:border-primary transition-all text-xs"
        >
          <div>
            <strong className="block text-xs font-bold text-error">Sana Iqbal</strong>
            <span className="block text-[10px] text-error/70">sana@dpa.edu · Enrolled Learner</span>
          </div>
          <span className="text-[10px] font-bold text-primary">Select</span>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="mt-3.5 space-y-3">
        <div>
          <label htmlFor="student-email" className="block text-[11px] font-bold text-error mb-1">
            Student Email or Roll Number
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-primary">
              <Mail size={13} />
            </span>
            <input
              type="text"
              id="student-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sana@dpa.edu"
              required
              className="w-full rounded-xl border border-border bg-white py-2 pl-8 pr-3 text-xs text-error outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="student-password" className="block text-[11px] font-bold text-error">
              Password
            </label>
            <span className="text-[10px] text-primary cursor-pointer hover:underline">
              Forgot?
            </span>
          </div>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-primary">
              <KeyRound size={13} />
            </span>
            <input
              type="password"
              id="student-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full rounded-xl border border-border bg-white py-2 pl-8 pr-3 text-xs text-error outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Single Line English Permissions */}
        <div className="rounded-lg border border-border bg-white px-3 py-2 text-[11px] text-error/80">
          <span className="font-semibold text-primary mr-1">Permissions:</span>
          <span>View assigned batch exams and rank results.</span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-white shadow-xs hover:opacity-90 transition-all"
        >
          <span>{isSubmitting ? 'Entering Portal...' : 'Enter Student Workspace'}</span>
          <ArrowRight size={13} />
        </button>
      </form>

      {/* Footer link */}
      <div className="mt-3.5 border-t border-border pt-2.5 text-center">
        <p className="text-[10px] text-error/80">
          First time here?{' '}
          <Link to="/signup" className="font-bold text-primary underline">
            Redeem your invite token
          </Link>
        </p>
      </div>
    </div>
  )
}
