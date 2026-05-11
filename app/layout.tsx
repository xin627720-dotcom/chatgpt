import type { Metadata, Viewport } from 'next';
import './globals.css';
import BottomNav from '@/components/BottomNav';
import PwaRegister from '@/components/PwaRegister';

export const metadata: Metadata = {
  title: '高考英语词汇底座',
  description: '高考英语词汇学习 App（个人版）',
  applicationName: '高考英语词汇底座',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '词汇底座'
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
        <main className='max-w-4xl mx-auto p-4 md:p-6 pb-24'>{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
