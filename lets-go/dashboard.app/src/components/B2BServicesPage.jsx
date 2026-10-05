const BATCHES = [
  { name: 'UPSC Foundation 2026', learners: 64, faculty: 'Dr. Meera Kapoor', next: 'UPSC Prelims Mock 04', progress: 72 },
  { name: 'UPSC Prelims Intensive', learners: 48, faculty: 'Arjun Rao', next: 'UPSC CSAT Practice 02', progress: 58 },
  { name: 'UPSC Mains Answer Writing', learners: 36, faculty: 'Nisha Menon', next: 'GS Paper II Review', progress: 84 },
]

const EXAMS = [
  { title: 'UPSC Prelims Mock 04', batch: 'Foundation 2026', status: 'Scheduled', time: '18 Sep, 10:00' },
  { title: 'UPSC CSAT Practice 02', batch: 'Prelims Intensive', status: 'Live', time: 'Today, 14:00' },
  { title: 'GS Paper II Review', batch: 'Mains Answer Writing', status: 'Completed', time: '16 Sep, 09:00' },
]

export default function B2BServicesPage() {
  return (
    <section className="b2b-services-page">
      <div className="b2b-services-heading">
        <div>
          <span className="dash-section-label">B2B services</span>
          <h2>Heftin UPSC Institute</h2>
          <p>Organization operations for UPSC batches, faculty, learners, and exam delivery.</p>
        </div>
        <span className="b2b-pack-status">Pack active</span>
      </div>

      <div className="b2b-service-stats">
        <div><strong>148</strong><span>Learners</span></div>
        <div><strong>6</strong><span>UPSC batches</span></div>
        <div><strong>12</strong><span>Faculty members</span></div>
      </div>

      <div className="b2b-service-grid">
        <article className="b2b-service-panel">
          <div className="b2b-panel-heading"><div><span className="dash-section-label">Batches</span><h3>Manage UPSC cohorts</h3></div><button type="button">New batch</button></div>
          <div className="b2b-batch-list">
            {BATCHES.map((batch) => <div className="b2b-batch" key={batch.name}><div className="b2b-batch-top"><div><strong>{batch.name}</strong><span>{batch.learners} learners · {batch.faculty}</span></div><b>{batch.progress}%</b></div><div className="b2b-progress"><span style={{ width: `${batch.progress}%` }} /></div><small>Next: {batch.next}</small></div>)}
          </div>
        </article>

        <article className="b2b-service-panel">
          <div className="b2b-panel-heading"><div><span className="dash-section-label">Exam operations</span><h3>UPSC exam schedule</h3></div></div>
          <div className="b2b-exam-list">{EXAMS.map((exam) => <div className="b2b-exam" key={exam.title}><div><strong>{exam.title}</strong><span>{exam.batch} · {exam.time}</span></div><b>{exam.status}</b></div>)}</div>
          <button type="button" className="b2b-create-exam">Create UPSC exam</button>
        </article>
      </div>

      <article className="b2b-service-panel b2b-rights-panel"><span className="dash-section-label">Heftin-managed rights</span><h3>Organization pack</h3><div className="b2b-rights">{['UPSC exam delivery', 'Batch management', 'Faculty workspace', 'Organization analytics', 'Mains evaluation'].map((right, index) => <div className={index === 4 ? 'is-locked' : 'is-enabled'} key={right}><strong>{right}</strong><span>{index === 4 ? 'Not included' : 'Available'}</span></div>)}</div><p>Heftin Super Admin controls this pack. Organization Admin can assign only enabled rights to faculty and learners.</p></article>
    </section>
  )
}
