"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth.service";
import apiClient from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Mail, Phone, MapPin, Save, Loader2, CheckCircle2, CreditCard, Trash2, X, AlertTriangle, Plus, Edit } from 'lucide-react';

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
  const [paymentMethod, setPaymentMethod] = React.useState<any>(null);
  const [deletingPayment, setDeletingPayment] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [autoRenew, setAutoRenew] = React.useState<boolean>(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = React.useState(false);
  const [savingPayment, setSavingPayment] = React.useState(false);
  
  // Payment form state
  const [paymentForm, setPaymentForm] = React.useState({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
  });
  const [paymentErrors, setPaymentErrors] = React.useState<Record<string, string>>({});

  // Helper function to format card number
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

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
      const [profileRes, paymentRes] = await Promise.all([
        apiClient.get<ProfileResponse>("/auth/profile"),
        apiClient.get("/me/payment-method").catch(() => ({ data: { success: true, data: null } })) // Silently fail if no payment method
      ]);
      const data = profileRes.data.data;
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
      // Load auto-renewal status
      if (data?.membership_auto_renew !== undefined) {
        setAutoRenew(data.membership_auto_renew);
      }
      if (paymentRes.data && paymentRes.data.data) {
        setPaymentMethod(paymentRes.data.data);
        // If payment method exists, pre-fill form for editing
        if (paymentRes.data.data.card_number_full) {
          try {
            const cardNum = paymentRes.data.data.card_number_full;
            const formattedCard = formatCardNumber(cardNum);
            setPaymentForm({
              cardNumber: formattedCard,
              cardholderName: paymentRes.data.data.cardholder_name || '',
              expiryMonth: paymentRes.data.data.expiry_month ? String(paymentRes.data.data.expiry_month).padStart(2, '0') : '',
              expiryYear: paymentRes.data.data.expiry_year ? String(paymentRes.data.data.expiry_year) : '',
              cvv: '', // Never pre-fill CVV
              billingAddress: paymentRes.data.data.billing_address || '',
              billingCity: paymentRes.data.data.billing_city || '',
              billingState: paymentRes.data.data.billing_state || '',
              billingZip: paymentRes.data.data.billing_zip || '',
            });
          } catch (err) {
            console.error('Error formatting card number:', err);
          }
        }
      } else {
        setPaymentMethod(null);
      }
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

  const handleDeletePaymentMethod = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    // Check if auto-renewal is enabled
    if (autoRenew) {
      setError('Cannot delete payment method while auto-renewal is enabled. Please disable auto-renewal first in your membership settings.');
      return;
    }
    
    setShowDeleteConfirm(true);
  };

  const confirmDeletePaymentMethod = async () => {
    try {
      setDeletingPayment(true);
      setShowDeleteConfirm(false);
      await apiClient.delete("/me/payment-method");
      setPaymentMethod(null);
      setPaymentForm({
        cardNumber: '',
        cardholderName: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        billingAddress: '',
        billingCity: '',
        billingState: '',
        billingZip: '',
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to delete payment method");
    } finally {
      setDeletingPayment(false);
    }
  };

  const validatePaymentForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!paymentForm.cardNumber || paymentForm.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    if (!paymentForm.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }
    if (!paymentForm.expiryMonth || !paymentForm.expiryYear) {
      newErrors.expiry = 'Expiry date is required';
    } else {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      const expiryYearNum = parseInt(paymentForm.expiryYear, 10);
      const expiryMonthNum = parseInt(paymentForm.expiryMonth, 10);

      if (expiryYearNum < currentYear || 
          (expiryYearNum === currentYear && expiryMonthNum < currentMonth)) {
        newErrors.expiry = 'This card has expired. Please use a different card.';
      }
    }
    if (!paymentForm.cvv || paymentForm.cvv.length !== 3) {
      newErrors.cvv = 'CVV must be exactly 3 digits';
    }
    if (!paymentForm.billingAddress.trim()) {
      newErrors.billingAddress = 'Billing address is required';
    }
    if (!paymentForm.billingCity.trim()) {
      newErrors.billingCity = 'City is required';
    } else if (!/^[a-zA-Z\s'-]+$/.test(paymentForm.billingCity.trim())) {
      newErrors.billingCity = 'City must contain only letters, spaces, hyphens, and apostrophes';
    }
    if (!paymentForm.billingState.trim()) {
      newErrors.billingState = 'State is required';
    } else if (!/^[a-zA-Z\s'-]+$/.test(paymentForm.billingState.trim())) {
      newErrors.billingState = 'State must contain only letters, spaces, hyphens, and apostrophes';
    }
    if (!paymentForm.billingZip.trim()) {
      newErrors.billingZip = 'ZIP code is required';
    }

    setPaymentErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSavePaymentMethod = async () => {
    if (!validatePaymentForm()) {
      return;
    }

    try {
      setSavingPayment(true);
      setError(null);
      
      const response = await apiClient.post("/me/payment-method", {
        cardNumber: paymentForm.cardNumber.replace(/\s/g, ''),
        cardholderName: paymentForm.cardholderName.trim(),
        expiryMonth: parseInt(paymentForm.expiryMonth, 10),
        expiryYear: parseInt(paymentForm.expiryYear, 10),
        cvv: paymentForm.cvv,
        billingAddress: paymentForm.billingAddress.trim(),
        billingCity: paymentForm.billingCity.trim(),
        billingState: paymentForm.billingState.trim(),
        billingZip: paymentForm.billingZip.trim(),
      });
      
      if (response.data.success) {
        // Reload payment method
        try {
          const paymentRes = await apiClient.get("/me/payment-method");
          if (paymentRes.data && paymentRes.data.success && paymentRes.data.data) {
            setPaymentMethod(paymentRes.data.data);
          }
        } catch (reloadError) {
          console.error('Error reloading payment method:', reloadError);
          // Don't fail the whole operation if reload fails
        }
        
        setShowAddPaymentModal(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        
        // Reset form
        setPaymentForm({
          cardNumber: '',
          cardholderName: '',
          expiryMonth: '',
          expiryYear: '',
          cvv: '',
          billingAddress: '',
          billingCity: '',
          billingState: '',
          billingZip: '',
        });
        setPaymentErrors({});
      } else {
        setError(response.data.message || "Failed to save payment method");
      }
    } catch (e: any) {
      console.error('Error saving payment method:', e);
      setError(e?.response?.data?.message || e?.message || "Failed to save payment method");
    } finally {
      setSavingPayment(false);
    }
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
                    fieldErrors.phone || (form.phone && form.phone.length !== 10)
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
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

        {/* Credit Information */}
        <Card className="border-2 border-gray-100 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-sea_green-50 to-dark_spring_green-50 border-b border-gray-200">
            <CardTitle className="text-xl flex items-center gap-2 text-gray-900">
              <div className="p-2 rounded-lg bg-sea_green-100">
                <CreditCard className="h-5 w-5 text-sea_green-700" />
              </div>
              Credit Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {paymentMethod ? (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <CreditCard className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Saved Card</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {paymentMethod?.card_number || '**** **** **** ****'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {paymentMethod?.cardholder_name || ''} • Expires {paymentMethod?.expiry_month ? String(paymentMethod.expiry_month).padStart(2, '0') : '--'}/{paymentMethod?.expiry_year || '----'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => setShowAddPaymentModal(true)}
                    variant="outline"
                    className="text-sea_green-600 hover:text-sea_green-700 hover:bg-sea_green-50 border-sea_green-200"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    onClick={handleDeletePaymentMethod}
                    disabled={deletingPayment}
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    {deletingPayment ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="p-4 bg-gray-50 rounded-lg inline-block mb-4">
                  <CreditCard className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-4">No credit card on file</p>
                <Button
                  type="button"
                  onClick={() => setShowAddPaymentModal(true)}
                  className="bg-sea_green-600 hover:bg-sea_green-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Credit Card
                </Button>
              </div>
            )}
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

      {/* Delete Payment Method Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Remove Payment Method</h2>
              </div>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="mb-6">
              {autoRenew && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800 font-medium">
                    ⚠️ You cannot delete your payment method while auto-renewal is enabled. Please disable auto-renewal first in your membership settings.
                  </p>
                </div>
              )}
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete your saved payment method?
              </p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Card ending in:</p>
                <p className="text-lg font-semibold text-gray-900">
                  {paymentMethod?.card_number || '**** **** **** ****'}
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                This action cannot be undone. You'll need to re-enter your payment information for future purchases.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={confirmDeletePaymentMethod}
                disabled={deletingPayment || autoRenew}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingPayment ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Removing...
                  </>
                ) : (
                  'Yes, Remove It'
                )}
              </Button>
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deletingPayment}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Payment Method Modal */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={(e) => {
          if (!savingPayment) {
            setShowAddPaymentModal(false);
          }
        }}>
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-sea_green-600" />
                {paymentMethod ? 'Update Payment Method' : 'Add Payment Method'}
              </h2>
              <button 
                onClick={() => {
                  if (!savingPayment) {
                    setShowAddPaymentModal(false);
                    setPaymentErrors({});
                  }
                }}
                disabled={savingPayment}
                className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {/* Card Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={paymentForm.cardNumber}
                  onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: formatCardNumber(e.target.value) })}
                  maxLength={19}
                  className={`w-full rounded-lg border px-4 py-3 ${paymentErrors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                />
                {paymentErrors.cardNumber && <p className="text-sm text-red-500 mt-1">{paymentErrors.cardNumber}</p>}
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={paymentForm.cardholderName}
                  onChange={(e) => setPaymentForm({ ...paymentForm, cardholderName: e.target.value })}
                  className={`w-full rounded-lg border px-4 py-3 ${paymentErrors.cardholderName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {paymentErrors.cardholderName && <p className="text-sm text-red-500 mt-1">{paymentErrors.cardholderName}</p>}
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Month</label>
                  <select
                    value={paymentForm.expiryMonth}
                    onChange={(e) => setPaymentForm({ ...paymentForm, expiryMonth: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${paymentErrors.expiry ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">MM</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <option key={month} value={String(month).padStart(2, '0')}>
                        {String(month).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Year</label>
                  <select
                    value={paymentForm.expiryYear}
                    onChange={(e) => setPaymentForm({ ...paymentForm, expiryYear: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${paymentErrors.expiry ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">YYYY</option>
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                      <option key={year} value={String(year)}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={paymentForm.cvv}
                    onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                    maxLength={3}
                    className={`w-full rounded-lg border px-4 py-3 ${paymentErrors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {paymentErrors.cvv && <p className="text-sm text-red-500 mt-1">{paymentErrors.cvv}</p>}
                </div>
                {paymentErrors.expiry && <p className="text-sm text-red-500 col-span-3">{paymentErrors.expiry}</p>}
              </div>

              {/* Billing Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Billing Address</label>
                <input
                  type="text"
                  placeholder="123 Main St"
                  value={paymentForm.billingAddress}
                  onChange={(e) => setPaymentForm({ ...paymentForm, billingAddress: e.target.value })}
                  className={`w-full rounded-lg border px-4 py-3 ${paymentErrors.billingAddress ? 'border-red-500' : 'border-gray-300'}`}
                />
                {paymentErrors.billingAddress && <p className="text-sm text-red-500 mt-1">{paymentErrors.billingAddress}</p>}
              </div>

              {/* City, State, ZIP */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    placeholder="Springfield"
                    value={paymentForm.billingCity}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z\s'-]/g, '');
                      setPaymentForm({ ...paymentForm, billingCity: value });
                    }}
                    className={`w-full rounded-lg border px-4 py-3 ${paymentErrors.billingCity ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {paymentErrors.billingCity && <p className="text-sm text-red-500 mt-1">{paymentErrors.billingCity}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    placeholder="IL"
                    value={paymentForm.billingState}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z\s'-]/g, '');
                      setPaymentForm({ ...paymentForm, billingState: value });
                    }}
                    className={`w-full rounded-lg border px-4 py-3 ${paymentErrors.billingState ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {paymentErrors.billingState && <p className="text-sm text-red-500 mt-1">{paymentErrors.billingState}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    placeholder="62701"
                    value={paymentForm.billingZip}
                    onChange={(e) => setPaymentForm({ ...paymentForm, billingZip: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    className={`w-full rounded-lg border px-4 py-3 ${paymentErrors.billingZip ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {paymentErrors.billingZip && <p className="text-sm text-red-500 mt-1">{paymentErrors.billingZip}</p>}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t">
              <Button
                onClick={handleSavePaymentMethod}
                disabled={savingPayment}
                className="flex-1 bg-sea_green-600 hover:bg-sea_green-700 text-white"
              >
                {savingPayment ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Payment Method'
                )}
              </Button>
              <Button
                onClick={() => setShowAddPaymentModal(false)}
                disabled={savingPayment}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
