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

type EventAttendanceRow = {
  event_id: number;
  event_name: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string | null;
  total_registered: number | null;
  registration_count: number | null;
  max_participants: number | null;
  total_revenue: string | number | null;
  capacity_percentage: string | number | null; // 0-100
};

export default function EventAttendancePage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<EventAttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);

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
  const getCapacityBadge = (percentage: number | null) => {
    if (percentage === null) return "default";
    if (percentage >= 90) return "danger";
    if (percentage >= 70) return "warning";
    if (percentage >= 50) return "secondary";
    return "success";
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

  const parseNumber = (value: unknown): number => {
    if (value === null || value === undefined) return 0;
    const n = parseFloat(String(value));
    return isNaN(n) ? 0 : n;
  };

  const formatMoney = (value: string | number | null | undefined) => {
    const num = parseNumber(value);
    return num.toLocaleString("en-US", { minimumFractionDigits: 2 });
  };

  // ===== summary metrics (shown in CSV header) =====
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

    // average utilization from capacity_percentage across events that HAVE a percentage
    const utilizationValues: number[] = [];
    data.forEach((ev) => {
      if (
        ev.capacity_percentage !== null &&
        ev.capacity_percentage !== undefined
      ) {
        const pct = parseNumber(ev.capacity_percentage);
        if (!isNaN(pct)) {
          utilizationValues.push(pct);
        }
      }
    });
    const avgUtilization =
      utilizationValues.length > 0
        ? utilizationValues.reduce((a, b) => a + b, 0) /
          utilizationValues.length
        : 0;

    // total capacity vs total registered, to get overall fill
    // (sum(registered) / sum(max_participants)) * 100
    let totalCapacity = 0;
    let totalAssignedToCap = 0;
    data.forEach((ev) => {
      if (
        ev.max_participants !== null &&
        ev.max_participants !== undefined &&
        ev.max_participants > 0
      ) {
        totalCapacity += parseNumber(ev.max_participants);
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
      avgUtilization, // number 0-100
      overallFillPct, // number 0-100
    };
  }, [data]);

  // ===== CSV generation =====
  // CSV layout:
  // 1) Summary section
  // 2) Blank row
  // 3) Per-event detail rows (same as before)
  const generateCsv = useCallback(() => {
    // --- summary section rows ---
    const summaryRows: string[][] = [
      ["Summary Metric", "Value"],
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
    ];

    // --- blank row as separator ---
    const separatorRow: string[] = [""];
    // --- headers for detailed rows ---
    const detailHeaders = [
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

    // --- detail rows, one per event ---
    const detailRows: string[][] = data.map((event) => [
      String(event.event_id ?? ""),
      event.event_name ?? "",
      event.event_date ? formatDate(event.event_date) : "",
      event.start_time ? formatTime(event.start_time) : "",
      event.end_time ? formatTime(event.end_time) : "",
      event.location ?? "",
      String(event.total_registered ?? ""),
      String(event.registration_count ?? ""),
      event.max_participants !== null && event.max_participants !== undefined
        ? String(event.max_participants)
        : "Unlimited",
      `$${formatMoney(event.total_revenue)}`,
      event.capacity_percentage !== null &&
      event.capacity_percentage !== undefined
        ? `${parseNumber(event.capacity_percentage).toFixed(1)}%`
        : "N/A",
    ]);

    // helper to escape cells for CSV safety
    const escapeCell = (val: string) => {
      if (
        val.includes(",") ||
        val.includes('"') ||
        val.includes("\n")
      ) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };

    // build all CSV lines
    const csvLines: string[] = [];

    // summary block
    summaryRows.forEach((row) => {
      csvLines.push(row.map(escapeCell).join(","));
    });

    // separator
    csvLines.push(separatorRow.map(escapeCell).join(","));

    // detail header
    csvLines.push(detailHeaders.map(escapeCell).join(","));

    // detail data
    detailRows.forEach((row) => {
      csvLines.push(row.map(escapeCell).join(","));
    });

    const csvContent = csvLines.join("\n");

    // trigger download
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `event_attendance_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [data, summary]);

  // ===== loading / auth states =====
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark_spring_green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // ===== render =====
  return (
    <div className="space-y-6">
      {/* HEADER ROW WITH TITLE + CSV BUTTON */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-8 w-8 text-persian_orange-600" />
            Event Attendance
          </h1>
          <p className="text-gray-600 mt-1">
            View event registrations and capacity utilization
          </p>
        </div>

        <Button
          onClick={generateCsv}
          className="flex items-center gap-2 bg-sea_green-600 hover:bg-sea_green-700 text-white"
        >
          <FileDown className="h-4 w-4" />
          <span>Generate CSV</span>
        </Button>
      </div>

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
                <TableCell className="font-medium">
                  {event.event_name}
                </TableCell>

                <TableCell>
                  <div className="text-sm">
                    <div>{formatDate(event.event_date)}</div>
                    <div className="text-gray-500">
                      {formatTime(event.start_time)} -{" "}
                      {formatTime(event.end_time)}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-sm text-gray-600">
                  {event.location || "N/A"}
                </TableCell>

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

                <TableCell>
                  <Badge variant="outline">
                    {event.max_participants || "Unlimited"}
                  </Badge>
                </TableCell>

                <TableCell className="font-semibold text-persian_orange-600">
                  ${formatMoney(event.total_revenue)}
                </TableCell>

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
