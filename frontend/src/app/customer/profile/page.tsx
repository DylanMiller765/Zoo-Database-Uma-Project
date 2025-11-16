"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth.service";
import apiClient from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Mail, Phone, MapPin, Save, Loader2, CheckCircle2 } from 'lucide-react';

type ProfileResponse = {
  success: boolean;
  data: any;
};

export default function CustomerProfilePage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [fetching, setFetching] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [profile, setProfile] = React.useState<any>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});

  const [form, setForm] = React.useState({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
  });

  React.useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace("/login");
        return;
      }
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, isAuthenticated]);

  const load = async () => {
    try {
      setFetching(true);
      const res = await apiClient.get<ProfileResponse>("/auth/profile");
      const data = res.data.data;
      setProfile(data);
      setForm({
        email: data?.customer_email || data?.email || "",
        first_name: data?.customer_first_name || data?.employee_first_name || "",
        last_name: data?.customer_last_name || data?.employee_last_name || "",
        phone: data?.customer_phone || data?.employee_phone || "",
        address: data?.address || "",
        city: data?.city || "",
        state: data?.state || "",
        zip_code: data?.zip_code || "",
      });
      setError(null);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to load profile");
    } finally {
      setFetching(false);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    setError(null);
    setSuccess(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setForm(prev => ({ ...prev, phone: value }));
      
      // Clear field error when user starts typing
      if (fieldErrors.phone) {
        setFieldErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.phone;
          return newErrors;
        });
      }
      
      setError(null);
      setSuccess(false);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!form.first_name.trim()) {
      errors.first_name = 'First name is required';
    }

    if (!form.last_name.trim()) {
      errors.last_name = 'Last name is required';
    }

    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) {
      errors.phone = 'Phone number must be exactly 10 digits';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      await authService.updateProfile(form);
      setSuccess(true);
      
      // Reload profile data
      await load();
      
      // Show success message briefly before redirecting
      setTimeout(() => {
        router.push("/customer");
      }, 1500);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError("Please fix the errors in the form before saving.");
      return;
    }
    
    await onSave();
  };

  if (loading || fetching) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark_spring_green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button onClick={() => router.push("/customer")} variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600 mt-1">Update your account information</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-5 py-4 rounded-lg flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 text-green-700 px-5 py-4 rounded-lg flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Success!</p>
            <p className="text-sm mt-1">Your profile has been updated successfully.</p>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="space-y-6">

        {/* Personal Details */}
        <Card className="border-2 border-gray-100 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-sea_green-50 to-dark_spring_green-50 border-b border-gray-200">
            <CardTitle className="text-xl flex items-center gap-2 text-gray-900">
              <div className="p-2 rounded-lg bg-sea_green-100">
                <User className="h-5 w-5 text-sea_green-700" />
              </div>
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="first_name" className="block text-sm font-semibold text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input 
                  id="first_name"
                  name="first_name" 
                  value={form.first_name} 
                  onChange={onChange} 
                  required
                  className={`w-full rounded-lg border px-4 py-3 transition-all focus:outline-none focus:ring-2 ${
                    fieldErrors.first_name 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-sea_green-500 focus:border-sea_green-500'
                  }`}
                  placeholder="Enter your first name"
                />
                {fieldErrors.first_name && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.first_name}</p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="last_name" className="block text-sm font-semibold text-gray-700">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input 
                  id="last_name"
                  name="last_name" 
                  value={form.last_name} 
                  onChange={onChange} 
                  required
                  className={`w-full rounded-lg border px-4 py-3 transition-all focus:outline-none focus:ring-2 ${
                    fieldErrors.last_name 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-sea_green-500 focus:border-sea_green-500'
                  }`}
                  placeholder="Enter your last name"
                />
                {fieldErrors.last_name && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.last_name}</p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  <Mail className="inline h-4 w-4 mr-1 text-gray-500" />
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input 
                  id="email"
                  name="email" 
                  type="email"
                  value={form.email} 
                  onChange={onChange} 
                  required
                  className={`w-full rounded-lg border px-4 py-3 transition-all focus:outline-none focus:ring-2 ${
                    fieldErrors.email 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-sea_green-500 focus:border-sea_green-500'
                  }`}
                  placeholder="you@example.com"
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                  <Phone className="inline h-4 w-4 mr-1 text-gray-500" />
                  Phone Number
                </label>
                <input 
                  id="phone"
                  name="phone" 
                  type="tel"
                  maxLength={10}
                  value={form.phone} 
                  onChange={handlePhoneChange} 
                  className={`w-full rounded-lg border px-4 py-3 transition-all focus:outline-none focus:ring-2 ${
                    fieldErrors.phone 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-sea_green-500 focus:border-sea_green-500'
                  }`}
                  placeholder="1234567890"
                />
                {fieldErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">10 digits (optional)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Details */}
        <Card className="border-2 border-gray-100 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-sea_green-50 to-dark_spring_green-50 border-b border-gray-200">
            <CardTitle className="text-xl flex items-center gap-2 text-gray-900">
              <div className="p-2 rounded-lg bg-sea_green-100">
                <MapPin className="h-5 w-5 text-sea_green-700" />
              </div>
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label htmlFor="address" className="block text-sm font-semibold text-gray-700">
                  Street Address
                </label>
                <input 
                  id="address"
                  name="address" 
                  value={form.address} 
                  onChange={onChange} 
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-sea_green-500 focus:border-sea_green-500" 
                  placeholder="123 Main Street"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label htmlFor="city" className="block text-sm font-semibold text-gray-700">
                    City
                  </label>
                  <input 
                    id="city"
                    name="city" 
                    value={form.city} 
                    onChange={onChange} 
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-sea_green-500 focus:border-sea_green-500" 
                    placeholder="City"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="state" className="block text-sm font-semibold text-gray-700">
                    State
                  </label>
                  <input 
                    id="state"
                    name="state" 
                    value={form.state} 
                    onChange={onChange} 
                    maxLength={2}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-sea_green-500 focus:border-sea_green-500 uppercase" 
                    placeholder="ST"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="zip_code" className="block text-sm font-semibold text-gray-700">
                    ZIP Code
                  </label>
                  <input 
                    id="zip_code"
                    name="zip_code" 
                    value={form.zip_code} 
                    onChange={onChange} 
                    maxLength={10}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-sea_green-500 focus:border-sea_green-500" 
                    placeholder="12345"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex gap-3 pt-4">
          <Button 
            type="submit" 
            disabled={saving} 
            className="px-8 py-3 bg-sea_green-600 hover:bg-sea_green-700 text-white flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
          <Button 
            onClick={() => router.push("/customer")} 
            variant="outline"
            className="px-8 py-3"
            disabled={saving}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
