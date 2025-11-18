'use client';

// Import necessary React hooks and components
import { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCart } from 'lucide-react';
// Import the service and type
import { eventService } from '@/services/event.service';
import { Event } from '@/types'; // Import the Event type from the centralized types file [cite: dylanmiller765/zoo-database-uma-project/Zoo-Database-Uma-Project-ecc1d164d13de8e703063347a8cd967fa2ddaede/frontend/src/types/index.ts]
// Import date-fns for formatting [cite: dylanmiller765/zoo-database-uma-project/Zoo-Database-Uma-Project-ecc1d164d13de8e703063347a8cd967fa2ddaede/frontend/package.json]
import { parse, format, parseISO } from 'date-fns';

// Define a type for status filters matching the API Event type's status
type StatusFilter = 'All' | Event['status'];

// Optional: Mock data as a fallback, structured like the Event type
const MOCK_EVENTS_FALLBACK: Event[] = [
    {
        event_id: 1,
        event_name: 'Giraffe Feeding (Sample)',
        location: 'Giraffe Overlook',
        description: 'Watch our giraffes enjoy their breakfast...',
        start_time: '10:00:00',
        end_time: '10:20:00',
        event_date: '2025-10-26', // Use a real date format
        status: 'scheduled',
    },
    {
        event_id: 2,
        event_name: 'Penguin Feeding (Sample)',
        location: 'Penguin Cove',
        description: 'See our playful penguins dive for fish...',
        start_time: '11:30:00',
        end_time: '11:50:00',
        event_date: '2025-10-26',
        status: 'scheduled',
    },
    {
        event_id: 5,
        event_name: 'Zoo Lights (Sample)',
        location: 'Park-wide',
        description: 'Evening festival with lights, music, and treats.',
        event_date: '2025-12-05',
        start_time: '18:00:00',
        end_time: '22:00:00',
        status: 'scheduled',
    },
];

// Helper function to format time string (e.g., "14:00:00" -> "2:00 PM")
function formatTime(timeStr: string | null | undefined): string {
  if (!timeStr) return 'N/A';
  try {
    // Parse the time string (HH:mm:ss) using a dummy date
    const dummyDate = parse(timeStr, 'HH:mm:ss', new Date());
    // Format to h:mm a (e.g., "2:00 PM")
    return format(dummyDate, 'h:mm a');
  } catch (e) {
    return timeStr; // Fallback to original string if parsing fails
  }
}

// Helper function to format date string (e.g., "2025-12-05" -> "Dec 5, 2025")
function formatEventDate(dateStr: string | null | undefined): string {
    if (!dateStr) return 'N/A';
    try {
        // Parse ISO date string (YYYY-MM-DD)
        const dateObj = parseISO(dateStr);
        // Format to MMM d, yyyy (e.g., "Dec 5, 2025")
        return format(dateObj, 'MMM d, yyyy');
    } catch (e) {
        return dateStr; // Fallback for "Daily" or other non-date strings
    }
}


export default function EventsPage() {
    // State for API data
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for filters
    const [q, setQ] = useState('');
    // Use the StatusFilter type for status state
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
    const { addItem } = useCart();
    const { isAuthenticated, user } = useAuth();
    
    // Fetch data on component mount
    useEffect( () => {
        const fetchEvents = async () => {
            try {
                setLoading(true); // Set loading true at the start
                setError(null);
                const data = await eventService.getAll();
                
                // Sort events by date (soonest first), then by start time
                const sortedEvents = [...data].sort((a, b) => {
                    // First compare dates
                    const dateA = a.event_date ? new Date(a.event_date).getTime() : Infinity;
                    const dateB = b.event_date ? new Date(b.event_date).getTime() : Infinity;
                    
                    if (dateA !== dateB) {
                        return dateA - dateB; // Ascending order (soonest first)
                    }
                    
                    // If dates are the same, sort by start time
                    const timeA = a.start_time || '';
                    const timeB = b.start_time || '';
                    return timeA.localeCompare(timeB);
                });
                
                setEvents(sortedEvents);
            } catch (err) {
                console.error("Failed to fetch events:", err);
                setError('Failed to load events. Displaying sample data.');
                setEvents(MOCK_EVENTS_FALLBACK); // Use the fallback
            } finally {
                setLoading(false); // Set loading false when done
            }
        };
        fetchEvents();
    }, []); // Empty dependency array

    // Determine which data source to use for rendering
    // If loading or error, use the fallback. Otherwise, use fetched events.
    const dataToDisplay = loading || error ? MOCK_EVENTS_FALLBACK : events;

    // Corrected filtering logic
    const filteredEvents = useMemo(() => {
        const needle = q.trim().toLowerCase();
        
        // Filter the dataToDisplay
        return dataToDisplay.filter((e) => {
            // 1. Text search: Check event_name, location, and description
            const textMatch =
                !needle ||
                e.event_name.toLowerCase().includes(needle) ||
                (e.location && e.location.toLowerCase().includes(needle)) ||
                (e.description && e.description.toLowerCase().includes(needle));
            
            // 2. Status filter: Check the 'status' property from the API
            const statusMatch = statusFilter === 'All' || e.status === statusFilter;
            
            return textMatch && statusMatch;
        });
    }, [q, statusFilter, dataToDisplay]); // Depend on filters and the data source

    return (
        <>
            <div className="mx-auto max-w-6xl px-4">
                <div className="min-h-[calc(100vh-6rem)] py-10">
                    {/* Top Banner */}
                    <section className="relative overflow-hidden rounded-2xl border">
                        {/* ... (Banner markup remains the same) ... */}
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
                            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                                        <span className="text-sm">📅 Events</span>
                                    </div>
                                    <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Explore Events</h1>
                                    <p className="mt-1 max-w-2xl text-white/90">
                                        Search daily programs and special events. Filter by status to find what’s happening now.
                                    </p>
                                </div>

                                {/* Filters */}
                                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                                    <input
                                        value={q}
                                        onChange={(e) => setQ(e.target.value)}
                                        placeholder="Search events…"
                                        className="input-field bg-white/95 text-gray-900 placeholder:text-gray-500 sm:w-72"
                                        disabled={loading}
                                    />
                                    {/* Updated select options to match Event['status'] */}
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                                        className="input-field bg-white/95 text-gray-900 sm:w-56"
                                        disabled={loading}
                                    >
                                        <option value="All">All Status</option>
                                        <option value="scheduled">Scheduled</option>
                                        <option value="ongoing">Ongoing</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    <Button
                                        variant="default"
                                        className="btn-secondary w-full sm:w-auto self-center sm:self-auto"
                                        onClick={() => {
                                            setQ('');
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

                    {/* Loading/Error Indicators */}
                    {loading && <div className="mt-8 text-center text-gray-600 py-10">Loading events...</div>}
                    {error && !loading && (
                        <div className="mt-8 rounded-md bg-yellow-50 p-4 text-center text-sm text-yellow-700">
                            {error}
                        </div>
                    )}

                    {/* Events Grid - Render only when not loading */}
                    {!loading && (
                        <section className="mt-8 rounded-2xl bg-gray-50 p-4 sm:p-6">
                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {/* Map over the correctly filtered list: filteredEvents */}
                                {filteredEvents.map((ev) => (
                                    <Card
                                        key={ev.event_id} // Use event_id from Event type
                                        className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md flex flex-col"
                                    >
                                        <CardHeader className="px-6 pt-6 pb-3">
                                            {/* Use event_name from Event type */}
                                            <CardTitle className="text-lg text-dark_spring_green-700">{ev.event_name}</CardTitle>
                                            <div className="mt-1 text-xs text-sea_green-700">
                                                {/* Use location from Event type */}
                                                <span className="font-medium">{ev.location || 'N/A'}</span>
                                                <span className="mx-2 text-gray-300">•</span>
                                                {/* Use event_date, start_time, end_time and format them */}
                                                <span>
                                                    {formatEventDate(ev.event_date)} • {formatTime(ev.start_time)}–{formatTime(ev.end_time)}
                                                </span>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="px-6 pb-6 text-sm text-gray-700 flex-grow">
                                            {/* Use description from Event type */}
                                            <p className="leading-relaxed">{ev.description || 'No description available.'}</p>
                                        </CardContent>
                                        <CardFooter className="px-6 pb-6 mt-auto">
                                            {isAuthenticated && user?.role === 'customer' && ev.status === 'scheduled' && ev.ticket_price != null ? (
                                                <Button
                                                    onClick={() => {
                                                        addItem({
                                                            item_id: ev.event_id,
                                                            name: ev.event_name,
                                                            item_type: 'event',
                                                            quantity: 1,
                                                            unit_price: ev.ticket_price!,
                                                            description: `Event on ${formatEventDate(ev.event_date)}`,
                                                            metadata: {
                                                                event_date: ev.event_date,
                                                            },
                                                        });
                                                    }}
                                                    className="w-full bg-sea_green-600 hover:bg-sea_green-700 text-white"
                                                >
                                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                                    Add to Cart (${ev.ticket_price.toFixed(2)})
                                                </Button>
                                            ) : ev.status !== 'scheduled' ? (
                                                <Button
                                                    disabled
                                                    className="w-full"
                                                >
                                                    Event {ev.status}
                                                </Button>
                                            ) : null}
                                        </CardFooter>
                                    </Card>
                                ))}

                                {/* No results message */}
                                {filteredEvents.length === 0 && !error && (
                                    <div className="col-span-full rounded-xl border bg-light_yellow-100 p-6 text-center text-gray-700">
                                        No events match your filters.
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

