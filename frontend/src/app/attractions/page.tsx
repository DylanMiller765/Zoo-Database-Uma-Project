'use client';

// Import necessary hooks and service
import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { attractionService } from '@/services/attractions.service'; // Import the service
import { Attraction } from '@/types'; // Import the correct type

// Keep MOCK_ATTRACTIONS as a fallback
const MOCK_ATTRACTIONS: Attraction[] = [
  // Your existing mock data...
  // Ensure the structure matches the Attraction type from '@/types'
  // (e.g., use attraction_id instead of id if that's what your type uses)
  {
    attraction_id: 1, // Example: Using attraction_id as number
    name: 'Aquarium',
    location: 'East Pavilion',
    opening_time: '09:00',
    closing_time: '17:00',
    status: 'open',
    // description field might be missing in your Attraction type, add if needed
    // description: 'Walkthrough tunnels with sharks, rays, and tropical fish.',
  },
  {
    attraction_id: 2,
    name: 'African Forest',
    location: 'North Loop',
    opening_time: '09:00',
    closing_time: '17:00',
    status: 'open',
    // description: 'Giraffes, gorillas, and immersive savanna paths.',
  },
  {
    attraction_id: 3,
    name: 'Galapagos Islands',
    location: 'West Rim',
    opening_time: '10:00',
    closing_time: '16:00',
    status: 'maintenance',
    // description: 'Marine iguanas, giant tortoises, and volcanic exhibits.',
  },
  {
    attraction_id: 4,
    name: 'Butterfly Garden',
    location: 'Central Court',
    opening_time: '09:30',
    closing_time: '16:30',
    status: 'open',
    // description: 'Free-flying butterflies in a lush, climate-controlled habitat.',
  },
  {
    attraction_id: 5,
    name: 'Nocturnal House',
    location: 'South Trail',
    opening_time: '11:00',
    closing_time: '19:00',
    status: 'closed',
    // description: 'See how desert and rainforest species live after dark.',
  },
];


export default function AttractionsPage() {
  // State for API data, loading, and errors
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for filters remains the same
  const [q, setQ] = useState('');
  const [loc, setLoc] = useState<'All' | string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'open' | 'closed' | 'maintenance'>('All');

  // Fetch data on component mount
  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await attractionService.getAll(); // Call the service
        setAttractions(data);
      } catch (err) {
        console.error("Failed to fetch attractions:", err);
        setError("Could not load attractions. Displaying sample data.");
        // Use mock data as fallback immediately on error
        setAttractions(MOCK_ATTRACTIONS);
      } finally {
        setLoading(false);
      }
    };

    fetchAttractions();
  }, []); // Empty dependency array means this runs once on mount

  // Determine which data source to use (API or Mock)
  // Use mock data if loading or if there was an error
  const dataToDisplay = loading || error ? MOCK_ATTRACTIONS : attractions;

  // Update useMemo hooks to use the current data source (dataToDisplay)
  const locations = useMemo(
    () => ['All', ...Array.from(new Set(dataToDisplay.map(a => a.location || 'Unknown')))], // Handle potential null location
    [dataToDisplay] // Recompute when dataToDisplay changes
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return dataToDisplay.filter(a => {
      const textMatch =
        !needle ||
        a.name.toLowerCase().includes(needle) ||
        // a.description?.toLowerCase().includes(needle) || // Check if description exists
        a.location?.toLowerCase().includes(needle);
      const locMatch = loc === 'All' || a.location === loc;
      const statusMatch = statusFilter === 'All' || a.status === statusFilter;
      return textMatch && locMatch && statusMatch;
    });
  }, [q, loc, statusFilter, dataToDisplay]); // Recompute when filters or data change

  return (
    <>
      <div className="mx-auto max-w-6xl px-4">
        <div className="min-h-[calc(100vh-6rem)] py-10">
          {/* Top Banner (remains the same) */}
          <section className="relative overflow-hidden rounded-2xl border">
            {/* ... (Banner content) ... */}
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

                {/* Filters */}
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search attractions…"
                    className="input-field bg-white/95 text-gray-900 placeholder:text-gray-500 sm:w-64"
                    disabled={loading} // Optionally disable filters while loading
                  />
                  <select
                    value={loc}
                    onChange={(e) => setLoc(e.target.value)}
                    className="input-field bg-white/95 text-gray-900 sm:w-48"
                    disabled={loading}
                  >
                    {locations.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="input-field bg-white/95 text-gray-900 sm:w-44"
                    disabled={loading}
                  >
                    <option value="All">All status</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                  <Button
                    className="btn-secondary w-full sm:w-auto self-center sm:self-auto"
                    onClick={() => {
                      setQ('');
                      setLoc('All');
                      setStatusFilter('All');
                    }}
                    disabled={loading}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Loading Indicator */}
          {loading && (
            <div className="mt-8 text-center text-gray-600">Loading attractions...</div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <div className="mt-8 rounded-md bg-yellow-50 p-4 text-center text-sm text-yellow-700">
              {error}
            </div>
          )}

          {/* Grid */}
          {!loading && ( // Render grid only when not loading
            <section className="mt-8 rounded-2xl bg-gray-50 p-4 sm:p-6">
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((a) => (
                  <Card
                    // Use attraction_id from the API/mock data
                    key={a.attraction_id}
                    className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <CardHeader className="px-6 pt-6 pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle className="text-lg text-dark_spring_green-700">
                            {a.name}
                          </CardTitle>
                          <div className="mt-0.5 text-xs text-sea_green-700">{a.location || 'N/A'}</div>
                        </div>
                        {/* Use optional chaining in case status is null/undefined */}
                        <StatusPill status={a.status ?? 'open'} />
                      </div>
                    </CardHeader>

                    <CardContent className="px-6 pb-6 text-sm text-gray-700">
                      {/* Check if description exists before rendering */}
                      {/* {a.description && <p className="leading-relaxed">{a.description}</p>} */}
                       <p className="leading-relaxed">Placeholder description for {a.name}.</p> {/* Add a placeholder if description isn't available */}


                      <div className="mt-4 text-xs text-gray-600">
                        <span className="font-semibold text-gray-700">Hours:</span>{' '}
                        {/* Handle potential null times */}
                        {a.opening_time || 'N/A'}–{a.closing_time || 'N/A'}
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
          )}
        </div>
      </div>
    </>
  );
}

// StatusPill component remains the same
function StatusPill({ status }: { status: 'open' | 'closed' | 'maintenance' }) {
  // ... (StatusPill implementation remains the same)
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