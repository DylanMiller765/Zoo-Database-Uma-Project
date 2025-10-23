'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <>
        <section className="relative isolate overflow-hidden rounded-3xl border shadow-sm
                    min-h-[70vh] px-6 sm:px-10 lg:px-14 py-16 sm:py-20">
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
        className="rounded-full border-white/70 text-white hover:bg-white/10 px-5 py-2 text-sm"
      >
        <Link href="/tickets">Get Tickets</Link>
      </Button>
    </div>

    <div className="mt-10 grid grid-cols-3 gap-4 text-sm text-white/90 sm:mx-auto sm:max-w-md">
      <Stat value="100+" label="Species" />
      <Stat value="8" label="Habitats" />
      <Stat value="50,000+" label="Visitors / yr" />
    </div>
  </div>
</section>

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
                <div className="mt-4 flex items-center gap-3">
                  <Button asChild size="sm" className="rounded-full bg-sea_green-500 hover:bg-sea_green-600 text-white">
                    <Link href={e.href ?? '/exhibits'}>Learn more</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="rounded-full border-dark_spring_green-500 text-dark_spring_green-600 hover:bg-light_yellow-200"
                  >
                    <Link href="/tickets">Get tickets</Link>
                  </Button>
                </div>
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
                <div className="mt-4 flex items-center gap-3">
                  <Button asChild size="sm" className="rounded-full bg-sea_green-500 hover:bg-sea_green-600 text-white">
                    <Link href="/attractions">Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
  </section>

  {/* PLAN YOUR VISIT */}
  <section id="plan" className="space-y-2">
        <h2 className="text-2xl font-bold">Plan Your Visit</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <SimpleCard title="Hours">
            Mon–Fri: 9:00–5:00<br />Sat–Sun: 8:00–4:00
          </SimpleCard>
          <SimpleCard title="Admission">
            Adults $29.95<br />Children $19.95<br />Seniors $24.95
          </SimpleCard>
          <SimpleCard title="Location">
            123 Wildlife Dr<br />City, ST 00000
          </SimpleCard>
          <SimpleCard title="Memberships">
            Annual $149<br />Family $299
          </SimpleCard>
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
  {/* End content wrapper */}
  </div>
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
