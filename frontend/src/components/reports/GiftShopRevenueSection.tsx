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
import { ShoppingBag } from "lucide-react";

interface GiftShopRevenueData {
  total: number;
  transactions: number;
  returns: number;
  byShop: Array<{
    gift_shop_id: number;
    shop_name: string;
    location: string | null;
    transactions: number;
    revenue: number;
    avg_transaction: number;
    returns: number;
  }>;
  byItem?: Array<{
    item_id: number;
    item_name: string;
    category: string | null;
    unit_price: number;
    total_quantity: number;
    total_revenue: number;
  }>;
}

interface Props {
  data: GiftShopRevenueData;
}

export function GiftShopRevenueSection({ data }: Props) {
  const formatMoney = (amount: number | string) => {
    const num = parseFloat(String(amount || 0));
    return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <Card className="border-l-4 border-pink-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-pink-600" />
            <CardTitle className="text-xl">Gift Shop Revenue</CardTitle>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-pink-600">
              ${formatMoney(data.total)}
            </div>
            <div className="text-sm text-gray-600">
              {data.transactions} transactions
              {data.returns > 0 && ` (${data.returns} returns)`}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Revenue by Gift Shop */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Revenue by Gift Shop
          </h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shop Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Transactions</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Avg Transaction</TableHead>
                  {data.returns > 0 && <TableHead className="text-right">Returns</TableHead>}
                  <TableHead className="text-right">% of Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.byShop.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No gift shop revenue data available for the selected period
                    </TableCell>
                  </TableRow>
                ) : (
                  data.byShop.map((row) => (
                    <TableRow key={row.gift_shop_id}>
                      <TableCell className="font-medium">{row.shop_name}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {row.location || 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">{row.transactions}</TableCell>
                      <TableCell className="text-right font-semibold text-pink-600">
                        ${formatMoney(row.revenue)}
                      </TableCell>
                      <TableCell className="text-right">
                        ${formatMoney(row.avg_transaction)}
                      </TableCell>
                      {data.returns > 0 && (
                        <TableCell className="text-right text-red-600">
                          {row.returns}
                        </TableCell>
                      )}
                      <TableCell className="text-right">
                        <Badge className="bg-pink-100 text-pink-800">
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

        {/* Items Sold Section */}
        {data.byItem && data.byItem.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Items Sold
            </h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Quantity Sold</TableHead>
                    <TableHead className="text-right">Total Revenue</TableHead>
                    <TableHead className="text-right">% of Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.byItem.map((item) => (
                    <TableRow key={item.item_id}>
                      <TableCell className="font-medium">{item.item_name}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {item.category || 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        ${formatMoney(item.unit_price)}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.total_quantity}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-pink-600">
                        ${formatMoney(item.total_revenue)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-pink-100 text-pink-800">
                          {((parseFloat(String(item.total_revenue)) / data.total) * 100).toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
