'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const items = [['/', '首页'], ['/learn', '学单词'], ['/quiz', '测验'], ['/wrong-words', '错词本'], ['/profile', '我的']];
export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className='fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t'>
      <div className='max-w-4xl mx-auto grid grid-cols-5 text-xs md:text-sm'>
        {items.map(([href, label]) => (
          <Link key={href} href={href} className={`p-3 md:p-4 text-center ${path === href ? 'text-blue-600 font-semibold' : 'text-slate-500'}`}>
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
