'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PaymentForm, { PaymentData } from '@/components/PaymentForm';
import { checkoutService } from '@/services/checkout.service';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Loader2, ArrowLeft, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { cart, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  if (!isAuthenticated || user?.role !== 'customer') {
    return (
      <div className="min-h-[calc(100vh-6rem)] py-10 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-gray-700 mb-4">
              Please log in to complete your purchase.
            </p>
            <Link href="/login?redirect=/checkout">
              <Button className="w-full bg-sea_green-600 hover:bg-sea_green-700">
                Log In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect if cart is empty
  if (cart.items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-6rem)] py-10 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg text-gray-700 mb-4">Your cart is empty</p>
            <Link href="/">
              <Button className="bg-sea_green-600 hover:bg-sea_green-700">
                Continue Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePaymentSubmit = async (payment: PaymentData) => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await checkoutService.processCheckout({
        items: cart.items.map(item => ({
          item_type: item.item_type,
          item_id: item.item_id,
          name: item.name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          metadata: item.metadata,
        })),
        payment_method: 'credit',
        save_payment_method: payment.savePaymentMethod,
        payment_data: {
          cardNumber: payment.cardNumber,
          cardholderName: payment.cardholderName,
          expiryMonth: parseInt(payment.expiryMonth, 10),
          expiryYear: parseInt(payment.expiryYear, 10),
          cvv: payment.cvv,
          billingAddress: payment.billingAddress,
          billingCity: payment.billingCity,
          billingState: payment.billingState,
          billingZip: payment.billingZip,
        },
      });

      if (result.success) {
        // Clear cart
        clearCart();

        // Redirect to confirmation page
        const params = new URLSearchParams({
          total: result.total_amount.toString(),
          tickets: result.summary.tickets.toString(),
          events: result.summary.events.toString(),
          cafe_items: result.summary.cafe_items.toString(),
          gift_shop_items: result.summary.gift_shop_items.toString(),
          donations: result.summary.donations.toString(),
          memberships: result.summary.memberships?.toString() || '0',
        });

        router.push(`/order-confirmation?${params.toString()}`);
      } else {
        setError('Failed to process order. Please try again.');
      }
    } catch (err: any) {
      console.error('Error processing checkout:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to process order. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] py-10">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  <div className="space-y-3">
                    {/* Cart Items */}
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm pb-3 border-b">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-600">
                            {item.quantity} x ${item.unit_price.toFixed(2)}
                          </p>
                          {item.metadata?.visit_date && (
                            <p className="text-xs text-gray-500 mt-1">
                              Visit: {new Date(item.metadata.visit_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <span className="font-medium text-gray-900">
                          ${(item.quantity * item.unit_price).toFixed(2)}
                        </span>
                      </div>
                    ))}

                    {/* Grand Total */}
                    <div className="border-t-2 pt-4 flex justify-between text-xl font-bold">
                      <span className="text-gray-700">Total</span>
                      <span className="text-sea_green-700">${cart.total.toFixed(2)}</span>
                    </div>

                    {/* Item Count */}
                    <p className="text-xs text-gray-600 text-center pt-2">
                      {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'}
                    </p>
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
