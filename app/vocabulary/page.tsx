'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { allWords } from '@/lib/store';
export default function Vocab(){const [book,setBook]=useState<'basic_700'|'core_2050'>('basic_700');const [q,setQ]=useState('');const list=useMemo(()=>allWords.filter(w=>w.book===book&&(`${w.word}${w.meaningCn}`.toLowerCase().includes(q.toLowerCase()))),[book,q]);
return <div className='pb-16'><h1 className='text-xl font-bold mb-3'>词库列表</h1><div className='flex gap-2 mb-3'><button onClick={()=>setBook('basic_700')} className='px-3 py-1 border rounded'>700</button><button onClick={()=>setBook('core_2050')} className='px-3 py-1 border rounded'>2050</button></div><input className='w-full border rounded p-2 mb-3' value={q} onChange={e=>setQ(e.target.value)} placeholder='搜索' /><div className='space-y-2'>{list.map(w=><Link href={`/word/${w.id}`} key={w.id} className='block bg-white border rounded p-2'><div className='font-semibold'>{w.word}</div><div className='text-sm'>{w.meaningCn}</div></Link>)}</div></div>}
