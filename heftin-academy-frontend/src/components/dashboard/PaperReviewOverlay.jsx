import { useState } from 'react'
import { motion } from 'framer-motion'

export default function PaperReviewOverlay({ submission, onClose, onSave }) {
  const isMains = submission.type === 'Mains'
  const [marks, setMarks] = useState(() => submission.questions.map((q) => q.awardedMarks))
  const [remark, setRemark] = useState(submission.teacherRemark ?? '')

  function setMark(index, value, max) {
    setMarks((prev) => {
      const next = [...prev]
      const clamped = Math.max(0, Math.min(max, Number(value) || 0))
      next[index] = clamped
      return next
    })
  }

  function save() {
    onSave(submission.id, {
      status: 'reviewed',
      teacherRemark: remark,
      questions: submission.questions.map((q, i) => ({ ...q, awardedMarks: isMains ? marks[i] : q.awardedMarks })),
    })
    onClose()
  }

  const totalAwarded = isMains ? marks.reduce((sum, m) => sum + (m ?? 0), 0) : submission.autoScore
  const totalMax = isMains
    ? submission.questions.reduce((sum, q) => sum + q.maxMarks, 0)
    : submission.maxScore

  return (
    <motion.div
      className="zoom-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button type="button" className="zoom-close" onClick={onClose} aria-label="Close review">
        &times;
      </button>

      <motion.div
        className="review-panel"
        onClick={(event) => event.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="review-head">
          <div>
            <span className="quiz-title">{submission.student}</span>
            <span className="quiz-progress-label">{submission.test}</span>
          </div>
          <span className={submission.type === 'Mains' ? 'dash-pill mid' : 'dash-pill good'}>
            {submission.type}
          </span>
        </div>

        <div className="review-proctoring">
          <h4>Proctoring log</h4>
          {submission.flagLog.length === 0 ? (
            <p className="review-flag-empty">No flags raised during this attempt.</p>
          ) : (
            <ul className="review-flag-list">
              {submission.flagLog.map((flag) => (
                <li key={flag.time}>
                  <span className="review-flag-time">{flag.time}</span> {flag.note}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="review-questions">
          {submission.questions.map((question, index) => (
            <div className="review-question" key={question.prompt}>
              <p className="review-question-prompt">
                {index + 1}. {question.prompt}
              </p>

              {isMains ? (
                <>
                  <p className="review-answer-text">{question.studentAnswer}</p>
                  <div className="review-marks-row">
                    <label>
                      Marks
                      <input
                        type="number"
                        min="0"
                        max={question.maxMarks}
                        value={marks[index] ?? ''}
                        onChange={(event) => setMark(index, event.target.value, question.maxMarks)}
                      />
                    </label>
                    <span className="review-marks-max">/ {question.maxMarks}</span>
                  </div>
                </>
              ) : (
                <div className="review-options">
                  {question.options.map((option, optIndex) => {
                    const isStudentPick = optIndex === question.studentAnswer
                    const isCorrect = optIndex === question.correctIndex
                    let cls = 'review-option'
                    if (isCorrect) cls += ' correct'
                    if (isStudentPick && !isCorrect) cls += ' wrong'
                    if (isStudentPick) cls += ' picked'
                    return (
                      <span className={cls} key={option}>
                        {option}
                      </span>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="review-remark">
          <label htmlFor="teacher-remark">Remark for student</label>
          <textarea
            id="teacher-remark"
            rows="2"
            value={remark}
            onChange={(event) => setRemark(event.target.value)}
            placeholder="Optional feedback..."
          />
        </div>

        <div className="review-footer">
          <span className="review-total">
            Total: <strong>{totalAwarded}</strong> / {totalMax}
          </span>
          <div className="quiz-actions">
            <button type="button" className="quiz-btn-secondary" onClick={onClose}>
              Close
            </button>
            <button type="button" className="series-btn" onClick={save}>
              {submission.status === 'reviewed' ? 'Update review' : 'Save review'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
