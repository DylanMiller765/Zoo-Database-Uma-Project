'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Exhibit = {
  id: string;
  name: string;
  habitat: string;
  summary: string;
};

const MOCK_EXHIBITS: Exhibit[] = [
  { id: 'savanna', name: 'African Savanna', habitat: 'Savanna', summary: 'Lions, zebras, giraffes; open grasslands.' },
  { id: 'rainforest', name: 'Tropical Rainforest', habitat: 'Rainforest', summary: 'Colorful birds, amphibians, and dense canopy.' },
  { id: 'desert', name: 'Desert Dunes', habitat: 'Desert', summary: 'Heat-adapted reptiles and nocturnal mammals.' },
  { id: 'wetlands', name: 'Wetlands Boardwalk', habitat: 'Wetlands', summary: 'Otters, wading birds, and aquatic plants.' },
  { id: 'elephants', name: 'Elephant Valley', habitat: 'Savanna', summary: 'Multi-generational elephant family.' },
];

export default function ExhibitsPage() {
  const [q, setQ] = useState('');
  const [habitat, setHabitat] = useState('All');

  const habitats = useMemo(
    () => ['All', ...Array.from(new Set(MOCK_EXHIBITS.map(e => e.habitat)))],
    []
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return MOCK_EXHIBITS.filter(e => {
      const textMatch =
        !needle ||
        e.name.toLowerCase().includes(needle) ||
        e.summary.toLowerCase().includes(needle);
      const habitatMatch = habitat === 'All' || e.habitat === habitat;
      return textMatch && habitatMatch;
    });
  }, [q, habitat]);

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
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15zm0 25c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10z' fill='%23ffffff'/%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px',
          }}
        />
        <div className="relative z-10 px-6 py-10 text-white sm:px-10">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                <span className="text-sm">🐾 Exhibits</span>
              </div>
              <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Explore Our Exhibits</h1>
              <p className="mt-1 max-w-2xl text-white/90">
                Browse by habitat, search by name, and discover what’s on display today.
              </p>
            </div>

            {/* Filters */}
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search exhibits…"
                className="input-field bg-white/95 text-gray-900 placeholder:text-gray-500 sm:w-72"
              />
              <select
                value={habitat}
                onChange={(e) => setHabitat(e.target.value)}
                className="input-field bg-white/95 text-gray-900 sm:w-56"
              >
                {habitats.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
              <Button
                variant="default"
                className="btn-secondary w-full sm:w-auto"
                onClick={() => {
                  setQ('');
                  setHabitat('All');
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Exhibits Grid */}
      <section className="mt-8 rounded-2xl bg-gray-50 p-4 sm:p-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(ex => (
            <Card
              key={ex.id}
              className="
                group overflow-hidden rounded-xl
                border border-gray-200 bg-white shadow-sm
                transition hover:-translate-y-0.5 hover:shadow-md
              "
            >
              <CardHeader className="px-6 pt-6 pb-3">
                <CardTitle className="text-lg text-dark_spring_green-700">
                  {ex.name}
                </CardTitle>
                <div className="text-xs text-sea_green-700">{ex.habitat}</div>
              </CardHeader>

              <CardContent className="px-6 pb-6 text-sm text-gray-700">
                <p className="leading-relaxed">{ex.summary}</p>

                {/* Left-aligned rounded button with green background */}
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
              No exhibits match your filters.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
