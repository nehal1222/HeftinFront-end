import { motion } from 'framer-motion'
import { ASSIGNMENTS } from '../data/dashboardData.js'

const STATUS_LABEL = { pending: 'Pending', overdue: 'Overdue', completed: 'Completed' }

const EXTENSION_BY_TYPE = {
  'Chapter Test': 'drill',
  'Speed Test': 'speed',
  'Mock Test': 'mock',
}

function fileTag(item) {
  const ext = EXTENSION_BY_TYPE[item.type] ?? 'test'
  return `${item.id}.${ext}`
}

export default function AssignmentsPage({ onStartQuiz }) {
  return (
    <section className="locker-grid">
      {ASSIGNMENTS.map((item, index) => (
        <motion.div
          key={item.id}
          className={`locker-file status-${item.status}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: index * 0.06 }}
          whileHover={{ rotate: 0, y: -6, scale: 1.02 }}
        >
          <div className="locker-tab">
            <span className="locker-filename">{fileTag(item)}</span>
            <span className={`assignment-status status-${item.status}`}>{STATUS_LABEL[item.status]}</span>
          </div>

          <div className="locker-body">
            <span className="assignment-type">{item.type}</span>
            <h3>{item.title}</h3>
            <p className="assignment-reason">{item.reason}</p>
            <span className="assignment-due">Due {item.dueDate}</span>

            <button
              type="button"
              className={item.status === 'completed' ? 'quiz-btn-secondary' : 'series-btn'}
              onClick={() =>
                onStartQuiz({
                  label: item.title,
                  questionCount: item.questionCount,
                  minutes: item.minutes,
                  subject: item.subject,
                })
              }
            >
              {item.status === 'completed' ? 'Review' : 'Start'}
            </button>
          </div>
        </motion.div>
      ))}
    </section>
  )
}
