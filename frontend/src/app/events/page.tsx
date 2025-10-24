'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type EventItem = {
	id: string;
	title: string;
	location: string;
	description: string;
	date?: string; // ISO date for one-off events
	start: string; // HH:MM (24h)
	end: string;   // HH:MM (24h)
	recurrence: 'daily' | 'one-off';
	image?: string;
};

// Mock data: mix of daily programs and one-off special events
const MOCK_EVENTS: EventItem[] = [
	{
		id: 'giraffe-feeding',
		title: 'Giraffe Feeding',
		location: 'Giraffe Overlook',
		description: 'Watch our giraffes enjoy their breakfast and learn about their unique eating habits.',
		start: '10:00',
		end: '10:20',
		recurrence: 'daily',
		image: '/images/events/giraffe-feeding.jpg',
	},
	{
		id: 'penguin-feeding',
		title: 'Penguin Feeding',
		location: 'Penguin Cove',
		description: 'See our playful penguins dive for fish while keepers share fun facts about their care.',
		start: '11:30',
		end: '11:50',
		recurrence: 'daily',
		image: '/images/events/penguin-feeding.jpg',
	},
	{
		id: 'otter-snack',
		title: 'Otter Snack Time',
		location: 'Otter Stream',
		description: 'Enjoy the otters’ playful antics as they crack shells and splash around during feeding.',
		start: '13:00',
		end: '13:20',
		recurrence: 'daily',
		image: '/images/events/otter-snack.jpg',
	},
	{
		id: 'big-cat-chat',
		title: 'Big Cat Chat',
		location: 'Wild Plains',
		description: 'Meet our lion keepers and learn how we care for these powerful predators up close.',
		start: '14:30',
		end: '14:50',
		recurrence: 'daily',
		image: '/images/events/big-cat-chat.jpg',
	},
	{
		id: 'zoo-lights',
		title: 'Zoo Lights',
		location: 'Park-wide',
		description: 'Evening festival with lights, music, and treats.',
		date: '2025-12-05',
		start: '18:00',
		end: '22:00',
		recurrence: 'one-off',
		image: '/images/events/zoo-lights.jpg',
	},
	{
		id: 'summer-safari-night',
		title: 'Summer Safari Night',
		location: 'Main Lawn',
		description: 'Live music and late hours with animal presentations.',
		date: '2025-07-10',
		start: '19:00',
		end: '21:00',
		recurrence: 'one-off',
		image: '/images/events/safari-night.jpg',
	},
];

function toMinutes(t: string) {
	const [h, m] = t.split(':').map(Number);
	return h * 60 + m;
}

type Status = 'current' | 'past' | 'future' | 'daily';

function computeStatus(e: EventItem, now: Date): Status {
	if (e.recurrence === 'daily') {
		const nMin = now.getHours() * 60 + now.getMinutes();
		const s = toMinutes(e.start);
		const en = toMinutes(e.end);
		// If happening right now, surface as current; otherwise label as daily
		return nMin >= s && nMin <= en ? 'current' : 'daily';
	}
	// one-off: compare dates
	if (!e.date) return 'future';
	const startDate = new Date(`${e.date}T${e.start}:00`);
	const endDate = new Date(`${e.date}T${e.end}:00`);
	if (now < startDate) return 'future';
	if (now > endDate) return 'past';
	return 'current';
}

export default function EventsPage() {
	const [q, setQ] = useState('');
	const [status, setStatus] = useState<'All' | Status>('All');

		const now = new Date();

	const withStatus = useMemo(() => {
		return MOCK_EVENTS.map((e) => ({ ...e, _status: computeStatus(e, now) }));
	}, [now]);

	const filtered = useMemo(() => {
		const needle = q.trim().toLowerCase();
		return withStatus.filter((e) => {
			const textMatch =
				!needle ||
				e.title.toLowerCase().includes(needle) ||
				e.location.toLowerCase().includes(needle) ||
				e.description.toLowerCase().includes(needle);
			const statusMatch = status === 'All' || e._status === status;
			return textMatch && statusMatch;
		});
	}, [q, status, withStatus]);

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
									/>
									<select
										value={status}
										onChange={(e) => setStatus(e.target.value as any)}
										className="input-field bg-white/95 text-gray-900 sm:w-56"
									>
										<option value="All">All</option>
										<option value="current">Current</option>
										<option value="daily">Daily</option>
										<option value="future">Future</option>
										<option value="past">Past</option>
									</select>
																						<Button
																							variant="default"
																							className="btn-secondary w-full sm:w-auto self-center sm:self-auto"
																			onClick={() => {
																				setQ('');
																				setStatus('All');
																			}}
																		>
																			Reset
																		</Button>
								</div>
							</div>
						</div>
					</section>

					{/* Events Grid */}
					<section className="mt-8 rounded-2xl bg-gray-50 p-4 sm:p-6">
						<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
							{filtered.map((ev) => (
								<Card
									key={ev.id}
									className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
								>
									<CardHeader className="px-6 pt-6 pb-3">
										<CardTitle className="text-lg text-dark_spring_green-700">{ev.title}</CardTitle>
										<div className="mt-1 text-xs text-sea_green-700">
											<span className="font-medium">{ev.location}</span>
											<span className="mx-2 text-gray-300">•</span>
											<span>
												{ev.recurrence === 'daily'
													? `${ev.start}–${ev.end} (Daily)`
													: `${ev.date} ${ev.start}–${ev.end}`}
											</span>
										</div>
									</CardHeader>
									<CardContent className="px-6 pb-6 text-sm text-gray-700">
										<p className="leading-relaxed">{ev.description}</p>
									</CardContent>
								</Card>
							))}

							{filtered.length === 0 && (
								<div className="col-span-full rounded-xl border bg-light_yellow-100 p-6 text-center text-gray-700">
									No events match your filters.
								</div>
							)}
						</div>
					</section>
				</div>
			</div>
		</>
	);
}

