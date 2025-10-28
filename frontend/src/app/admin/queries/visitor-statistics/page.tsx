"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { queryService } from "@/services/query.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  UserCircle,
  DollarSign,
  TrendingUp,
  Ticket,
  FileDown,
} from "lucide-react";

type VisitorRow = {
  visit_date: string;
  ticket_type: string;
  payment_method: string | null;
  ticket_count: number;
  total_revenue: string | number | null;
  avg_price: string | number | null;
};

type VisitorSummary = {
  total_tickets: number | string | null;
  total_revenue: number | string | null;
  avg_ticket_price: number | string | null;
  unique_customers: number | string | null;
};

export default function VisitorStatisticsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<VisitorRow[]>([]);
  const [summary, setSummary] = useState<VisitorSummary>({
    total_tickets: 0,
    total_revenue: 0,
    avg_ticket_price: 0,
    unique_customers: 0,
  });
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const parseNum = (value: unknown): number => {
    if (value === null || value === undefined) return 0;
    const n = parseFloat(String(value));
    return isNaN(n) ? 0 : n;
  };

  const formatMoney = (value: unknown) =>
    parseNum(value).toLocaleString("en-US", { minimumFractionDigits: 2 });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const y = String(date.getFullYear()).slice(-2);
    return `${m}/${d}/${y}`;
  };

  const getTicketTypeBadge = (type: string) => {
    const variants: Record<string, any> = {
      adult: "default",
      child: "secondary",
      senior: "warning",
      student: "success",
    };
    return variants[type] || "default";
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await queryService.getVisitorStatistics(startDate, endDate);
      setData(result.data || []);
      setSummary(result.summary || {});
    } catch (err) {
      console.error("Failed to load visitor statistics:", err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (isAuthenticated) loadData();
  }, [isAuthenticated, loadData]);

  const handleFilter = () => loadData();
  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setTimeout(() => loadData(), 0);
  };

  const derivedStats = useMemo(() => {
    const totalTicketsFromRows = data.reduce(
      (sum, row) => sum + parseNum(row.ticket_count),
      0
    );
    const totalRevenueFromRows = data.reduce(
      (sum, row) => sum + parseNum(row.total_revenue),
      0
    );
    return { totalTicketsFromRows, totalRevenueFromRows };
  }, [data]);

  // ---------- CSV generation (clean header) ----------
  const generateCsv = useCallback(() => {
    const ticketsValue =
      summary.total_tickets ?? derivedStats.totalTicketsFromRows ?? 0;
    const revenueValue =
      summary.total_revenue ?? derivedStats.totalRevenueFromRows ?? 0;

    // ✅ Clean, professional summary section (no date rows)
    const summaryRows: string[][] = [
      ["Report Summary", ""],
      ["Total Tickets Sold", String(ticketsValue)],
      ["Total Revenue (USD)", `$${formatMoney(revenueValue)}`],
      ["Avg Ticket Price (USD)", `$${formatMoney(summary.avg_ticket_price)}`],
      ["Unique Customers", String(summary.unique_customers ?? 0)],
    ];

    const blankRow: string[] = [""];

    const detailHeaders = [
      "visit_date",
      "ticket_type",
      "payment_method",
      "ticket_count",
      "total_revenue_usd",
      "avg_price_usd",
    ];

    const detailRows: string[][] = data.map((r) => [
      r.visit_date ? `'${formatDate(r.visit_date)}` : "",
      r.ticket_type ?? "",
      r.payment_method ?? "N/A",
      String(r.ticket_count ?? 0),
      `$${formatMoney(r.total_revenue)}`,
      `$${formatMoney(r.avg_price)}`,
    ]);

    const escapeCell = (v: string) =>
      v.includes(",") || v.includes('"') || v.includes("\n")
        ? `"${v.replace(/"/g, '""')}"`
        : v;

    const csvLines: string[] = [];
    summaryRows.forEach((r) => csvLines.push(r.map(escapeCell).join(",")));
    csvLines.push(blankRow.map(escapeCell).join(","));
    csvLines.push(detailHeaders.map(escapeCell).join(","));
    detailRows.forEach((r) => csvLines.push(r.map(escapeCell).join(",")));

    const blob = new Blob([csvLines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `visitor_statistics_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [data, summary, derivedStats]);

  if (authLoading || loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark_spring_green-600" />
      </div>
    );

  if (!isAuthenticated) return null;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <UserCircle className="h-8 w-8 text-sea_green-600" />
            Visitor Statistics
          </h1>
          <p className="text-gray-600 mt-1">
            Analyze ticket sales and visitor trends
          </p>
        </div>

        <Button
          onClick={generateCsv}
          className="flex items-center gap-2 bg-sea_green-600 hover:bg-sea_green-700 text-white"
        >
          <FileDown className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* FILTER */}
      <Card>
        <CardHeader>
          <CardTitle>Date Range Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <Button
              onClick={handleFilter}
              className="bg-dark_spring_green-600 hover:bg-dark_spring_green-700 text-white"
            >
              Apply Filter
            </Button>
            <Button
              variant="outline"
              onClick={handleClearFilter}
              className="border-dark_spring_green-600 text-dark_spring_green-600 hover:bg-dark_spring_green-50"
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Ticket className="h-4 w-4 text-sea_green-600" />
              Total Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-sea_green-600">
              {summary.total_tickets || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="h-4 w-4 text-persian_orange-600" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-persian_orange-600">
              $
              {parseNum(summary.total_revenue).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-dark_spring_green-600" />
              Avg Ticket Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-dark_spring_green-600">
              $
              {parseNum(summary.avg_ticket_price).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserCircle className="h-4 w-4 text-sea_green-600" />
              Unique Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-sea_green-600">
              {summary.unique_customers || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Visit Date</TableHead>
              <TableHead>Ticket Type</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Ticket Count</TableHead>
              <TableHead>Total Revenue</TableHead>
              <TableHead>Avg Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">
                  {formatDate(row.visit_date)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getTicketTypeBadge(row.ticket_type)}
                    className="capitalize"
                  >
                    {row.ticket_type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {row.payment_method || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell>{row.ticket_count}</TableCell>
                <TableCell className="font-semibold text-persian_orange-600">
                  ${formatMoney(row.total_revenue)}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  ${formatMoney(row.avg_price)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {data.length === 0 && (
          <div className="text-center py-12">
            <UserCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No visitor statistics found</p>
            <p className="text-gray-500 text-sm">
              Try clearing the date filter to see all activity.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
