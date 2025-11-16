import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditCard } from "lucide-react";

interface MembershipRevenueData {
  total: number;
  memberships: number;
  manualPurchases: number;
  autoRenewals: number;
  byType: Array<{
    purchase_type: string;
    count: number;
    revenue: number;
  }>;
  byPaymentMethod: Array<{
    payment_method: string;
    count: number;
    revenue: number;
  }>;
}

interface Props {
  data: MembershipRevenueData;
}

export function MembershipRevenueSection({ data }: Props) {
  const formatMoney = (amount: number | string) => {
    const num = parseFloat(String(amount || 0));
    return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatPaymentMethod = (method: string) => {
    return method.charAt(0).toUpperCase() + method.slice(1);
  };

  return (
    <Card className="border-l-4 border-green-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-green-600" />
            <CardTitle className="text-xl">Membership Revenue</CardTitle>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              ${formatMoney(data.total)}
            </div>
            <div className="text-sm text-gray-600">
              {data.memberships} memberships sold
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Revenue by Purchase Type */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Revenue by Purchase Type
          </h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Purchase Type</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">% of Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.byType.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      No membership revenue data available for the selected period
                    </TableCell>
                  </TableRow>
                ) : (
                  data.byType.map((row) => (
                    <TableRow key={row.purchase_type}>
                      <TableCell className="font-medium">
                        {row.purchase_type}
                      </TableCell>
                      <TableCell className="text-right">{row.count}</TableCell>
                      <TableCell className="text-right font-semibold text-green-600">
                        ${formatMoney(row.revenue)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-green-100 text-green-800">
                          {((parseFloat(String(row.revenue)) / data.total) * 100).toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Revenue by Payment Method */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Revenue by Payment Method
          </h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="text-right">Memberships</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">% of Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.byPaymentMethod.map((row) => (
                  <TableRow key={row.payment_method}>
                    <TableCell className="font-medium">
                      {formatPaymentMethod(row.payment_method)}
                    </TableCell>
                    <TableCell className="text-right">{row.count}</TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      ${formatMoney(row.revenue)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-green-100 text-green-800">
                        {((parseFloat(String(row.revenue)) / data.total) * 100).toFixed(1)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
