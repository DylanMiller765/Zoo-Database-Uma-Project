'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';

type Tier = {
  name: string;
  onetime: string;
  impact: string;
  href: string;
};

const TIERS: Tier[] = [
  { name: 'Supporter',   onetime: '$25',  impact: 'Food & enrichment for small animals', href: '/checkout?tier=supporter' },
  { name: 'Advocate',    onetime: '$50',  impact: 'Vet supplies & habitat upkeep',        href: '/checkout?tier=advocate' },
  { name: 'Guardian',    onetime: '$100', impact: 'Education programs for local schools', href: '/checkout?tier=guardian' },
  { name: 'Conservator', onetime: '$250', impact: 'Conservation & research projects',     href: '/checkout?tier=conservator' },
];

export default function DonatePage() {
  return (
    <div className="min-h-[calc(100vh-6rem)] py-10">
      {/* Top Banner – identical structure to Exhibits page */}
      <section className="relative overflow-hidden rounded-2xl border">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-dark_spring_green-500 via-sea_green-400 to-dark_spring_green-600" />
        <div className="pointer-events-none absolute -top-6 right-10 h-24 w-24 rounded-full bg-light_yellow-300/30 blur-2xl" />
        <div className="pointer-events-none absolute top-20 right-24 h-16 w-16 rounded-full bg-melon-300/30 blur-xl" />
        <div className="pointer-events-none absolute -bottom-10 left-10 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15zm0 25c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10z' fill='%23ffffff'/%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px',
          }}
        />

        <div className="relative z-10 px-6 py-10 text-white sm:px-10">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {/* 🟢 Donate tag matches 🐾 Exhibits tag */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                <span className="text-sm">💚 Donate</span>
              </div>
              <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Support Conservation at ZooVerse 12</h1>
              <p className="mt-1 max-w-2xl text-white/90">
                Every contribution helps care for animals, maintain habitats, and expand educational programs for our community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Table */}
      <section className="mt-8 rounded-2xl bg-gray-50 p-4 sm:p-6">
        <Card className="overflow-hidden rounded-xl border">
          <CardHeader className="px-6 pt-6 pb-3">
            <CardTitle className="text-lg text-dark_spring_green-700">Donation Tiers</CardTitle>
          </CardHeader>

          <CardContent className="px-0 pb-6">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-gray-600">
                  <tr className="border-y">
                    <th className="px-6 py-3 font-semibold">Tier</th>
                    <th className="px-6 py-3 font-semibold">One-time Donation</th>
                    <th className="px-6 py-3 font-semibold">Your Impact</th>
                    <th className="px-6 py-3 font-semibold"><span className="sr-only">Donate</span></th>
                  </tr>
                </thead>
                <tbody>
                  {TIERS.map((t, i) => (
                    <tr
                      key={t.name}
                      className={`border-t ${i % 2 === 1 ? 'bg-gray-50' : 'bg-white'} hover:bg-light_yellow-50 transition-colors`}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">{t.name}</td>
                      <td className="px-6 py-4 text-gray-800">{t.onetime}</td>
                      <td className="px-6 py-4 text-gray-700">{t.impact}</td>
                      <td className="px-6 py-4">
                        <Button
                          asChild
                          size="sm"
                          className="rounded-full bg-sea_green-500 text-white hover:bg-sea_green-600 px-5"
                        >
                          <Link href={t.href}>Donate</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Optional custom amount CTA */}
            <div className="mt-6 px-6">
              <Button asChild className="rounded-full bg-sea_green-500 text-white hover:bg-sea_green-600 px-6">
                <Link href="/checkout">Give a Custom Amount</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
