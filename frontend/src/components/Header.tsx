'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <>
  <section className="relative isolate overflow-hidden rounded-3xl border shadow-sm
        min-h-[70vh] px-6 sm:px-10 lg:px-14 py-20 sm:py-24">
  {/* Gradient background */}
  <div className="absolute inset-0 -z-10 bg-gradient-to-br
                  from-dark_spring_green-500 via-sea_green-400 to-dark_spring_green-600 rounded-3xl" />

  {/* soft blobs */}
  <div className="pointer-events-none absolute -top-6 right-10 h-24 w-24 rounded-full bg-light_yellow-300/30 blur-2xl" />
  <div className="pointer-events-none absolute top-20 right-24 h-16 w-16 rounded-full bg-melon-300/30 blur-xl" />
  <div className="pointer-events-none absolute -bottom-10 left-10 h-36 w-36 rounded-full bg-white/10 blur-3xl" />

  {/* subtle pattern overlay */}
  <div
    className="absolute inset-0 opacity-10 rounded-3xl"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15zm0 25c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10z' fill='%23ffffff'/%3E%3C/svg%3E")`,
      backgroundSize: "30px 30px",
    }}
  />

  {/* Centered content */}
  <div className="relative z-10 mx-auto max-w-4xl text-center text-white">
    <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm">
      Welcome to
    </span>
    <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
      ZooVerse 12
    </h1>
    <p className="mx-auto mt-4 max-w-2xl text-white/90 text-lg">
      Discover amazing animals, immersive habitats, and unforgettable family-friendly adventures at ZooVerse 12
    </p>

    <div className="mt-8 flex flex-wrap justify-center gap-4">
      <Button asChild className="rounded-full bg-white text-dark_spring_green-700 hover:bg-white/90 px-6 py-3 text-sm sm:text-base font-semibold shadow-sm">
        <Link href="/exhibits">Explore Exhibits</Link>
      </Button>
      <Button asChild variant="outline" className="rounded-full border-white/80 text-white hover:bg-white/10 px-6 py-3 text-sm sm:text-base">
        <Link href="/tickets">Get Tickets</Link>
      </Button>
    </div>
  </div>
  {/* Bottom wave to blend into white content */}
  <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10">
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="h-16 w-full fill-white">
      <path d="M0,64 C240,120 480,0 720,32 C960,64 1200,160 1440,96 L1440,120 L0,120 Z" />
    </svg>
  </div>
</section>

{/* Stats overlapping the hero bottom edge */}
<div className="relative z-20 -mt-8 sm:-mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
  {[{v:"100+",l:"Species"},{v:"8",l:"Habitats"},{v:"50,000+",l:"Visitors / yr"}].map((s) => (
    <div key={s.l} className="rounded-2xl bg-white shadow-lg ring-1 ring-black/5 px-6 py-6 text-center">
      <div className="text-4xl font-extrabold text-dark_spring_green-600">{s.v}</div>
      <div className="mt-1 text-sm text-gray-600">{s.l}</div>
    </div>
  ))}
</div>

  {/* FEATURED EXHIBITS — no image bars, clean cards */}
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
          {[
            {
              title: "African Savanna",
              desc: "Lions, zebras, giraffes roaming open grasslands.",
              img: "/images/pexels-gary-whyte-228069-730537.jpg",
            },
            {
              title: "Tropical Rainforest",
              desc: "Tropical birds, amphibians, and dense canopy.",
              img: "/images/pexels-mikhail-nilov-7709803.jpg",
            },
            {
              title: "Elephant Valley",
              desc: "Multi-generational herd and keeper talks.",
              img: "/images/pexels-hsapir-1054666.jpg",
              href: "/exhibits/elephant-valley",
            },
          ].map((e) => (
            <Card
              key={e.title}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <CardHeader className="px-0 pt-0 pb-3">
                <div className="w-full overflow-hidden rounded-t-lg">
                  <img
                    src={e.img}
                    alt={e.title}
                    loading="lazy"
                    className="h-44 w-full object-cover"
                    onError={(ev) => {
                      (ev.currentTarget as HTMLImageElement).src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='300'><rect fill='%23e5e7eb' width='100%25' height='100%25'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='18'>Image unavailable</text></svg>";
                    }}
                  />
                </div>
                <div className="px-6 pt-4">
                  <CardTitle className="text-lg text-dark_spring_green-700">{e.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6 text-sm text-gray-700">
                <p className="leading-relaxed">{e.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
  </section>

  {/* ATTRACTIONS — match Featured Exhibits styling */}
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
          {[
            { title: "Gift Shop", desc: "Souvenirs & plush.", img: "/images/attractions/gift-shop.jpg" },
            { title: "Café", desc: "Coffee & snacks.", img: "/images/attractions/cafe.jpg" },
            { title: "Play Zone", desc: "Kids area.", img: "/images/attractions/play-zone.jpg" },
            { title: "Aquarium", desc: "Sharks, rays, tropical fish.", img: "/images/attractions/aquarium.jpg" },
          ].map((a) => (
            <Card
              key={a.title}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <CardHeader className="px-0 pt-0 pb-3">
                <div className="w-full overflow-hidden rounded-t-lg">
                  <img
                    src={a.img}
                    alt={a.title}
                    loading="lazy"
                    className="h-44 w-full object-cover"
                    onError={(ev) => {
                      (ev.currentTarget as HTMLImageElement).src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='300'><rect fill='%23e5e7eb' width='100%25' height='100%25'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='18'>Image coming soon</text></svg>";
                    }}
                  />
                </div>
                <div className="px-6 pt-4">
                  <CardTitle className="text-lg text-dark_spring_green-700">{a.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6 text-sm text-gray-700">
                <p className="leading-relaxed">{a.desc}</p>
              </CardContent>
            </Card>
          ))}
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
          {[
            { title: "Giraffe Feeding", desc: "Watch our giraffes enjoy their breakfast and learn about their unique eating habits.", img: "/images/events/giraffe-feeding.jpg", time: "10:00 AM", location: "Giraffe Overlook" },
            { title: "Penguin Feeding", desc: "See our playful penguins dive for fish while keepers share fun facts about their care.", img: "/images/events/penguin-feeding.jpg", time: "11:30 AM", location: "Penguin Cove" },
            { title: "Otter Snack Time", desc: "Enjoy the otters' playful antics as they crack shells and splash around during feeding.", img: "/images/events/otter-snack.jpg", time: "1:00 PM", location: "Otter Stream" },
            { title: "Big Cat Chat", desc: "Meet our lion keepers and learn how we care for these powerful predators up close.", img: "/images/events/big-cat-chat.jpg", time: "2:30 PM", location: "Wild Plains" },
          ].map((event) => (
            <Card
              key={event.title}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <CardHeader className="px-0 pt-0 pb-3">
                <div className="w-full overflow-hidden rounded-t-lg">
                  <img
                    src={event.img}
                    alt={event.title}
                    loading="lazy"
                    className="h-44 w-full object-cover"
                    onError={(ev) => {
                      (ev.currentTarget as HTMLImageElement).src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='300'><rect fill='%23e5e7eb' width='100%25' height='100%25'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='18'>Image coming soon</text></svg>";
                    }}
                  />
                </div>
                <div className="px-6 pt-4">
                  <CardTitle className="text-lg text-dark_spring_green-700">{event.title}</CardTitle>
                  <p className="text-xs text-sea_green-600 font-medium mt-1">{event.time} • {event.location}</p>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6 text-sm text-gray-700">
                <p className="leading-relaxed">{event.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
  </section>

  {/* PLAN YOUR VISIT */}
  <section id="plan" className="space-y-6 mt-12" style={{ scrollMarginTop: '-10vh' }}>
        <h2 className="text-3xl font-bold text-center text-gray-900">Plan Your Visit</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {/* Hours Card */}
          <Card className="rounded-2xl border border-gray-200 bg-white shadow-md p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sea_green-100">
              <svg className="h-8 w-8 text-sea_green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2"/>
              </svg>
            </div>
            <CardTitle className="text-xl font-bold text-gray-900 mb-4">Hours</CardTitle>
            <CardContent className="text-gray-600 space-y-1">
              <p>Mon–Fri: 9:00–5:00</p>
              <p>Sat–Sun: 8:00–4:00</p>
            </CardContent>
          </Card>

          {/* Admission Card */}
          <Card className="rounded-2xl border border-gray-200 bg-white shadow-md p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sea_green-100">
              <svg className="h-8 w-8 text-sea_green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth="2"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h.01M7 12h.01"/>
              </svg>
            </div>
            <CardTitle className="text-xl font-bold text-gray-900 mb-4">One-Time Admission</CardTitle>
            <CardContent className="text-gray-600 space-y-1">
              <p>Adults $29.95</p>
              <p>Children $19.95</p>
              <p>Seniors $24.95</p>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card className="rounded-2xl border border-gray-200 bg-white shadow-md p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sea_green-100">
              <svg className="h-8 w-8 text-sea_green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <CardTitle className="text-xl font-bold text-gray-900 mb-4">Location</CardTitle>
            <CardContent className="text-gray-600 space-y-1">
              <p>123 Wildlife Dr</p>
              <p>City, ST 00000</p>
            </CardContent>
          </Card>

          {/* Memberships Card */}
          <Card className="rounded-2xl border border-gray-200 bg-white shadow-md p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sea_green-100">
              <svg className="h-8 w-8 text-sea_green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
              </svg>
            </div>
            <CardTitle className="text-xl font-bold text-gray-900 mb-4">Annual Membership</CardTitle>
            <CardContent className="text-gray-600 space-y-1">
              <p>Annual $149</p>
              <p>Family $299</p>
            </CardContent>
          </Card>
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
  {/* End page content */}
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border bg-white/10 px-4 py-3 sm:bg-white/80 sm:text-gray-700">
      <div className="text-lg font-semibold text-white sm:text-gray-900">{value}</div>
      <div className="text-xs text-white/90 sm:text-gray-600">{label}</div>
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
