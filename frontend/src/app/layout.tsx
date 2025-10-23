import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "ZooVerse 12",
  description: "Simple zoo template",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <Header />
  <main className="mx-auto max-w-[90rem] 2xl:max-w-none px-4 sm:px-6 lg:px-8">{children}</main>
      </body>
    </html>
  );
}
