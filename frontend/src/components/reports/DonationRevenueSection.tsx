import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

interface DonationRevenueData {
  total: number;
  transactions: number;
}

interface Props {
  data: DonationRevenueData;
}

export function DonationRevenueSection({ data }: Props) {
  const formatMoney = (amount: number | string) => {
    const num = parseFloat(String(amount || 0));
    return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const averageDonation = data.transactions > 0 ? data.total / data.transactions : 0;

  return (
    <Card className="border-l-6 border-red-300 bg-red-50/30">
      <CardHeader className="pb-4 pl-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-red-600" />
            <div>
              <CardTitle className="text-xl text-gray-900">Donations</CardTitle>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-red-700">
              ${formatMoney(data.total)}
            </div>
            <div className="text-sm text-gray-600">
              {data.transactions} donation{data.transactions !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pl-6 pr-6">
        {/* Donation Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-red-100">
            <div className="text-xs text-gray-600 font-medium mb-1">Total Donations</div>
            <div className="text-2xl font-bold text-red-700">
              ${formatMoney(data.total)}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-red-100">
            <div className="text-xs text-gray-600 font-medium mb-1">Average Donation</div>
            <div className="text-2xl font-bold text-red-700">
              ${formatMoney(averageDonation)}
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
