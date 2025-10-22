'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/api';

type Animal = {
  animal_id: number;
  name: string;
  species: string;
  scientific_name?: string;
  habitat_name?: string;
  health_status?: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  endangerment_status?:
    | 'least_concern'
    | 'near_threatened'
    | 'vulnerable'
    | 'endangered'
    | 'critically_endangered'
    | 'extinct_in_the_wild'
    | 'extinct';
  gender?: 'male' | 'female' | 'unknown';
  date_of_birth?: string;
};

const MOCK_ANIMALS: Animal[] = [
  {
    animal_id: 1,
    name: 'Kibo',
    species: 'Giraffe',
    scientific_name: 'Giraffa camelopardalis',
    habitat_name: 'African Savanna',
    health_status: 'good',
    endangerment_status: 'vulnerable',
    gender: 'male',
  },
  {
    animal_id: 2,
    name: 'Maji',
    species: 'African Elephant',
    scientific_name: 'Loxodonta africana',
    habitat_name: 'Elephant Valley',
    health_status: 'excellent',
    endangerment_status: 'endangered',
    gender: 'female',
  },
  {
    animal_id: 3,
    name: 'Kaya',
    species: 'Jaguar',
    scientific_name: 'Panthera onca',
    habitat_name: 'Tropical Rainforest',
    health_status: 'fair',
    endangerment_status: 'near_threatened',
    gender: 'female',
  },
];

export default function AnimalsPage() {
  const [q, setQ] = useState('');
  const [habitat, setHabitat] = useState<'All' | string>('All');
  const [health, setHealth] = useState<'All' | NonNullable<Animal['health_status']>>('All');
  const [status, setStatus] =
    useState<'All' | NonNullable<Animal['endangerment_status']>>('All');

  const [animals, setAnimals] = useState<Animal[]>(MOCK_ANIMALS);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // GET /animals?search=&habitat=&health=&status=
  const fetchAnimals = async () => {
    try {
      setLoading(true);
      setErr(null);

      const params: Record<string, string> = {};
      if (q.trim()) params.search = q.trim();
      if (habitat !== 'All') params.habitat = habitat;
      if (health !== 'All') params.health = health;
      if (status !== 'All') params.status = status;

      const res = await apiClient.get('/animals', { params });
      const data = (res?.data?.data || res?.data) as Animal[] | undefined;

      if (Array.isArray(data)) {
        setAnimals(data);
      } else {
        setErr('Unexpected response from /animals; showing sample data.');
        setAnimals(MOCK_ANIMALS);
      }
    } catch (e: any) {
      setErr(e?.response?.data?.message || 'Could not load animals; showing sample data.');
      setAnimals(MOCK_ANIMALS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const habitats = useMemo(
    () => ['All', ...Array.from(new Set(animals.map((a) => a.habitat_name).filter(Boolean)))],
    [animals]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return animals.filter((a) => {
      const text = `${a.name ?? ''} ${a.species ?? ''} ${a.scientific_name ?? ''} ${a.habitat_name ?? ''}`.toLowerCase();
      const textMatch = !needle || text.includes(needle);
      const habitatMatch = habitat === 'All' || a.habitat_name === habitat;
      const healthMatch = health === 'All' || a.health_status === health;
      const statusMatch = status === 'All' || a.endangerment_status === status;
      return textMatch && habitatMatch && healthMatch && statusMatch;
    });
  }, [animals, q, habitat, health, status]);

  return (
    <div className="min-h-[calc(100vh-6rem)] py-10">
      {/* Top Banner — consistent with site */}
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
                <span className="text-sm">🐾 Animals</span>
              </div>
              <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Browse & Manage Animals</h1>
              <p className="mt-1 max-w-2xl text-white/90">
                Search by name or species and filter by habitat, health, or conservation status.
              </p>
            </div>

            {/* Filters (wraps neatly, no overflow) */}
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search animals…"
                aria-label="Search animals"
                className="input-field w-full bg-white/95 text-gray-900 placeholder:text-gray-500 sm:w-auto sm:min-w-[16rem] flex-1"
              />

              <select
                value={habitat}
                onChange={(e) => setHabitat(e.target.value)}
                aria-label="Filter by habitat"
                className="input-field w-full bg-white/95 text-gray-900 sm:w-auto sm:min-w-[10rem]"
              >
                {habitats.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>

              <select
                value={health}
                onChange={(e) => setHealth(e.target.value as any)}
                aria-label="Filter by health"
                className="input-field w-full bg-white/95 text-gray-900 sm:w-auto sm:min-w-[10rem]"
              >
                <option value="All">All health</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
                <option value="critical">Critical</option>
              </select>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                aria-label="Filter by conservation status"
                className="input-field w-full bg-white/95 text-gray-900 sm:w-auto sm:min-w-[12rem]"
              >
                <option value="All">All statuses</option>
                <option value="least_concern">Least Concern</option>
                <option value="near_threatened">Near Threatened</option>
                <option value="vulnerable">Vulnerable</option>
                <option value="endangered">Endangered</option>
                <option value="critically_endangered">Critically Endangered</option>
                <option value="extinct_in_the_wild">Extinct in the Wild</option>
                <option value="extinct">Extinct</option>
              </select>

              <Button
                className="btn-secondary w-full sm:w-auto sm:min-w-[8rem]"
                onClick={() => {
                  setQ('');
                  setHabitat('All');
                  setHealth('All');
                  setStatus('All');
                }}
              >
                Reset
              </Button>

              <Button
                className="btn-secondary w-full sm:w-auto sm:min-w-[8rem]"
                onClick={fetchAnimals}
                disabled={loading}
                title="Refresh from server"
              >
                {loading ? 'Loading…' : 'Refresh'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Error note (falls back to mock data) */}
      {err && (
        <div
          className="mt-4 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-900"
          role="status"
          aria-live="polite"
        >
          {err}
        </div>
      )}

      {/* Animals Grid */}
      <section className="mt-8 rounded-2xl bg-gray-50 p-4 sm:p-6">
        {loading ? (
          <SkeletonGrid />
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <Card
                key={a.animal_id}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <CardHeader className="px-6 pt-6 pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg text-dark_spring_green-700">
                        {a.name}{' '}
                        <span className="text-gray-400">·</span>{' '}
                        <span className="text-base text-gray-700">{a.species}</span>
                      </CardTitle>
                      <div className="mt-0.5 text-xs text-sea_green-700">
                        {a.habitat_name || 'Unassigned habitat'}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <HealthPill status={a.health_status ?? 'good'} />
                      <ConservationPill status={a.endangerment_status ?? 'least_concern'} />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-6 pb-6 text-sm text-gray-700">
                  {a.scientific_name && (
                    <p className="leading-relaxed italic text-gray-600">{a.scientific_name}</p>
                  )}

                  {(a.gender || a.date_of_birth) && (
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-600">
                      {a.gender && (
                        <div>
                          <span className="font-semibold text-gray-700">Gender:</span> {a.gender}
                        </div>
                      )}
                      {a.date_of_birth && (
                        <div>
                          <span className="font-semibold text-gray-700">DOB:</span> {a.date_of_birth}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-5 flex gap-2">
                    <Button
                      asChild
                      size="sm"
                      className="rounded-full bg-sea_green-500 px-5 text-white hover:bg-sea_green-600"
                    >
                      <Link href={`/dashboard/animals?view=${a.animal_id}`}>View profile</Link>
                    </Button>

                    <Button
                      asChild
                      size="sm"
                      className="rounded-full bg-dark_spring_green-500 px-5 text-white hover:bg-dark_spring_green-600"
                    >
                      <Link href={`/dashboard/animals?log=${a.animal_id}`}>Log feeding</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filtered.length === 0 && !loading && (
              <div className="col-span-full rounded-xl border bg-light_yellow-100 p-6 text-center text-gray-700">
                No animals match your filters.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

/** Loading skeletons that match card layout */
function SkeletonGrid() {
  const items = Array.from({ length: 6 }, (_, i) => i);
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((i) => (
        <Card key={i} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="px-6 pt-6 pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="h-5 w-48 animate-pulse rounded bg-gray-200" />
              <div className="flex gap-2">
                <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
                <div className="h-6 w-32 animate-pulse rounded-full bg-gray-200" />
              </div>
            </div>
          </div>
          <div className="px-6 pb-6">
            <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="mt-5 flex gap-2">
              <div className="h-8 w-28 animate-pulse rounded-full bg-gray-200" />
              <div className="h-8 w-28 animate-pulse rounded-full bg-gray-200" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

/** Small pills using your palette */
function HealthPill({ status }: { status: NonNullable<Animal['health_status']> }) {
  const map: Record<NonNullable<Animal['health_status']>, { label: string; cls: string }> = {
    excellent: { label: 'Excellent', cls: 'bg-sea_green-100 text-sea_green-800 border-sea_green-300' },
    good:       { label: 'Good',      cls: 'bg-green-100 text-green-800 border-green-300' },
    fair:       { label: 'Fair',      cls: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    poor:       { label: 'Poor',      cls: 'bg-orange-100 text-orange-800 border-orange-300' },
    critical:   { label: 'Critical',  cls: 'bg-red-100 text-red-800 border-red-300' },
  };
  const { label, cls } = map[status] ?? map.good;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}

function ConservationPill({ status }: { status: NonNullable<Animal['endangerment_status']> }) {
  const map: Record<NonNullable<Animal['endangerment_status']>, { label: string; cls: string }> = {
    least_concern:         { label: 'Least Concern',         cls: 'bg-gray-100 text-gray-800 border-gray-300' },
    near_threatened:       { label: 'Near Threatened',       cls: 'bg-lime-100 text-lime-800 border-lime-300' },
    vulnerable:            { label: 'Vulnerable',            cls: 'bg-amber-100 text-amber-800 border-amber-300' },
    endangered:            { label: 'Endangered',            cls: 'bg-orange-100 text-orange-900 border-orange-300' },
    critically_endangered: { label: 'Critically Endangered', cls: 'bg-red-100 text-red-900 border-red-300' },
    extinct_in_the_wild:   { label: 'Extinct in the Wild',   cls: 'bg-gray-200 text-gray-900 border-gray-300' },
    extinct:               { label: 'Extinct',               cls: 'bg-black text-white border-black' },
  };
  const { label, cls } = map[status] ?? map.least_concern;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}
