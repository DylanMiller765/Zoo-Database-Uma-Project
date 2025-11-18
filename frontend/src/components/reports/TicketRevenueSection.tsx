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
import { Ticket } from "lucide-react";

interface TicketRevenueData {
  total: number;
  transactions: number;
  byType: Array<{
    ticket_type: string;
    count: number;
    revenue: number;
    unit_price: number;
  }>;
}

interface Props {
  data: TicketRevenueData;
}

export function TicketRevenueSection({ data }: Props) {
  const formatMoney = (amount: number | string) => {
    const num = parseFloat(String(amount || 0));
    return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatTicketType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Calculate totals for verification
  const typeTotal = data.byType.reduce((sum, row) => sum + parseFloat(String(row.revenue || 0)), 0);

  return (
    <Card className="border-l-6 border-blue-300 bg-blue-50/30">
      <CardHeader className="pb-4 pl-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Ticket className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle className="text-xl text-gray-900">Ticket Revenue</CardTitle>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-700">
              ${formatMoney(data.total)}
            </div>
            <div className="text-sm text-gray-600">
              {data.transactions} tickets sold
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pl-6 pr-6">
        {/* Revenue by Ticket Type */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 pl-2">
            Revenue by Ticket Type
          </h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket Type</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total Revenue</TableHead>
                  <TableHead className="text-right">% of Ticket Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.byType.map((row) => (
                  <TableRow key={row.ticket_type}>
                    <TableCell className="font-medium">
                      {formatTicketType(row.ticket_type)}
                    </TableCell>
                    <TableCell className="text-right">{row.count}</TableCell>
                    <TableCell className="text-right text-gray-600">
                      ${formatMoney(row.unit_price)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-blue-700">
                      ${formatMoney(row.revenue)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-blue-100 text-blue-800">
                        {((parseFloat(String(row.revenue)) / data.total) * 100).toFixed(1)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-blue-50 font-semibold border-t-2">
                  <TableCell>Subtotal</TableCell>
                  <TableCell className="text-right">{data.transactions}</TableCell>
                  <TableCell className="text-right">—</TableCell>
                  <TableCell className="text-right text-blue-700">
                    ${formatMoney(typeTotal)}
                  </TableCell>
                  <TableCell className="text-right">100%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
