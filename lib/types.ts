export type WordBook = 'basic_700' | 'core_2050';
export type WordStatus = 'new' | 'learning' | 'fuzzy' | 'mastered';

export interface Word {
  id: string;
  word: string;
  meaningCn: string;
  book: WordBook;
  letter: string;
  orderIndex: number;
  pos?: string;
  definition?: string;
  rootAffix?: string;
  synonyms?: string[];
  antonyms?: string[];
  collocations?: string[];
  exampleSentences?: string[];
  examMeanings?: string[];
  examExamples?: string[];
  audio?: string;
}

export interface UserWordProgress {
  wordId: string;
  status: WordStatus;
  lastReviewedAt?: string;
  nextReviewAt?: string;
  correctCount: number;
  wrongCount: number;
  fuzzyCount: number;
  isFavorite: boolean;
}

export interface UserSettings { dailyNewWords: number; preferredBook: WordBook; reminderEnabled: boolean }
export interface QuizSession { mode: 'en2cn'|'cn2en'|'spelling'; index: number; score: number; questionWordIds: string[]; answered: Record<string,boolean>; }
export interface UserMeta { lastCheckinDate?: string; streak: number; points: number }
