export type WordBook = 'basic_700' | 'core_2050';
export type WordStatus = 'new' | 'learning' | 'fuzzy' | 'mastered';

export interface Word { id:string; word:string; meaningCn:string; book:WordBook; letter:string; orderIndex:number }
export interface UserWordProgress { wordId:string; status:WordStatus; lastReviewedAt?:string; nextReviewAt?:string; correctCount:number; wrongCount:number; fuzzyCount:number; isFavorite:boolean }
export interface UserSettings { dailyNewWords:number; preferredBook:WordBook; reminderEnabled:boolean }
