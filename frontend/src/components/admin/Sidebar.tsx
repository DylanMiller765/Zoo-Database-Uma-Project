"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Leaf,
  Calendar,
  UserCircle,
  Store,
  Coffee,
  Ticket,
  Menu,
  X,
  Home,
  Activity,
  TrendingUp,
  DollarSign,
  UserCog
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  className?: string;
}

interface MenuItem {
  href: string;
  icon: any;
  label: string;
  roles: string[]; // Which roles can access this page
}

const menuItems: MenuItem[] = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', roles: ['manager', 'keeper', 'veterinarian', 'coordinator', 'cashier', 'guide', 'maintenance', 'security', 'other'] },
  { href: '/admin/animals', icon: Leaf, label: 'Animals', roles: ['manager', 'veterinarian', 'keeper'] },
  { href: '/admin/assignments', icon: UserCog, label: 'Assignments', roles: ['manager'] },
  { href: '/admin/habitats', icon: Home, label: 'Habitats', roles: ['manager', 'veterinarian', 'keeper'] },
  { href: '/admin/employees', icon: Users, label: 'Employees', roles: ['manager'] },
  { href: '/admin/events', icon: Calendar, label: 'Events', roles: ['manager', 'coordinator', 'guide'] },
  { href: '/admin/customers', icon: UserCircle, label: 'Customers', roles: ['manager'] },
  { href: '/admin/transactions', icon: DollarSign, label: 'Transactions', roles: ['manager'] },
  { href: '/admin/gift-shops', icon: Store, label: 'Gift Shops', roles: ['manager', 'cashier'] },
  { href: '/admin/cafes', icon: Coffee, label: 'Cafes', roles: ['manager', 'cashier'] },
  { href: '/admin/queries/animal-health-care', icon: Activity, label: 'Animal Health & Care', roles: ['manager', 'keeper', 'veterinarian'] },
  { href: '/admin/queries/event-performance', icon: TrendingUp, label: 'Event Performance', roles: ['manager', 'coordinator'] },
  { href: '/admin/queries/financial-report', icon: DollarSign, label: 'Financial Report', roles: ['manager'] },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  // Filter menu items based on user's role
  const visibleMenuItems = menuItems.filter(item =>
    user?.job_role && item.roles.includes(user.job_role)
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-dark_spring_green-500 text-white rounded-md"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-200",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className
        )}
      >
        {/* Logo/Header */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200 bg-gradient-to-r from-dark_spring_green-50 to-sea_green-50">
          <Link href="/admin" className="flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-dark_spring_green-600" />
            <span className="font-bold text-lg text-dark_spring_green-700">Zoo Admin</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {visibleMenuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium",
                      isActive
                        ? "bg-dark_spring_green-500 text-white"
                        : "text-gray-700 hover:bg-sea_green-50 hover:text-dark_spring_green-600"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            ZooVerse Management System
          </p>
        </div>
      </aside>
    </>
  );
}
