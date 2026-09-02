import { useState } from 'react'
import { motion } from 'framer-motion'
import Toggle from './Toggle.jsx'

const EXAM_FOCUS_OPTIONS = ['Banking', 'SSC', 'Railways', 'Other Exams']

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState('Ananya R.')
  const [examFocus, setExamFocus] = useState('Banking')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [studyReminders, setStudyReminders] = useState(true)
  const [weeklySummary, setWeeklySummary] = useState(false)
  const [saved, setSaved] = useState(false)

  function handleSave(event) {
    event.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <motion.form
      className="settings-form"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSave}
    >
      <section className="dash-panel settings-section">
        <div className="dash-panel-head">
          <h2>Profile</h2>
          <span className="dash-panel-sub">Account</span>
        </div>

        <label className="settings-field">
          <span>Display name</span>
          <input type="text" value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
        </label>

        <label className="settings-field">
          <span>Primary exam focus</span>
          <select value={examFocus} onChange={(event) => setExamFocus(event.target.value)}>
            {EXAM_FOCUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="dash-panel settings-section">
        <div className="dash-panel-head">
          <h2>Notifications</h2>
          <span className="dash-panel-sub">Preferences</span>
        </div>

        <Toggle
          label="Email notifications"
          description="Get an email when a new test series is released."
          checked={emailNotifications}
          onChange={setEmailNotifications}
        />
        <Toggle
          label="Study reminders"
          description="A gentle nudge if you haven't practiced in a day."
          checked={studyReminders}
          onChange={setStudyReminders}
        />
        <Toggle
          label="Weekly performance summary"
          description="A recap of your accuracy and rank change every Monday."
          checked={weeklySummary}
          onChange={setWeeklySummary}
        />
      </section>

      <div className="settings-actions">
        <button type="submit" className="series-btn">
          Save changes
        </button>
        {saved && <span className="settings-saved">Saved</span>}
      </div>
    </motion.form>
  )
}
