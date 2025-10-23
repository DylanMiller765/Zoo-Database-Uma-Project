'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';

type Attraction = {
  id: string;
  name: string;
  location: string;
  opening_time: string;
  closing_time: string;
  description: string;
  status?: 'open' | 'closed' | 'maintenance';
};

const MOCK_ATTRACTIONS: Attraction[] = [
  {
    id: 'aquarium',
    name: 'Aquarium',
    location: 'East Pavilion',
    opening_time: '09:00',
    closing_time: '17:00',
    status: 'open',
    description: 'Walkthrough tunnels with sharks, rays, and tropical fish.',
  },
  {
    id: 'african-forest',
    name: 'African Forest',
    location: 'North Loop',
    opening_time: '09:00',
    closing_time: '17:00',
    status: 'open',
    description: 'Giraffes, gorillas, and immersive savanna paths.',
  },
  {
    id: 'galapagos',
    name: 'Galapagos Islands',
    location: 'West Rim',
    opening_time: '10:00',
    closing_time: '16:00',
    status: 'maintenance',
    description: 'Marine iguanas, giant tortoises, and volcanic exhibits.',
  },
  {
    id: 'butterfly-garden',
    name: 'Butterfly Garden',
    location: 'Central Court',
    opening_time: '09:30',
    closing_time: '16:30',
    status: 'open',
    description: 'Free-flying butterflies in a lush, climate-controlled habitat.',
  },
  {
    id: 'nocturnal-house',
    name: 'Nocturnal House',
    location: 'South Trail',
    opening_time: '11:00',
    closing_time: '19:00',
    status: 'closed',
    description: 'See how desert and rainforest species live after dark.',
  },
];

export default function AttractionsPage() {
  const [q, setQ] = useState('');
  const [loc, setLoc] = useState<'All' | string>('All');
  const [status, setStatus] = useState<'All' | 'open' | 'closed' | 'maintenance'>('All');

  const locations = useMemo(
    () => ['All', ...Array.from(new Set(MOCK_ATTRACTIONS.map(a => a.location)))],
    []
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return MOCK_ATTRACTIONS.filter(a => {
      const textMatch =
        !needle ||
        a.name.toLowerCase().includes(needle) ||
        a.description.toLowerCase().includes(needle) ||
        a.location.toLowerCase().includes(needle);
      const locMatch = loc === 'All' || a.location === loc;
      const statusMatch = status === 'All' || a.status === status;
      return textMatch && locMatch && statusMatch;
    });
  }, [q, loc, status]);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4">
        <div className="min-h-[calc(100vh-6rem)] py-10">
      {/* Top Banner — matches Exhibits style */}
      <section className="relative overflow-hidden rounded-2xl border">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-dark_spring_green-500 via-sea_green-400 to-dark_spring_green-600" />
        <div className="pointer-events-none absolute -top-6 right-10 h-24 w-24 rounded-full bg-light_yellow-300/30 blur-2xl" />
        <div className="pointer-events-none absolute top-20 right-24 h-16 w-16 rounded-full bg-melon-300/30 blur-xl" />
        <div className="pointer-events-none absolute -bottom-10 left-10 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15zm0 25c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10z' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px',
          }}
        />

        <div className="relative z-10 px-6 py-10 text-white sm:px-10">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                <span className="text-sm">🎪 Attractions</span>
              </div>
              <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Explore Attractions</h1>
              <p className="mt-1 max-w-2xl text-white/90">
                Search and filter by location and status.
              </p>
            </div>

            {/* Filters (no Min Capacity) */}
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search attractions…"
                className="input-field bg-white/95 text-gray-900 placeholder:text-gray-500 sm:w-64"
              />
              <select
                value={loc}
                onChange={(e) => setLoc(e.target.value)}
                className="input-field bg-white/95 text-gray-900 sm:w-48"
              >
                {locations.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="input-field bg-white/95 text-gray-900 sm:w-44"
              >
                <option value="All">All status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <Button
                className="btn-secondary w-full sm:w-auto"
                onClick={() => {
                  setQ('');
                  setLoc('All');
                  setStatus('All');
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mt-8 rounded-2xl bg-gray-50 p-4 sm:p-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <Card
              key={a.id}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <CardHeader className="px-6 pt-6 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg text-dark_spring_green-700">
                      {a.name}
                    </CardTitle>
                    <div className="mt-0.5 text-xs text-sea_green-700">{a.location}</div>
                  </div>
                  <StatusPill status={a.status ?? 'open'} />
                </div>
              </CardHeader>

              <CardContent className="px-6 pb-6 text-sm text-gray-700">
                <p className="leading-relaxed">{a.description}</p>

                <div className="mt-4 text-xs text-gray-600">
                  <span className="font-semibold text-gray-700">Hours:</span>{' '}
                  {a.opening_time}–{a.closing_time}
                </div>

                <div className="mt-5 flex justify-start">
                  <Button
                    asChild
                    size="sm"
                    className="rounded-full bg-sea_green-500 text-white hover:bg-sea_green-600 px-5"
                  >
                    <Link href="/tickets">Get tickets</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full rounded-xl border bg-light_yellow-100 p-6 text-center text-gray-700">
              No attractions match your filters.
            </div>
          )}
        </div>
      </section>
        </div>
      </main>
    </>
  );
}

/** Small status pill using your palette */
function StatusPill({ status }: { status: 'open' | 'closed' | 'maintenance' }) {
  const map: Record<typeof status, { label: string; cls: string }> = {
    open: { label: 'Open', cls: 'bg-sea_green-100 text-sea_green-800 border-sea_green-300' },
    closed: { label: 'Closed', cls: 'bg-gray-100 text-gray-800 border-gray-300' },
    maintenance: { label: 'Maintenance', cls: 'bg-melon-100 text-persian_orange-900 border-melon-300' },
  };
  const { label, cls } = map[status] ?? map.open;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}
