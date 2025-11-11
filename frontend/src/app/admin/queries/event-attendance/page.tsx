"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { queryService } from "@/services/query.service";
import apiClient from "@/lib/api";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Calendar, Users, Eye, Download, MapPin } from "lucide-react";

/* ============================ Types ============================ */
type EventRow = {
  event_id: number | string;
  event_name: string;
  event_date: string;   // YYYY-MM-DD or ISO
  start_time: string;   // HH:mm:ss or ISO
  end_time: string;     // HH:mm:ss or ISO
  location?: string | null;
  max_participants?: number | null;
  total_registered?: number | null;
  registration_count?: number | null;
  total_revenue?: string | number | null;
  capacity_percentage?: string | number | null;
};

type RegistrationEntity = {
  registration_id: number | string;
  event_id: number | string;
  number_of_participants?: number | null;
  total_amount?: string | number | null;
  registration_date?: string | null;
};

type Attraction = {
  attraction_id: number | string;
  name: string;
  location?: string | null;
  human_capacity?: number | null;
  opening_time?: string | null; // TIME
  closing_time?: string | null; // TIME
  status?: string | null;
};

/* ====== Aliases you can extend if needed ====== */
const ATTRACTION_ALIASES: Record<string, string> = {
  "aquatic center amphitheater": "aquatic center",
  "aquatic amphitheater": "aquatic center",
  "education center": "education center",
  "ed center": "education center",
  "ed ctr": "education center",
  "african savannah": "african savanna",
  // If you want an umbrella: "various locations": "main plaza",
};

/* ============================ Component ============================ */
export default function EventAttendancePage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  // Data
  const [rows, setRows] = useState<EventRow[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationEntity[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);

  // Dates (inclusive)
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // UI
  const [loading, setLoading] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Columns (no Summary section)
  const [cols, setCols] = useState<Record<string, boolean>>({
    Event: true, Date: true, Time: true, Location: true, MaxParticipants: true,
    Participants: true, Amount: true,
    AttractionName: true, AttractionStatus: true, AttractionCapacity: true, AttractionHours: true,
  });
  const selectAllCols = () => setCols(Object.fromEntries(Object.keys(cols).map(k => [k, true])));
  const resetCols = () => setCols(Object.fromEntries(Object.keys(cols).map(k => [k, false])));

  /* ============================ Helpers ============================ */
  const toNum = (v: unknown) => {
    const n = Number(v as any);
    return Number.isFinite(n) ? n : null;
  };
  const moneyNum = (v?: string | number | null) => (typeof v === "string" ? parseFloat(v) : (v ?? 0));
  const currency = (v?: string | number | null) =>
    `$${Number(moneyNum(v) || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const parseDate = (value?: string | null) => {
    if (!value) return null;
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d;
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const d2 = new Date(`${value}T00:00:00`);
      if (!Number.isNaN(d2.getTime())) return d2;
    }
    return null;
  };
  const formatDate = (value?: string | null) => {
    const d = parseDate(value);
    if (!d) return value || "N/A";
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yy = String(d.getFullYear()).slice(-2);
    return `${mm}/${dd}/${yy}`;
  };
  const formatTime = (t?: string | null) => {
    if (!t) return "N/A";
    if (t.includes("T")) {
      const d = new Date(t);
      if (!Number.isNaN(d.getTime())) {
        const hh = String(d.getHours()).padStart(2, "0");
        const mm = String(d.getMinutes()).padStart(2, "0");
        return `${hh}:${mm}`;
      }
    }
    return t.length >= 5 ? t.slice(0, 5) : t;
  };
  const capacityBadge = (pct?: number | null) => {
    if (pct == null) return "default" as const;
    if (pct >= 90) return "danger" as const;
    if (pct >= 70) return "warning" as const;
    if (pct >= 50) return "secondary" as const;
    return "success" as const;
  };
  const hours = (open?: string | null, close?: string | null) =>
    [open, close].every(Boolean) ? `${String(open).slice(0, 5)}–${String(close).slice(0, 5)}` : "N/A";

  const safeArr = (payload: any): any[] =>
    Array.isArray(payload) ? payload
      : Array.isArray(payload?.data) ? payload.data
      : Array.isArray(payload?.rows) ? payload.rows
      : Array.isArray(payload?.data?.rows) ? payload.data.rows
      : [];

  // robust normalize
  const normalize = (s?: string | null) =>
    (s ?? "")
      .toLowerCase()
      .replace(/\u00a0/g, " ")
      .replace(/&/g, " and ")
      .replace(/[@.,/\\()'_’\-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const cutQualifier = (s?: string | null) => {
    if (!s) return s ?? "";
    // keep leftmost chunk before "-", ":", "("
    return String(s).split(/[-:(]/)[0];
  };

  // token helpers
  const toTokens = (s: string) =>
    new Set(
      normalize(s)
        .split(" ")
        .filter(Boolean)
    );

  const jaccard = (a: Set<string>, b: Set<string>) => {
    if (!a.size || !b.size) return 0;
    let inter = 0;
    for (const t of a) if (b.has(t)) inter++;
    return inter / (a.size + b.size - inter);
  };

  const levenshtein = (a: string, b: string) => {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }
    return dp[m][n];
  };
  const similarity = (a: string, b: string) => {
    if (!a || !b) return 0;
    const d = levenshtein(a, b);
    return 1 - d / Math.max(a.length, b.length);
  };

  /* ============================ Data Load ============================ */
  useEffect(() => {
    if (isAuthenticated) void loadAll();
  }, [isAuthenticated]);

  const fetchEvents = async (start?: string, end?: string): Promise<EventRow[]> => {
    try {
      const res = (await (queryService as any).getEventAttendance?.({
        start_date: start || undefined, end_date: end || undefined,
      })) as EventRow[] | undefined;
      if (Array.isArray(res)) {
        return res.map((e: any) => ({
          event_id: e.event_id ?? e.id,
          event_name: e.event_name ?? e.name ?? "",
          event_date: e.event_date ?? e.date ?? "",
          start_time: e.start_time ?? e.starts_at ?? "",
          end_time: e.end_time ?? e.ends_at ?? "",
          location: e.location ?? e.venue ?? "",
          max_participants: e.max_participants ?? e.capacity ?? null,
          total_registered: e.total_registered ?? e.attendees ?? null,
          registration_count: e.registration_count ?? e.bookings ?? null,
          total_revenue: e.total_revenue ?? e.revenue ?? null,
          capacity_percentage: e.capacity_percentage ?? (e.utilization != null ? e.utilization : null),
        }));
      }
    } catch {}
    const candidates = [
      { path: "/reports/event-attendance", params: { start_date: start, end_date: end } },
      { path: "/events/attendance", params: { start_date: start, end_date: end } },
      { path: "/events/summary", params: { start_date: start, end_date: end } },
      { path: "/events", params: { start_date: start, end_date: end } },
    ];
    for (const c of candidates) {
      try {
        const r = await apiClient.get<any>(c.path, { params: c.params });
        const arr = safeArr(r?.data);
        if (arr.length) {
          return arr.map((e: any) => ({
            event_id: e.event_id ?? e.id,
            event_name: e.event_name ?? e.name ?? "",
            event_date: e.event_date ?? e.date ?? "",
            start_time: e.start_time ?? e.starts_at ?? "",
            end_time: e.end_time ?? e.ends_at ?? "",
            location: e.location ?? e.venue ?? "",
            max_participants: e.max_participants ?? e.maxParticipants ?? e.capacity ?? null,
            total_registered: e.total_registered ?? e.attendees ?? null,
            registration_count: e.registration_count ?? e.bookings ?? null,
            total_revenue: e.total_revenue ?? e.revenue ?? null,
            capacity_percentage: e.capacity_percentage ?? (e.utilization != null ? e.utilization : null),
          }));
        }
      } catch {}
    }
    return [];
  };

  const tryFetchRegistrations = async (): Promise<RegistrationEntity[]> => {
    const endpoints = ["/event-registrations","/event_registrations","/events/registrations","/registrations"];
    for (const path of endpoints) {
      try {
        const res = await apiClient.get<any>(path, {
          params: startDate || endDate ? { start_date: startDate || undefined, end_date: endDate || undefined } : undefined,
        });
        const arr = safeArr(res?.data);
        if (arr.length) {
          return arr.map((r: any) => ({
            registration_id: r.registration_id ?? r.id,
            event_id: r.event_id ?? r.eventId,
            number_of_participants: r.number_of_participants ?? r.participants ?? null,
            total_amount: r.total_amount ?? r.amount ?? null,
            registration_date: r.registration_date ?? r.created_at ?? r.createdAt ?? null,
          }));
        }
      } catch {}
    }
    return [];
  };

  // ---------- Pagination helper for attractions ----------
  const fetchAllPages = async (path: string): Promise<any[]> => {
    const all: any[] = [];

    // A: page/limit
    try {
      for (let page = 1; page <= 50; page++) {
        const r = await apiClient.get<any>(path, { params: { page, limit: 100 } });
        const arr = safeArr(r?.data);
        if (!arr.length) break;
        all.push(...arr);
        const next = (r?.data && (r.data.next || r.data.next_page || r.data.nextPage)) ?? null;
        if (!next && arr.length < 100) break;
      }
      if (all.length) return all;
    } catch {}

    // B: offset/limit
    try {
      for (let offset = 0; offset < 5000; offset += 200) {
        const r = await apiClient.get<any>(path, { params: { offset, limit: 200 } });
        const arr = safeArr(r?.data);
        if (!arr.length) break;
        all.push(...arr);
        if (arr.length < 200) break;
      }
      if (all.length) return all;
    } catch {}

    // C: single page fallback
    try {
      const r = await apiClient.get<any>(path);
      const arr = safeArr(r?.data);
      if (arr.length) return arr;
    } catch {}

    return all;
  };

  const tryFetchAttractions = async (): Promise<Attraction[]> => {
    const endpoints = ["/attractions", "/api/attractions", "/reports/attractions"];
    const out: Attraction[] = [];
    const seen = new Set<string>(); // by id or normalized name

    for (const path of endpoints) {
      const pages = await fetchAllPages(path);
      for (const a of pages) {
        const normalizedName = normalize(a.name ?? "");
        const idKey = String(a.attraction_id ?? a.id ?? "") || normalizedName;
        if (seen.has(idKey)) continue;
        seen.add(idKey);
        out.push({
          attraction_id: a.attraction_id ?? a.id,
          name: a.name ?? "",
          location: a.location ?? null,
          human_capacity: a.human_capacity ?? null,
          opening_time: a.opening_time ?? null,
          closing_time: a.closing_time ?? null,
          status: a.status ?? null,
        });
      }
      if (out.length) break; // stop after first endpoint that yields data
    }
    return out;
  };
  // ---------- /pagination ----------

  const loadAll = async () => {
    try {
      setLoading(true);
      const events = await fetchEvents(startDate || undefined, endDate || undefined);
      setRows(Array.isArray(events) ? events : []);
      const regs = await tryFetchRegistrations();
      setRegistrations(regs);
      const attrs = await tryFetchAttractions();
      setAttractions(attrs);
    } finally {
      setLoading(false);
    }
  };

  /* ====================== Filter + Index + Matching ====================== */
  const filteredRows = useMemo(() => {
    if (!startDate && !endDate) return rows;
    const start = startDate ? parseDate(startDate) : null;
    const end = endDate ? parseDate(endDate) : null;
    const endMax = end ? new Date(end.getTime()) : null;
    if (endMax) endMax.setHours(23,59,59,999);
    return rows.filter(r => {
      const d = parseDate(r.event_date);
      if (!d) return true;
      if (start && d < start) return false;
      if (endMax && d > endMax) return false;
      return true;
    });
  }, [rows, startDate, endDate]);

  const regsByEventId = useMemo(() => {
    const g = new Map<number, RegistrationEntity[]>();
    for (const reg of registrations) {
      const eid = toNum((reg as any).event_id);
      if (eid == null) continue;
      const norm: RegistrationEntity = { ...reg, event_id: eid, registration_id: toNum(reg.registration_id) ?? 0 };
      if (!g.has(eid)) g.set(eid, []);
      g.get(eid)!.push(norm);
    }
    return g;
  }, [registrations]);

  const attractionByNameNorm = useMemo(() => {
    const m = new Map<string, Attraction>();
    for (const a of attractions) {
      const k = normalize(a.name);
      if (k) m.set(k, a);
    }
    for (const [aliasRaw, canonRaw] of Object.entries(ATTRACTION_ALIASES)) {
      const alias = normalize(aliasRaw);
      const canon = normalize(canonRaw);
      const a = m.get(canon);
      if (a && !m.has(alias)) m.set(alias, a);
    }
    return m;
  }, [attractions]);

  const attractionByLocNorm = useMemo(() => {
    const m = new Map<string, Attraction>();
    for (const a of attractions) {
      const k = normalize(a.location);
      if (k) m.set(k, a);
    }
    return m;
  }, [attractions]);

  // Token index: token -> set of attractions that contain the token
  const tokenIndex = useMemo(() => {
    const idx = new Map<string, Set<Attraction>>();
    const add = (key: string, a: Attraction) => {
      for (const tok of toTokens(key)) {
        if (!idx.has(tok)) idx.set(tok, new Set());
        idx.get(tok)!.add(a);
      }
    };
    for (const [nameKey, a] of attractionByNameNorm) add(nameKey, a);
    for (const [locKey, a] of attractionByLocNorm) add(locKey, a);
    return idx;
  }, [attractionByNameNorm, attractionByLocNorm]);

  const matchAttraction = (eventLocation?: string | null, eventName?: string | null): Attraction | undefined => {
    // treat "Various Locations" as intentionally N/A; add an alias if you want to map it
    const locCut = cutQualifier(eventLocation);
    const nLoc = normalize(locCut);
    if (nLoc === "various locations") return undefined;

    const nName = normalize(eventName);
    const candidates = [nLoc, nName].filter(Boolean) as string[];

    // alias straight map or exact name/location
    for (const k of candidates) {
      const ali = ATTRACTION_ALIASES[k] ? normalize(ATTRACTION_ALIASES[k]) : k;
      if (attractionByNameNorm.has(ali)) return attractionByNameNorm.get(ali);
      if (attractionByLocNorm.has(ali)) return attractionByLocNorm.get(ali);
      if (attractionByNameNorm.has(k)) return attractionByNameNorm.get(k);
      if (attractionByLocNorm.has(k)) return attractionByLocNorm.get(k);
    }

    // token ALL-match (prefer)
    const locTokens = nLoc ? Array.from(toTokens(nLoc)) : [];
    if (locTokens.length) {
      let possible: Set<Attraction> | null = null;
      for (const t of locTokens) {
        const bucket = tokenIndex.get(t);
        if (!bucket) { possible = null; break; }
        possible = possible ? new Set([...possible].filter(x => bucket.has(x))) : new Set(bucket);
        if (!possible.size) break;
      }
      if (possible && possible.size) return [...possible][0];
    }

    // contains both ways
    for (const k of candidates) {
      for (const [nameKey, a] of attractionByNameNorm) {
        if (nameKey.includes(k) || k.includes(nameKey)) return a;
      }
      for (const [locKey, a] of attractionByLocNorm) {
        if (locKey.includes(k) || k.includes(locKey)) return a;
      }
    }

    // jaccard then levenshtein
    const kTokens = candidates.map(toTokens);
    let bestTok: { a: Attraction; score: number } | null = null;
    const consider = (key: string, a: Attraction) => {
      const aTok = toTokens(key);
      for (const kt of kTokens) {
        const s = jaccard(aTok, kt);
        if (s > (bestTok?.score ?? 0)) bestTok = { a, score: s };
      }
    };
    for (const [nameKey, a] of attractionByNameNorm) consider(nameKey, a);
    for (const [locKey, a] of attractionByLocNorm) consider(locKey, a);
    if (bestTok && bestTok.score >= 0.5) return bestTok.a;

    let best: { a: Attraction; score: number } | null = null;
    for (const k of candidates) {
      for (const [nameKey, a] of attractionByNameNorm) {
        const s = similarity(k, nameKey);
        if (s > (best?.score ?? 0)) best = { a, score: s };
      }
      for (const [locKey, a] of attractionByLocNorm) {
        const s = similarity(k, locKey);
        if (s > (best?.score ?? 0)) best = { a, score: s };
      }
    }
    if (best && best.score >= 0.8) return best.a;

    return undefined;
  };

  /* ============================ Report Rows ============================ */
  const reportRows = useMemo(() => {
    const out: Array<Record<string, any>> = [];
    for (const r of filteredRows) {
      const eventId = toNum((r as any).event_id);
      const regs = eventId != null ? regsByEventId.get(eventId) ?? [] : [];
      const participants = regs.reduce((s, x) => s + (x.number_of_participants ?? 0), 0);

      const attr = matchAttraction(r.location, r.event_name);

      out.push({
        Event: r.event_name,
        Date: formatDate(r.event_date),
        Time: `${formatTime(r.start_time)} - ${formatTime(r.end_time)}`,
        Location: r.location ?? "",
        MaxParticipants: r.max_participants ?? "",

        Participants: r.total_registered ?? participants,
        Amount: currency(r.total_revenue),

        AttractionName: attr?.name ?? "N/A",
        AttractionStatus: attr?.status ?? "N/A",
        AttractionCapacity: attr?.human_capacity ?? "N/A",
        AttractionHours: hours(attr?.opening_time, attr?.closing_time),
      });
    }
    return out;
  }, [filteredRows, regsByEventId, attractionByNameNorm, attractionByLocNorm, tokenIndex]);

  const selectedHeaders = useMemo(() => Object.keys(cols).filter((k) => cols[k]), [cols]);

  const downloadCSV = () => {
    if (!reportRows.length || !selectedHeaders.length) return;
    const escape = (val: any) => {
      const s = String(val ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [
      selectedHeaders.join(","),
      ...reportRows.map((row) => selectedHeaders.map((h) => escape(row[h])).join(",")),
    ];
    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "event_attendance_report.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  /* ============================ Render ============================ */
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark_spring_green-600"></div>
      </div>
    );
  }
  if (!isAuthenticated) return null;

  return (
    <div className="space-y-6">
      {/* Header + actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-8 w-8 text-persian_orange-600" />
            Event Attendance
          </h1>
          <p className="text-gray-600 mt-1">View event registrations with attraction context</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsPreviewOpen(true)} className="flex items-center gap-2">
            <Eye className="h-4 w-4" /> Preview Report
          </Button>
          <Button onClick={downloadCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" /> Download CSV
          </Button>
        </div>
      </div>

      {/* Date Range */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Date Range</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col">
            <label className="text-sm mb-1">Start date</label>
            <input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} className="border rounded-md px-3 py-2 text-sm" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm mb-1">End date</label>
            <input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} className="border rounded-md px-3 py-2 text-sm" />
          </div>
          <div className="flex gap-2">
            <Button onClick={() => loadAll()}>Apply</Button>
            <Button variant="outline" onClick={() => { setStartDate(""); setEndDate(""); void loadAll(); }}>Clear</Button>
          </div>
          {(startDate || endDate) && (
            <div className="text-sm text-gray-600">Active range: {startDate || "—"} to {endDate || "—"}</div>
          )}
        </CardContent>
      </Card>

      {/* Report Options */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-lg">Report Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="outline" size="sm" onClick={resetCols}>Reset Columns</Button>
            <Button variant="outline" size="sm" onClick={selectAllCols}>Select All</Button>
          </div>

          <div className="flex flex-wrap gap-8">
            <div>
              <p className="text-sm font-medium mb-1">Event</p>
              {["Event","Date","Time","Location","MaxParticipants"].map((key) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!cols[key]} onChange={() => setCols(c => ({ ...c, [key]: !c[key] }))} />
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
              ))}
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Registration</p>
              {["Participants","Amount"].map((key) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!cols[key]} onChange={() => setCols(c => ({ ...c, [key]: !c[key] }))} />
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
              ))}
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Attraction</p>
              {["AttractionName","AttractionStatus","AttractionCapacity","AttractionHours"].map((key) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!cols[key]} onChange={() => setCols(c => ({ ...c, [key]: !c[key] }))} />
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Primary table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Name</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Registrations</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Utilization</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(filteredRows.length ? filteredRows : rows).map((r) => (
              <TableRow key={String(r.event_id)}>
                <TableCell className="font-medium">{r.event_name}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{formatDate(r.event_date)}</div>
                    <div className="text-gray-500">{formatTime(r.start_time)} - {formatTime(r.end_time)}</div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {r.location || "N/A"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-dark_spring_green-600" />
                    <span className="font-semibold">
                      {r.total_registered ??
                        (regsByEventId.get(Number(r.event_id)) ?? []).reduce((s, x) => s + (x.number_of_participants ?? 0), 0)}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({r.registration_count ?? (regsByEventId.get(Number(r.event_id)) ?? []).length} bookings)
                    </span>
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline">{r.max_participants ?? "Unlimited"}</Badge></TableCell>
                <TableCell className="font-semibold text-persian_orange-600">{currency(r.total_revenue)}</TableCell>
                <TableCell>
                  {r.capacity_percentage != null ? (
                    <Badge variant={capacityBadge(Number(r.capacity_percentage))}>
                      {Number(r.capacity_percentage).toFixed(1)}%
                    </Badge>
                  ) : <span className="text-sm text-gray-500">N/A</span>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {(filteredRows.length ? filteredRows : rows).length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No events found for the selected range</p>
          </div>
        )}
      </div>

      {/* Modal preview */}
      <Modal
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Report Preview"
        description="Merged report (Events + Event Registrations + Attractions)"
        size="xl"
      >
        {selectedHeaders.length === 0 ? (
          <p className="text-gray-600">Select at least one column in Report Options to see the preview.</p>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {selectedHeaders.map((h) => (
                    <TableHead key={h}>{h.replace(/([A-Z])/g, " $1")}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportRows.map((row, idx) => (
                  <TableRow key={idx}>
                    {selectedHeaders.map((h) => (
                      <TableCell key={h}>{String(row[h] ?? "")}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {reportRows.length === 0 && (
              <div className="text-center py-8 text-gray-600">No rows available.</div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
