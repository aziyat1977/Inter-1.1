import { VocabItem, Question, GrammarRule, Translations } from './types';

export const UI_TEXT: Translations = {
  studentMode: { en: "Student Mode", ru: "Студент", uz: "Talaba" },
  teacherMode: { en: "Teacher Mode", ru: "Учитель", uz: "O'qituvchi" },
  kahootMode: { en: "Speed Battle", ru: "Битва", uz: "Tezkor Jang" },
  vocabMode: { en: "Vocab & Drill", ru: "Словарь", uz: "Lug'at" },
  back: { en: "Back", ru: "Назад", uz: "Orqaga" },
  next: { en: "Next", ru: "Далее", uz: "Keyingi" },
  submit: { en: "Go", ru: "Пуск", uz: "Ketting" },
  reveal: { en: "Show", ru: "Показать", uz: "Ko'rsatish" },
  check: { en: "Check", ru: "Проверить", uz: "Tekshirish" },
  correct: { en: "Yes!", ru: "Да!", uz: "Ha!" },
  tryAgain: { en: "Again", ru: "Еще раз", uz: "Qayta" },
  score: { en: "Score", ru: "Счет", uz: "Hisob" },
  loading: { en: "Loading...", ru: "Загрузка...", uz: "Yuklanmoqda..." },
  unitTitle: { en: "Unit 1: Trends", ru: "Раздел 1: Тренды", uz: "1-Bölüm: Trendlar" },
  xpEarned: { en: "XP", ru: "XP", uz: "XP" },
  dayStreak: { en: "Streak", ru: "Серия", uz: "Seriya" },
  start: { en: "Start", ru: "Начать", uz: "Boshlash" },
  instructions: { en: "Instructions", ru: "Инфо", uz: "Info" },
  study: { en: "Study", ru: "Учить", uz: "O'qish" },
  quiz: { en: "Quiz", ru: "Тест", uz: "Test" }
};

export const READING_TEXT = {
  title: "Facebook Friends",
  author: "Rob Jones",
  paragraphs: [
    "How many Facebook friends have you seen lately? Rob Jones is currently meeting every single one. His goal? 700 friends.",
    "He wants to raise money for charity. He has already met 123 friends in seven countries.",
    "He takes a photo with everyone. He has raised over £3,000 so far.",
    "He hopes to meet all 700 in three years. This includes a trip to New Zealand.",
    "Are Facebook friends real? Rob met his girlfriend online. They have been together for three years.",
    "'I am learning a lot about myself,' Rob says. 'I now have good friends in people I never met before.'",
    "He generally spends a day with them. They choose the activity.",
    "He has visited England, Scotland, Poland, Finland, Germany, Switzerland and the USA."
  ]
};

export const VOCAB_LIST: VocabItem[] = [
  { id: '1', word: 'achievement', partOfSpeech: 'n', definition: 'a big success', contextSentence: 'Winning was a huge achievement.', translation: { ru: 'достижение', uz: 'yutuq' } },
  { id: '2', word: 'fall out', partOfSpeech: 'v', definition: 'stop being friends', contextSentence: 'I never fall out with him.', translation: { ru: 'поссориться', uz: 'urushib qolmoq' } },
  { id: '3', word: 'get on well', partOfSpeech: 'v', definition: 'be good friends', contextSentence: 'We get on well.', translation: { ru: 'ладить', uz: 'chiqishmoq' } },
  { id: '4', word: 'meet up', partOfSpeech: 'v', definition: 'meet socially', contextSentence: 'Let\'s meet up later.', translation: { ru: 'встретиться', uz: 'uchrashmoq' } },
  { id: '5', word: 'persuade', partOfSpeech: 'v', definition: 'convince someone', contextSentence: 'Can I persuade you?', translation: { ru: 'убеждать', uz: 'ishontirmoq' } },
  { id: '6', word: 'currently', partOfSpeech: 'adv', definition: 'now', contextSentence: 'I am currently working.', translation: { ru: 'сейчас', uz: 'hozirda' } },
  { id: '7', word: 'in common', partOfSpeech: 'phr', definition: 'same interests', contextSentence: 'We have a lot in common.', translation: { ru: 'общее', uz: 'umumiy' } },
  { id: '8', word: 'keep in touch', partOfSpeech: 'phr', definition: 'stay connected', contextSentence: 'Keep in touch!', translation: { ru: 'на связи', uz: 'aloqada bo\'lmoq' } },
];

export const GRAMMAR_RULES: GrammarRule[] = [
  {
    title: "Present Simple",
    usage: 'simple',
    description: "Facts and Habits.",
    examples: ["I live in London.", "He takes photos."]
  },
  {
    title: "Present Continuous",
    usage: 'continuous',
    description: "Now and Trends.",
    examples: ["I am working now.", "It is changing."]
  },
  {
    title: "Present Perfect",
    usage: 'perfect',
    description: "Experience and Results.",
    examples: ["I have visited Paris.", "He has left."]
  }
];

// SIMPLIFIED 2-OPTION QUESTIONS
export const KAHOOT_QUESTIONS: Question[] = [
  {
    id: 'k1',
    question: "Rob _____ his friends right now.",
    options: ["meets", "is meeting"],
    correctAnswer: "is meeting",
    type: "multiple-choice",
    explanation: "NOW = Continuous."
  },
  {
    id: 'k2',
    question: "To 'fall out' means to...",
    options: ["Argue", "Hug"],
    correctAnswer: "Argue",
    type: "multiple-choice",
    explanation: "Bad relationship."
  },
  {
    id: 'k3',
    question: "Experience up to now?",
    options: ["I have visited", "I visit"],
    correctAnswer: "I have visited",
    type: "multiple-choice",
    explanation: "Experience = Perfect."
  },
  {
    id: 'k4',
    question: "What does 'Currently' mean?",
    options: ["Now", "Actually"],
    correctAnswer: "Now",
    type: "multiple-choice",
    explanation: "Currently = At this moment."
  },
  {
    id: 'k5',
    question: "He usually _____ the food.",
    options: ["is choosing", "chooses"],
    correctAnswer: "chooses",
    type: "multiple-choice",
    explanation: "Usually = Simple."
  },
  {
    id: 'k6',
    question: "'I have lived here all my life.'",
    options: ["Past action", "Started in past, still here"],
    correctAnswer: "Started in past, still here",
    type: "multiple-choice",
    explanation: "Perfect connects past to now."
  },
  {
    id: 'k7',
    question: "Opposite of 'Get on'?",
    options: ["Fall out", "Meet up"],
    correctAnswer: "Fall out",
    type: "multiple-choice",
    explanation: "Get on = Good. Fall out = Bad."
  },
  {
    id: 'k8',
    question: "Look! It _____.",
    options: ["rains", "is raining"],
    correctAnswer: "is raining",
    type: "multiple-choice",
    explanation: "Look! = Happening now."
  }
];

export const PRACTICE_EXERCISES: Question[] = [
  {
    id: 'p1',
    question: "I often _____ friends. (meet up / am meeting up)",
    type: "input",
    correctAnswer: "meet up",
    explanation: "Often = Habit."
  },
  {
    id: 'p2',
    question: "Facebook _____ communication. (changes / is changing)",
    type: "input",
    correctAnswer: "is changing",
    explanation: "Trend = Continuous."
  },
  {
    id: 'p3',
    question: "He _____ 100 people so far. (met / has met)",
    type: "input",
    correctAnswer: "has met",
    explanation: "So far = Perfect."
  },
  {
    id: 'p4',
    question: "I _____ a great time now! (have / am having)",
    type: "input",
    correctAnswer: "am having",
    explanation: "Now = Continuous."
  }
];

export const SOUNDS = {
  CORRECT: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
  WRONG: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3',
  CLICK: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  SUCCESS: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'
};