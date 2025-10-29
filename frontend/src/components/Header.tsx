'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  // Helper: always navigate to "/#id" so it works from any page
  const to = (hash: string) => `/#${hash}`;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b w-full">
      <div className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 py-3">
        {/* Left: Logo flush left */}
        <div className="flex items-center justify-start w-0 min-w-fit">
          <Link href="/" className="font-bold text-lg whitespace-nowrap">ZooVerse 12</Link>
        </div>

        {/* Center: Nav absolutely centered */}
        <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <ul className="flex items-center gap-5 md:gap-6 xl:gap-8 text-sm lg:text-[15px]">
            <li><Link href={to('exhibits')} className="hover:underline">Exhibits</Link></li>
            {/* Temporary: hide Attractions from navbar for now; leave code for later re-enable */}
            {false && (
              <li><Link href={to('attractions')} className="hover:underline">Attractions</Link></li>
            )}
            <li><Link href={to('events')} className="hover:underline">Events</Link></li>
            <li><Link href={to('plan')} className="hover:underline">Visit</Link></li>
            <li><Link href={to('donate')} className="hover:underline">Donate</Link></li>
          </ul>
        </nav>

        {/* Right: Login and Get Tickets flush right */}
        <div className="flex items-center justify-end w-0 min-w-fit gap-2 md:gap-3 ml-auto">
          <Link href="/login" className="rounded-md border px-3 py-1">Login</Link>
          <Link href="/tickets" className="rounded-full bg-sea_green-500 text-white px-4 py-1 font-semibold hover:bg-sea_green-600 transition">Get Tickets</Link>
        </div>
      </div>
    </header>
  );
}
