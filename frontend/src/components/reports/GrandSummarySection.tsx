import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Award } from "lucide-react";

interface SummaryData {
  totalRevenue: number;
  totalTransactions: number;
  dateRange: {
    start: string;
    end: string;
  };
  sources: Array<{
    name: string;
    revenue: number;
  }>;
  largestRevenueSource?: string;
  largestRevenueAmount?: number;
}

interface Props {
  data: SummaryData;
}

export function GrandSummarySection({ data }: Props) {
  const formatMoney = (amount: number | string) => {
    const num = parseFloat(String(amount || 0));
    return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'ticket': return 'Ticket Sales';
      case 'event': return 'Event Registrations';
      case 'gift_shop': return 'Gift Shop Sales';
      case 'cafe': return 'Cafe Sales';
      case 'membership': return 'Membership Purchases';
      default: return source;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'ticket': return 'bg-blue-500';
      case 'event': return 'bg-purple-500';
      case 'gift_shop': return 'bg-pink-500';
      case 'cafe': return 'bg-orange-500';
      case 'membership': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'ticket': return 'bg-blue-100 text-blue-800';
      case 'event': return 'bg-purple-100 text-purple-800';
      case 'gift_shop': return 'bg-pink-100 text-pink-800';
      case 'cafe': return 'bg-orange-100 text-orange-800';
      case 'membership': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const avgTransactionValue = data.totalTransactions > 0
    ? data.totalRevenue / data.totalTransactions
    : 0;

  return (
    <Card className="border-2 border-sea_green-500">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Award className="h-6 w-6 text-sea_green-600" />
          Grand Summary & Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Revenue Source Comparison */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Revenue by Source
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.sources.map((source) => (
              <Card key={source.name} className={`border-l-4 ${getSourceColor(source.name)}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      {getSourceLabel(source.name)}
                    </span>
                    <Badge className={getSourceBadgeColor(source.name)}>
                      {((source.revenue / data.totalRevenue) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    ${formatMoney(source.revenue)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Key Insights
          </h3>
          <div className="space-y-3">
            {/* Total Revenue */}
            <div className="flex items-start gap-3 p-4 bg-sea_green-50 rounded-lg border border-sea_green-200">
              <DollarSign className="h-5 w-5 text-sea_green-600 mt-0.5" />
              <div>
                <div className="font-semibold text-gray-900">
                  Total Revenue: ${formatMoney(data.totalRevenue)}
                </div>
                <div className="text-sm text-gray-600">
                  From {data.totalTransactions.toLocaleString()} transactions across {data.sources.length} revenue source{data.sources.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* Largest Revenue Source */}
            {data.largestRevenueSource && data.largestRevenueAmount && (
              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <Award className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-900">
                    Largest Revenue Source: {getSourceLabel(data.largestRevenueSource)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Generated ${formatMoney(data.largestRevenueAmount)} ({((data.largestRevenueAmount / data.totalRevenue) * 100).toFixed(1)}% of total revenue)
                  </div>
                </div>
              </div>
            )}

            {/* Average Transaction */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-semibold text-gray-900">
                  Average Transaction Value: ${formatMoney(avgTransactionValue)}
                </div>
                <div className="text-sm text-gray-600">
                  Across all revenue sources in the selected period
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
