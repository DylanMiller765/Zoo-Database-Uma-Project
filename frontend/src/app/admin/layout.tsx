"use client";

import { AuthProvider } from '@/context/AuthContext';
import { Sidebar } from '@/components/admin/Sidebar';
import { TopBar } from '@/components/admin/TopBar';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return (
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <TopBar />
        <main className="lg:ml-64 pt-16">
          <div className="p-8 w-full">
            {children}
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}
