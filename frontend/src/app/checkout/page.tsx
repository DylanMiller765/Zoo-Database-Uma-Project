'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PaymentForm, { PaymentData } from '@/components/PaymentForm';
import { ticketService } from '@/services/ticket.service';
import { authService } from '@/services/auth.service';
import apiClient from '@/lib/api';
import { Loader2, ArrowLeft } from 'lucide-react';

const TICKET_PRICES = {
  adult: 29.95,
  child: 19.95,
  senior: 24.95,
};

const MEMBERSHIP_PRICE = 149.00;

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine checkout type
  const type = searchParams.get('type') || 'tickets'; // 'tickets' or 'membership'

  // Get order data from URL params
  // For tickets
  const adults = parseInt(searchParams.get('adults') || '0');
  const children = parseInt(searchParams.get('children') || '0');
  const seniors = parseInt(searchParams.get('seniors') || '0');
  const visitDate = searchParams.get('date') || '';
  const ticketDonation = parseFloat(searchParams.get('donation') || '0');

  // For membership
  const firstName = searchParams.get('firstName') || '';
  const lastName = searchParams.get('lastName') || '';
  const email = searchParams.get('email') || '';
  const startDate = searchParams.get('startDate') || '';
  const membershipDonation = parseFloat(searchParams.get('donation') || '0');

  // Calculate totals
  const ticketsTotal = adults * TICKET_PRICES.adult + children * TICKET_PRICES.child + seniors * TICKET_PRICES.senior;
  const ticketsGrandTotal = ticketsTotal + ticketDonation;
  const membershipGrandTotal = MEMBERSHIP_PRICE + membershipDonation;
  const totalTickets = adults + children + seniors;

  const grandTotal = type === 'tickets' ? ticketsGrandTotal : membershipGrandTotal;

  // Redirect if missing required data
  useEffect(() => {
    if (type === 'tickets' && totalTickets === 0 && ticketDonation === 0) {
      router.push('/tickets');
    }
    if (type === 'membership' && (!firstName || !lastName || !email)) {
      router.push('/membership');
    }
  }, [type, totalTickets, ticketDonation, firstName, lastName, email, router]);

  const handlePaymentSubmit = async (payment: PaymentData) => {
    setIsProcessing(true);
    setError(null);

    try {
      if (type === 'tickets') {
        // Handle ticket purchase
        const user = authService.getStoredUser();
        const customerId = user?.role === 'customer' && user.customer_id ? user.customer_id : undefined;

        // Save payment method if requested and user is logged in
        if (payment.savePaymentMethod && customerId) {
          try {
            await apiClient.post('/me/payment-method', {
              cardNumber: payment.cardNumber,
              cardholderName: payment.cardholderName,
              expiryMonth: payment.expiryMonth,
              expiryYear: payment.expiryYear,
              cvv: payment.cvv,
              billingAddress: payment.billingAddress,
              billingCity: payment.billingCity,
              billingState: payment.billingState,
              billingZip: payment.billingZip,
            });
          } catch (err) {
            console.error('Failed to save payment method:', err);
          }
        }

        // Create ticket records
        const ticketPromises = [];

        if (totalTickets > 0) {
          for (let i = 0; i < adults; i++) {
            ticketPromises.push(
              ticketService.create({
                customer_id: customerId,
                visit_date: visitDate,
                ticket_type: 'adult',
                price: TICKET_PRICES.adult,
                payment_method: 'online',
              })
            );
          }

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
        }

        if (ticketPromises.length > 0) {
          await Promise.all(ticketPromises);
        }

        router.push(
          `/tickets/confirmation?tickets=${totalTickets}&total=${ticketsGrandTotal.toFixed(2)}&date=${visitDate}`
        );
      } else {
        // Handle membership purchase
        const response = await apiClient.post('/me/membership/purchase', {
          start_date: startDate || undefined,
          paymentData: {
            cardNumber: payment.cardNumber,
            cardholderName: payment.cardholderName,
            expiryMonth: payment.expiryMonth,
            expiryYear: payment.expiryYear,
            cvv: payment.cvv,
            billingAddress: payment.billingAddress,
            billingCity: payment.billingCity,
            billingState: payment.billingState,
            billingZip: payment.billingZip,
          },
          savePaymentMethod: payment.savePaymentMethod,
        });

        if (response.data.success) {
          router.push('/membership/confirmation?plan=Individual');
        } else {
          setError(response.data.message || 'Failed to purchase membership');
        }
      }
    } catch (err: any) {
      console.error('Error processing purchase:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to process purchase. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const backUrl = type === 'tickets' ? '/tickets' : '/membership';

  return (
    <div className="min-h-[calc(100vh-6rem)] py-10">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push(backUrl)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Payment Form */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <PaymentForm
              onPaymentSubmit={handlePaymentSubmit}
              isLoading={isProcessing}
              showSaveOption={true}
            />
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
                    {type === 'tickets' ? (
                      <>
                        {/* Tickets */}
                        {totalTickets > 0 && (
                          <>
                            {adults > 0 && (
                              <div className="flex justify-between text-gray-700">
                                <span>{adults} Adult Ticket{adults > 1 ? 's' : ''}</span>
                                <span className="font-medium">${(adults * TICKET_PRICES.adult).toFixed(2)}</span>
                              </div>
                            )}
                            {children > 0 && (
                              <div className="flex justify-between text-gray-700">
                                <span>{children} Child Ticket{children > 1 ? 's' : ''}</span>
                                <span className="font-medium">${(children * TICKET_PRICES.child).toFixed(2)}</span>
                              </div>
                            )}
                            {seniors > 0 && (
                              <div className="flex justify-between text-gray-700">
                                <span>{seniors} Senior Ticket{seniors > 1 ? 's' : ''}</span>
                                <span className="font-medium">${(seniors * TICKET_PRICES.senior).toFixed(2)}</span>
                              </div>
                            )}
                            <div className="border-t pt-3 flex justify-between font-semibold text-gray-900">
                              <span>Tickets Subtotal</span>
                              <span>${ticketsTotal.toFixed(2)}</span>
                            </div>
                          </>
                        )}

                        {/* Donation */}
                        {ticketDonation > 0 && (
                          <div className="border-t pt-3 flex justify-between text-gray-700">
                            <span>Conservation Donation 💚</span>
                            <span className="font-medium">${ticketDonation.toFixed(2)}</span>
                          </div>
                        )}

                        {/* Visit Date */}
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
                      </>
                    ) : (
                      <>
                        {/* Membership Plan */}
                        <div className="pb-3 border-b">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-semibold text-gray-900">Individual Membership</div>
                              <div className="text-xs text-gray-600 mt-1">Valid for 365 days from start date</div>
                            </div>
                            <span className="font-bold text-gray-900">${MEMBERSHIP_PRICE}</span>
                          </div>
                        </div>

                        {/* Donation */}
                        {membershipDonation > 0 && (
                          <div className="pb-3 border-b flex justify-between text-gray-700">
                            <span>Conservation Donation 💚</span>
                            <span className="font-medium">${membershipDonation.toFixed(2)}</span>
                          </div>
                        )}

                        {/* Member Info */}
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs font-semibold text-gray-800 mb-1">Member:</p>
                          <p className="text-sm text-gray-900">{firstName} {lastName}</p>
                          <p className="text-xs text-gray-600 mt-1">{email}</p>
                        </div>
                      </>
                    )}

                    {/* Grand Total */}
                    <div className="border-t-2 pt-3 flex justify-between text-lg font-bold text-sea_green-700">
                      <span>Total</span>
                      <span>${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-sea_green-600" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

