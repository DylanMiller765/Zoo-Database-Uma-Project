"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { queryService } from "@/services/query.service";
import apiClient from "@/lib/api";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { UserCircle, DollarSign, TrendingUp, Ticket, Eye, Download } from "lucide-react";
import { Modal } from "@/components/ui/modal";

/** ---------- Types from your schema ---------- */
type Summary = {
  total_tickets?: number | null;
  total_revenue?: string | number | null;
  avg_ticket_price?: string | number | null;
  unique_customers?: number | null;
};

type BaseRow = {
  visit_date: string;
  ticket_type?: string | null;
  payment_method?: string | null;
  ticket_count?: number | null;
  total_revenue?: string | number | null;
  avg_price?: string | number | null;
};

type TicketEntity = {
  ticket_id: number;
  customer_id: number | null;
  purchase_date: string | null; // DATETIME
  visit_date: string | null;    // DATE
  ticket_type: "adult" | "child" | "senior" | "student";
  price: string | number;       // DECIMAL
  payment_method: "cash" | "credit" | "debit" | "online" | null;
};

type CustomerEntity = {
  customer_id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  annual_pass: "yes" | "no";
  registration_date: string | null;
};

type GiftShopTxn = {
  transaction_id: number;
  customer_id: number | null;
  sale_date: string;               // DATETIME
  total_amount: string | number;   // DECIMAL
};

/** ---------- Utils ---------- */
const safeArr = (payload: any): any[] =>
  Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];

const moneyNum = (v?: string | number | null) =>
  typeof v === "string" ? parseFloat(v) : (v ?? 0);

const currency = (v?: string | number | null) =>
  `$${Number(moneyNum(v) || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  })}`;

/** Format a Date to local YYYY-MM-DD */
const toYMD = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/** Get a reliable YYYY-MM-DD from a variety of inputs (date or datetime strings) without timezone gotchas */
const ymdFromInput = (value?: string | null): string | null => {
  if (!value) return null;
  // If already starts with YYYY-MM-DD, take that part (works for ISO datetimes too)
  const m = value.match(/^(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];
  // Fallback: parse and convert to local YMD
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : toYMD(d);
};

const fmtDate = (value?: string | null) => {
  const ymd = ymdFromInput(value);
  if (!ymd) return value || "N/A";
  const [yyyy, mm, dd] = ymd.split("-");
  return `${mm}/${dd}/${String(yyyy).slice(-2)}`;
};

const fmtDateTime = (value?: string | null) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = String(d.getFullYear());
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${mm}/${dd}/${yyyy} ${hh}:${min}`;
};

/** Inclusive-end helper for backend params (add +1 day if API is exclusive) */
const addDaysISO = (yyyyMmDd?: string | null, days = 1): string | undefined => {
  if (!yyyyMmDd) return undefined;
  const parts = yyyyMmDd.split("-");
  if (parts.length !== 3) return yyyyMmDd;
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  d.setDate(d.getDate() + days);
  return toYMD(d);
};

/** ---------- Component ---------- */
export default function VisitorStatisticsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  // Existing aggregate for cards/table
  const [data, setData] = useState<BaseRow[]>([]);
  const [summary, setSummary] = useState<Summary>({});

  // 3-table merge sources
  const [tickets, setTickets] = useState<TicketEntity[]>([]);
  const [customers, setCustomers] = useState<CustomerEntity[]>([]);
  const [giftTxns, setGiftTxns] = useState<GiftShopTxn[]>([]);

  // date filter (YYYY-MM-DD)
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // report UI
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // All selected by default so Preview is never blank
  const [cols, setCols] = useState<Record<string, boolean>>({
    VisitDate: true,
    PurchaseDate: true,
    TicketType: true,
    PaymentMethod: true,
    TicketPrice: true,
    CustomerName: true,
    CustomerEmail: true,
    AnnualPass: true,
    GiftShopSalesTotal: true,     // from gift_shop_sales_transactions
    TotalPerCustomerDay: true     // TicketPrice + GiftShopSalesTotal
  });

  const selectAllCols = () => {
    const allTrue: Record<string, boolean> = {};
    Object.keys(cols).forEach((k) => (allTrue[k] = true));
    setCols(allTrue);
  };
  const resetCols = () => {
    const allFalse: Record<string, boolean> = {};
    Object.keys(cols).forEach((k) => (allFalse[k] = false));
    setCols(allFalse);
  };

  useEffect(() => {
    if (isAuthenticated) void loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const loadAll = async () => {
    // for backends that use < end_date (exclusive), send end + 1 day
    const endParamExclusive = addDaysISO(endDate, 1);

    // 1) existing aggregate for the summary cards/table
    const result = await queryService.getVisitorStatistics(startDate || undefined, endParamExclusive);
    setData(safeArr(result?.data) as BaseRow[]);
    setSummary((result?.summary || {}) as Summary);

    // 2) tickets
    try {
      const tkRes = await apiClient.get<any>("/tickets", {
        params:
          startDate || endDate
            ? { start_date: startDate || undefined, end_date: endParamExclusive }
            : undefined,
      });
      const tk = safeArr(tkRes?.data).map((t: any) => ({
        ticket_id: Number(t.ticket_id ?? t.id),
        customer_id: t.customer_id == null ? null : Number(t.customer_id),
        purchase_date: t.purchase_date ?? null,
        visit_date: t.visit_date ?? null,
        ticket_type: t.ticket_type,
        price: t.price,
        payment_method: t.payment_method ?? null,
      })) as TicketEntity[];
      setTickets(tk);
    } catch {
      setTickets([]);
    }

    // 3) customers
    try {
      const custRes = await apiClient.get<any>("/customers");
      const cust = safeArr(custRes?.data).map((c: any) => ({
        customer_id: Number(c.customer_id ?? c.id),
        first_name: c.first_name,
        last_name: c.last_name,
        email: c.email ?? null,
        annual_pass: c.annual_pass ?? "no",
        registration_date: c.registration_date ?? null,
      })) as CustomerEntity[];
      setCustomers(cust);
    } catch {
      setCustomers([]);
    }

    // 4) gift shop sales transactions
    try {
      let txns: GiftShopTxn[] = [];
      try {
        const r1 = await apiClient.get<any>("/gift_shop_sales_transactions", {
          params:
            startDate || endDate
              ? { start_date: startDate || undefined, end_date: endParamExclusive }
              : undefined,
        });
        txns = safeArr(r1?.data).map((x: any) => ({
          transaction_id: Number(x.transaction_id ?? x.id),
          customer_id: x.customer_id == null ? null : Number(x.customer_id),
          sale_date: x.sale_date,
          total_amount: x.total_amount,
        }));
      } catch {}
      if (!txns.length) {
        const r2 = await apiClient.get<any>("/gift-shop-sales-transactions", {
          params:
            startDate || endDate
              ? { start_date: startDate || undefined, end_date: endParamExclusive }
              : undefined,
        });
        txns = safeArr(r2?.data).map((x: any) => ({
          transaction_id: Number(x.transaction_id ?? x.id),
          customer_id: x.customer_id == null ? null : Number(x.customer_id),
          sale_date: x.sale_date,
          total_amount: x.total_amount,
        }));
      }
      setGiftTxns(txns);
    } catch {
      setGiftTxns([]);
    }
  };

  const handleFilter = () => void loadAll();
  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    void loadAll();
  };

  /** -------- helpers -------- */
  const getTicketTypeBadge = (type?: string | null) => {
    const t = (type || "").toLowerCase();
    const variants: Record<string, any> = {
      adult: "default",
      child: "secondary",
      senior: "warning",
      student: "success",
    };
    return variants[t] || "default";
  };

  /** -------- indexes & precomputed maps -------- */
  const customersById = useMemo(() => {
    const m = new Map<number, CustomerEntity>();
    for (const c of customers) m.set(c.customer_id, c);
    return m;
  }, [customers]);

  // Gift shop total by (customer_id, YMD(sale_date)) — avoid timezone issues by using YMD strings
  const giftTotalByCustomerDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of giftTxns) {
      if (s.customer_id == null) continue;
      const dayStr = ymdFromInput(s.sale_date);
      if (!dayStr) continue;
      const k = `${s.customer_id}|${dayStr}`;
      const prev = map.get(k) ?? 0;
      map.set(k, prev + moneyNum(s.total_amount));
    }
    return map;
  }, [giftTxns]);

  /** INCLUSIVE filter for tickets using YMD string comparison (no timezone drift) */
  const filteredTickets = useMemo(() => {
    if (!startDate && !endDate) return tickets;

    const s = startDate || null;
    const e = endDate || null;

    return tickets.filter((t) => {
      // choose visit_date if present, else purchase_date
      const ymd = ymdFromInput(t.visit_date || t.purchase_date);
      if (!ymd) return false;
      if (s && ymd < s) return false; // must be >= start
      if (e && ymd > e) return false; // must be <= end
      return true;
    });
  }, [tickets, startDate, endDate]);

  /** INCLUSIVE filter for the main aggregate table (also YMD string compare) */
  const filteredData = useMemo(() => {
    if (!startDate && !endDate) return data;

    const s = startDate || null;
    const e = endDate || null;

    return data.filter((row) => {
      const ymd = ymdFromInput(row.visit_date);
      if (!ymd) return false;
      if (s && ymd < s) return false; // >= start
      if (e && ymd > e) return false; // <= end
      return true;
    });
  }, [data, startDate, endDate]);

  /** -------- report rows (Tickets + Customers + Gift Shop Txns) -------- */
  const reportRows = useMemo(() => {
    const out: Array<Record<string, any>> = [];

    if (filteredTickets.length) {
      for (const t of filteredTickets) {
        const cust = t.customer_id != null ? customersById.get(t.customer_id) : undefined;

        // same-customer same-day gift shop total
        let giftTotal = 0;
        const visitYMD = ymdFromInput(t.visit_date || t.purchase_date);
        if (t.customer_id != null && visitYMD) {
          const k = `${t.customer_id}|${visitYMD}`;
          giftTotal = giftTotalByCustomerDay.get(k) ?? 0;
        }

        const ticketPrice = moneyNum(t.price);
        const totalPerCustomerDay = ticketPrice + giftTotal;

        out.push({
          VisitDate: fmtDate(t.visit_date),
          PurchaseDate: fmtDateTime(t.purchase_date),
          TicketType: t.ticket_type,
          PaymentMethod: t.payment_method ?? "",
          TicketPrice: currency(ticketPrice),
          CustomerName: cust ? `${cust.first_name} ${cust.last_name}` : "",
          CustomerEmail: cust?.email ?? "",
          AnnualPass: cust?.annual_pass ?? "",
          GiftShopSalesTotal: currency(giftTotal),
          TotalPerCustomerDay: currency(totalPerCustomerDay),
        });
      }
      return out;
    }

    // Fallback from aggregate if no tickets returned
    for (const r of filteredData) {
      out.push({
        VisitDate: fmtDate(r.visit_date),
        PurchaseDate: "",
        TicketType: r.ticket_type ?? "",
        PaymentMethod: r.payment_method ?? "",
        TicketPrice: currency(r.avg_price),
        CustomerName: "",
        CustomerEmail: "",
        AnnualPass: "",
        GiftShopSalesTotal: currency(0),
        TotalPerCustomerDay: currency(moneyNum(r.avg_price)),
      });
    }
    return out;
  }, [filteredTickets, customersById, giftTotalByCustomerDay, filteredData]);

  const selectedHeaders = useMemo(
    () => Object.keys(cols).filter((k) => cols[k]),
    [cols]
  );

  const downloadCSV = () => {
    if (!reportRows.length || !selectedHeaders.length) return;
    const escape = (val: any) => {
      const s = String(val ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [
      selectedHeaders.join(","),
      ...reportRows.map((row) =>
        selectedHeaders.map((h) => escape(row[h])).join(",")
      ),
    ];
    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "visitor_statistics_report.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  /** ---------- Render ---------- */
  if (authLoading) {
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
            <UserCircle className="h-8 w-8 text-sea_green-600" />
            Visitor Statistics
          </h1>
          <p className="text-gray-600 mt-1">Analyze ticket sales and visitor trends</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Preview Report
          </Button>
          <Button onClick={downloadCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download CSV
          </Button>
        </div>
      </div>

      {/* ===== Date Range ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Date Range</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col">
            <label htmlFor="startDate" className="text-sm mb-1">Start date</label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
              placeholder="mm/dd/yyyy"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="endDate" className="text-sm mb-1">End date</label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
              placeholder="mm/dd/yyyy"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleFilter}>Apply</Button>
            <Button variant="outline" onClick={handleClearFilter}>Clear</Button>
          </div>
          {(startDate || endDate) && (
            <div className="text-sm text-gray-600">
              Active range: {startDate || "—"} to {endDate || "—"}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ===== Report Options ===== */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-lg">Report Options</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetCols}>Reset Columns</Button>
            <Button variant="outline" size="sm" onClick={selectAllCols}>Select All</Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-10">
            {/* Ticket */}
            <div>
              <p className="text-sm font-medium mb-1">Ticket</p>
              {["VisitDate", "PurchaseDate", "TicketType", "PaymentMethod", "TicketPrice"].map((key) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!cols[key]}
                    onChange={() => setCols((c) => ({ ...c, [key]: !c[key] }))}
                  />
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
              ))}
            </div>

            {/* Customer */}
            <div>
              <p className="text-sm font-medium mb-1">Customer</p>
              {["CustomerName", "CustomerEmail", "AnnualPass"].map((key) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!cols[key]}
                    onChange={() => setCols((c) => ({ ...c, [key]: !c[key] }))}
                  />
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
              ))}
            </div>

            {/* Gift Shop (3rd table) */}
            <div>
              <p className="text-sm font-medium mb-1">Gift Shop</p>
              {["GiftShopSalesTotal", "TotalPerCustomerDay"].map((key) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!cols[key]}
                    onChange={() => setCols((c) => ({ ...c, [key]: !c[key] }))}
                  />
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===== KPI SUMMARY CARDS ===== */}
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
              {summary.total_tickets ?? 0}
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
              {currency(summary.total_revenue)}
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
              {currency(summary.avg_ticket_price)}
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
              {summary.unique_customers ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ===== Main table (uses inclusive filteredData via YMD compare) ===== */}
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
            {filteredData.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{fmtDate(item.visit_date)}</TableCell>
                <TableCell>
                  <Badge variant={getTicketTypeBadge(item.ticket_type)} className="capitalize">
                    {item.ticket_type || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {item.payment_method || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell>{item.ticket_count ?? 0}</TableCell>
                <TableCell className="font-semibold text-persian_orange-600">
                  {currency(item.total_revenue)}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {currency(item.avg_price)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <UserCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No visitor statistics found</p>
          </div>
        )}
      </div>

      {/* Modal preview */}
      <Modal
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Report Preview"
        description="Merged report (Tickets + Customers + Gift Shop Sales)"
        size="xl"
      >
        {selectedHeaders.length === 0 ? (
          <p className="text-gray-600">
            Select at least one column in Report Options to see the preview.
          </p>
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
