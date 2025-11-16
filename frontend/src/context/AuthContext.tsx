"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials } from '@/types';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials, returnTo?: string | null) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load user from storage on mount
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials, returnTo?: string | null) => {
    try {
      const response = await authService.login(credentials);
      if (response.success && response.data.user) {
        setUser(response.data.user);
        
        // Handle returnTo for specific pages
        if (returnTo === 'membership') {
          const pendingMembershipPurchase = typeof window !== 'undefined' 
            ? localStorage.getItem('pendingMembershipPurchase') 
            : null;
          if (pendingMembershipPurchase) {
            router.push('/membership?restorePurchase=true');
            return;
          }
        }
        
        if (returnTo === 'tickets') {
          const pendingTicketPurchase = typeof window !== 'undefined' 
            ? localStorage.getItem('pendingTicketPurchase') 
            : null;
          if (pendingTicketPurchase) {
            router.push('/tickets?restorePurchase=true');
            return;
          }
        }
        
        // Default redirect based on role
        if (response.data.user.role === 'employee') {
          router.push('/admin');
        } else {
          router.push('/customer');
        }
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await authService.register(userData);
      if (response.success && response.data?.user) {
        // authService.register already stores token and user in localStorage
        // Update the context state
        setUser(response.data.user);
        
        // Redirect to customer page
        router.push('/customer');
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = async () => {
    if (user?.role === 'customer') {
      try {
        await authService.clearNotificationOnLogout('warning');
      } catch (error) {
        console.error('Failed to clear notifications on logout', error);
      }
    }
    authService.logout();
    setUser(null);
    router.push('/login');
  };

  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];

    // Check against the primary role first (employee vs customer)
    if (roleArray.includes(user.role)) {
      return true;
    }

    // Then check against the specific job role if the user is an employee
    if (user.role === 'employee' && user.job_role) {
      return roleArray.includes(user.job_role);
    }

    return false;
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
