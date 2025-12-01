export type Mode = 'landing' | 'student' | 'teacher' | 'kahoot' | 'vocab';
export type Language = 'en' | 'ru' | 'uz';

export interface Badge {
  id: string;
  icon: string;
  name: string;
  description: string;
}

export interface UserState {
  xp: number;
  level: number;
  streak: number;
  completedModules: string[];
  badges: string[];
}

export interface VocabItem {
  id: string;
  word: string;
  partOfSpeech: string;
  definition: string;
  contextSentence: string;
  translation: {
    ru: string;
    uz: string;
  };
}

export interface Question {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string | string[]; // Can be multiple accepted strings for inputs
  type: 'multiple-choice' | 'input' | 'boolean' | 'gap-fill';
  explanation: string;
  hint?: string;
}

export interface GrammarRule {
  title: string;
  description: string;
  examples: string[];
  usage: 'simple' | 'continuous' | 'perfect';
}

export interface Translations {
  [key: string]: {
    en: string;
    ru: string;
    uz: string;
  };
}