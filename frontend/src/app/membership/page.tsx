'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LogIn, Lock } from 'lucide-react';
import apiClient from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

const MEMBERSHIP_PLANS = {
  individual: {
    name: 'Individual',
    price: 149,
    benefits: [
      'Unlimited access for 1 adult for one year',
      'Free parking',
      'One free guest pass',
      'Transferable within household',
      'Pick up your physical card at the zoo',
    ],
  },
};

const DONATION_AMOUNTS = [10, 25, 50, 100];

function MembershipPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const { addItem, openCart } = useCart();
  const [selectedPlan, setSelectedPlan] = useState<'individual'>('individual');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [includeDonation, setIncludeDonation] = useState(false);
  const [donationAmount, setDonationAmount] = useState(25);
  const [customDonation, setCustomDonation] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRestoreMessage, setShowRestoreMessage] = useState(false);
  const [autoRenew, setAutoRenew] = useState(true); // Default ON

  // Check for restore purchase flag
  useEffect(() => {
    const restorePurchase = searchParams.get('restorePurchase');
    if (restorePurchase === 'true') {
      const pendingData = localStorage.getItem('pendingMembershipPurchase');
      if (pendingData) {
        try {
          const data = JSON.parse(pendingData);
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
          setEmail(data.email || '');
          setPhone(data.phone || '');
        setIncludeDonation(data.includeDonation || false);
        setDonationAmount(data.donationAmount || 25);
        setCustomDonation(data.customDonation || '');
        setAutoRenew(data.autoRenew !== undefined ? data.autoRenew : true);
          
          setShowRestoreMessage(true);
          setTimeout(() => setShowRestoreMessage(false), 5000);
          
          // Clear localStorage and URL param
          localStorage.removeItem('pendingMembershipPurchase');
          router.replace('/membership');
        } catch (error) {
          console.error('Error restoring membership data:', error);
        }
      }
    }
  }, [searchParams, router]);

  // Auto-populate form with user's profile data if logged in
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) return; // Not logged in, skip auto-populate

        setLoadingProfile(true);
        const response = await apiClient.get('/auth/profile');
        const profile = response.data.data;

        // Auto-populate fields from profile
        if (profile) {
          setFirstName(profile.customer_first_name || profile.employee_first_name || '');
          setLastName(profile.customer_last_name || profile.employee_last_name || '');
          setEmail(profile.customer_email || profile.email || '');
          setPhone(profile.customer_phone || profile.employee_phone || '');
        }
      } catch (error) {
        // Silently fail - user just fills form manually
        console.log('Could not auto-populate profile data');
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  // Only Individual membership is offered
  const effectivePlan: 'individual' = selectedPlan;
  const membershipPrice = MEMBERSHIP_PLANS.individual.price;
  const finalDonation = customDonation 
    ? parseFloat(customDonation) || 0 
    : donationAmount;
  const grandTotal = membershipPrice + (includeDonation ? finalDonation : 0);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setPhone(value);
      if (value.length > 0 && value.length !== 10) {
        setPhoneError('Phone number must be exactly 10 digits');
      } else {
        setPhoneError('');
      }
    }
  };

  const handleCheckout = () => {
    if (!firstName || !lastName || !email) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate phone number if provided
    if (phone && phone.length !== 10) {
      setPhoneError('Phone number must be exactly 10 digits');
      return;
    }

    // Check if user is logged in
    if (!isAuthenticated || user?.role !== 'customer') {
      // Save form data to localStorage
      const membershipData = {
        firstName,
        lastName,
        email,
        phone,
        includeDonation,
        donationAmount,
        customDonation,
        autoRenew,
      };
      localStorage.setItem('pendingMembershipPurchase', JSON.stringify(membershipData));
      
      // Show login modal
      setShowLoginModal(true);
      return;
    }

    // Add membership to cart
    addItem({
      item_type: 'membership',
      name: 'Individual Membership',
      quantity: 1,
      unit_price: MEMBERSHIP_PLANS.individual.price,
      metadata: {
        membership_type: 'individual',
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone || undefined,
        auto_renew: autoRenew,
      },
    });

    // Add donation if selected
    if (includeDonation && finalDonation > 0) {
      addItem({
        item_type: 'donation',
        name: 'Conservation Donation',
        quantity: 1,
        unit_price: finalDonation,
        metadata: {
          donation_message: '',
        },
      });
    }

    // Open cart sidebar to show added items
    openCart();

    // Reset form
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setPhoneError('');
    setIncludeDonation(false);
    setDonationAmount(25);
    setCustomDonation('');
    setAutoRenew(true); // Reset to default ON
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] py-10">
      {/* Restore message */}
      {showRestoreMessage && (
        <div className="mb-6 rounded-xl bg-sea_green-50 border-2 border-sea_green-200 p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-sea_green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-sea_green-800">
            Your membership information has been restored! Please review and proceed to checkout.
          </p>
        </div>
      )}

      {/* Login Modal - Simple & Cute */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowLoginModal(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sea_green-100 mb-3">
                  <Lock className="h-8 w-8 text-sea_green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h2>
                <p className="text-gray-600 text-sm">
                  You need to sign in first before you purchase. It will only take a moment!
                </p>
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowLoginModal(false);
                    router.push('/login?returnTo=membership');
                  }}
                  className="flex-1 bg-sea_green-500 hover:bg-sea_green-600 text-white"
                >
                  Go to Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Top Banner */}
      <section className="relative overflow-hidden rounded-2xl border">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-dark_spring_green-500 via-sea_green-400 to-dark_spring_green-600" />
        <div className="pointer-events-none absolute -top-6 right-10 h-24 w-24 rounded-full bg-light_yellow-300/30 blur-2xl" />
        <div className="pointer-events-none absolute top-20 right-24 h-16 w-16 rounded-full bg-melon-300/30 blur-xl" />
        <div className="pointer-events-none absolute -bottom-10 left-10 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15zm0 25c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10z' fill='%23ffffff'/%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px',
          }}
        />
        <div className="relative z-10 px-6 py-10 text-white sm:px-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 mb-3">
            <span className="text-sm">💎 Membership</span>
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">Become a Member</h1>
          <p className="mt-2 max-w-2xl text-white/90">
            Get unlimited access for a full year, exclusive perks, and support conservation efforts.
          </p>
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Left Column - Plan Selection & Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Membership Plans */}
          <section className="rounded-2xl bg-gray-50 p-6">
            <h2 className="text-xl font-bold mb-4">Your Membership</h2>
            <Card className="relative overflow-hidden rounded-2xl border-2 border-sea_green-200 bg-gradient-to-br from-sea_green-50 to-white shadow-md">
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-sea_green-200/30 blur-2xl" />
              <div className="pointer-events-none absolute right-0 bottom-0 h-24 w-24 rounded-full bg-dark_spring_green-100/40 blur-xl" />
              <CardHeader className="px-8 pt-8 pb-4">
                <CardTitle className="text-2xl text-dark_spring_green-700">Individual Membership</CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="text-3xl md:text-4xl font-extrabold text-sea_green-600 mb-3 tracking-tight">$149<span className="text-base font-semibold text-gray-600">/year</span></div>
                <p className="text-sm text-gray-700 mb-6">Unlimited access for one adult for 12 months, plus exclusive perks.</p>
                <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-sea_green-500 mt-0.5">✓</span>
                    <span>Unlimited access for 1 adult for one year</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sea_green-500 mt-0.5">✓</span>
                    <span>Free parking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sea_green-500 mt-0.5">✓</span>
                    <span>One free guest pass</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sea_green-500 mt-0.5">✓</span>
                    <span>Transferable within household</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sea_green-500 mt-0.5">✓</span>
                    <span>Pick up your physical card at the zoo</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Member Information Form */}
          <section id="member-info" className="rounded-2xl bg-gray-50 p-6">
            <h2 className="text-xl font-bold mb-4">Member Information</h2>
            <Card className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <CardContent className="p-6 space-y-4">
                {/* Name Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="first-name" className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="first-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sea_green-500 focus:border-sea_green-500 transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="last-name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="last-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sea_green-500 focus:border-sea_green-500 transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sea_green-500 focus:border-sea_green-500 transition-all"
                    placeholder="john.doe@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={10}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      phoneError
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:ring-sea_green-500 focus:border-sea_green-500'
                    }`}
                    placeholder="1234567890"
                  />
                  {phoneError && (
                    <p className="mt-1 text-sm text-red-600">{phoneError}</p>
                  )}
                  {phone && !phoneError && (
                    <p className="mt-1 text-xs text-gray-500">Format: 10 digits (e.g., 1234567890)</p>
                  )}
                </div>

                {/* Auto-Renewal Toggle */}
                <div className="rounded-xl border-2 border-gray-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <label htmlFor="auto-renew" className="block text-sm font-semibold text-gray-900 mb-1">
                        Auto-Renewal
                      </label>
                      <p className="text-xs text-gray-600">
                        {autoRenew 
                          ? 'Your membership will automatically renew each year. You can turn this off anytime in your account settings.'
                          : 'Turn on to automatically renew your membership when it expires. You can change this anytime.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoRenew(!autoRenew)}
                      className={`relative ml-4 inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sea_green-500 focus:ring-offset-2 ${
                        autoRenew ? 'bg-sea_green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          autoRenew ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Donation Section */}
          <section className="rounded-2xl bg-gray-50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Support Conservation</h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDonation}
                  onChange={(e) => setIncludeDonation(e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-sea_green-600 focus:ring-sea_green-500"
                />
                <span className="text-sm font-medium text-gray-700">Add donation</span>
              </label>
            </div>

            {includeDonation && (
              <Card className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Your donation helps care for animals, maintain habitats, and support education programs.
                  </p>

                  {/* Preset Amounts */}
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {DONATION_AMOUNTS.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => {
                          setDonationAmount(amount);
                          setCustomDonation('');
                        }}
                        className={`py-3 rounded-xl border-2 font-semibold transition-all ${
                          donationAmount === amount && !customDonation
                            ? 'border-sea_green-500 bg-sea_green-50 text-sea_green-700'
                            : 'border-gray-200 text-gray-700 hover:border-sea_green-300'
                        }`}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <div>
                    <label htmlFor="custom-donation" className="block text-sm font-medium text-gray-700 mb-2">
                      Or enter custom amount:
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        id="custom-donation"
                        value={customDonation}
                        onChange={(e) => setCustomDonation(e.target.value)}
                        placeholder="0.00"
                        min="1"
                        step="0.01"
                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sea_green-500 focus:border-sea_green-500 transition-all"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </section>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card className="rounded-2xl border border-gray-200 bg-white shadow-lg">
              <CardHeader className="px-6 pt-6 pb-3">
                <CardTitle className="text-xl text-dark_spring_green-700">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-3 text-sm">
                  {/* Membership Plan */}
                  <div className="pb-3 border-b">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {MEMBERSHIP_PLANS[selectedPlan].name} Membership
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Valid for 365 days from start date
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">
                        ${membershipPrice}
                      </span>
                    </div>
                  </div>

                  {/* Donation */}
                  {includeDonation && finalDonation > 0 && (
                    <div className="pb-3 border-b flex justify-between text-gray-700">
                      <span>Conservation Donation 💚</span>
                      <span className="font-medium">${finalDonation.toFixed(2)}</span>
                    </div>
                  )}

                  {/* Grand Total */}
                  <div className="pt-3 flex justify-between text-lg font-bold text-sea_green-700">
                    <span>Total</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>

                  {/* Savings Callout */}
                  <div className="mt-4 p-3 bg-light_yellow-50 rounded-lg border border-light_yellow-200">
                    <p className="text-xs font-semibold text-gray-800 mb-1">
                      💰 You Save Money!
                    </p>
                    <p className="text-xs text-gray-700">
                      {selectedPlan === 'individual' 
                        ? 'Visit 5+ times to break even vs. day passes'
                        : 'Perfect for families who visit regularly'}
                    </p>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  disabled={!firstName || !lastName || !email}
                  className="w-full mt-6 py-6 rounded-xl bg-sea_green-600 text-white font-semibold hover:bg-sea_green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!firstName || !lastName || !email 
                    ? 'Fill Required Fields' 
                    : 'Proceed to Checkout'}
                </Button>
              </CardContent>
            </Card>

            {/* Removed bottom Membership Perks card per request */}

            {/* Just Visiting? */}
            <Card className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 shadow-sm">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Just visiting once?</h3>
                <p className="text-xs text-gray-700 mb-3">
                  Purchase individual day passes instead.
                </p>
                <Link
                  href="/tickets"
                  className="text-xs font-semibold text-sea_green-700 hover:underline"
                >
                  Buy day tickets →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MembershipPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-6rem)] py-10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sea_green-600"></div>
      </div>
    }>
      <MembershipPageContent />
    </Suspense>
  );
}
