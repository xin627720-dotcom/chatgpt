'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { checkinToday, dueWords, getMeta, getProgress, getSettings } from '@/lib/store';
import AnimatedNumber from '@/components/AnimatedNumber';
import { UserMeta, UserSettings, UserWordProgress } from '@/lib/types';

type Stats = {
  todayNew: number;
  due: number;
  mastered: number;
  wrong: number;
  favorite: number;
  dailyTask: string;
};

export default function Home() {
  const [progress, setProgress] = useState<Record<string, UserWordProgress>>({});
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [meta, setMeta] = useState<UserMeta>({ streak: 0, points: 0 });

  useEffect(() => {
    setProgress(getProgress());
    setSettings(getSettings());
    setMeta(getMeta());
  }, []);

  const stats = useMemo<Stats>(() => {
    const values = Object.values(progress);
    const today = new Date().toISOString().slice(0, 10);
    const dailyTarget = settings?.dailyNewWords ?? 20;
    return {
      todayNew: dailyTarget,
      due: dueWords(progress).length,
      mastered: values.filter((v) => v.status === 'mastered').length,
      wrong: values.filter((v) => v.wrongCount > 0).length,
      favorite: values.filter((v) => v.isFavorite).length,
      dailyTask: `${values.filter((v) => v.lastReviewedAt?.slice(0, 10) === today).length}/${dailyTarget}`,
    };
  }, [progress, settings]);

  return (
    <div className="space-y-4">
      <div className="glass-card p-4">
        <h1 className="text-2xl font-bold">高考英语词汇 App</h1>
        <p className="text-sm text-slate-600 mt-1">每日积累，科学复习，稳步提分。</p>
        <button className="btn-primary mt-3" onClick={() => setMeta(checkinToday())}>签到 +10 积分</button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          ['今日新词', stats.todayNew], ['到期复习', stats.due], ['掌握数', stats.mastered], ['错词数', stats.wrong],
          ['收藏数', stats.favorite], ['今日任务', stats.dailyTask], ['连续天数', meta.streak], ['积分', meta.points],
        ].map(([k, v]) => (
          <div key={String(k)} className="glass-card p-3">
            <p className="text-xs text-slate-500">{k}</p>
            <p className="font-semibold text-lg">{typeof v === 'number' ? <AnimatedNumber value={v} /> : v}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[['开始学习', '/learn'], ['词库', '/vocabulary'], ['错词本', '/wrong-words'], ['测验', '/quiz']].map(([t, h]) => (
          <Link key={String(h)} href={String(h)} className="btn-primary text-center">{t}</Link>
        ))}
      </div>
    </div>
  );
}
