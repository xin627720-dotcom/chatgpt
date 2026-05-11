import './globals.css';
import BottomNav from '@/components/BottomNav';
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang='zh-CN'><body><main className='max-w-xl mx-auto p-4 pb-20'>{children}</main><BottomNav/></body></html>}
