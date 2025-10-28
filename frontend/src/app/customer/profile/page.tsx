"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth.service";
import apiClient from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

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
  const [profile, setProfile] = React.useState<any>(null);

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
  };

  const onSave = async () => {
    try {
      setSaving(true);
      await authService.updateProfile(form);
      await load();
      router.push("/customer");
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Basic required-field guard; browser will also enforce `required`
    if (!form.first_name || !form.last_name || !form.email) {
      setError("Please fill in all required fields (First name, Last name, Email).");
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
    <form className="space-y-6" onSubmit={onSubmit} noValidate>
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
        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-5 py-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Personal Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">First Name<span className="text-red-600"> *</span></label>
              <input 
                name="first_name" 
                value={form.first_name} 
                onChange={onChange} 
                required
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-dark_spring_green-500" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Last Name<span className="text-red-600"> *</span></label>
              <input 
                name="last_name" 
                value={form.last_name} 
                onChange={onChange} 
                required
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-dark_spring_green-500" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email<span className="text-red-600"> *</span></label>
              <input 
                name="email" 
                type="email"
                value={form.email} 
                onChange={onChange} 
                required
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-dark_spring_green-500" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input 
                name="phone" 
                value={form.phone} 
                onChange={onChange} 
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-dark_spring_green-500" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Street Address</label>
              <input 
                name="address" 
                value={form.address} 
                onChange={onChange} 
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-dark_spring_green-500" 
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">City</label>
                <input 
                  name="city" 
                  value={form.city} 
                  onChange={onChange} 
                  className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-dark_spring_green-500" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">State</label>
                <input 
                  name="state" 
                  value={form.state} 
                  onChange={onChange} 
                  className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-dark_spring_green-500" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">ZIP Code</label>
                <input 
                  name="zip_code" 
                  value={form.zip_code} 
                  onChange={onChange} 
                  className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-dark_spring_green-500" 
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex gap-3">
        <Button type="submit" disabled={saving} className="px-6">
          {saving ? "Saving…" : "Save Changes"}
        </Button>
        <Button onClick={() => router.push("/customer")} variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  );
}
