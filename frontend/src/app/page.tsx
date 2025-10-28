'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { attractionService } from "@/services/attractions.service";
import { eventService } from "@/services/event.service";
import { Attraction, Event } from "@/types";

export default function HomePage() {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attractionsData, eventsData] = await Promise.all([
          attractionService.getAll(),
          eventService.getAll(),
        ]);
        setAttractions(attractionsData);
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
        <div className="space-y-16 pb-16">
      {/* HERO - Beautiful Gradient Design */}
      <section className="relative isolate overflow-hidden rounded-3xl border shadow-sm
                    min-h-[70vh] px-6 sm:px-10 lg:px-14 py-16 sm:py-20">
        {/* Gradient background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br
                      from-dark_spring_green-500 via-sea_green-400 to-dark_spring_green-600 rounded-3xl" />

        {/* Soft blobs */}
        <div className="pointer-events-none absolute -top-6 right-10 h-24 w-24 rounded-full bg-light_yellow-300/30 blur-2xl" />
        <div className="pointer-events-none absolute top-20 right-24 h-16 w-16 rounded-full bg-melon-300/30 blur-xl" />
        <div className="pointer-events-none absolute -bottom-10 left-10 h-36 w-36 rounded-full bg-white/10 blur-3xl" />

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-10 rounded-3xl"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15zm0 25c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10z' fill='%23ffffff'/%3E%3C/svg%3E")`,
            backgroundSize: "30px 30px",
          }}
        />

        {/* Centered content */}
        <div className="relative z-10 mx-auto max-w-4xl text-center text-white">
          <span className="mb-3 inline-block rounded-full bg-white/10 px-3 py-1 text-xs">
            Welcome to
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
            ZooVerse 12
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/90">
            Explore the wild—discover amazing animals, habitats, and family-friendly attractions.
          </p>

          <div className="mt-7 flex justify-center gap-4">
            <Button
              asChild
              className="rounded-full bg-sea_green-500 hover:bg-sea_green-600 text-white px-5 py-2 text-sm font-medium shadow-sm"
            >
              <Link href="/exhibits">Explore Exhibits</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-sea_green-500/70 bg-sea_green-500/60 text-white hover:bg-sea_green-500/70 px-5 py-2 text-sm font-medium"
            >
              <Link href="/tickets">Get Tickets</Link>
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 sm:gap-6">
            <Stat value="100+" label="Species" />
            <Stat value="8" label="Habitats" />
            <Stat value="50,000+" label="Visitors / yr" />
          </div>
        </div>
      </section>

      {/* FEATURED EXHIBITS - Enhanced with Images */}
      <section id="exhibits" className="space-y-2 rounded-2xl bg-gray-50 p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">Featured Exhibits</h2>
          <a
            href="/exhibits"
            className="inline-flex items-center gap-1 rounded-full bg-sea_green-500 px-4 py-1.5 text-white text-sm font-medium hover:bg-sea_green-600 transition"
          >
            See more <span aria-hidden="true">→</span>
          </a>
        </div>
        <p className="text-sm text-gray-600">Discover our most popular exhibits and crowd favorites!</p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p>Loading exhibits...</p>
          ) : (
            attractions.slice(0, 3).map((attraction) => (
              <Card
                key={attraction.attraction_id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <CardHeader className="px-0 pt-0 pb-3">
                  <div className="w-full overflow-hidden rounded-t-lg">
                    <img
                      src={`/images/pexels-gary-whyte-228069-730537.jpg`}
                      alt={attraction.name}
                      loading="lazy"
                      className="h-44 w-full object-cover"
                    />
                  </div>
                  <div className="px-6 pt-4">
                    <CardTitle className="text-lg text-dark_spring_green-700">{attraction.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6 text-sm text-gray-700">
                  <p className="leading-relaxed">{attraction.location}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* ATTRACTIONS - Enhanced with Images */}
      <section id="attractions" className="space-y-2 rounded-2xl bg-gray-50 p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">Attractions</h2>
          <a
            href="/attractions"
            className="inline-flex items-center gap-1 rounded-full bg-sea_green-500 px-4 py-1.5 text-white text-sm font-medium hover:bg-sea_green-600 transition"
          >
            See more <span aria-hidden="true">→</span>
          </a>
        </div>
        <p className="text-sm text-gray-600">Visit our family favorites around the park.</p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <p>Loading attractions...</p>
          ) : (
            attractions.slice(0, 4).map((attraction) => (
              <Card
                key={attraction.attraction_id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <CardHeader className="px-0 pt-0 pb-3">
                  <div className="w-full overflow-hidden rounded-t-lg">
                    <img
                      src={`/images/attractions/cafe.jpg`}
                      alt={attraction.name}
                      loading="lazy"
                      className="h-44 w-full object-cover"
                    />
                  </div>
                  <div className="px-6 pt-4">
                    <CardTitle className="text-lg text-dark_spring_green-700">{attraction.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6 text-sm text-gray-700">
                  <p className="leading-relaxed">{attraction.location}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* EVENTS */}
      <section id="events" className="space-y-2 rounded-2xl bg-gray-50 p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">Upcoming Events</h2>
          <a
            href="/events"
            className="inline-flex items-center gap-1 rounded-full bg-sea_green-500 px-4 py-1.5 text-white text-sm font-medium hover:bg-sea_green-600 transition"
          >
            See more <span aria-hidden="true">→</span>
          </a>
        </div>
        <p className="text-sm text-gray-600">Join us for special events and educational programs!</p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <p>Loading events...</p>
          ) : (
            events.slice(0, 4).map((event) => (
              <Card
                key={event.event_id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <CardHeader className="px-0 pt-0 pb-3">
                  <div className="w-full overflow-hidden rounded-t-lg">
                    <img
                      src={`/images/events/giraffe-feeding.jpg`}
                      alt={event.name}
                      loading="lazy"
                      className="h-44 w-full object-cover"
                    />
                  </div>
                  <div className="px-6 pt-4">
                    <CardTitle className="text-lg text-dark_spring_green-700">{event.name}</CardTitle>
                    <p className="text-xs text-sea_green-600 font-medium mt-1">{event.start_time} • {event.location}</p>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6 text-sm text-gray-700">
                  <p className="leading-relaxed">{event.description}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* PLAN YOUR VISIT */}
      <section id="plan" className="space-y-2 rounded-2xl bg-gray-50 p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">Plan Your Visit</h2>
          <a
            href="/visit"
            className="inline-flex items-center gap-1 rounded-full bg-sea_green-500 px-4 py-1.5 text-white text-sm font-medium hover:bg-sea_green-600 transition"
          >
            See more <span aria-hidden="true">→</span>
          </a>
        </div>
        <p className="text-sm text-gray-600">Everything you need to know before you visit.</p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <PlanCard 
            icon={<ClockIcon />}
            title="Hours"
            content={<>Mon–Fri: 9:00–5:00<br />Sat–Sun: 8:00–4:00</>}
          />
          <PlanCard 
            icon={<TicketIcon />}
            title="Admission"
            content={<>Adults $29.95<br />Children $19.95<br />Seniors $24.95</>}
          />
          <PlanCard 
            icon={<LocationIcon />}
            title="Location"
            content={<>123 Wildlife Dr<br />City, ST 00000</>}
          />
          <PlanCard 
            icon={<StarIcon />}
            title="Memberships"
            content={<>Annual $149<br />Family $299</>}
          />
        </div>
      </section>

      {/* DONATE CTA */}
      <section id="donate" className="rounded-xl border bg-white p-6 text-center">
        <h3 className="text-xl font-semibold">Support Conservation</h3>
        <p className="mt-2 text-gray-600">Donations help care for animals and protect habitats.</p>
        <div className="mt-4">
          <Button asChild className="rounded-full bg-sea_green-500 hover:bg-sea_green-600">
            <Link href="/donate">Donate Now</Link>
          </Button>
        </div>
      </section>

    </div>
</>

  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white px-6 py-6 shadow-lg">
      <div className="text-3xl font-bold text-sea_green-600">{value}</div>
      <div className="mt-1 text-sm text-gray-600">{label}</div>
    </div>
  );
}

function SimpleCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <CardHeader className="px-6 pt-6 pb-3">
        <CardTitle className="text-lg text-dark_spring_green-700">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6 text-sm text-gray-700">{children}</CardContent>
    </Card>
  );
}

function PlanCard({ icon, title, content }: { icon: React.ReactNode; title: string; content: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white p-8 shadow-lg text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sea_green-100">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-bold text-gray-800">{title}</h3>
      <div className="text-sm text-gray-600 leading-relaxed">{content}</div>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg className="h-8 w-8 text-sea_green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path strokeWidth="2" strokeLinecap="round" d="M12 6v6l4 2" />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg className="h-8 w-8 text-sea_green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="6" width="18" height="12" rx="2" strokeWidth="2" />
      <path strokeWidth="2" d="M3 10h18M3 14h18" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="h-8 w-8 text-sea_green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4-4-8-8-8-11a8 8 0 1116 0c0 3-4 7-8 11z" />
      <circle cx="12" cy="10" r="3" strokeWidth="2" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="h-8 w-8 text-sea_green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}