import type { Metadata, Viewport } from 'next';
import './globals.css';
import BottomNav from '@/components/BottomNav';
import PwaRegister from '@/components/PwaRegister';

export const metadata: Metadata = {
  title: '高考英语词汇学习',
  description: '个人自用的高考英语词汇学习 PWA',
  applicationName: '高考英语词汇学习',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '词汇学习'
  },
  formatDetection: { telephone: false }
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='zh-CN'>
      <body>
        <PwaRegister />
        <main className='max-w-xl mx-auto p-4 pb-20'>{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
