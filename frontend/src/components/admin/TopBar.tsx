"use client";

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function TopBar() {
  const { user, logout } = useAuth();

  const getRoleBadgeVariant = (role: string): "default" | "secondary" | "success" | "warning" | "danger" | "outline" => {
    if (role === 'manager') return 'success';
    if (role === 'keeper') return 'secondary';
    if (role === 'veterinarian') return 'warning';
    return 'default';
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-0 lg:left-64 z-20">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left side - Page title or breadcrumbs could go here */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Welcome, {user?.first_name || 'User'}
          </h1>
        </div>

        {/* Right side - User info and actions */}
        <div className="flex items-center space-x-4">
          {/* User info */}
          <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-dark_spring_green-100 text-dark_spring_green-700 font-semibold">
              <User className="h-4 w-4" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">{user?.first_name} {user?.last_name}</p>
              {user?.job_role && (
                <Badge variant={getRoleBadgeVariant(user.job_role)} className="mt-0.5 text-xs">
                  {user.job_role}
                </Badge>
              )}
            </div>
          </div>

          {/* Logout */}
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
