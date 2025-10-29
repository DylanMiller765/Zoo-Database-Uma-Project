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
  Filter as FilterIcon,
  Settings as SettingsIcon,
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

// columns the user can include/exclude in the CSV
const AVAILABLE_COLUMNS = [
  {
    key: "visit_date",
    label: "Visit Date",
    getValue: (row: VisitorRow, helpers: any) =>
      row.visit_date ? `'${helpers.formatDate(row.visit_date)}` : "",
  },
  {
    key: "ticket_type",
    label: "Ticket Type",
    getValue: (row: VisitorRow) => row.ticket_type ?? "",
  },
  {
    key: "payment_method",
    label: "Payment Method",
    getValue: (row: VisitorRow) => row.payment_method ?? "N/A",
  },
  {
    key: "ticket_count",
    label: "Ticket Count",
    getValue: (row: VisitorRow) =>
      row.ticket_count != null ? String(row.ticket_count) : "0",
  },
  {
    key: "total_revenue",
    label: "Total Revenue (USD)",
    getValue: (row: VisitorRow, helpers: any) =>
      `$${helpers.formatMoney(row.total_revenue)}`,
  },
  {
    key: "avg_price",
    label: "Avg Price (USD)",
    getValue: (row: VisitorRow, helpers: any) =>
      `$${helpers.formatMoney(row.avg_price)}`,
  },
] as const;

export default function VisitorStatisticsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  // -------- data state --------
  const [data, setData] = useState<VisitorRow[]>([]);
  const [summary, setSummary] = useState<VisitorSummary>({
    total_tickets: 0,
    total_revenue: 0,
    avg_ticket_price: 0,
    unique_customers: 0,
  });
  const [loading, setLoading] = useState(true);

  // -------- filters (date range) --------
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // -------- report builder state (user control) --------
  // which columns to include
  const [selectedColumns, setSelectedColumns] = useState<Record<string, boolean>>({
    visit_date: true,
    ticket_type: true,
    payment_method: true,
    ticket_count: true,
    total_revenue: true,
    avg_price: true,
  });

  // how to group
  const [groupMode, setGroupMode] = useState<
    "raw" | "by_ticket_type" | "by_payment_method"
  >("raw");

  // include summary/kpis block at top of CSV?
  const [includeSummaryBlock, setIncludeSummaryBlock] = useState<boolean>(true);

  // -------- util helpers --------
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

  // -------- data load --------
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

  // -------- date filter actions --------
  const handleFilter = () => loadData();
  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setTimeout(() => loadData(), 0);
  };

  // -------- derived stats (for fallback + summarization) --------
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

  // -------- dynamic grouping logic for export --------
  //
  // groupMode === "raw":
  //   just use each row from `data`.
  //
  // groupMode === "by_ticket_type":
  //   combine rows with the same ticket_type:
  //     ticket_count -> sum
  //     total_revenue -> sum
  //     avg_price -> weighted avg = total_revenue_sum / ticket_count_sum
  //
  // groupMode === "by_payment_method":
  //   same idea but group by payment_method instead
  //
  const groupedRowsForExport: VisitorRow[] = useMemo(() => {
    if (groupMode === "raw") {
      return data;
    }

    const map = new Map<string, { ticket_count: number; total_revenue: number; anyRow: VisitorRow }>();

    const makeKey = (row: VisitorRow) =>
      groupMode === "by_ticket_type"
        ? row.ticket_type || "Unknown Ticket Type"
        : row.payment_method || "Unknown Payment Method";

    data.forEach((row) => {
      const key = makeKey(row);
      if (!map.has(key)) {
        map.set(key, {
          ticket_count: 0,
          total_revenue: 0,
          anyRow: row,
        });
      }
      const bucket = map.get(key)!;
      bucket.ticket_count += parseNum(row.ticket_count);
      bucket.total_revenue += parseNum(row.total_revenue);
    });

    // turn that back into VisitorRow-ish objects
    const result: VisitorRow[] = [];
    map.forEach((bucket, key) => {
      const avgPriceCalc =
        bucket.ticket_count > 0
          ? bucket.total_revenue / bucket.ticket_count
          : 0;

      // we "collapse" each bucket into a single pseudo-row
      // we keep the relevant dimension in either ticket_type or payment_method,
      // blank out fields that don't make sense for grouped mode.
      const baseRow = bucket.anyRow;

      const rowOut: VisitorRow = {
        visit_date: groupMode === "raw" ? baseRow.visit_date : "", // hide date because it's multiple days potentially
        ticket_type:
          groupMode === "by_ticket_type" ? key : baseRow.ticket_type ?? "",
        payment_method:
          groupMode === "by_payment_method" ? key : baseRow.payment_method ?? "",
        ticket_count: bucket.ticket_count,
        total_revenue: bucket.total_revenue,
        avg_price: avgPriceCalc,
      };

      result.push(rowOut);
    });

    return result;
  }, [data, groupMode, parseNum]);

  // -------- CSV generation --------
  const generateCsv = useCallback(() => {
    // 1. Build ordered list of columns the user actually wants
    const activeColumns = AVAILABLE_COLUMNS.filter(
      (col) => selectedColumns[col.key]
    );

    // 2. Build the header row from active columns
    const headerRow = activeColumns.map((col) => col.label);

    // 3. Build data rows (from groupedRowsForExport)
    const helpers = { formatMoney, formatDate }; // passed to column getters
    const detailRows: string[][] = groupedRowsForExport.map((r) =>
      activeColumns.map((col) => col.getValue(r, helpers))
    );

    // 4. Optional summary block for the top of the CSV
    //    (lets finance/leadership see KPIs right away)
    const ticketsValue =
      summary.total_tickets ?? derivedStats.totalTicketsFromRows ?? 0;
    const revenueValue =
      summary.total_revenue ?? derivedStats.totalRevenueFromRows ?? 0;

    const summaryBlock: string[][] = includeSummaryBlock
      ? [
          ["Report Summary", ""],
          ["Grouping Mode", groupMode],
          ["Total Tickets Sold", String(ticketsValue)],
          ["Total Revenue (USD)", `$${formatMoney(revenueValue)}`],
          [
            "Avg Ticket Price (USD)",
            `$${formatMoney(summary.avg_ticket_price)}`,
          ],
          [
            "Unique Customers",
            String(summary.unique_customers ?? 0),
          ],
          [""], // blank separator row
        ]
      : [];

    // 5. Escape CSV cells
    const escapeCell = (v: string) =>
      v.includes(",") || v.includes('"') || v.includes("\n")
        ? `"${v.replace(/"/g, '""')}"`
        : v;

    // 6. Build final CSV lines
    const csvLines: string[] = [];

    // summary block (if enabled)
    summaryBlock.forEach((row) => {
      csvLines.push(row.map(escapeCell).join(","));
    });

    // headers
    csvLines.push(headerRow.map(escapeCell).join(","));

    // data
    detailRows.forEach((row) => {
      csvLines.push(row.map(escapeCell).join(","));
    });

    // 7. Download
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
  }, [
    selectedColumns,
    groupedRowsForExport,
    includeSummaryBlock,
    groupMode,
    summary,
    derivedStats,
  ]);

  // -------- loading / auth states --------
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark_spring_green-600" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // -------- UI helpers --------
  const toggleColumn = (key: string) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

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

      {/* DATE FILTER */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilterIcon className="h-4 w-4 text-dark_spring_green-600" />
            Date Range Filter
          </CardTitle>
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

      {/* REPORT OPTIONS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4 text-persian_orange-600" />
            Report Options
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Grouping mode */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Group rows by
            </Label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  className="accent-dark_spring_green-600"
                  checked={groupMode === "raw"}
                  onChange={() => setGroupMode("raw")}
                />
                <span>None (raw rows)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  className="accent-dark_spring_green-600"
                  checked={groupMode === "by_ticket_type"}
                  onChange={() => setGroupMode("by_ticket_type")}
                />
                <span>Ticket Type</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  className="accent-dark_spring_green-600"
                  checked={groupMode === "by_payment_method"}
                  onChange={() => setGroupMode("by_payment_method")}
                />
                <span>Payment Method</span>
              </label>
            </div>
            <p className="text-xs text-gray-500">
              Groups rows and sums ticket counts & revenue. Avg price becomes
              weighted.
            </p>
          </div>

          {/* Column selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Columns to include
            </Label>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {AVAILABLE_COLUMNS.map((col) => (
                <label
                  key={col.key}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="accent-dark_spring_green-600"
                    checked={!!selectedColumns[col.key]}
                    onChange={() => toggleColumn(col.key)}
                  />
                  <span>{col.label}</span>
                </label>
              ))}
            </div>

            <p className="text-xs text-gray-500">
              Only checked columns will be exported.
            </p>
          </div>

          {/* Summary block toggle */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Summary block at top of CSV
            </Label>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                className="accent-dark_spring_green-600"
                checked={includeSummaryBlock}
                onChange={() =>
                  setIncludeSummaryBlock((prev) => !prev)
                }
              />
              <span>
                Include totals (revenue, tickets, avg ticket price,
                unique customers)
              </span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* KPI CARDS */}
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
              {parseNum(summary.total_revenue).toLocaleString(
                "en-US",
                {
                  minimumFractionDigits: 2,
                }
              )}
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
              {parseNum(
                summary.avg_ticket_price
              ).toLocaleString("en-US", {
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

      {/* DATA TABLE (visual preview of raw rows) */}
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
