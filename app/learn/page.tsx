'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { allWords, getProgress, toggleFavorite, updateReview } from '@/lib/store';

export default function Learn() {
  const words = useMemo(() => allWords, []);
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const word = words[idx % words.length];
  const progress = getProgress()[word.id];

  const speak = (text: string) => {
    if (!text) return;
    window.speechSynthesis?.cancel();
    window.speechSynthesis?.speak(new SpeechSynthesisUtterance(text));
  };

  const act = (type: 'know' | 'fuzzy' | 'dont') => {
    updateReview(word.id, type);
    setShow(false);
    setIdx((v) => v + 1);
  };

  const onFavorite = () => {
    toggleFavorite(word.id);
    setRefresh((v) => v + 1);
  };

  return (
    <div className="space-y-4 pb-16">
      <h1 className="text-xl font-bold">学习模式升级</h1>
      <div className="bg-white border rounded-xl p-5">
        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold">{word.word}</p>
          <span key={refresh} className="text-sm text-slate-500">{progress?.isFavorite ? '已收藏' : '未收藏'}</span>
        </div>

        {show && (
          <div className="mt-4 space-y-2">
            <p>{word.meaningCn}</p>
            <p className="text-sm text-slate-600">{word.definition || '—'}</p>
            <p className="text-sm">搭配：{word.collocations?.join('；') || '—'}</p>
            <p className="text-sm">例句：{word.exampleSentences?.[0] || '—'}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button className="border rounded p-2" onClick={() => setShow(true)}>显示释义</button>
        <button className="border rounded p-2" onClick={() => speak(word.word)}>🔊朗读</button>
        <button className="border rounded p-2" onClick={onFavorite}>⭐收藏</button>
        <Link href={`/word/${word.id}`} className="border rounded p-2 text-center">详情</Link>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button className="bg-green-600 text-white p-2 rounded" onClick={() => act('know')}>认识</button>
        <button className="bg-amber-500 text-white p-2 rounded" onClick={() => act('fuzzy')}>模糊</button>
        <button className="bg-rose-600 text-white p-2 rounded" onClick={() => act('dont')}>不认识</button>
      </div>
    </div>
  );
}
