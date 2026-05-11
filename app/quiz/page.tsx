'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { allWords, getQuizHistory, getQuizSession, saveQuizHistory, saveQuizSession, updateReview } from '@/lib/store';

type Mode = 'en2cn' | 'cn2en' | 'spelling';
interface QuizState { mode: Mode; ids: string[]; index: number; score: number }

const MODES: Mode[] = ['en2cn', 'cn2en', 'spelling'];

const createIds = () => allWords.map((w) => w.id).sort(() => Math.random() - 0.5).slice(0, Math.min(20, allWords.length));
const buildChoices = (wordId: string) => {
  const base = allWords.find((w) => w.id === wordId);
  if (!base) return [];
  const distractors = allWords.filter((w) => w.id !== wordId).sort(() => Math.random() - 0.5).slice(0, 3);
  return [base, ...distractors].sort(() => Math.random() - 0.5);
};

export default function Quiz() {
  const [state, setState] = useState<QuizState | null>(null);
  const [picked, setPicked] = useState<string>();
  const [spell, setSpell] = useState('');
  const [choiceMap, setChoiceMap] = useState<Record<string, string[]>>({});

  const persist = (next: QuizState) => {
    setState(next);
    saveQuizSession({ mode: next.mode, questionWordIds: next.ids, index: next.index, score: next.score, answered: {} });
  };

  useEffect(() => {
    const session = getQuizSession();
    if (session?.questionWordIds?.length) {
      setState({ mode: session.mode, ids: session.questionWordIds, index: session.index, score: session.score });
      return;
    }
    setState({ mode: 'en2cn', ids: createIds(), index: 0, score: 0 });
  }, []);

  const words = useMemo(() => (state ? state.ids.map((id) => allWords.find((w) => w.id === id)).filter(Boolean) : []), [state]) as typeof allWords;

  useEffect(() => {
    if (!state) return;
    const map: Record<string, string[]> = {};
    state.ids.forEach((id) => { map[id] = buildChoices(id).map((w) => w.id); });
    setChoiceMap(map);
  }, [state?.ids?.join('|')]);

  if (!state) return null;
  const current = words[state.index];

  if (!current) {
    return (
      <div className="glass-card p-4 space-y-3">
        <h2 className="text-xl font-bold">测验完成</h2>
        <p>得分 {state.score}/{words.length}</p>
        <div className="grid grid-cols-2 gap-2">
          <button className="btn-primary" onClick={() => persist({ mode: state.mode, ids: createIds(), index: 0, score: 0 })}>再来一轮</button>
          <Link href="/" className="btn-soft text-center">返回首页</Link>
        </div>
      </div>
    );
  }

  const finish = (finalScore: number) => {
    const history = getQuizHistory();
    history.unshift({ id: Date.now().toString(), createdAt: new Date().toISOString(), total: words.length, correct: finalScore, score: Math.round((finalScore / words.length) * 100) });
    saveQuizHistory(history.slice(0, 20));
    saveQuizSession(null);
    setState((s) => (s ? { ...s, index: words.length, score: finalScore } : s));
  };

  const advance = (correct: boolean) => {
    const score = correct ? state.score + 1 : state.score;
    correct ? updateReview(current.id, 'know') : updateReview(current.id, 'dont');
    if (state.index >= words.length - 1) return finish(score);
    persist({ ...state, index: state.index + 1, score });
  };

  const options = (choiceMap[current.id] || []).map((id) => allWords.find((w) => w.id === id)).filter(Boolean) as typeof allWords;

  return (
    <div className="pb-16 space-y-3">
      <h1 className="text-xl font-bold">测验</h1>
      <div className="flex gap-2">
        {MODES.map((mode) => (
          <button key={mode} onClick={() => persist({ ...state, mode, index: 0, score: 0 })} className={`btn-soft ${state.mode === mode ? 'bg-slate-900 text-white' : ''}`}>
            {mode}
          </button>
        ))}
      </div>

      <p>第 {state.index + 1}/{words.length} 题 | 得分 {state.score}</p>

      {state.mode === 'spelling' ? (
        <div className="glass-card p-3 space-y-2">
          <p>{current.meaningCn}</p>
          <input className="w-full border rounded p-2" value={spell} onChange={(e) => setSpell(e.target.value)} placeholder="输入英文拼写" />
          <button className="btn-primary" onClick={() => { const ok = spell.trim().toLowerCase() === current.word.toLowerCase(); setSpell(''); advance(ok); }}>提交</button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="font-semibold">{state.mode === 'en2cn' ? current.word : current.meaningCn}</p>
          {options.map((o) => {
            const label = state.mode === 'en2cn' ? o.meaningCn : o.word;
            const cls = picked ? (o.id === current.id ? 'bg-green-100' : o.id === picked ? 'bg-rose-100' : '') : '';
            return (
              <button key={o.id} className={`w-full text-left border rounded p-2 transition ${cls}`} onClick={() => { if (picked) return; setPicked(o.id); setTimeout(() => { setPicked(undefined); advance(o.id === current.id); }, 220); }}>
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
