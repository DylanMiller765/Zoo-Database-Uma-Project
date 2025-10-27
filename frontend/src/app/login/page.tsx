'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import authService from '@/services/auth.service';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });

      if (response.success) {
        // Redirect based on role
        if (response.data.user.role === 'employee') {
          router.push('/dashboard');
        } else {
          router.push('/customer');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Nature-Inspired Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-dark_spring_green-500 via-sea_green-400 to-dark_spring_green-600 p-12 flex-col justify-between relative overflow-hidden">
        {/* Organic decorative elements - like leaves floating */}
        <div className="absolute top-10 right-20 w-32 h-32 bg-light_yellow-300/20 rounded-full blur-2xl"></div>
        <div className="absolute top-40 right-10 w-24 h-24 bg-melon-300/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-60 left-40 w-20 h-20 bg-persian_orange-300/20 rounded-full blur-xl"></div>

        {/* Subtle leaf/nature pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15zm0 25c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10z' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }}></div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="text-5xl">🌿</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
            Welcome to ZooVerse
          </h1>
          <p className="text-xl text-white/90 font-light">
            Explore nature's wonders and manage your membership
          </p>
        </div>

        <div className="relative z-10 space-y-5 text-white/90">
          <div className="flex items-start space-x-4 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🎫</span>
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg mb-1">Book Tickets</h3>
              <p className="text-sm text-white/80">Purchase tickets and plan your visit</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🎉</span>
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg mb-1">Events & Programs</h3>
              <p className="text-sm text-white/80">Join exclusive events and educational programs</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">💎</span>
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg mb-1">Membership Benefits</h3>
              <p className="text-sm text-white/80">Manage your membership and enjoy perks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Clean Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <h1 className="text-3xl font-bold text-dark_spring_green-600 mb-2">
              ZooVerse
            </h1>
            <p className="text-gray-600">Customer Portal</p>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Customer Sign In
            </h2>
            <p className="text-gray-600 text-lg">
              Access your account to manage tickets and memberships
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-5 py-4 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pr-12"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">New to ZooVerse? <Link href="/register" className="text-dark_spring_green-600 hover:text-dark_spring_green-700 font-semibold">Create an account</Link></p>
            <Link href="/admin/login" className="block text-sm text-gray-500 hover:text-gray-700">
              Staff Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
