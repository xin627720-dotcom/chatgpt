'use client';

import basicOld from '@/data/vocab-basic-700.json';
import coreOld from '@/data/vocab-core-2050.json';
import basicEnhanced from '@/data/vocab-basic-700-enhanced.json';
import coreEnhanced from '@/data/vocab-core-2050-enhanced.json';
import { QuizSession, UserMeta, UserSettings, UserWordProgress, Word, WordBook } from './types';

const P = 'gk_progress_v2';
const S = 'gk_settings_v1';
const Q = 'gk_quiz_history_v2';
const QS = 'gk_quiz_session_v2';
const M = 'gk_meta_v1';

const defaultSettings: UserSettings = { dailyNewWords: 20, preferredBook: 'basic_700', reminderEnabled: false };
const defaultMeta: UserMeta = { streak: 0, points: 0 };

const readLS = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeLS = <T,>(key: string, value: T) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

const normalize = (rows: any[], book: WordBook): Word[] =>
  rows.map((r, i) => ({
    id: r.id || `${book}_${r.word}_${i}`.toLowerCase(),
    word: r.word,
    meaningCn: r.meaningCn || r.meaning || '',
    book,
    letter: (r.word?.[0] || '#').toUpperCase(),
    orderIndex: r.orderIndex ?? i,
    pos: r.pos,
    definition: r.definition,
    rootAffix: r.rootAffix,
    synonyms: r.synonyms || [],
    antonyms: r.antonyms || [],
    collocations: r.collocations || [],
    exampleSentences: r.exampleSentences || [],
    examMeanings: r.examMeanings || [],
    examExamples: r.examExamples || [],
    audio: r.audio,
  }));

const b = basicEnhanced?.length ? normalize(basicEnhanced as any[], 'basic_700') : normalize(basicOld as any[], 'basic_700');
const c = coreEnhanced?.length ? normalize(coreEnhanced as any[], 'core_2050') : normalize(coreOld as any[], 'core_2050');

export const allWords = [...b, ...c];
export const wordsByBook = (book: WordBook) => allWords.filter((w) => w.book === book);

export const getProgress = (): Record<string, UserWordProgress> => readLS(P, {});
export const saveProgress = (v: Record<string, UserWordProgress>) => writeLS(P, v);

export const getSettings = (): UserSettings => readLS(S, defaultSettings);
export const saveSettings = (s: UserSettings) => writeLS(S, s);

export const getMeta = (): UserMeta => readLS(M, defaultMeta);
export const saveMeta = (m: UserMeta) => writeLS(M, m);

export const getQuizHistory = (): any[] => readLS(Q, []);
export const saveQuizHistory = (v: any[]) => writeLS(Q, v);

export const getQuizSession = (): QuizSession | null => readLS(QS, null);
export const saveQuizSession = (v: QuizSession | null) => {
  if (!v) {
    if (typeof window !== 'undefined') localStorage.removeItem(QS);
    return;
  }
  writeLS(QS, v);
};

export function toggleFavorite(wordId: string) {
  const p = getProgress();
  const item = p[wordId] || { wordId, status: 'new', correctCount: 0, wrongCount: 0, fuzzyCount: 0, isFavorite: false };
  item.isFavorite = !item.isFavorite;
  p[wordId] = item;
  saveProgress(p);
}

export function updateReview(wordId: string, level: 'know' | 'fuzzy' | 'dont') {
  const p = getProgress();
  const now = new Date();
  const item = p[wordId] || { wordId, status: 'new', correctCount: 0, wrongCount: 0, fuzzyCount: 0, isFavorite: false };

  if (level === 'dont') {
    item.wrongCount++;
    item.status = 'learning';
    item.nextReviewAt = new Date(now.getTime() + 10 * 60 * 1000).toISOString();
  }
  if (level === 'fuzzy') {
    item.fuzzyCount++;
    item.status = 'fuzzy';
    item.nextReviewAt = new Date(now.getTime() + 86400000).toISOString();
  }
  if (level === 'know') {
    item.correctCount++;
    item.status = item.correctCount >= 3 ? 'mastered' : 'learning';
    item.nextReviewAt = new Date(now.getTime() + (item.status === 'mastered' ? 7 : 3) * 86400000).toISOString();
  }

  item.lastReviewedAt = now.toISOString();
  p[wordId] = item;
  saveProgress(p);
}

export const dueWords = (progress: Record<string, UserWordProgress>) =>
  Object.values(progress)
    .filter((v) => v.nextReviewAt && new Date(v.nextReviewAt) <= new Date())
    .map((v) => v.wordId);

export function checkinToday() {
  const m = getMeta();
  const today = new Date().toISOString().slice(0, 10);
  if (m.lastCheckinDate === today) return m;

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  m.streak = m.lastCheckinDate === yesterday ? m.streak + 1 : 1;
  m.points += 10;
  m.lastCheckinDate = today;
  saveMeta(m);
  return m;
}
