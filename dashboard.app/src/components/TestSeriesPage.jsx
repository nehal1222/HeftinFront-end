import { useState } from 'react'
import { motion } from 'framer-motion'
import { TEST_SERIES } from '../data/dashboardData.js'
import { MAINS_EXAMS } from '../data/mainsData.js'

export default function TestSeriesPage({ onStartQuiz }) {
  const [examType, setExamType] = useState('Prelims')

  return (
    <section>
      <div className="exam-type-toggle">
        {['Prelims', 'Mains'].map((type) => (
          <button
            key={type}
            type="button"
            className={examType === type ? 'exam-type-btn active' : 'exam-type-btn'}
            onClick={() => setExamType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {examType === 'Prelims' ? (
        <section className="page-grid">
          {TEST_SERIES.map((series, index) => (
            <motion.div
              key={series.id}
              className="series-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              whileHover={{ scale: 1.015 }}
            >
              <span className="series-category">{series.category}</span>
              <h3>{series.name}</h3>
              <div className="series-meta">
                <span>{series.tests} tests</span>
                <span>{series.attempted} attempted</span>
              </div>
              <div className="series-progress">
                <div
                  className="series-progress-bar"
                  style={{ width: `${(series.attempted / series.tests) * 100}%` }}
                />
              </div>
              {series.avgScore !== null ? (
                <span className="series-score">Avg. score {series.avgScore}%</span>
              ) : (
                <span className="series-score series-score-new">Not started</span>
              )}
              <button
                type="button"
                className="series-btn"
                onClick={() => onStartQuiz({ label: series.name, questionCount: 10, type: 'Prelims' })}
              >
                {series.attempted > 0 ? 'Continue series' : 'Start series'}
              </button>
            </motion.div>
          ))}
        </section>
      ) : (
        <section className="page-grid">
          {MAINS_EXAMS.map((exam, index) => (
            <motion.div
              key={exam.id}
              className="series-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              whileHover={{ scale: 1.015 }}
            >
              <span className="series-category">{exam.category}</span>
              <h3>{exam.name}</h3>
              <span className="series-mains-note">Teacher graded</span>
              <button
                type="button"
                className="series-btn"
                onClick={() =>
                  onStartQuiz({ label: exam.name, subject: exam.subject, type: 'Mains', questionCount: 2 })
                }
              >
                Start paper
              </button>
            </motion.div>
          ))}
        </section>
      )}
    </section>
  )
}
