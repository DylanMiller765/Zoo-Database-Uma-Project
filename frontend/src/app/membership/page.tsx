'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const MEMBERSHIP_PLANS = {
  individual: {
    name: 'Individual',
    price: 149,
    benefits: [
      'Unlimited access for 1 adult for one year',
      '10% discount at gift shop and cafés',
      'Free parking',
      'Early access to special events',
      'Member-only newsletter',
    ],
  },
  family: {
    name: 'Family',
    price: 299,
    benefits: [
      'Unlimited access for 2 adults + up to 4 children for one year',
      '15% discount at gift shop and cafés',
      'Free parking',
      'Early access to special events',
      'Member-only newsletter',
      'Guest passes (4 per year)',
    ],
  },
};

const DONATION_AMOUNTS = [10, 25, 50, 100];

export default function MembershipPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'individual' | 'family'>('individual');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [includeDonation, setIncludeDonation] = useState(false);
  const [donationAmount, setDonationAmount] = useState(25);
  const [customDonation, setCustomDonation] = useState('');

  const membershipPrice = MEMBERSHIP_PLANS[selectedPlan].price;
  const finalDonation = customDonation 
    ? parseFloat(customDonation) || 0 
    : donationAmount;
  const grandTotal = membershipPrice + (includeDonation ? finalDonation : 0);

  const handleCheckout = () => {
    if (!firstName || !lastName || !email) {
      alert('Please fill in all required fields');
      return;
    }
    // In a real app, this would process payment and create membership
    // Redirect to confirmation page with plan name
    router.push(`/membership/confirmation?plan=${MEMBERSHIP_PLANS[selectedPlan].name}`);
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] py-10">
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
            <h2 className="text-xl font-bold mb-4">Choose Your Plan</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Individual Plan */}
              <Card
                className={`rounded-xl border-2 cursor-pointer transition-all ${
                  selectedPlan === 'individual'
                    ? 'border-sea_green-500 bg-sea_green-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-sea_green-300'
                }`}
                onClick={() => setSelectedPlan('individual')}
              >
                <CardHeader className="px-6 pt-6 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-dark_spring_green-700">Individual</CardTitle>
                    {selectedPlan === 'individual' && (
                      <span className="text-sea_green-600">✓</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="text-3xl font-bold text-sea_green-600 mb-4">
                    $149<span className="text-base font-normal text-gray-600">/year</span>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {MEMBERSHIP_PLANS.individual.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-sea_green-500 mt-0.5">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Family Plan */}
              <Card
                className={`rounded-xl border-2 cursor-pointer transition-all ${
                  selectedPlan === 'family'
                    ? 'border-sea_green-500 bg-sea_green-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-sea_green-300'
                }`}
                onClick={() => setSelectedPlan('family')}
              >
                <CardHeader className="px-6 pt-6 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-dark_spring_green-700">Family</CardTitle>
                    {selectedPlan === 'family' && (
                      <span className="text-sea_green-600">✓</span>
                    )}
                  </div>
                  <div className="mt-1 inline-block rounded-full bg-persian_orange-100 px-2 py-0.5 text-xs font-semibold text-persian_orange-700">
                    Best Value
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="text-3xl font-bold text-sea_green-600 mb-4">
                    $299<span className="text-base font-normal text-gray-600">/year</span>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {MEMBERSHIP_PLANS.family.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-sea_green-500 mt-0.5">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Member Information Form */}
          <section className="rounded-2xl bg-gray-50 p-6">
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
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sea_green-500 focus:border-sea_green-500 transition-all"
                    placeholder="(555) 123-4567"
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label htmlFor="start-date" className="block text-sm font-semibold text-gray-700 mb-2">
                    Membership Start Date
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sea_green-500 focus:border-sea_green-500 transition-all"
                  />
                  <p className="mt-2 text-xs text-gray-600">
                    Leave blank to start immediately
                  </p>
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
                  {!firstName || !lastName || !email ? 'Fill Required Fields' : 'Complete Purchase'}
                </Button>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="mt-6 rounded-2xl border border-gray-200 bg-sea_green-50 shadow-sm">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">✨ Membership Perks</h3>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• Physical membership card mailed within 7 days</li>
                  <li>• Digital card available immediately</li>
                  <li>• Automatic renewal reminders</li>
                  <li>• Transferable within household</li>
                </ul>
              </CardContent>
            </Card>

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
