const LANDINGS = {
  student: {
    eyebrow: 'Student workspace',
    title: 'Your next best study move.',
    subtitle: 'UPSC exams, learning material, and focused practice in one place.',
    stats: [['04', 'Open UPSC exams', 'Two due this week'], ['18', 'Lessons left', 'Across 3 subjects'], ['6 days', 'Study streak', 'Keep it going']],
    focus: ['Complete the Polity revision set', '12 questions left in your current study plan.'],
    activity: [['UPSC Prelims Mock 04', 'Score 78% - yesterday'], ['Indian Polity: Parliament', 'Lesson 6 of 8 - in progress'], ['Daily current affairs', 'Microtask due today']],
    actions: [['Take an UPSC exam', 'Start your next scheduled test.'], ['Continue learning', 'Return to your active subject.'], ['Practise a microtask', 'Build a focused daily habit.']],
  },
  individual: {
    eyebrow: 'Individual learner',
    title: 'Build your learning rhythm.',
    subtitle: 'Your access expands with your subscription plan, from core practice to deeper UPSC analytics.',
    stats: [['3', 'Active courses', 'Keep your momentum'], ['12', 'Microtasks', 'Ready to practise'], ['78%', 'Weekly progress', 'Up 8% this week']],
    focus: ['Choose your next UPSC milestone', 'Your Scholar plan has 4 practice paths ready.'],
    activity: [['Scholar plan', '4 capabilities currently enabled'], ['UPSC Economy basics', '68% course completion'], ['Analytics preview', 'Weekly report ready']],
    actions: [['Explore your plan', 'See which capabilities are included.'], ['Take an UPSC exam', 'Choose a test from your tier.'], ['Upgrade access', 'Unlock more practice and analytics.']],
  },
  faculty: {
    eyebrow: 'Organization faculty',
    title: 'Turn expertise into progress.',
    subtitle: 'Create UPSC material, guide assignments, and support learners in your assigned batches.',
    stats: [['24', 'Assigned learners', 'Across 2 batches'], ['08', 'Pending reviews', 'Due this week'], ['92%', 'Class engagement', 'Above target']],
    focus: ['Review 8 pending answer sheets', 'The oldest submission has been waiting for 18 hours.'],
    activity: [['UPSC Foundation 2026', '24 learners active today'], ['GS Paper II Review', '12 submissions received'], ['New material request', 'Faculty resource requested by Batch 2']],
    actions: [['Review submissions', 'Grade and return learner work.'], ['Create material', 'Add a new UPSC lesson or test.'], ['Open assignments', 'Track work across your batches.']],
  },
  org_admin: {
    eyebrow: 'Organization admin',
    title: 'Run a focused learning operation.',
    subtitle: 'Manage UPSC batches, faculty, learners, exams, and the rights Heftin has enabled for your organization.',
    stats: [['06', 'Active batches', 'Across your organization'], ['148', 'Learners', '12 new this month'], ['11', 'Rights enabled', 'From the Heftin pack']],
    focus: ['Publish the next batch exam', 'UPSC Prelims Mock 04 is ready for scheduling.'],
    activity: [['UPSC Foundation 2026', '64 learners - 72% progress'], ['Faculty invitation', '2 invitations awaiting response'], ['Organization pack', '11 rights enabled by Heftin']],
    actions: [['Open B2B services', 'Manage batches and UPSC exams.'], ['Manage people', 'Invite faculty and learners.'], ['Review organization rights', 'Use only enabled pack capabilities.']],
  },
  super_admin: {
    eyebrow: 'Heftin platform',
    title: 'See the whole learning network.',
    subtitle: 'Control organizations, subscription plans, rights packs, and platform capabilities across Heftin.',
    stats: [['42', 'Organizations', '3 awaiting review'], ['8.4k', 'Active learners', 'Across all plans'], ['12', 'Live capabilities', 'Available platform-wide']],
    focus: ['Review 3 organizations awaiting approval', 'Complete verification before enabling their organization packs.'],
    activity: [['Institution plan', '12 capabilities available'], ['Heftin UPSC Institute', 'Pack updated 2 hours ago'], ['Platform usage', '8.4k active learners this month']],
    actions: [['Manage organizations', 'Create, suspend, and review organizations.'], ['Define subscriptions', 'Set plan access and entitlements.'], ['Configure rights packs', 'Decide what Org Admins can assign.']],
  },
}

export default function RoleLandingPage({ role, onNavigate }) {
  const landing = LANDINGS[role] || LANDINGS.student
  const personName = (() => {
    try {
      return localStorage.getItem('heftinName') || 'Ananya'
    } catch (e) {
      return 'Ananya'
    }
  })()
  const organization = role === 'super_admin' ? 'Heftin platform' : role === 'student' || role === 'individual' ? 'Personal workspace' : 'Heftin UPSC Institute'
  const roleLabel = role === 'org_admin' ? 'Organization Admin' : role === 'super_admin' ? 'Heftin Super Admin' : role === 'faculty' ? 'Faculty' : role === 'individual' ? 'Individual learner' : 'Student'

  return (
    <section className="role-landing-page">
      <div className="role-landing-identity"><div><span>Signed in as</span><strong>{personName}</strong></div><div><span>Organization</span><strong>{organization}</strong></div><div><span>Role</span><strong>{roleLabel}</strong></div></div>
      <div className="role-landing-hero">
        <div><span className="dash-section-label">{landing.eyebrow}</span><h2>{landing.title}</h2><p>{landing.subtitle}</p></div>
        <span className="role-landing-badge">Role home</span>
      </div>
      <div className="role-landing-stats">{landing.stats.map(([value, label, note]) => <div key={label}><strong>{value}</strong><span>{label}</span><small>{note}</small></div>)}</div>
      <div className="role-landing-grid">
        <article className="role-landing-focus"><span className="dash-section-label">Focus now</span><strong>{landing.focus[0]}</strong><p>{landing.focus[1]}</p><button type="button" onClick={() => onNavigate(role === 'org_admin' ? 'organization' : role === 'faculty' ? 'submissions' : 'overview')}>Open focus -&gt;</button></article>
        <article className="role-landing-activity"><span className="dash-section-label">Recent activity</span>{landing.activity.map(([label, detail]) => <div key={label}><strong>{label}</strong><span>{detail}</span></div>)}</article>
      </div>
      <div className="role-landing-actions">{landing.actions.map(([label, copy], index) => <button type="button" key={label} onClick={() => onNavigate(index === 0 && role === 'org_admin' ? 'organization' : index === 0 && role === 'faculty' ? 'submissions' : index === 1 && role === 'super_admin' ? 'subscriptions' : 'overview')}><strong>{label}</strong><span>{copy}</span><b>Open →</b></button>)}</div>
    </section>
  )
}
