/* Mock data for the teacher review portal — front-end demo only, no real
   backend. Prelims submissions are objective (auto-scored, teacher confirms
   + checks proctoring flags). Mains submissions are descriptive answers a
   teacher grades by hand, question by question. */

export const SUBMISSIONS = [
  {
    id: 'sub-1',
    student: 'Rohan Mehta',
    initials: 'RM',
    test: 'SSC CGL Tier I — Full Mock 4',
    subject: 'General Studies',
    type: 'Prelims',
    submittedAt: '2026-08-27',
    status: 'pending',
    flagLog: [
      { time: '00:04:12', note: 'Face not detected for 8s' },
      { time: '00:22:40', note: 'Looked away from screen' },
    ],
    autoScore: 68,
    maxScore: 100,
    questions: [
      { prompt: 'What is the capital of Australia?', options: ['Canberra', 'Sydney', 'Melbourne', 'Perth'], correctIndex: 0, studentAnswer: 0 },
      { prompt: 'The Reserve Bank of India was established in which year?', options: ['1935', '1947', '1950', '1930'], correctIndex: 0, studentAnswer: 2 },
      { prompt: 'Which gas do plants primarily absorb for photosynthesis?', options: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'], correctIndex: 0, studentAnswer: 0 },
      { prompt: 'Who wrote the Indian National Anthem?', options: ['Rabindranath Tagore', 'Mahatma Gandhi', 'Bankim Chandra', 'Sarojini Naidu'], correctIndex: 0, studentAnswer: 3 },
    ],
  },
  {
    id: 'sub-2',
    student: 'Ishita Verma',
    initials: 'IV',
    test: 'UPSC Mains — GS Paper II (Polity)',
    subject: 'Polity',
    type: 'Mains',
    submittedAt: '2026-08-26',
    status: 'pending',
    flagLog: [],
    questions: [
      {
        prompt: 'Discuss the significance of the Basic Structure doctrine in Indian constitutional law.',
        studentAnswer:
          'The Basic Structure doctrine, laid down in Kesavananda Bharati v. State of Kerala (1973), holds that Parliament cannot amend the Constitution in a way that destroys its basic features — such as democracy, secularism, judicial review, and federalism. It acts as a check on the amending power under Article 368, ensuring the core identity of the Constitution is preserved even as it evolves.',
        maxMarks: 15,
        awardedMarks: null,
      },
      {
        prompt: 'Explain the role of the Finance Commission in Centre–State fiscal relations.',
        studentAnswer:
          'The Finance Commission, constituted every five years under Article 280, recommends the distribution of tax revenues between the Centre and States, and among States. It addresses vertical and horizontal fiscal imbalance and also advises on grants-in-aid to states in need.',
        maxMarks: 10,
        awardedMarks: null,
      },
    ],
    teacherRemark: '',
  },
  {
    id: 'sub-3',
    student: 'Aditya Rao',
    initials: 'AR',
    test: 'Banking Prelims — Speed Test 2',
    subject: 'Quant',
    type: 'Prelims',
    submittedAt: '2026-08-25',
    status: 'reviewed',
    flagLog: [
      { time: '00:11:02', note: 'Multiple faces detected' },
    ],
    autoScore: 82,
    maxScore: 100,
    questions: [
      { prompt: 'What is 15% of 240?', options: ['36', '42', '30', '24'], correctIndex: 0, studentAnswer: 0 },
      { prompt: 'A train covers 180 km in 3 hours. What is its speed?', options: ['60 km/h', '45 km/h', '90 km/h', '54 km/h'], correctIndex: 0, studentAnswer: 0 },
      { prompt: 'Simple interest on ₹2000 at 5% per annum for 3 years is?', options: ['₹300', '₹200', '₹250', '₹350'], correctIndex: 0, studentAnswer: 1 },
    ],
    teacherRemark: 'Flag reviewed — second face was a sibling passing by, not a concern.',
  },
  {
    id: 'sub-4',
    student: 'Priya Nair',
    initials: 'PN',
    test: 'Railways Mains — Descriptive Set 1',
    subject: 'English',
    type: 'Mains',
    submittedAt: '2026-08-24',
    status: 'reviewed',
    flagLog: [],
    questions: [
      {
        prompt: 'Write a short essay (150 words) on the importance of time management for competitive exam aspirants.',
        studentAnswer:
          'Time management is the backbone of competitive exam preparation. With a fixed syllabus and limited hours, aspirants must prioritize high-weightage topics, revise consistently, and avoid last-minute cramming. A structured timetable balancing study, mock tests, and rest improves retention and reduces exam-day anxiety, ultimately leading to better performance.',
        maxMarks: 20,
        awardedMarks: 16,
      },
    ],
    teacherRemark: 'Clear structure and on-topic. Could use one more concrete example.',
  },
]

export function proctoringSummary(submission) {
  const count = submission.flagLog.length
  if (count === 0) return { label: 'No flags', tone: 'good' }
  if (count === 1) return { label: '1 flag', tone: 'mid' }
  return { label: `${count} flags`, tone: 'low' }
}
