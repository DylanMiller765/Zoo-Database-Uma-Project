'use client';

import { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { habitatService } from '@/services/habitat.service';
import { animalService } from '@/services/animal.service';
import { Habitat, Animal } from '@/types';
import { Loader2 } from 'lucide-react';

type ExhibitData = Habitat & {
  animals: Animal[];
  animalCount: number;
};

export default function ExhibitsPage() {
  const [q, setQ] = useState('');
  const [habitatFilter, setHabitatFilter] = useState('All');
  const [habitats, setHabitats] = useState<ExhibitData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [habitatsData, animalsData] = await Promise.all([
          habitatService.getAll(),
          animalService.getAll(),
        ]);

        // Group animals by habitat
        const habitatMap = new Map<number, Animal[]>();
        animalsData.forEach((animal) => {
          if (animal.habitat_id) {
            if (!habitatMap.has(animal.habitat_id)) {
              habitatMap.set(animal.habitat_id, []);
            }
            habitatMap.get(animal.habitat_id)!.push(animal);
          }
        });

        // Combine habitats with their animals
        const exhibitData: ExhibitData[] = habitatsData.map((habitat) => ({
          ...habitat,
          animals: habitatMap.get(habitat.habitat_id) || [],
          animalCount: habitatMap.get(habitat.habitat_id)?.length || 0,
        }));

        setHabitats(exhibitData);
      } catch (err: any) {
        console.error('Error fetching exhibits:', err);
        setError(err.message || 'Failed to load exhibits');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const environmentTypes = useMemo(
    () => ['All', ...Array.from(new Set(habitats.map(h => h.environment_type)))],
    [habitats]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return habitats.filter(h => {
      const textMatch =
        !needle ||
        h.habitat_name.toLowerCase().includes(needle) ||
        h.environment_type.toLowerCase().includes(needle) ||
        h.animals.some(a =>
          a.name.toLowerCase().includes(needle) ||
          a.species.toLowerCase().includes(needle)
        );
      const habitatMatch = habitatFilter === 'All' || h.environment_type === habitatFilter;
      return textMatch && habitatMatch && h.status === 'active';
    });
  }, [q, habitatFilter, habitats]);

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
                disabled={isLoading}
              />
              <select
                value={habitatFilter}
                onChange={(e) => setHabitatFilter(e.target.value)}
                className="input-field bg-white/95 text-gray-900 sm:w-56"
                disabled={isLoading}
              >
                {environmentTypes.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
              <Button
                variant="default"
                className="btn-secondary w-full sm:w-auto self-center sm:self-auto"
                onClick={() => {
                  setQ('');
                  setHabitatFilter('All');
                }}
                disabled={isLoading}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Exhibits Grid */}
      <section className="mt-8 rounded-2xl bg-gray-50 p-4 sm:p-6">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-dark_spring_green-500" />
            <span className="ml-3 text-gray-600">Loading exhibits...</span>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
            <p className="font-semibold">Error loading exhibits</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(habitat => (
              <Card
                key={habitat.habitat_id}
                className="
                  group overflow-hidden rounded-xl
                  border border-gray-200 bg-white shadow-sm
                  transition hover:-translate-y-0.5 hover:shadow-md
                "
              >
                {habitat.image_url && (
                  <div className="w-full overflow-hidden rounded-t-lg">
                    <img
                      src={habitat.image_url}
                      alt={habitat.habitat_name}
                      loading="lazy"
                      className="h-48 w-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="px-6 pt-6 pb-3">
                  <CardTitle className="text-lg text-dark_spring_green-700">
                    {habitat.habitat_name}
                  </CardTitle>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-sea_green-700">{habitat.environment_type}</span>
                    <span className="rounded-full bg-dark_spring_green-100 px-2 py-1 text-dark_spring_green-700">
                      {habitat.animalCount} {habitat.animalCount === 1 ? 'animal' : 'animals'}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="px-6 pb-6 text-sm text-gray-700">
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-dark_spring_green-600">Habitat Details:</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Size: {habitat.size} • Capacity: {habitat.animal_capacity} animals
                      </p>
                      <p className="text-xs text-gray-600">
                        Status: <span className="capitalize font-medium text-sea_green-600">{habitat.status}</span>
                      </p>
                    </div>

                    {habitat.animals.length > 0 && (
                      <div>
                        <p className="font-semibold text-dark_spring_green-600">Featured Animals:</p>
                        <ul className="mt-1 space-y-1">
                          {habitat.animals.slice(0, 5).map((animal) => (
                            <li key={animal.animal_id} className="text-xs text-gray-700">
                              • {animal.name} ({animal.species})
                            </li>
                          ))}
                          {habitat.animals.length > 5 && (
                            <li className="text-xs italic text-gray-500">
                              + {habitat.animals.length - 5} more...
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {habitat.animals.length === 0 && (
                      <p className="text-xs italic text-gray-500">
                        No animals currently housed in this habitat.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {filtered.length === 0 && !isLoading && (
              <div className="col-span-full rounded-xl border bg-light_yellow-100 p-6 text-center text-gray-700">
                No exhibits match your filters.
              </div>
            )}
          </div>
        )}
      </section>
        </div>
      </div>
    </>
  );
}
