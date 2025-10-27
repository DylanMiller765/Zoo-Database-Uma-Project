'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TicketConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [ticketCount, setTicketCount] = useState(0);

  useEffect(() => {
    // Get ticket count from URL params
    const count = searchParams.get('tickets');
    if (count) {
      setTicketCount(parseInt(count));
    } else {
      // Redirect if no ticket count provided
      router.push('/tickets');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sea_green-50 to-light_yellow-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="border-sea_green-200 shadow-lg">
          <CardHeader className="bg-sea_green-500 text-white text-center">
            <div className="flex justify-center mb-4">
              <svg 
                className="w-20 h-20 text-white"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <CardTitle className="text-3xl font-bold">
              Thank You for Your Purchase!
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-6">
              <div className="bg-light_yellow-100 border border-sea_green-200 rounded-lg p-6">
                <p className="text-lg text-gray-700 mb-2">
                  You have successfully purchased
                </p>
                <p className="text-4xl font-bold text-sea_green-600">
                  {ticketCount} {ticketCount === 1 ? 'Ticket' : 'Tickets'}
                </p>
              </div>

              <div className="pt-4 space-y-3">
                <p className="text-gray-600">
                  We can&apos;t wait to see you at the zoo! Please bring your confirmation or show your ticket details at the entrance.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button 
                  asChild 
                  className="flex-1 bg-sea_green-500 hover:bg-sea_green-600 text-white text-lg py-6"
                >
                  <Link href="/">
                    Return Home
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline"
                  className="flex-1 border-sea_green-500 text-sea_green-600 hover:bg-sea_green-50 text-lg py-6"
                >
                  <Link href="/tickets">
                    Buy More Tickets
                  </Link>
                </Button>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Need help? Contact us at <span className="text-sea_green-600 font-semibold">info@wildzoo.com</span> or call <span className="text-sea_green-600 font-semibold">(555) 123-4567</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
