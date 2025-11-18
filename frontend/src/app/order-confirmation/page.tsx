'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle, ShoppingBag, Calendar, Gift, Coffee, Heart } from 'lucide-react';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();

  const total = parseFloat(searchParams.get('total') || '0');
  const tickets = parseInt(searchParams.get('tickets') || '0');
  const events = parseInt(searchParams.get('events') || '0');
  const cafe_items = parseInt(searchParams.get('cafe_items') || '0');
  const gift_shop_items = parseInt(searchParams.get('gift_shop_items') || '0');
  const donations = parseInt(searchParams.get('donations') || '0');

  return (
    <div className="min-h-[calc(100vh-6rem)] py-16">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-green-100 rounded-full p-6 mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-lg text-gray-600 text-center">
            Thank you for your purchase. Your order has been successfully processed.
          </p>
        </div>

        {/* Order Summary Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Items Breakdown */}
            <div className="space-y-3">
              {tickets > 0 && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">{tickets} Ticket{tickets > 1 ? 's' : ''}</span>
                  </div>
                </div>
              )}

              {events > 0 && (
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-gray-900">{events} Event Registration{events > 1 ? 's' : ''}</span>
                  </div>
                </div>
              )}

              {cafe_items > 0 && (
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Coffee className="h-5 w-5 text-yellow-700" />
                    <span className="font-medium text-gray-900">{cafe_items} Café Item{cafe_items > 1 ? 's' : ''}</span>
                  </div>
                </div>
              )}

              {gift_shop_items > 0 && (
                <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Gift className="h-5 w-5 text-pink-600" />
                    <span className="font-medium text-gray-900">{gift_shop_items} Gift Shop Item{gift_shop_items > 1 ? 's' : ''}</span>
                  </div>
                </div>
              )}

              {donations > 0 && (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-gray-900">Conservation Donation</span>
                  </div>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="border-t pt-4 flex justify-between items-center text-xl font-bold">
              <span className="text-gray-700">Total Paid:</span>
              <span className="text-sea_green-700">${total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-lg mb-2 text-blue-900">What's Next?</h3>
          <ul className="space-y-2 text-blue-800">
            {tickets > 0 && (
              <li>• You can view your tickets in your account dashboard</li>
            )}
            {events > 0 && (
              <li>• Event details and confirmation will be available in your account</li>
            )}
            {(cafe_items > 0 || gift_shop_items > 0) && (
              <li>• Your items will be ready for pickup when you visit the zoo</li>
            )}
            {donations > 0 && (
              <li>• Thank you for supporting conservation efforts!</li>
            )}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link href="/customer?refresh=true" className="flex-1">
            <Button className="w-full bg-sea_green-600 hover:bg-sea_green-700 text-white">
              View My Account
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
