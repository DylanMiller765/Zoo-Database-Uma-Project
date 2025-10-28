"use client";

import { usePathname } from 'next/navigation';
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    // For admin pages, don't render the public header, just the children
    // The admin layout will handle its own TopBar
    return <>{children}</>;
  }

  // For public pages, render the header and main wrapper
  return (
    <>
      {/* Hide the public navbar when a user is logged in (customer experience) */}
      {!isAuthenticated && <Header />}
      <main className="mx-auto max-w-[90rem] 2xl:max-w-[120rem] px-6 sm:px-8 lg:px-12 xl:px-16">
        {children}
      </main>
    </>
  );
}
