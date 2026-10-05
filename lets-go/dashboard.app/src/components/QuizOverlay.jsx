import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { generateQuiz } from '../data/quizData.js'
import { generateMainsQuestions } from '../data/mainsData.js'

const MAX_QUESTIONS = 10

function ProctorCam() {
  const videoRef = useRef(null)
  const [status, setStatus] = useState('requesting')

  useEffect(() => {
    let stream
    let cancelled = false

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('unsupported')
      return undefined
    }

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop())
          return
        }
        stream = s
        if (videoRef.current) videoRef.current.srcObject = s
        setStatus('live')
      })
      .catch(() => setStatus('denied'))

    return () => {
      cancelled = true
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  return (
    <div className="quiz-cam">
      {status === 'live' && (
        <>
          <video ref={videoRef} autoPlay muted playsInline />
          <span className="quiz-cam-dot" />
        </>
      )}
      {status === 'requesting' && <span className="quiz-cam-msg">Starting camera...</span>}
      {(status === 'denied' || status === 'unsupported') && (
        <span className="quiz-cam-msg warn">Camera off</span>
      )}
      <span className="quiz-cam-label">Proctored</span>
    </div>
  )
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function QuizOverlay({ quiz, onClose, onSubmit }) {
  const isMains = quiz.type === 'Mains'
  const questionCount = Math.min(quiz.questionCount ?? 10, MAX_QUESTIONS)
  const questions = useMemo(
    () => (isMains ? generateMainsQuestions(quiz.subject, questionCount) : generateQuiz(questionCount, quiz.subject)),
    [isMains, questionCount, quiz.subject],
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(isMains ? '' : null))
  const [finished, setFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(quiz.minutes ? quiz.minutes * 60 : null)
  const submittedRef = useRef(false)

  useEffect(() => {
    if (timeLeft === null || finished) return undefined
    if (timeLeft <= 0) {
      setFinished(true)
      return undefined
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timeLeft, finished])

  const question = questions[currentIndex]
  const isLast = currentIndex === questions.length - 1

  function selectOption(optionIndex) {
    setAnswers((prev) => {
      const next = [...prev]
      next[currentIndex] = optionIndex
      return next
    })
  }

  function setAnswerText(text) {
    setAnswers((prev) => {
      const next = [...prev]
      next[currentIndex] = text
      return next
    })
  }

  function goNext() {
    if (isLast) {
      setFinished(true)
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }

  function goPrev() {
    setCurrentIndex((i) => Math.max(0, i - 1))
  }

  function retake() {
    setAnswers(Array(questions.length).fill(isMains ? '' : null))
    setCurrentIndex(0)
    setFinished(false)
    setTimeLeft(quiz.minutes ? quiz.minutes * 60 : null)
    submittedRef.current = false
  }

  const score = isMains
    ? 0
    : answers.reduce((total, answer, i) => (answer === questions[i].correctIndex ? total + 1 : total), 0)

  useEffect(() => {
    if (!finished || submittedRef.current || !onSubmit) return
    submittedRef.current = true

    if (isMains) {
      onSubmit({
        id: `sub-${Date.now()}`,
        student: 'Ananya R.',
        initials: 'AR',
        test: quiz.label,
        subject: quiz.subject ?? 'General',
        type: 'Mains',
        submittedAt: new Date().toISOString().slice(0, 10),
        status: 'pending',
        flagLog: [],
        teacherRemark: '',
        questions: questions.map((q, i) => ({
          prompt: q.prompt,
          maxMarks: q.maxMarks,
          awardedMarks: null,
          studentAnswer: answers[i],
        })),
      })
    } else {
      onSubmit({
        id: `sub-${Date.now()}`,
        student: 'Ananya R.',
        initials: 'AR',
        test: quiz.label,
        subject: quiz.subject ?? 'Mixed',
        type: 'Prelims',
        submittedAt: new Date().toISOString().slice(0, 10),
        status: 'pending',
        flagLog: [],
        autoScore: score,
        maxScore: questions.length,
        questions: questions.map((q, i) => ({
          prompt: q.prompt,
          options: q.options,
          correctIndex: q.correctIndex,
          studentAnswer: answers[i],
        })),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished])

  return (
    <motion.div
      className="zoom-backdrop quiz-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button type="button" className="zoom-close" onClick={onClose} aria-label="Close quiz">
        &times;
      </button>

      <motion.div
        className="quiz-panel"
        onClick={(event) => event.stopPropagation()}
        initial={{ opacity: 0, scale: 0.98, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 24 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {!finished ? (
          <>
            <div className="quiz-head">
              <div>
                <span className="quiz-title">{quiz.label}</span>
                <span className="quiz-progress-label">
                  Question {currentIndex + 1} of {questions.length}
                </span>
              </div>
              <div className="quiz-head-right">
                <ProctorCam />
                {timeLeft !== null && (
                  <span className={timeLeft <= 30 ? 'quiz-timer low' : 'quiz-timer'}>{formatTime(timeLeft)}</span>
                )}
              </div>
            </div>

            <div className="series-progress">
              <div
                className="series-progress-bar"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            <p className="quiz-question">
              {question.prompt}
              {isMains && <span className="quiz-question-marks"> ({question.maxMarks} marks)</span>}
            </p>

            {isMains ? (
              <textarea
                className="quiz-answer-textarea"
                rows="8"
                placeholder="Write your answer here..."
                value={answers[currentIndex]}
                onChange={(event) => setAnswerText(event.target.value)}
              />
            ) : (
              <div className="quiz-options">
                {question.options.map((option, index) => (
                  <button
                    key={option}
                    type="button"
                    className={answers[currentIndex] === index ? 'quiz-option selected' : 'quiz-option'}
                    onClick={() => selectOption(index)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            <div className="quiz-actions">
              <button type="button" className="quiz-btn-secondary" onClick={goPrev} disabled={currentIndex === 0}>
                Previous
              </button>
              <button type="button" className="series-btn" onClick={goNext}>
                {isLast ? 'Submit test' : 'Next question'}
              </button>
            </div>
          </>
        ) : (
          <div className="quiz-results">
            <span className="quiz-results-label">{isMains ? 'Paper submitted' : 'Test complete'}</span>
            {isMains ? (
              <p className="quiz-score-text">
                Your answers have been sent to a teacher for grading. You'll see your marks once reviewed.
              </p>
            ) : (
              <>
                <div className="score-ring big">
                  <strong>{Math.round((score / questions.length) * 100)}%</strong>
                </div>
                <p className="quiz-score-text">
                  {score} out of {questions.length} correct
                </p>
              </>
            )}
            {onSubmit && <p className="quiz-submitted-note">Paper submitted for teacher review.</p>}
            <div className="quiz-actions">
              <button type="button" className="quiz-btn-secondary" onClick={onClose}>
                Back
              </button>
              <button type="button" className="series-btn" onClick={retake}>
                Retake
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
