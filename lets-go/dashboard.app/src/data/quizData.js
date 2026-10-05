/* Sample question pools for the practice quiz flow. Not a real exam bank —
   enough genuine, verifiable multiple-choice questions per subject to make
   the test-taking flow (timer, scoring, review) actually functional. */

const QUESTION_BANKS = {
  Quant: [
    { prompt: 'What is 15% of 240?', options: ['36', '42', '30', '24'], correctIndex: 0 },
    { prompt: 'A train covers 180 km in 3 hours. What is its speed?', options: ['60 km/h', '45 km/h', '90 km/h', '54 km/h'], correctIndex: 0 },
    { prompt: 'A shopkeeper sells an item for ₹450 after a 10% profit. What was the cost price?', options: ['₹409.09', '₹400', '₹405', '₹410'], correctIndex: 0 },
    { prompt: 'What comes next in the series: 2, 6, 12, 20, 30, ?', options: ['42', '40', '36', '44'], correctIndex: 0 },
    { prompt: 'Simple interest on ₹2000 at 5% per annum for 3 years is?', options: ['₹300', '₹200', '₹250', '₹350'], correctIndex: 0 },
  ],
  Reasoning: [
    { prompt: 'Complete the series: 3, 6, 9, 12, ?', options: ['15', '14', '16', '18'], correctIndex: 0 },
    { prompt: 'Find the odd one out: Apple, Banana, Carrot, Mango', options: ['Carrot', 'Apple', 'Banana', 'Mango'], correctIndex: 0 },
    { prompt: "If all Roses are Flowers, and some Flowers fade quickly, which statement is definitely true?", options: ['Some roses may fade quickly', 'All flowers are roses', 'No rose fades quickly', 'All flowers fade quickly'], correctIndex: 0 },
    { prompt: 'Complete the series: Z, X, V, T, ?', options: ['R', 'S', 'Q', 'U'], correctIndex: 0 },
    { prompt: 'Find the odd one out: Delhi, Mumbai, Chennai, Ganges', options: ['Ganges', 'Delhi', 'Mumbai', 'Chennai'], correctIndex: 0 },
  ],
  English: [
    { prompt: "Choose the correct synonym of 'Abundant'.", options: ['Plentiful', 'Scarce', 'Rare', 'Limited'], correctIndex: 0 },
    { prompt: "Choose the correct antonym of 'Genuine'.", options: ['Fake', 'Honest', 'Real', 'True'], correctIndex: 0 },
    { prompt: 'Fill in the blank: She has been working here ___ 2019.', options: ['since', 'for', 'from', 'at'], correctIndex: 0 },
    { prompt: 'Identify the correctly spelled word.', options: ['Necessary', 'Neccessary', 'Necesary', 'Neccesary'], correctIndex: 0 },
    { prompt: 'Choose the correct sentence.', options: ['He goes to school every day.', 'He go to school every day.', 'He going to school every day.', 'He gone to school every day.'], correctIndex: 0 },
  ],
  'General Knowledge': [
    { prompt: 'What is the capital of Australia?', options: ['Canberra', 'Sydney', 'Melbourne', 'Perth'], correctIndex: 0 },
    { prompt: 'Which is the largest planet in our solar system?', options: ['Jupiter', 'Saturn', 'Earth', 'Mars'], correctIndex: 0 },
    { prompt: 'The Reserve Bank of India was established in which year?', options: ['1935', '1947', '1950', '1930'], correctIndex: 0 },
    { prompt: 'Which gas do plants primarily absorb for photosynthesis?', options: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'], correctIndex: 0 },
    { prompt: 'Who wrote the Indian National Anthem?', options: ['Rabindranath Tagore', 'Mahatma Gandhi', 'Bankim Chandra', 'Sarojini Naidu'], correctIndex: 0 },
  ],
}

const GENERAL_POOL = Object.values(QUESTION_BANKS).flat()

function shuffleOptions(question) {
  const correctAnswer = question.options[question.correctIndex]
  const shuffled = [...question.options]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return { ...question, options: shuffled, correctIndex: shuffled.indexOf(correctAnswer) }
}

export function generateQuiz(questionCount, subject) {
  const pool = QUESTION_BANKS[subject] ?? GENERAL_POOL
  const questions = []
  for (let i = 0; i < questionCount; i++) {
    const base = pool[i % pool.length]
    questions.push({ ...shuffleOptions(base), id: i })
  }
  return questions
}
