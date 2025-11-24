"use client";

import { useState, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';

function RegisterPageContent() {
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Phone number must be exactly 10 digits';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    setError('');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setFormData(prev => ({ ...prev, phone: value }));
      
      // Validate phone number - must be exactly 10 digits if provided
      if (value.length > 0 && value.length !== 10) {
        setFieldErrors(prev => ({ ...prev, phone: 'Phone number must be exactly 10 digits' }));
      } else {
        setFieldErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.phone;
          return newErrors;
        });
      }
      
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare registration data (exclude confirmPassword)
      const { confirmPassword, ...registrationData } = formData;
      
      // Use AuthContext register function which handles state update and redirect
      await register(registrationData);
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-dark_spring_green-500 via-sea_green-400 to-dark_spring_green-600 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 right-20 w-32 h-32 bg-light_yellow-300/20 rounded-full blur-2xl"></div>
        <div className="absolute top-40 right-10 w-24 h-24 bg-melon-300/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-60 left-40 w-20 h-20 bg-persian_orange-300/20 rounded-full blur-xl"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="text-5xl">🦁</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
            ZooVerse
          </h1>
          <p className="text-xl text-white/90 font-light">
            Join our community today!
          </p>
        </div>

        <div className="relative z-10 space-y-5 text-white/90">
          {/* Feature sections can be dynamically shown based on user type if needed */}
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-8 py-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Create Account
            </h2>
            <p className="text-gray-600 text-lg">
              Sign up to start your ZooVerse journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-5 py-4 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-5">
              {/* First Name and Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={handleChange}
                    className={`input-field ${fieldErrors.first_name ? 'border-red-500' : ''}`}
                    placeholder="John"
                    disabled={isLoading}
                  />
                  {fieldErrors.first_name && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.first_name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={handleChange}
                    className={`input-field ${fieldErrors.last_name ? 'border-red-500' : ''}`}
                    placeholder="Doe"
                    disabled={isLoading}
                  />
                  {fieldErrors.last_name && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.last_name}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-field ${fieldErrors.email ? 'border-red-500' : ''}`}
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`input-field pr-12 ${fieldErrors.password ? 'border-red-500' : ''}`}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`input-field pr-12 ${fieldErrors.confirmPassword ? 'border-red-500' : ''}`}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  maxLength={10}
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className={`input-field ${fieldErrors.phone || (formData.phone && formData.phone.length !== 10) ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="1234567890"
                  disabled={isLoading}
                />
                {fieldErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">10 digits (optional)</p>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="123 Main St"
                  disabled={isLoading}
                />
              </div>

              {/* City, State, Zip */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="City"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="ST"
                    maxLength={2}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="zip_code" className="block text-sm font-semibold text-gray-700 mb-2">
                  Zip Code
                </label>
                <input
                  id="zip_code"
                  name="zip_code"
                  type="text"
                  value={formData.zip_code}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="12345"
                  maxLength={10}
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center justify-center space-x-2 w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-dark_spring_green-600 hover:text-dark_spring_green-700 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sea_green-600"></div>
      </div>
    }>
      <RegisterPageContent />
    </Suspense>
  );
}

