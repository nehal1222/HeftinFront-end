import { useState } from 'react'
import { motion } from 'framer-motion'
import { proctoringSummary } from '../data/teacherData.js'

const TABS = ['All', 'Pending', 'Reviewed']

export default function TeacherSubmissionsPage({ submissions, onReview }) {
  const [tab, setTab] = useState('All')

  const visible = submissions.filter((s) => {
    if (tab === 'Pending') return s.status === 'pending'
    if (tab === 'Reviewed') return s.status === 'reviewed'
    return true
  })

  return (
    <motion.section
      className="dash-panel dash-table-panel"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="dash-panel-head">
        <h2>Submitted papers</h2>
        <div className="submission-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              className={tab === t ? 'submission-tab active' : 'submission-tab'}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <table className="dash-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Test</th>
            <th>Type</th>
            <th>Submitted</th>
            <th>Proctoring</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {visible.map((submission, index) => {
            const flags = proctoringSummary(submission)
            return (
              <motion.tr
                key={submission.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <td>
                  <div className="submission-student">
                    <span className="submission-avatar">{submission.initials}</span>
                    {submission.student}
                  </div>
                </td>
                <td>{submission.test}</td>
                <td>
                  <span className={submission.type === 'Mains' ? 'dash-pill mid' : 'dash-pill good'}>
                    {submission.type}
                  </span>
                </td>
                <td>{submission.submittedAt}</td>
                <td>
                  <span className={`dash-pill ${flags.tone}`}>{flags.label}</span>
                </td>
                <td>
                  <span className={submission.status === 'reviewed' ? 'dash-pill good' : 'dash-pill low'}>
                    {submission.status === 'reviewed' ? 'Reviewed' : 'Pending'}
                  </span>
                </td>
                <td>
                  <button type="button" className="quiz-btn-secondary" onClick={() => onReview(submission)}>
                    {submission.status === 'reviewed' ? 'View' : 'Review'}
                  </button>
                </td>
              </motion.tr>
            )
          })}
        </tbody>
      </table>

      {visible.length === 0 && <p className="submission-empty">Nothing here.</p>}
    </motion.section>
  )
}
