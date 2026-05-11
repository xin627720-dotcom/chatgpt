'use client';

import { allWords, getProgress, toggleFavorite, updateReview } from '@/lib/store';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function WordDetail() {
  const { id } = useParams<{ id: string }>();
  const word = allWords.find((x) => x.id === id);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!word) return;
    setIsFavorite(Boolean(getProgress()[word.id]?.isFavorite));
  }, [word]);

  if (!word) return <div>未找到单词</div>;

  const speak = (text: string) => {
    window.speechSynthesis?.speak(new SpeechSynthesisUtterance(text));
  };

  const onFavorite = () => {
    toggleFavorite(word.id);
    setIsFavorite(Boolean(getProgress()[word.id]?.isFavorite));
  };

  return (
    <div className="space-y-3 pb-16">
      <h1 className="text-2xl font-bold">{word.word}</h1>
      <p>{word.meaningCn} {word.pos ? `(${word.pos})` : ''}</p>
      <p className="text-slate-600">{word.definition || '—'}</p>
      <p>词根词缀：{word.rootAffix || '—'}</p>
      <p>同义词：{word.synonyms?.join('、') || '—'}</p>
      <p>反义词：{word.antonyms?.join('、') || '—'}</p>
      <p>搭配：{word.collocations?.join('；') || '—'}</p>
      <p>例句：{word.exampleSentences?.[0] || '—'}</p>
      <p>考试释义：{word.examMeanings?.join('；') || '—'}</p>
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => speak(word.word)} className="border rounded px-3 py-1">朗读单词</button>
        <button onClick={() => speak(word.exampleSentences?.[0] || word.word)} className="border rounded px-3 py-1">朗读例句</button>
        <button onClick={onFavorite} className="border rounded px-3 py-1">{isFavorite ? '取消收藏' : '收藏'}</button>
        <button onClick={() => updateReview(word.id, 'know')} className="bg-green-600 text-white rounded px-3 py-1">标记掌握</button>
      </div>
    </div>
  );
}
