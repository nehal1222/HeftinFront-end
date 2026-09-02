/* Sample descriptive question pools for the Mains (subjective, teacher-graded)
   flow — mirrors quizData.js but with no options/correctIndex, just a prompt
   and the marks it's worth. Not a real exam bank, just enough to make the
   write-an-answer -> submit -> teacher grades loop functional. */

const MAINS_QUESTION_BANKS = {
  Polity: [
    { prompt: 'Discuss the significance of the Basic Structure doctrine in Indian constitutional law.', maxMarks: 15 },
    { prompt: 'Examine the role of the Election Commission of India in ensuring free and fair elections.', maxMarks: 15 },
    { prompt: 'Critically analyze the doctrine of separation of powers as practiced in India.', maxMarks: 10 },
  ],
  Economy: [
    { prompt: 'Explain the role of the Finance Commission in Centre-State fiscal relations.', maxMarks: 15 },
    { prompt: "Discuss the challenges of fiscal deficit management in India's post-pandemic economy.", maxMarks: 15 },
    { prompt: "Evaluate the impact of GST on India's informal economy.", maxMarks: 10 },
  ],
  'General Studies': [
    { prompt: 'Write a short essay (150 words) on the importance of time management for competitive exam aspirants.', maxMarks: 20 },
    { prompt: "Discuss the role of railways in India's freight and logistics network.", maxMarks: 15 },
  ],
  Essay: [
    { prompt: 'Write an essay (250 words) on "Technology as an enabler of inclusive growth."', maxMarks: 25 },
    { prompt: 'Write an essay (250 words) on "The role of youth in nation building."', maxMarks: 25 },
  ],
}

export const MAINS_EXAMS = [
  { id: 'upsc-gs2', category: 'UPSC Mains', name: 'GS Paper II — Polity & Governance', subject: 'Polity' },
  { id: 'upsc-gs3', category: 'UPSC Mains', name: 'GS Paper III — Economy & Environment', subject: 'Economy' },
  { id: 'railways-desc', category: 'Railways Mains', name: 'Descriptive Paper — General Studies', subject: 'General Studies' },
  { id: 'state-psc-essay', category: 'State PSC Mains', name: 'Essay & Answer Writing Practice', subject: 'Essay' },
]

export function generateMainsQuestions(subject, count = 2) {
  const pool = MAINS_QUESTION_BANKS[subject] ?? Object.values(MAINS_QUESTION_BANKS).flat()
  return pool.slice(0, count).map((q, i) => ({ ...q, id: i }))
}
