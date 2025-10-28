"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { queryService } from '@/services/query.service';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RevenueAnalysisPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await queryService.getRevenueAnalysis();
      setData(result);
    } catch (error) {
      console.error('Failed to load revenue analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark_spring_green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const totalRevenue = data.reduce((sum, item) => sum + (parseFloat(item.total_revenue) || 0), 0);
  const totalTransactions = data.reduce((sum, item) => sum + (parseInt(item.transaction_count) || 0), 0);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <DollarSign className="h-8 w-8 text-persian_orange-600" />
          Revenue Analysis
        </h1>
        <p className="text-gray-600 mt-1">Breakdown of revenue by source and time period</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-persian_orange-600" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-persian_orange-600">
              ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-dark_spring_green-600" />
              Total Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-dark_spring_green-600">
              {totalTransactions.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Revenue Source</TableHead>
              <TableHead>Month/Year</TableHead>
              <TableHead>Transactions</TableHead>
              <TableHead>Total Revenue</TableHead>
              <TableHead>Avg Transaction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <Badge variant={item.revenue_source === 'Tickets' ? 'default' : 'secondary'}>
                    {item.revenue_source}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {monthNames[(item.month || 1) - 1]} {item.year}
                </TableCell>
                <TableCell>{item.transaction_count}</TableCell>
                <TableCell className="font-semibold text-persian_orange-600">
                  ${parseFloat(item.total_revenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  ${parseFloat(item.avg_transaction || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {data.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No revenue data found</p>
          </div>
        )}
      </div>
    </div>
  );
}
