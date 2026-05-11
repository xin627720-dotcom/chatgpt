'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { allWords, getProgress, getSettings } from '@/lib/store';

export default function Home(){const [loaded,setLoaded]=useState(false);const [progress,setProgress]=useState<any>({});const [settings,setSettings]=useState<any>(null);
useEffect(()=>{setProgress(getProgress());setSettings(getSettings());setLoaded(true)},[]);
const stats=useMemo(()=>{const vals=Object.values(progress) as any[];const due=vals.filter(v=>v.nextReviewAt&&new Date(v.nextReviewAt)<=new Date()).length;const basic=allWords.filter(w=>w.book==='basic_700');const core=allWords.filter(w=>w.book==='core_2050');const mastered=(ids:string[])=>ids.filter(id=>progress[id]?.status==='mastered').length;return {due,basic:`${mastered(basic.map(v=>v.id))}/${basic.length}`,core:`${mastered(core.map(v=>v.id))}/${core.length}`}},[progress]);
if(!loaded)return null;return <div className='space-y-4'><h1 className='text-2xl font-bold'>高考英语词汇底座</h1><div className='grid grid-cols-2 gap-3'>{[['今日新词',settings.dailyNewWords],['今日复习',stats.due],['700进度',stats.basic],['2050进度',stats.core]].map(([k,v])=><div className='bg-white p-3 rounded-xl border' key={String(k)}><p className='text-xs text-slate-500'>{k}</p><p className='text-lg font-semibold'>{v}</p></div>)}</div><div className='grid grid-cols-2 gap-3'>{[['开始学习','/learn'],['搜索单词','/vocabulary'],['错词本','/wrong-words'],['开始测验','/quiz']].map(([t,h])=><Link key={String(h)} href={String(h)} className='bg-blue-600 text-white rounded-xl p-3 text-center'>{t}</Link>)}</div></div>}
