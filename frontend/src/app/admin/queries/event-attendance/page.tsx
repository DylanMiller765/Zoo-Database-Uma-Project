"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { queryService } from "@/services/query.service";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Users, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type EventAttendanceRow = {
  event_id: number;
  event_name: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string | null;
  total_registered: number | null;
  registration_count: number | null; // unique bookings / orders
  max_participants: number | null;
  total_revenue: string | number | null;
  capacity_percentage: string | number | null; // 0-100
};

const REPORT_TYPES = [
  { value: "attendance", label: "Attendance / Capacity (default)" },
  { value: "revenue", label: "Revenue Summary" },
  { value: "capacity", label: "Capacity Stress" },
  { value: "utilization", label: "Utilization Ranking" },
];

export default function EventAttendancePage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<EventAttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);

  // user-selected report type
  const [reportType, setReportType] = useState<string>("attendance");

  // fetch data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await queryService.getEventAttendance();
      setData(result);
    } catch (error) {
      console.error("Failed to load event attendance:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadData();
  }, [isAuthenticated, loadData]);

  // ===== helpers =====
  const parseNumber = (value: unknown): number => {
    if (value === null || value === undefined) return 0;
    const n = parseFloat(String(value));
    return isNaN(n) ? 0 : n;
  };

  const getCapacityBadge = (percentage: number | null) => {
    if (percentage === null) return "default";
    if (percentage >= 90) return "danger";
    if (percentage >= 70) return "warning";
    if (percentage >= 50) return "secondary";
    return "success";
  };

  const formatMoney = (value: string | number | null | undefined) => {
    const num = parseNumber(value);
    return num.toLocaleString("en-US", { minimumFractionDigits: 2 });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${day}/${year}`;
  };

  const formatTime = (timeString: string) =>
    timeString ? timeString.substring(0, 5) : "";

  // ===== summary metrics (for high-level stats in CSV header) =====
  const summary = useMemo(() => {
    const totalEvents = data.length;

    const totalRegistrations = data.reduce(
      (sum, ev) => sum + parseNumber(ev.total_registered),
      0
    );

    const totalRevenueRaw = data.reduce(
      (sum, ev) => sum + parseNumber(ev.total_revenue),
      0
    );

    // avg utilization per event, and overall fill % across all capacity
    const utilizationValues: number[] = [];
    data.forEach((ev) => {
      if (
        ev.capacity_percentage !== null &&
        ev.capacity_percentage !== undefined
      ) {
        const pct = parseNumber(ev.capacity_percentage);
        if (!isNaN(pct)) utilizationValues.push(pct);
      }
    });
    const avgUtilization =
      utilizationValues.length > 0
        ? utilizationValues.reduce((a, b) => a + b, 0) /
          utilizationValues.length
        : 0;

    // "overall fill %":
    // (sum of registered) / (sum of capacity) * 100
    let totalCapacity = 0;
    let totalAssignedToCap = 0;
    data.forEach((ev) => {
      const cap = ev.max_participants;
      if (cap !== null && cap !== undefined && cap > 0) {
        totalCapacity += parseNumber(cap);
        totalAssignedToCap += parseNumber(ev.total_registered);
      }
    });
    const overallFillPct =
      totalCapacity > 0
        ? (totalAssignedToCap / totalCapacity) * 100
        : 0;

    return {
      totalEvents,
      totalRegistrations,
      totalRevenueRaw,
      avgUtilization, // avg of per-event %
      overallFillPct, // global fill
    };
  }, [data]);

  // ===== CSV building logic per report type =====
  // Each report type returns { headers, rows }.
  const buildRowsForReport = useCallback(
    (type: string): { headers: string[]; rows: string[][] } => {
      if (type === "revenue") {
        const headers = [
          "event_id",
          "event_name",
          "event_date",
          "total_registered",
          "total_revenue_usd",
          "revenue_per_attendee_usd",
        ];

        const rows = data.map((ev) => {
          const totalReg = parseNumber(ev.total_registered);
          const totalRev = parseNumber(ev.total_revenue);
          const perHead =
            totalReg > 0 ? totalRev / totalReg : 0;

          return [
            String(ev.event_id ?? ""),
            ev.event_name ?? "",
            ev.event_date ? formatDate(ev.event_date) : "",
            String(totalReg),
            `$${formatMoney(ev.total_revenue)}`,
            `$${perHead.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}`,
          ];
        });

        return { headers, rows };
      }

      if (type === "capacity") {
        // Focus: which events are at/near capacity
        const headers = [
          "event_id",
          "event_name",
          "event_date",
          "max_participants",
          "total_registered",
          "capacity_percentage",
          "status",
        ];

        const rows = data.map((ev) => {
          const pctNum = ev.capacity_percentage
            ? parseNumber(ev.capacity_percentage)
            : null;

          let statusLabel = "OK";
          if (pctNum !== null) {
            if (pctNum >= 100) statusLabel = "Overbooked";
            else if (pctNum >= 90) statusLabel = "Near Full";
            else if (pctNum >= 70) statusLabel = "Filling";
          }

          return [
            String(ev.event_id ?? ""),
            ev.event_name ?? "",
            ev.event_date ? formatDate(ev.event_date) : "",
            ev.max_participants !== null &&
            ev.max_participants !== undefined
              ? String(ev.max_participants)
              : "Unlimited",
            String(ev.total_registered ?? 0),
            pctNum !== null
              ? `${pctNum.toFixed(1)}%`
              : "N/A",
            statusLabel,
          ];
        });

        return { headers, rows };
      }

      if (type === "utilization") {
        // Rank events by capacity % (highest first)
        const sorted = [...data].sort((a, b) => {
          const pa =
            a.capacity_percentage !== null &&
            a.capacity_percentage !== undefined
              ? parseNumber(a.capacity_percentage)
              : -1;
          const pb =
            b.capacity_percentage !== null &&
            b.capacity_percentage !== undefined
              ? parseNumber(b.capacity_percentage)
              : -1;
          return pb - pa;
        });

        const headers = [
          "event_id",
          "event_name",
          "event_date",
          "max_participants",
          "total_registered",
          "capacity_percentage",
        ];

        const rows = sorted.map((ev) => [
          String(ev.event_id ?? ""),
          ev.event_name ?? "",
          ev.event_date ? formatDate(ev.event_date) : "",
          ev.max_participants !== null &&
          ev.max_participants !== undefined
            ? String(ev.max_participants)
            : "Unlimited",
          String(ev.total_registered ?? 0),
          ev.capacity_percentage !== null &&
          ev.capacity_percentage !== undefined
            ? `${parseNumber(ev.capacity_percentage).toFixed(1)}%`
            : "N/A",
        ]);

        return { headers, rows };
      }

      // default: "attendance"
      // basically your existing per-event detail
      const headers = [
        "event_id",
        "event_name",
        "event_date",
        "start_time",
        "end_time",
        "location",
        "total_registered",
        "registration_count",
        "max_participants",
        "total_revenue_usd",
        "capacity_percentage",
      ];

      const rows = data.map((ev) => [
        String(ev.event_id ?? ""),
        ev.event_name ?? "",
        ev.event_date ? formatDate(ev.event_date) : "",
        ev.start_time ? formatTime(ev.start_time) : "",
        ev.end_time ? formatTime(ev.end_time) : "",
        ev.location ?? "",
        String(ev.total_registered ?? ""),
        String(ev.registration_count ?? ""),
        ev.max_participants !== null &&
        ev.max_participants !== undefined
          ? String(ev.max_participants)
          : "Unlimited",
        `$${formatMoney(ev.total_revenue)}`,
        ev.capacity_percentage !== null &&
        ev.capacity_percentage !== undefined
          ? `${parseNumber(ev.capacity_percentage).toFixed(1)}%`
          : "N/A",
      ]);

      return { headers, rows };
    },
    [data]
  );

  // ===== CSV export helper =====
  const escapeCell = (val: string) => {
    if (val.includes(",") || val.includes('"') || val.includes("\n")) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const toCsvText = (rows: string[][]) =>
    rows.map((row) => row.map(escapeCell).join(",")).join("\n");

  const downloadCsv = (filenameBase: string, csvText: string) => {
    const blob = new Blob([csvText], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${filenameBase}_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ===== Final CSV generator =====
  const handleGenerateCsv = useCallback(() => {
    const { headers, rows } = buildRowsForReport(reportType);

    // summary block depends on reportType but we’ll keep it simple:
    const summaryRows: string[][] = [
      ["Report Type", reportType],
      ["Total Events", String(summary.totalEvents)],
      ["Total Registrations", String(summary.totalRegistrations)],
      [
        "Total Revenue (USD)",
        `$${summary.totalRevenueRaw.toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })}`,
      ],
      [
        "Average Utilization % (per event)",
        `${summary.avgUtilization.toFixed(1)}%`,
      ],
      [
        "Overall Capacity Fill %",
        `${summary.overallFillPct.toFixed(1)}%`,
      ],
      [""], // blank line
    ];

    const csvText = toCsvText([
      ...summaryRows,
      headers,
      ...rows,
    ]);

    downloadCsv(`event_report_${reportType}`, csvText);
  }, [reportType, summary, buildRowsForReport]);

  // ===== loading / auth states =====
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark_spring_green-600" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // ===== render =====

  // NOTE: we could conditionally hide/show columns in the table using `reportType`.
  // For now we keep your original table layout visible all the time in the UI,
  // because it's the most useful live view. The dropdown only affects the CSV.

  return (
    <div className="space-y-6">
      {/* HEADER ROW WITH TITLE + CONTROLS */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-8 w-8 text-persian_orange-600" />
            Event Attendance
          </h1>
          <p className="text-gray-600 mt-1">
            View event registrations and capacity utilization, or export a
            specific style of report.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          {/* Report Type Select */}
          <div className="flex flex-col text-sm">
            <Label className="text-xs text-gray-600 mb-1">
              Report Type
            </Label>
            <select
              className="rounded-md border px-2 py-1 text-sm"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              {REPORT_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* CSV Export */}
          <Button
            onClick={handleGenerateCsv}
            className="flex items-center gap-2 bg-sea_green-600 hover:bg-sea_green-700 text-white self-start sm:self-auto"
          >
            <FileDown className="h-4 w-4" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Name</TableHead>
              <TableHead>Date &amp; Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Registrations</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Utilization</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((event) => (
              <TableRow key={event.event_id}>
                {/* Event Name */}
                <TableCell className="font-medium">
                  {event.event_name}
                </TableCell>

                {/* Date & Time */}
                <TableCell>
                  <div className="text-sm">
                    <div>{formatDate(event.event_date)}</div>
                    <div className="text-gray-500">
                      {formatTime(event.start_time)} -{" "}
                      {formatTime(event.end_time)}
                    </div>
                  </div>
                </TableCell>

                {/* Location */}
                <TableCell className="text-sm text-gray-600">
                  {event.location || "N/A"}
                </TableCell>

                {/* Registrations */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-dark_spring_green-600" />
                    <span className="font-semibold">
                      {event.total_registered ?? 0}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({event.registration_count ?? 0} bookings)
                    </span>
                  </div>
                </TableCell>

                {/* Capacity */}
                <TableCell>
                  <Badge variant="outline">
                    {event.max_participants || "Unlimited"}
                  </Badge>
                </TableCell>

                {/* Revenue */}
                <TableCell className="font-semibold text-persian_orange-600">
                  ${formatMoney(event.total_revenue)}
                </TableCell>

                {/* Utilization */}
                <TableCell>
                  {event.capacity_percentage !== null &&
                  event.capacity_percentage !== undefined ? (
                    <Badge
                      variant={getCapacityBadge(
                        parseNumber(event.capacity_percentage)
                      )}
                    >
                      {parseNumber(
                        event.capacity_percentage
                      ).toFixed(1)}
                      %
                    </Badge>
                  ) : (
                    <span className="text-sm text-gray-500">N/A</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {data.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No upcoming events found</p>
          </div>
        )}
      </div>
    </div>
  );
}
