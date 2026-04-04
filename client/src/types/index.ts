export interface Word {
  id: number;
  english: string;
  korean: string;
  pronunciation: string | null;
  exampleSentence: string | null;
  exampleTranslation: string | null;
  wrongCount: number;
  correctCount: number;
  studyDate: string;
  lastStudiedAt: string | null;
}

export interface QuizQuestion {
  wordId: number;
  korean: string;
  pronunciation: string | null;
  totalWords: number;
}

export interface QuizResult {
  correct: boolean;
  correctAnswer: string;
  korean: string;
  exampleSentence: string | null;
  exampleTranslation: string | null;
  wrongCount: number;
}

export type FlashcardMode = 'hide_english' | 'hide_korean' | 'random';

export interface WordPreview {
  number: number;
  english: string;
  korean: string;
  pronunciation: string;
}

export interface WordDetail {
  number: number;
  english: string;
  korean: string;
  pronunciation: string;
  examples: Array<{ english: string; korean: string }>;
  grammar: string[];
  vocabulary: Array<{ word: string; meaning: string }>;
}

export interface TodayStudyData {
  date: string;
  preview: WordPreview[];
  details: WordDetail[];
}
