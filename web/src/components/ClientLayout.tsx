'use client';

import Sidebar from '@/components/Sidebar';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      {!isLoginPage && <Sidebar />}
      <main className="flex-1 overflow-x-hidden relative">
        {children}
      </main>
    </div>
  );
}
