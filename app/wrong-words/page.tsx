'use client';
import { useEffect, useState } from 'react';
import { allWords, getProgress, updateReview } from '@/lib/store';
export default function WrongWords(){const [ids,setIds]=useState<string[]>([]);useEffect(()=>{const p=getProgress();setIds(Object.values(p).filter((v:any)=>v.wrongCount>0||v.isFavorite).map((v:any)=>v.wordId));},[]);const words=allWords.filter(w=>ids.includes(w.id));
return <div><h1 className='text-xl font-bold mb-3'>错词本</h1><div className='space-y-2'>{words.map(w=><div key={w.id} className='bg-white border rounded p-3'><p className='font-semibold'>{w.word}</p><p className='text-sm'>{w.meaningCn}</p><button className='mt-2 text-sm text-blue-600' onClick={()=>updateReview(w.id,'know')}>复习为“认识”</button></div>)}</div>{!words.length&&<p className='text-slate-500'>暂无错词。</p>}</div>}
