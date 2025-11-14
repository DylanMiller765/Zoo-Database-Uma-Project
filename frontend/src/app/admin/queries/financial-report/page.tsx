"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { queryService, type FinancialReportParams } from "@/services/query.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, TrendingUp, PieChart, FileDown, Calendar } from "lucide-react";
import {
  ReportParametersCard,
  DateRangePicker,
  ReportEmptyState,
  GenerateReportButton
} from "@/components/reports";

type RevenueRow = {
  transaction_date: string;
  revenue_source: string;
  category: string;
  payment_method: string;
  transaction_count: number;
  total_revenue: number;
  avg_transaction_value: number;
};

export default function FinancialReportPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  // Report state
  const [hasGenerated, setHasGenerated] = useState(false);
  const [data, setData] = useState<RevenueRow[]>([]);
  const [loading, setLoading] = useState(false);

  // Parameters
  const [params, setParams] = useState<FinancialReportParams>({
    startDate: '',
    endDate: '',
    sources: ['ticket', 'event', 'gift_shop', 'cafe'],
    grouping: 'day',
    includeReturns: false
  });

  // Summary metrics
  const summary = useMemo(() => {
    const totalRevenue = data.reduce((sum, row) => sum + parseFloat(String(row.total_revenue || 0)), 0);
    const totalTransactions = data.reduce((sum, row) => sum + (row.transaction_count || 0), 0);

    // Revenue by source
    const bySource: Record<string, number> = {};
    data.forEach(row => {
      if (!bySource[row.revenue_source]) {
        bySource[row.revenue_source] = 0;
      }
      bySource[row.revenue_source] += parseFloat(String(row.total_revenue || 0));
    });

    return {
      totalRevenue,
      totalTransactions,
      avgTransaction: totalTransactions > 0 ? totalRevenue / totalTransactions : 0,
      bySource
    };
  }, [data]);

  // Generate report handler
  const handleGenerate = async () => {
    // Validate required fields
    if (!params.startDate || !params.endDate) {
      alert("Please select both start and end dates");
      return;
    }

    if (!params.sources || params.sources.length === 0) {
      alert("Please select at least one revenue source");
      return;
    }

    try {
      setLoading(true);
      const result = await queryService.getFinancialReport(params);
      setData(result.data);
      setHasGenerated(true);
    } catch (error) {
      console.error("Failed to generate report:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Clear handler
  const handleClear = () => {
    setParams({
      startDate: '',
      endDate: '',
      sources: ['ticket', 'event', 'gift_shop', 'cafe'],
      grouping: 'day',
      includeReturns: false
    });
    setHasGenerated(false);
    setData([]);
  };

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatMoney = (amount: number | string) => {
    const num = parseFloat(String(amount || 0));
    return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getSourceBadgeColor = (source: string) => {
    if (source.includes('Ticket')) return 'bg-blue-100 text-blue-800';
    if (source.includes('Event')) return 'bg-purple-100 text-purple-800';
    if (source.includes('Gift Shop')) return 'bg-pink-100 text-pink-800';
    if (source.includes('Cafe')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'ticket': return 'Tickets';
      case 'event': return 'Events';
      case 'gift_shop': return 'Gift Shop';
      case 'cafe': return 'Cafe';
      default: return source;
    }
  };

  // Toggle source selection
  const toggleSource = (source: string) => {
    const currentSources = params.sources || [];
    if (currentSources.includes(source)) {
      setParams({ ...params, sources: currentSources.filter(s => s !== source) });
    } else {
      setParams({ ...params, sources: [...currentSources, source] });
    }
  };

  // Export functionality (placeholder)
  const handleExport = () => {
    alert("Export functionality will be implemented after xlsx dependency is resolved");
  };

  // Form validation
  const isFormValid = params.startDate && params.endDate && params.sources && params.sources.length > 0;

  // Auth check
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark_spring_green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <DollarSign className="h-8 w-8 text-sea_green-600" />
          Financial Report
        </h1>
      </div>

      {/* Parameters Form */}
      <ReportParametersCard>
        <DateRangePicker
          startDate={params.startDate}
          endDate={params.endDate}
          onRangeChange={(startDate, endDate) => setParams({ ...params, startDate, endDate })}
          label="Transaction Date Range"
          required={true}
          showQuickSelect={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Revenue Sources */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Revenue Sources <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {['ticket', 'event', 'gift_shop', 'cafe'].map((source) => (
                <button
                  key={source}
                  type="button"
                  onClick={() => toggleSource(source)}
                  className={`px-3 py-2 rounded-md border text-sm font-medium transition-colors ${
                    params.sources?.includes(source)
                      ? 'bg-sea_green-600 text-white border-sea_green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-sea_green-400'
                  }`}
                >
                  {getSourceLabel(source)}
                </button>
              ))}
            </div>
          </div>

          {/* Group By */}
          <div>
            <Label htmlFor="grouping" className="text-sm font-medium text-gray-700">
              Group Transactions By
            </Label>
            <select
              id="grouping"
              value={params.grouping}
              onChange={(e) => setParams({ ...params, grouping: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
        </div>

        {/* Include Returns Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="includeReturns"
            checked={params.includeReturns}
            onChange={(e) => setParams({ ...params, includeReturns: e.target.checked })}
            className="rounded border-gray-300 text-sea_green-600 focus:ring-sea_green-500"
          />
          <Label htmlFor="includeReturns" className="text-sm text-gray-700 cursor-pointer">
            Include returns and refunds
          </Label>
        </div>

        {/* Generate Button */}
        <GenerateReportButton
          onGenerate={handleGenerate}
          onClear={handleClear}
          loading={loading}
          disabled={!isFormValid}
          hasGenerated={hasGenerated}
        />
      </ReportParametersCard>

      {/* Empty State or Results */}
      {!hasGenerated && (
        <ReportEmptyState
          icon={<DollarSign className="h-16 w-16 text-sea_green-400" />}
          title="No Report Generated"
          description="Select a date range, choose revenue sources, and click Generate Report to view financial data."
        />
      )}

      {hasGenerated && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Revenue */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-sea_green-600">
                  ${formatMoney(summary.totalRevenue)}
                </p>
              </CardContent>
            </Card>

            {/* Total Transactions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-persian_orange-600">
                  {summary.totalTransactions.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            {/* Avg Transaction */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Avg Transaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-dark_spring_green-600">
                  ${formatMoney(summary.avgTransaction)}
                </p>
              </CardContent>
            </Card>

            {/* Revenue Sources */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <PieChart className="h-3 w-3" />
                  Active Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-600">
                  {Object.keys(summary.bySource).length}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue by Source Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(summary.bySource).map(([source, amount]) => (
              <Card key={source} className="border-l-4 border-sea_green-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-gray-600 flex items-center justify-between">
                    <span>{getSourceLabel(source)}</span>
                    <Badge className={getSourceBadgeColor(source)}>
                      {((amount / summary.totalRevenue) * 100).toFixed(1)}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-bold text-gray-900">
                    ${formatMoney(amount)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Export Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleExport}
              className="flex items-center gap-2 bg-sea_green-600 hover:bg-sea_green-700 text-white"
            >
              <FileDown className="h-4 w-4" />
              Export to Excel
            </Button>
          </div>

          {/* Transactions Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Source Type</TableHead>
                      <TableHead>Source Name</TableHead>
                      <TableHead className="text-right">Transactions</TableHead>
                      <TableHead className="text-right">Total Revenue</TableHead>
                      <TableHead className="text-right">Avg Transaction</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((row, index) => (
                      <TableRow key={index}>
                        {/* Date */}
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {formatDate(row.transaction_date)}
                          </div>
                        </TableCell>

                        {/* Source Type */}
                        <TableCell>
                          <Badge className={getSourceBadgeColor(row.revenue_source)}>
                            {row.revenue_source}
                          </Badge>
                        </TableCell>

                        {/* Source Name */}
                        <TableCell className="text-sm text-gray-600">
                          {row.category || 'N/A'}
                        </TableCell>

                        {/* Transaction Count */}
                        <TableCell className="text-right font-semibold">
                          {row.transaction_count}
                        </TableCell>

                        {/* Total Revenue */}
                        <TableCell className="text-right font-bold text-sea_green-600">
                          ${formatMoney(row.total_revenue)}
                        </TableCell>

                        {/* Average Transaction */}
                        <TableCell className="text-right text-gray-600">
                          ${formatMoney(row.avg_transaction_value)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* No Data State */}
              {data.length === 0 && (
                <div className="text-center py-12">
                  <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No transactions found matching the selected criteria.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Try adjusting your date range, revenue sources, or filters.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
