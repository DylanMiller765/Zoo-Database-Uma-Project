'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [membershipPlan, setMembershipPlan] = useState('');

  useEffect(() => {
    // Get membership plan from URL params
    const plan = searchParams.get('plan');
    if (plan) {
      setMembershipPlan(plan);
    } else {
      // Redirect if no plan provided
      router.push('/membership');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sea_green-50 to-light_yellow-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="border-sea_green-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-sea_green-500 to-dark_spring_green-500 text-white text-center">
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
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" 
                />
              </svg>
            </div>
            <CardTitle className="text-3xl font-bold">
              Welcome to the Club!
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-6">
              <div className="bg-light_yellow-100 border border-sea_green-200 rounded-lg p-6">
                <p className="text-lg text-gray-700 mb-2">
                  You are now a proud member with our
                </p>
                <p className="text-4xl font-bold text-sea_green-600">
                  {membershipPlan} Membership
                </p>
              </div>

              <div className="pt-4 space-y-3">
                <p className="text-gray-600">
                  Thank you for supporting our zoo! Your membership helps us continue our mission of conservation, education, and animal care.
                </p>
                <p className="text-gray-600 font-semibold">
                  🎉 You now have unlimited access to the zoo for the entire year!
                </p>
              </div>

              <div className="bg-melon-100 border border-persian_orange-300 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  💳 Your membership card will be available for pickup at the entrance on your first visit. Please bring a valid ID.
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
                  <Link href="/membership">
                    View Details
                  </Link>
                </Button>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Questions about your membership? Contact us at <span className="text-sea_green-600 font-semibold">members@wildzoo.com</span> or call <span className="text-sea_green-600 font-semibold">(555) 123-4567</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function MembershipConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
