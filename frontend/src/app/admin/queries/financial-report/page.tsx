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
  const { isAuthenticated, loading: authLoading, user } = useAuth();
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
    includeCanceled: true
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
      includeCanceled: true
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
    // Format YYYY-MM-DD directly without timezone conversion
    const [year, month, day] = dateString.split('-');
    return `${month}/${day}/${year}`;
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
      case 'ticket': return 'border-blue-400';
      case 'event': return 'border-purple-400';
      case 'gift_shop': return 'border-pink-400';
      case 'cafe': return 'border-orange-400';
      case 'membership': return 'border-green-400';
      case 'donation': return 'border-red-400';
      default: return 'border-gray-300';
    }
  };

  const getSourceColorValue = (source: string) => {
    switch (source) {
      case 'ticket': return '#60a5fa';
      case 'event': return '#a78bfa';
      case 'gift_shop': return '#ec4899';
      case 'cafe': return '#fb923c';
      case 'membership': return '#4ade80';
      case 'donation': return '#f87171';
      default: return '#d1d5db';
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

  // Restrict access to managers only
  if (user?.job_role !== 'manager') {
    router.push("/admin");
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

          {/* Event Settings */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Event Options
            </Label>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="includeCanceled"
                checked={params.includeCanceled}
                onChange={(e) => setParams({ ...params, includeCanceled: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="includeCanceled" className="text-sm font-medium text-gray-700 mb-0 cursor-pointer">
                Include Cancelled Events
              </Label>
            </div>
          </div>
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
          <div className="flex justify-center">
            <Card className="border border-gray-200 w-3/4">
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
                    Revenue by Source
                  </h3>
                  <div className="space-y-2">
                    {reportData.summary.sources.map((source, index) => (
                      <div
                        key={source.name}
                        className={`border-l-4 ${getSourceColor(source.name)} pl-4 p-4 rounded flex items-center justify-between border-gray-200`}
                        style={{ borderLeft: `4px solid ${getSourceColorValue(source.name)}` }}
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{getSourceLabel(source.name)}</div>
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
                    <div className="border-t-2 border-gray-300 pt-3 mt-3 p-4 rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-lg font-bold text-gray-900">TOTAL REVENUE</div>
                          <div className="text-xs text-gray-600">
                            Sum of all revenue sources above
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
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
          </div>

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
