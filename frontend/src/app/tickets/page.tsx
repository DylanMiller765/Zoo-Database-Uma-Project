'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ticketService } from '@/services/ticket.service';
import { authService } from '@/services/auth.service';
import { Loader2 } from 'lucide-react';

const TICKET_PRICES = {
  adult: 29.95,
  child: 19.95,
  senior: 24.95,
};

const DONATION_AMOUNTS = [10, 25, 50, 100];

export default function TicketsPage() {
  const router = useRouter();
  const [visitDate, setVisitDate] = useState('');
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [seniors, setSeniors] = useState(0);
  const [includeDonation, setIncludeDonation] = useState(false);
  const [donationAmount, setDonationAmount] = useState(25);
  const [customDonation, setCustomDonation] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ticketsTotal = 
    adults * TICKET_PRICES.adult + 
    children * TICKET_PRICES.child + 
    seniors * TICKET_PRICES.senior;

  const totalTickets = adults + children + seniors;

  const finalDonation = customDonation 
    ? parseFloat(customDonation) || 0 
    : donationAmount;

  const grandTotal = ticketsTotal + (includeDonation ? finalDonation : 0);

  const handleCheckout = async () => {
    if (totalTickets === 0) {
      alert('Please select at least one ticket');
      return;
    }
    if (!visitDate) {
      alert('Please select a visit date');
      return;
    }

    // Validate date is not in the past or too far in the future
    const selectedDate = new Date(visitDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oneYearFromNow = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    if (selectedDate < today) {
      setError('Please select a date in the future');
      return;
    }
    if (selectedDate > oneYearFromNow) {
      setError('Please select a date within the next year');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Get current user if logged in (customer_id will be null for guest checkout)
      const user = authService.getStoredUser();
      const customerId = user?.role === 'customer' && user.customer_id ? user.customer_id : undefined;

      console.log('Ticket purchase - User:', user);
      console.log('Ticket purchase - Customer ID:', customerId);

      // Create ticket records for each ticket type
      const ticketPromises = [];

      // Adult tickets
      for (let i = 0; i < adults; i++) {
        const ticketData = {
          customer_id: customerId,
          visit_date: visitDate,
          ticket_type: 'adult' as const,
          price: TICKET_PRICES.adult,
          payment_method: 'online' as const,
        };
        console.log('Creating adult ticket:', ticketData);
        ticketPromises.push(ticketService.create(ticketData));
      }

      // Child tickets
      for (let i = 0; i < children; i++) {
        ticketPromises.push(
          ticketService.create({
            customer_id: customerId,
            visit_date: visitDate,
            ticket_type: 'child',
            price: TICKET_PRICES.child,
            payment_method: 'online',
          })
        );
      }

      // Senior tickets
      for (let i = 0; i < seniors; i++) {
        ticketPromises.push(
          ticketService.create({
            customer_id: customerId,
            visit_date: visitDate,
            ticket_type: 'senior',
            price: TICKET_PRICES.senior,
            payment_method: 'online',
          })
        );
      }

      // Process all tickets
      await Promise.all(ticketPromises);

      // Redirect to confirmation page with ticket count and total
      router.push(
        `/tickets/confirmation?tickets=${totalTickets}&total=${grandTotal.toFixed(2)}&date=${visitDate}`
      );
    } catch (err: any) {
      console.error('Error processing tickets:', err);
      setError(err.response?.data?.message || 'Failed to process ticket purchase. Please try again.');
    } finally {
      setIsProcessing(false);
    }
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
            <span className="text-sm">🎫 Get Tickets</span>
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">Purchase Your Tickets</h1>
          <p className="mt-2 max-w-2xl text-white/90">
            Select your visit date, ticket quantities, and optionally support conservation with a donation.
          </p>
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Left Column - Ticket Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Visit Date */}
          <section className="rounded-2xl bg-gray-50 p-6">
            <h2 className="text-xl font-bold mb-4">Select Visit Date</h2>
            <Card className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <CardContent className="p-6">
                <label htmlFor="visit-date" className="block text-sm font-semibold text-gray-700 mb-2">
                  When would you like to visit?
                </label>
                <input
                  type="date"
                  id="visit-date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sea_green-500 focus:border-sea_green-500 transition-all"
                />
                <p className="mt-2 text-xs text-gray-600">
                  Open Monday–Friday 9AM–5PM, Saturday–Sunday 8AM–4PM
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Ticket Quantities */}
          <section className="rounded-2xl bg-gray-50 p-6">
            <h2 className="text-xl font-bold mb-4">Select Tickets</h2>
            <div className="space-y-4">
              {/* Adults */}
              <Card className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">Adults</h3>
                      <p className="text-sm text-gray-600">Ages 13+</p>
                      <p className="text-xl font-bold text-sea_green-600 mt-1">${TICKET_PRICES.adult}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setAdults(Math.max(0, adults - 1))}
                        className="h-10 w-10 rounded-full border-2 border-gray-300 text-gray-700 hover:border-sea_green-500 hover:text-sea_green-600 transition-colors font-semibold"
                      >
                        −
                      </button>
                      <span className="text-xl font-semibold w-8 text-center">{adults}</span>
                      <button
                        onClick={() => setAdults(adults + 1)}
                        className="h-10 w-10 rounded-full border-2 border-gray-300 text-gray-700 hover:border-sea_green-500 hover:text-sea_green-600 transition-colors font-semibold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Children */}
              <Card className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">Children</h3>
                      <p className="text-sm text-gray-600">Ages 3–12 (under 3 free)</p>
                      <p className="text-xl font-bold text-sea_green-600 mt-1">${TICKET_PRICES.child}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="h-10 w-10 rounded-full border-2 border-gray-300 text-gray-700 hover:border-sea_green-500 hover:text-sea_green-600 transition-colors font-semibold"
                      >
                        −
                      </button>
                      <span className="text-xl font-semibold w-8 text-center">{children}</span>
                      <button
                        onClick={() => setChildren(children + 1)}
                        className="h-10 w-10 rounded-full border-2 border-gray-300 text-gray-700 hover:border-sea_green-500 hover:text-sea_green-600 transition-colors font-semibold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seniors */}
              <Card className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">Seniors</h3>
                      <p className="text-sm text-gray-600">Ages 65+</p>
                      <p className="text-xl font-bold text-sea_green-600 mt-1">${TICKET_PRICES.senior}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSeniors(Math.max(0, seniors - 1))}
                        className="h-10 w-10 rounded-full border-2 border-gray-300 text-gray-700 hover:border-sea_green-500 hover:text-sea_green-600 transition-colors font-semibold"
                      >
                        −
                      </button>
                      <span className="text-xl font-semibold w-8 text-center">{seniors}</span>
                      <button
                        onClick={() => setSeniors(seniors + 1)}
                        className="h-10 w-10 rounded-full border-2 border-gray-300 text-gray-700 hover:border-sea_green-500 hover:text-sea_green-600 transition-colors font-semibold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                  {/* Tickets Breakdown */}
                  {adults > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span>{adults} Adult{adults > 1 ? 's' : ''}</span>
                      <span className="font-medium">${(adults * TICKET_PRICES.adult).toFixed(2)}</span>
                    </div>
                  )}
                  {children > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span>{children} Child{children > 1 ? 'ren' : ''}</span>
                      <span className="font-medium">${(children * TICKET_PRICES.child).toFixed(2)}</span>
                    </div>
                  )}
                  {seniors > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span>{seniors} Senior{seniors > 1 ? 's' : ''}</span>
                      <span className="font-medium">${(seniors * TICKET_PRICES.senior).toFixed(2)}</span>
                    </div>
                  )}

                  {totalTickets === 0 && (
                    <p className="text-gray-500 italic py-2">No tickets selected</p>
                  )}

                  {totalTickets > 0 && (
                    <>
                      <div className="border-t pt-3 flex justify-between font-semibold text-gray-900">
                        <span>Tickets Subtotal</span>
                        <span>${ticketsTotal.toFixed(2)}</span>
                      </div>
                    </>
                  )}

                  {/* Donation */}
                  {includeDonation && finalDonation > 0 && (
                    <>
                      <div className="border-t pt-3 flex justify-between text-gray-700">
                        <span>Conservation Donation 💚</span>
                        <span className="font-medium">${finalDonation.toFixed(2)}</span>
                      </div>
                    </>
                  )}

                  {/* Grand Total */}
                  {(totalTickets > 0 || (includeDonation && finalDonation > 0)) && (
                    <div className="border-t-2 pt-3 flex justify-between text-lg font-bold text-sea_green-700">
                      <span>Total</span>
                      <span>${grandTotal.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Visit Date Display */}
                {visitDate && (
                  <div className="mt-4 p-3 bg-sea_green-50 rounded-lg">
                    <p className="text-xs font-semibold text-sea_green-800 mb-1">Visit Date:</p>
                    <p className="text-sm text-sea_green-900">
                      {new Date(visitDate + 'T00:00:00').toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  disabled={totalTickets === 0 || !visitDate || isProcessing}
                  className="w-full mt-6 py-6 rounded-xl bg-sea_green-600 text-white font-semibold hover:bg-sea_green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>
                      {totalTickets === 0 ? 'Select Tickets' : !visitDate ? 'Select Date' : 'Proceed to Checkout'}
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="mt-6 rounded-2xl border border-gray-200 bg-light_yellow-50 shadow-sm">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">💡 Need a membership?</h3>
                <p className="text-xs text-gray-700 mb-3">
                  Visit 5+ times a year? A membership pays for itself with unlimited access.
                </p>
                <Link
                  href="/membership"
                  className="text-xs font-semibold text-sea_green-700 hover:underline"
                >
                  View membership options →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
