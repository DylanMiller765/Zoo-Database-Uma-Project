'use client';

import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import NotificationBanner from "@/components/NotificationBanner";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <AuthProvider>
          {!isAdminRoute && <Header />}
          <NotificationBanner />
          <main className={isAdminRoute ? '' : "mx-auto max-w-[90rem] 2xl:max-w-[120rem] px-6 sm:px-8 lg:px-12 xl:px-16"}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
