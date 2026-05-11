'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { allWords, getProgress, saveProgress, updateReview } from '@/lib/store';
import { UserWordProgress } from '@/lib/types';
import Toast from '@/components/Toast';

export default function WrongWords() {
  const [progress, setProgress] = useState<Record<string, UserWordProgress>>({});
  const [toast, setToast] = useState('');

  const refresh = () => setProgress(getProgress());
  useEffect(() => refresh(), []);

  const list = useMemo(
    () => Object.values(progress).filter((v) => v.wrongCount > 0).sort((a, b) => b.wrongCount - a.wrongCount),
    [progress],
  );

  const setMastered = (id: string) => {
    const p = getProgress();
    p[id] = {
      ...(p[id] || { wordId: id, isFavorite: false, wrongCount: 0, fuzzyCount: 0, correctCount: 0, status: 'new' }),
      wordId: id,
      status: 'mastered',
      correctCount: Math.max(p[id]?.correctCount || 0, 3),
    };
    saveProgress(p);
    refresh();
    setToast('已移除');
  };

  const remove = (id: string) => {
    const p = getProgress();
    delete p[id];
    saveProgress(p);
    refresh();
    setToast('已标记为掌握');
  };

  useEffect(() => { if (!toast) return; const t=setTimeout(()=>setToast(''),1200); return ()=>clearTimeout(t); }, [toast]);

  return (
    <div className="space-y-2 pb-16">
      <Toast message={toast} />
      <h1 className="text-xl font-bold">错词本</h1>
      {list.map((item) => {
        const word = allWords.find((x) => x.id === item.wordId);
        if (!word) return null;
        return (
          <div key={word.id} className="bg-white border rounded p-3">
            <p className="font-semibold">{word.word}</p>
            <p className="text-sm">{word.meaningCn}</p>
            <p className="text-xs text-slate-500">错题次数 {item.wrongCount} | 上次错误 {item.lastReviewedAt || '-'} | 下次复习 {item.nextReviewAt || '-'}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              <Link href={`/word/${word.id}`} className="text-blue-600 text-sm">详情</Link>
              <button onClick={() => { updateReview(word.id, 'dont'); refresh(); setToast('已加入复习队列'); }} className="text-sm">重新学习</button>
              <button onClick={() => setMastered(word.id)} className="text-sm">标记掌握</button>
              <button onClick={() => remove(word.id)} className="text-sm text-rose-600">移除</button>
            </div>
          </div>
        );
      })}
      {!list.length && <p className="text-slate-500">暂无错词，继续保持！</p>}
    </div>
  );
}
