"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4">
        <div className="space-y-16 pb-16">
      {/* HERO (simple gradient placeholder background) */}
      <section className="relative isolate rounded-xl border bg-white">
        <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200" />
        <div className="px-6 py-16 text-center sm:py-20">
          <span className="mb-3 inline-block rounded-full border px-3 py-1 text-xs text-gray-600">
            Welcome to
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">ZooVerse 12</h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Come explore the wildverse of nature! Discover amazing animals, attractions, and fun for the whole family.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            {/*<Button asChild><Link href="/exhibits">Explore Exhibits</Link></Button>*/}
            <Button asChild variant="outline"><Link href="/tickets">Get Tickets</Link></Button>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4 text-sm text-gray-700 sm:mx-auto sm:max-w-md">
            <Stat value="100+" label="Species" />
            <Stat value="8" label="Habitats" />
            <Stat value="50,000+" label="Visitors" />
          </div>
        </div>
      </section>

      {/* FEATURED EXHIBITS (no images, neutral) */}
      <section className="space-y-2">
        <h2 className="text-2xl font-bold">Featured Exhibits</h2>
        <p className="text-sm text-gray-600">A few examples. Link to the full list.</p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "African Savanna", desc: "Lions, zebras, giraffes. Placeholder copy." },
            { title: "Rainforest", desc: "Tropical birds and amphibians. Placeholder copy." },
            { title: "Elephant Valley", desc: "Family herd viewing area. Placeholder copy." },
          ].map((e) => (
            <Card key={e.title} className="overflow-hidden">
              <div className="h-28 w-full bg-gray-200" />
              <CardHeader><CardTitle className="text-lg">{e.title}</CardTitle></CardHeader>
              <CardContent className="text-sm text-gray-700">
                <p>{e.desc}</p>
                <div className="mt-3">
                  <Link href="/exhibits" className="text-gray-900 underline">Learn more</Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ATTRACTIONS (Gift Shop + Café + optional extras) */}
      <section className="space-y-2">
        <h2 className="text-2xl font-bold">Attractions</h2>
        <p className="text-sm text-gray-600">Keep it simple. Edit names and links later.</p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Gift Shop", desc: "Souvenirs & plush." },
            { title: "Café", desc: "Coffee & snacks." },
            {/*{ title: "Train Ride", desc: "Scenic loop." },*/},
            { title: "Play Zone", desc: "Kids area." },
          ].map((a) => (
            <Card key={a.title}>
              <CardHeader><CardTitle className="text-lg">{a.title}</CardTitle></CardHeader>
              <CardContent className="text-sm text-gray-700">
                <p>{a.desc}</p>
                <div className="mt-3">
                  <Link href="/attractions" className="text-gray-900 underline">Details</Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* PLAN YOUR VISIT (Hours, Admission, Location, Memberships) */}
      <section className="space-y-2">
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
      <section className="rounded-xl border bg-white p-6 text-center">
        <h3 className="text-xl font-semibold">Support Conservation</h3>
        <p className="mt-2 text-gray-600">Donations help care for animals and protect habitats.</p>
        <div className="mt-4">
          <Button asChild><Link href="/donate">Donate Now</Link></Button>
        </div>
      </section>
        </div>
      </main>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border bg-white/80 px-4 py-3">
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  );
}

function SimpleCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">{title}</CardTitle></CardHeader>
      <CardContent className="text-sm text-gray-700">{children}</CardContent>
    </Card>
  );
}
