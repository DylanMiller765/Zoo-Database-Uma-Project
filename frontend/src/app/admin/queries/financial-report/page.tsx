"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { queryService, type FinancialReportParams } from "@/services/query.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DollarSign, Calendar, Database } from "lucide-react";
import {
  ReportParametersCard,
  DateRangePicker,
  ReportEmptyState,
  GenerateReportButton,
  TicketRevenueSection,
  EventRevenueSection,
  GiftShopRevenueSection,
  CafeRevenueSection,
  MembershipRevenueSection,
  DonationRevenueSection,
} from "@/components/reports";

type FinancialReportData = {
  ticketRevenue?: any;
  eventRevenue?: any;
  giftShopRevenue?: any;
  cafeRevenue?: any;
  membershipRevenue?: any;
  donationRevenue?: any;
  summary: {
    totalRevenue: number;
    totalTransactions: number;
    dateRange: { start: string | null; end: string | null; isAllTime?: boolean };
    sources: Array<{ name: string; revenue: number }>;
    largestRevenueSource?: string;
    largestRevenueAmount?: number;
  };
};

export default function FinancialReportPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  // Report state
  const [hasGenerated, setHasGenerated] = useState(false);
  const [reportData, setReportData] = useState<FinancialReportData | null>(null);
  const [loading, setLoading] = useState(false);

  // Parameters
  const [params, setParams] = useState<FinancialReportParams>({
    startDate: '',
    endDate: '',
    sources: ['ticket', 'event', 'gift_shop', 'cafe', 'membership', 'donation'],
    grouping: 'day',
    includeReturns: false
  });

  // Generate report handler
  const handleGenerate = async () => {
    // Allow empty dates for all-time report
    if (!params.sources || params.sources.length === 0) {
      alert("Please select at least one revenue source");
      return;
    }

    try {
      setLoading(true);
      const result = await queryService.getFinancialReport(params);
      setReportData(result);
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
      sources: ['ticket', 'event', 'gift_shop', 'cafe', 'membership', 'donation'],
      grouping: 'day',
      includeReturns: false
    });
    setHasGenerated(false);
    setReportData(null);
  };

  // Helper functions
  const formatMoney = (amount: number | string) => {
    const num = parseFloat(String(amount || 0));
    return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'All Time';
    return new Date(dateString).toLocaleDateString();
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'ticket': return 'Ticket Sales';
      case 'event': return 'Event Registrations';
      case 'gift_shop': return 'Gift Shop Sales';
      case 'cafe': return 'Cafe Sales';
      case 'membership': return 'Membership Purchases';
      case 'donation': return 'Donations';
      default: return source;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'ticket': return 'border-blue-200 bg-blue-50';
      case 'event': return 'border-purple-200 bg-purple-50';
      case 'gift_shop': return 'border-pink-200 bg-pink-50';
      case 'cafe': return 'border-orange-200 bg-orange-50';
      case 'membership': return 'border-green-200 bg-green-50';
      case 'donation': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
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

  // Quick select for all-time
  const setAllTime = () => {
    setParams({ ...params, startDate: '', endDate: '' });
  };

  // Form validation - sources required, dates optional
  const isFormValid = params.sources && params.sources.length > 0;

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
      <Card>
        <CardContent className="space-y-4 pt-6">
        <div>
          <DateRangePicker
            startDate={params.startDate || ''}
            endDate={params.endDate || ''}
            onRangeChange={(startDate, endDate) => setParams({ ...params, startDate, endDate })}
            label="Transaction Date Range"
            required={false}
            showQuickSelect={true}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Revenue Sources */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Revenue Sources <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {['ticket', 'event', 'gift_shop', 'cafe', 'membership', 'donation'].map((source) => (
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
                  {getSourceLabel(source).split(' ')[0]}
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
            Include returns and refunds in revenue totals
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
        </CardContent>
      </Card>

      {/* Empty State or Results */}
      {!hasGenerated && (
        <ReportEmptyState
          icon={<DollarSign className="h-16 w-16 text-sea_green-400" />}
        />
      )}

      {hasGenerated && reportData && (
        <>
          {/* SUMMARY SECTION - MOVED TO TOP */}
          <Card className="border-2 border-sea_green-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Database className="h-6 w-6 text-sea_green-600" />
                  Summary
                </CardTitle>
                <div className="text-right">
                  <div className="text-xs text-gray-500 flex items-center gap-1 justify-end">
                    <Calendar className="h-3 w-3" />
                    Report Period
                  </div>
                  <div className="text-sm font-semibold text-gray-700">
                    {reportData.summary.dateRange.isAllTime ? (
                      'All Time'
                    ) : (
                      <>
                        {formatDate(reportData.summary.dateRange.start)} - {formatDate(reportData.summary.dateRange.end)}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stacked Revenue Sources */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Revenue by Source (Aggregated from Database Tables)
                </h3>
                <div className="space-y-2">
                  {reportData.summary.sources.map((source, index) => (
                    <div
                      key={source.name}
                      className={`border-l-6 ${getSourceColor(source.name)} p-4 rounded-r-md flex items-center justify-between`}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{getSourceLabel(source.name)}</div>
                        <div className="text-xs text-gray-500">
                          Table: {source.name === 'ticket' ? 'tickets' : source.name === 'event' ? 'event_registrations' : source.name === 'gift_shop' ? 'gift_shop_sales_transactions' : source.name === 'cafe' ? 'cafe_sales' : 'membership_purchases'} | Aggregation: SUM(price/total_amount)
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          ${formatMoney(source.revenue)}
                        </div>
                        <div className="text-xs text-gray-600">
                          {((source.revenue / reportData.summary.totalRevenue) * 100).toFixed(1)}% of total
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Total Row */}
                  <div className="border-t-2 border-gray-300 pt-3 mt-3 bg-sea_green-50 p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-lg font-bold text-gray-900">TOTAL REVENUE</div>
                        <div className="text-xs text-gray-600">
                          Sum of all revenue sources above
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-sea_green-700">
                          ${formatMoney(reportData.summary.totalRevenue)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {reportData.summary.totalTransactions.toLocaleString()} transactions
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Source Sections */}
          <div className="space-y-6">
            {reportData.ticketRevenue && (
              <TicketRevenueSection data={reportData.ticketRevenue} />
            )}

            {reportData.eventRevenue && (
              <EventRevenueSection data={reportData.eventRevenue} />
            )}

            {reportData.giftShopRevenue && (
              <GiftShopRevenueSection data={reportData.giftShopRevenue} />
            )}

            {reportData.cafeRevenue && (
              <CafeRevenueSection data={reportData.cafeRevenue} />
            )}

            {reportData.membershipRevenue && (
              <MembershipRevenueSection data={reportData.membershipRevenue} />
            )}

            {reportData.donationRevenue && (
              <DonationRevenueSection data={reportData.donationRevenue} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
