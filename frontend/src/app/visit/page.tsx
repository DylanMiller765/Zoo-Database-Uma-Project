'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function VisitPage() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-4">
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
                <span className="text-sm">🎫 Plan Your Visit</span>
              </div>
              <h1 className="text-3xl font-bold sm:text-4xl">Everything You Need to Know</h1>
              <p className="mt-2 max-w-2xl text-white/90">
                Hours, admission, holidays, and membership benefits—all in one place.
              </p>
            </div>
          </section>

          {/* Hours & Holidays */}
          <section className="mt-8 rounded-2xl bg-gray-50 p-6">
            <h2 className="text-2xl font-bold mb-4">Hours & Holidays</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <Card className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <CardHeader className="px-6 pt-6 pb-3">
                  <CardTitle className="text-lg text-dark_spring_green-700">Operating Hours</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 text-sm text-gray-700">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Monday – Friday:</span>
                      <span>9:00 AM – 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Saturday – Sunday:</span>
                      <span>8:00 AM – 4:00 PM</span>
                    </div>
                    <p className="mt-4 text-xs text-gray-600">
                      Last entry is 30 minutes before closing.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <CardHeader className="px-6 pt-6 pb-3">
                  <CardTitle className="text-lg text-dark_spring_green-700">Holidays Closed</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 text-sm text-gray-700">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="text-melon-500">•</span>
                      <span>Thanksgiving Day</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-melon-500">•</span>
                      <span>Christmas Day</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-melon-500">•</span>
                      <span>New Year's Day</span>
                    </li>
                  </ul>
                  <p className="mt-4 text-xs text-gray-600">
                    Check our calendar for special closures or early closing days.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Admission Pricing */}
          <section className="mt-8 rounded-2xl bg-gray-50 p-6">
            <h2 className="text-2xl font-bold mb-4">Admission Pricing</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <Card className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <CardHeader className="px-6 pt-6 pb-3">
                  <CardTitle className="text-lg text-dark_spring_green-700">Adults</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="text-3xl font-bold text-sea_green-600">$29.95</div>
                  <p className="mt-2 text-xs text-gray-600">Ages 13+</p>
                </CardContent>
              </Card>

              <Card className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <CardHeader className="px-6 pt-6 pb-3">
                  <CardTitle className="text-lg text-dark_spring_green-700">Children</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="text-3xl font-bold text-sea_green-600">$19.95</div>
                  <p className="mt-2 text-xs text-gray-600">Ages 3–12</p>
                </CardContent>
              </Card>

              <Card className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <CardHeader className="px-6 pt-6 pb-3">
                  <CardTitle className="text-lg text-dark_spring_green-700">Seniors</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="text-3xl font-bold text-sea_green-600">$24.95</div>
                  <p className="mt-2 text-xs text-gray-600">Ages 65+</p>
                </CardContent>
              </Card>
            </div>
            <p className="mt-4 text-sm text-gray-600 text-center">
              Children under 3 are free. Group rates available for 10+ people.
            </p>
          </section>

          {/* Membership Benefits */}
          <section className="mt-8 rounded-2xl bg-gray-50 p-6">
            <h2 className="text-2xl font-bold mb-4">Membership Benefits</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <Card className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <CardHeader className="px-6 pt-6 pb-3">
                  <CardTitle className="text-lg text-dark_spring_green-700">Individual Membership</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="text-2xl font-bold text-sea_green-600 mb-4">$149 / year</div>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-sea_green-500 mt-0.5">✓</span>
                      <span>Unlimited access for one year</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sea_green-500 mt-0.5">✓</span>
                      <span>10% discount at gift shop and cafés</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sea_green-500 mt-0.5">✓</span>
                      <span>Free parking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sea_green-500 mt-0.5">✓</span>
                      <span>Early access to special events</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <CardHeader className="px-6 pt-6 pb-3">
                  <CardTitle className="text-lg text-dark_spring_green-700">Family Membership</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="text-2xl font-bold text-sea_green-600 mb-4">$299 / year</div>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-sea_green-500 mt-0.5">✓</span>
                      <span>Unlimited access for up to 4 family members</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sea_green-500 mt-0.5">✓</span>
                      <span>10% discount at gift shop and cafés</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sea_green-500 mt-0.5">✓</span>
                      <span>Free parking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sea_green-500 mt-0.5">✓</span>
                      <span>Early access to special events</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sea_green-500 mt-0.5">✓</span>
                      <span>2 guest passes per year</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 text-center">
              <Button asChild className="rounded-full bg-sea_green-500 hover:bg-sea_green-600 px-8 py-3">
                <Link href="/tickets">Get Your Membership</Link>
              </Button>
            </div>
          </section>

          {/* Location & Contact */}
          <section className="mt-8 rounded-2xl bg-gray-50 p-6">
            <h2 className="text-2xl font-bold mb-4">Location & Contact</h2>
            <Card className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <CardContent className="px-6 py-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <h3 className="font-semibold text-dark_spring_green-700 mb-2">Address</h3>
                    <p className="text-sm text-gray-700">
                      123 Wildlife Drive<br />
                      City, ST 00000
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark_spring_green-700 mb-2">Contact</h3>
                    <p className="text-sm text-gray-700">
                      Phone: (555) 123-4567<br />
                      Email: info@zooverse12.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </>
  );
}
