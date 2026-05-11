'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  ['/','首页','🏠'],
  ['/learn','学单词','📘'],
  ['/quiz','测验','📝'],
  ['/wrong-words','错词本','📌'],
  ['/profile','我的','👤'],
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-20">
      <div className="max-w-xl mx-auto m-2 rounded-2xl bg-white/90 backdrop-blur border border-slate-200 shadow-lg">
        <div className="grid grid-cols-5 text-xs">
          {items.map(([href, label, icon]) => {
            const active = path === href;
            return (
              <Link key={href} href={href} className={`p-2.5 text-center transition ${active ? 'text-blue-600 font-semibold' : 'text-slate-500'}`}>
                <div>{icon}</div>
                <div>{label}</div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
