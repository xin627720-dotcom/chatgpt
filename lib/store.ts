'use client';
import basic from '@/data/vocab-basic-700.json';
import core from '@/data/vocab-core-2050.json';
import { UserSettings, UserWordProgress, Word, WordBook } from './types';

const P='gk_progress_v1', S='gk_settings_v1', Q='gk_quiz_v1';
export const allWords=[...basic,...core] as Word[];
export const wordsByBook=(b:WordBook)=>allWords.filter(w=>w.book===b);
export const getProgress=():Record<string,UserWordProgress>=>{ if (typeof window==='undefined') return {}; return JSON.parse(localStorage.getItem(P)||'{}'); };
export const saveProgress=(v:Record<string,UserWordProgress>)=>{ if (typeof window==='undefined') return; localStorage.setItem(P,JSON.stringify(v)); };
export const getSettings=():UserSettings=>{ if (typeof window==='undefined') return {dailyNewWords:20, preferredBook:'basic_700', reminderEnabled:false}; return JSON.parse(localStorage.getItem(S)||'{"dailyNewWords":20,"preferredBook":"basic_700","reminderEnabled":false}'); };
export const saveSettings=(s:UserSettings)=>{ if (typeof window==='undefined') return; localStorage.setItem(S,JSON.stringify(s)); };
export const getQuizHistory=()=>{ if (typeof window==='undefined') return []; return JSON.parse(localStorage.getItem(Q)||'[]') as any[]; };
export const saveQuizHistory=(v:any[])=>{ if (typeof window==='undefined') return; localStorage.setItem(Q,JSON.stringify(v)); };

export function updateReview(wordId:string, level:'know'|'fuzzy'|'dont'){
  const p=getProgress(); const now=new Date();
  const item=p[wordId]||{wordId,status:'new',correctCount:0,wrongCount:0,fuzzyCount:0,isFavorite:false};
  if(level==='dont'){ item.wrongCount++; item.status='learning'; item.nextReviewAt=new Date(now.getTime()+10*60*1000).toISOString(); }
  if(level==='fuzzy'){ item.fuzzyCount++; item.status='fuzzy'; item.nextReviewAt=new Date(now.getTime()+2*86400000).toISOString(); }
  if(level==='know'){ item.correctCount++; item.status=item.correctCount>=3?'mastered':'learning'; item.nextReviewAt=new Date(now.getTime()+3*86400000).toISOString(); }
  item.lastReviewedAt=now.toISOString(); p[wordId]=item; saveProgress(p);
}
