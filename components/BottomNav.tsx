'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const items=[['/','首页'],['/learn','学单词'],['/quiz','测验'],['/wrong-words','错词本'],['/profile','我的']];
export default function BottomNav(){const path=usePathname();return <nav className='fixed bottom-0 inset-x-0 bg-white border-t'><div className='max-w-xl mx-auto grid grid-cols-5 text-xs'>{items.map(([href,label])=><Link key={href} href={href} className={`p-3 text-center ${path===href?'text-blue-600 font-semibold':'text-slate-500'}`}>{label}</Link>)}</div></nav>}
