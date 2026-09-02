export const STAT_CARDS = [
  { id: 'tests', label: 'Tests Attempted', value: '128', delta: '↑ 8 this week', deltaClass: 'up' },
  { id: 'accuracy', label: 'Overall Accuracy', value: '84%', delta: '↑ 12% from last test', deltaClass: 'up' },
  { id: 'rank', label: 'Current Rank', value: '#214', delta: '↑ 36 ranks', deltaClass: 'up' },
  { id: 'streak', label: 'Study Streak', value: '9 days', delta: 'Keep it going', deltaClass: '' },
]

export const PERFORMANCE_BARS = [38, 52, 45, 60, 48, 65, 58, 72, 68, 78, 74, 84]

export const OVERALL_ACCURACY = 84

export const PIE_SLICES = [
  { label: 'Quant', pct: 32, color: 'var(--teal)' },
  { label: 'Reasoning', pct: 26, color: 'var(--teal-light)' },
  { label: 'English', pct: 24, color: '#006670' },
  { label: 'General Knowledge', pct: 18, color: '#5fb8c4' },
]

export const RECENT_ATTEMPTS = [
  { test: 'SBI PO Mock 12', date: 'Aug 21, 2026', score: '78/100', accuracy: 84 },
  { test: 'SSC CGL Tier 1', date: 'Aug 18, 2026', score: '65/100', accuracy: 71 },
  { test: 'RRB NTPC Full Test', date: 'Aug 14, 2026', score: '82/100', accuracy: 88 },
  { test: 'IBPS Clerk Mock 5', date: 'Aug 10, 2026', score: '58/100', accuracy: 62 },
]

export function accuracyPillClass(pct) {
  if (pct >= 80) return 'good'
  if (pct >= 65) return 'mid'
  return 'low'
}

/* ---------- Test Series page ---------- */
export const TEST_SERIES = [
  { id: 'banking', category: 'Banking', name: 'SBI PO / Clerk Complete Series', tests: 24, attempted: 11, avgScore: 76 },
  { id: 'ssc', category: 'SSC', name: 'SSC CGL Tier 1 & 2 Series', tests: 18, attempted: 6, avgScore: 71 },
  { id: 'railways', category: 'Railways', name: 'RRB NTPC Full-Length Series', tests: 15, attempted: 9, avgScore: 82 },
  { id: 'ibps', category: 'Banking', name: 'IBPS Clerk Prelims Series', tests: 20, attempted: 4, avgScore: 65 },
  { id: 'other', category: 'Other Exams', name: 'State PSC Foundation Series', tests: 12, attempted: 0, avgScore: null },
]

/* ---------- Practice page: chapter-wise ---------- */
export const CHAPTER_SUBJECTS = [
  {
    subject: 'Quant',
    color: 'var(--teal)',
    chapters: [
      { name: 'Percentages', questions: 40, accuracy: 82 },
      { name: 'Profit & Loss', questions: 35, accuracy: 74 },
      { name: 'Time & Work', questions: 30, accuracy: 68 },
      { name: 'Data Interpretation', questions: 45, accuracy: 79 },
    ],
  },
  {
    subject: 'Reasoning',
    color: 'var(--teal-light)',
    chapters: [
      { name: 'Puzzles & Seating', questions: 38, accuracy: 71 },
      { name: 'Syllogism', questions: 28, accuracy: 85 },
      { name: 'Blood Relations', questions: 20, accuracy: 88 },
    ],
  },
  {
    subject: 'English',
    color: '#006670',
    chapters: [
      { name: 'Reading Comprehension', questions: 32, accuracy: 76 },
      { name: 'Cloze Test', questions: 22, accuracy: 80 },
      { name: 'Error Spotting', questions: 26, accuracy: 69 },
    ],
  },
  {
    subject: 'General Knowledge',
    color: '#5fb8c4',
    chapters: [
      { name: 'Current Affairs', questions: 50, accuracy: 73 },
      { name: 'Banking Awareness', questions: 30, accuracy: 77 },
    ],
  },
]

/* ---------- Practice page: speed tests ---------- */
export const SPEED_TESTS = [
  { id: 'speed-5', label: '5-Minute Sprint', minutes: 5, questions: 15, difficulty: 'Easy' },
  { id: 'speed-10', label: '10-Minute Speed Test', minutes: 10, questions: 30, difficulty: 'Medium' },
  { id: 'speed-15', label: '15-Minute Challenge', minutes: 15, questions: 45, difficulty: 'Medium' },
  { id: 'speed-20', label: '20-Minute Full Sprint', minutes: 20, questions: 60, difficulty: 'Hard' },
]

/* ---------- Results page ---------- */
export const ALL_RESULTS = [
  { test: 'SBI PO Mock 12', date: 'Aug 21, 2026', category: 'Banking', score: '78/100', accuracy: 84 },
  { test: 'SSC CGL Tier 1', date: 'Aug 18, 2026', category: 'SSC', score: '65/100', accuracy: 71 },
  { test: 'RRB NTPC Full Test', date: 'Aug 14, 2026', category: 'Railways', score: '82/100', accuracy: 88 },
  { test: 'IBPS Clerk Mock 5', date: 'Aug 10, 2026', category: 'Banking', score: '58/100', accuracy: 62 },
  { test: '10-Minute Speed Test', date: 'Aug 9, 2026', category: 'Practice', score: '27/30', accuracy: 90 },
  { test: 'SBI PO Mock 11', date: 'Aug 6, 2026', category: 'Banking', score: '71/100', accuracy: 76 },
  { test: 'SSC CGL Tier 2', date: 'Aug 3, 2026', category: 'SSC', score: '60/100', accuracy: 68 },
  { test: 'RRB NTPC Mock 4', date: 'Jul 30, 2026', category: 'Railways', score: '75/100', accuracy: 79 },
  { test: 'Percentages Chapter Test', date: 'Jul 27, 2026', category: 'Practice', score: '33/40', accuracy: 83 },
  { test: 'IBPS Clerk Mock 4', date: 'Jul 24, 2026', category: 'Banking', score: '52/100', accuracy: 57 },
]

/* ---------- Rank tiers ---------- */
export const RANK_TIERS = [
  { name: 'Elite', max: 50, color: '#00808c' },
  { name: 'Platinum', max: 200, color: '#8cc6cb' },
  { name: 'Gold', max: 1000, color: '#006670' },
  { name: 'Silver', max: 5000, color: '#5fb8c4' },
  { name: 'Bronze', max: Infinity, color: '#013a40' },
]

export function tierForRank(rank) {
  return RANK_TIERS.find((tier) => rank <= tier.max) ?? RANK_TIERS[RANK_TIERS.length - 1]
}

/* ---------- Leaderboard ---------- */
export const LEADERBOARD = [
  { rank: 1, name: 'Rohit Verma', initials: 'RV', score: 98.2, trend: 2 },
  { rank: 2, name: 'Priya Nair', initials: 'PN', score: 97.6, trend: 0 },
  { rank: 3, name: 'Arjun Mehta', initials: 'AM', score: 96.9, trend: -1 },
  { rank: 4, name: 'Sana Iqbal', initials: 'SI', score: 95.4, trend: 3 },
  { rank: 5, name: 'Karan Shah', initials: 'KS', score: 94.8, trend: -2 },
  { rank: 6, name: 'Divya Rao', initials: 'DR', score: 93.1, trend: 1 },
  { rank: 214, name: 'Ananya R.', initials: 'AR', score: 84.0, trend: 36, self: true },
]

/* ---------- Assignments ---------- */
export const ASSIGNMENTS = [
  {
    id: 'a1',
    title: 'Time & Work Chapter Test',
    type: 'Chapter Test',
    subject: 'Quant',
    dueDate: 'Aug 28, 2026',
    status: 'pending',
    reason: 'Your weakest chapter this month — 68% accuracy',
    questionCount: 10,
  },
  {
    id: 'a2',
    title: 'Puzzles & Seating Chapter Test',
    type: 'Chapter Test',
    subject: 'Reasoning',
    dueDate: 'Aug 30, 2026',
    status: 'pending',
    reason: 'Boost your Reasoning average',
    questionCount: 10,
  },
  {
    id: 'a3',
    title: '10-Minute Speed Test',
    type: 'Speed Test',
    subject: null,
    dueDate: 'Aug 23, 2026',
    status: 'overdue',
    reason: 'Weekly speed-test goal',
    questionCount: 10,
    minutes: 10,
  },
  {
    id: 'a4',
    title: 'SBI PO Mock 13',
    type: 'Mock Test',
    subject: null,
    dueDate: 'Aug 20, 2026',
    status: 'completed',
    reason: 'Next in your Banking series',
    questionCount: 10,
  },
  {
    id: 'a5',
    title: 'Error Spotting Chapter Test',
    type: 'Chapter Test',
    subject: 'English',
    dueDate: 'Sep 2, 2026',
    status: 'pending',
    reason: 'Keep your English streak going',
    questionCount: 10,
  },
]

/* ---------- Study streak (last 28 days, oldest first; today is the last entry) ---------- */
export const STREAK_DAYS = [
  true, true, false, true, false, true, true,
  false, true, true, true, false, true, false,
  true, true, false, true, true,
  true, true, true, true, true, true, true, true, true,
]
