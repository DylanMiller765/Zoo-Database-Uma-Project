"use client";

import { Sidebar } from '@/components/admin/Sidebar';
import { TopBar } from '@/components/admin/TopBar';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !hasRole('employee'))) {
      router.push('/login');
    }
  }, [user, loading, hasRole, router]);

  if (loading || !user || !hasRole('employee')) {
    // You can return a loading spinner or null here
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <TopBar />
      <main className="lg:ml-64 pt-16">
        <div className="p-8 w-full">
          {children}
        </div>
      </main>
    </div>
  );

}
