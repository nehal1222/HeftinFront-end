import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CHAPTER_SUBJECTS, SPEED_TESTS } from '../data/dashboardData.js'

export default function PracticePage({ onStartQuiz }) {
  const [mode, setMode] = useState('chapters')

  return (
    <section>
      <div className="practice-tabs">
        <button
          type="button"
          className={mode === 'chapters' ? 'practice-tab active' : 'practice-tab'}
          onClick={() => setMode('chapters')}
        >
          Chapter-wise tests
        </button>
        <button
          type="button"
          className={mode === 'speed' ? 'practice-tab active' : 'practice-tab'}
          onClick={() => setMode('speed')}
        >
          Speed tests
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'chapters' ? (
          <motion.div
            key="chapters"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {CHAPTER_SUBJECTS.map((subject) => (
              <div key={subject.subject} className="chapter-subject">
                <h3>
                  <span className="chapter-dot" style={{ background: subject.color }} />
                  {subject.subject}
                </h3>
                <div className="chapter-list">
                  {subject.chapters.map((chapter) => (
                    <div key={chapter.name} className="chapter-row">
                      <div>
                        <span className="chapter-name">{chapter.name}</span>
                        <span className="chapter-meta">{chapter.questions} questions · {chapter.accuracy}% avg accuracy</span>
                      </div>
                      <button
                        type="button"
                        className="chapter-btn"
                        onClick={() =>
                          onStartQuiz({ label: chapter.name, questionCount: chapter.questions, subject: subject.subject })
                        }
                      >
                        Start
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="speed"
            className="page-grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {SPEED_TESTS.map((test) => (
              <div key={test.id} className="speed-card">
                <span className={`speed-difficulty speed-${test.difficulty.toLowerCase()}`}>
                  {test.difficulty}
                </span>
                <h3>{test.label}</h3>
                <div className="speed-meta">
                  <span>{test.minutes} min</span>
                  <span>{test.questions} questions</span>
                </div>
                <button
                  type="button"
                  className="series-btn"
                  onClick={() => onStartQuiz({ label: test.label, questionCount: test.questions, minutes: test.minutes })}
                >
                  Start sprint
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
