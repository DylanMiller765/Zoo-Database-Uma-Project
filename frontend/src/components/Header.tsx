'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ChevronDown, LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Helper: always navigate to "/#id" so it works from any page
  const to = (hash: string) => `/#${hash}`;

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    router.push('/');
  };

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
            <li><Link href={to('attractions')} className="hover:underline">Attractions</Link></li>
            <li><Link href={to('events')} className="hover:underline">Events</Link></li>
            <li><Link href={to('plan')} className="hover:underline">Visit</Link></li>
            <li><Link href={to('donate')} className="hover:underline">Donate</Link></li>
          </ul>
        </nav>

        {/* Right: User menu or Login/Get Tickets */}
        <div className="flex items-center justify-end w-0 min-w-fit gap-2 md:gap-3 ml-auto">
          {user ? (
            <>
              {/* Show Get Tickets button for customers */}
              {user.role === 'customer' && (
                <Link href="/tickets" className="rounded-full bg-sea_green-500 text-white px-4 py-1 font-semibold hover:bg-sea_green-600 transition">
                  Get Tickets
                </Link>
              )}

              {/* User dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 rounded-md border px-3 py-1.5 hover:bg-gray-50 transition"
                >
                  <span className="text-sm font-medium">
                    {user.first_name} {user.last_name}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg py-1">
                    {user.role === 'customer' && (
                      <Link
                        href="/customer"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition"
                      >
                        <UserIcon className="h-4 w-4" />
                        My Account
                      </Link>
                    )}

                    {user.role === 'employee' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <hr className="my-1" />

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition w-full text-left text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-md border px-3 py-1">Login</Link>
              <Link href="/tickets" className="rounded-full bg-sea_green-500 text-white px-4 py-1 font-semibold hover:bg-sea_green-600 transition">Get Tickets</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
