"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { transactionService } from '@/services/transaction.service';
import { UnifiedTransaction } from '@/types/transaction.types';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, DollarSign } from 'lucide-react';

export default function TransactionsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState<UnifiedTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    if (isAuthenticated) {
      loadTransactions();
    }
  }, [isAuthenticated]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions
    .filter(t => {
      const matchesSearch = t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === 'all' || t.type === typeFilter;

      // TODO: Add date filtering

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'total') {
        return b.total - a.total;
      }
      return 0;
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark_spring_green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="h-8 w-8 text-sea_green-600" />
            All Transactions
          </h1>
          <p className="text-gray-600 mt-1">View and manage all sales and donations</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by customer name or transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="w-auto">
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">All Types</option>
            <option value="Ticket">Ticket</option>
            <option value="Event">Event</option>
            <option value="Gift Shop">Gift Shop</option>
            <option value="Cafe">Cafe</option>
            <option value="Donation">Donation</option>
          </Select>
        </div>

        <div className="w-auto">
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Sort by Date</option>
            <option value="total">Sort by Total</option>
          </Select>
        </div>

        <Badge variant="outline" className="text-sm">
          {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((t) => {
              const isRefunded = !!t.refunded_at;
              return (
                <TableRow
                  key={t.id}
                  className={isRefunded ? 'bg-red-50 opacity-75' : ''}
                >
                  <TableCell className="font-medium">{t.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge>{t.type}</Badge>
                      {isRefunded && (
                        <Badge variant="danger">REFUNDED</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(t.date)}</TableCell>
                  <TableCell>{t.customerName}</TableCell>
                  <TableCell className={isRefunded ? 'line-through text-red-600' : ''}>
                    ${t.total.toFixed(2)}
                    {isRefunded && t.refund_reason && (
                      <div className="text-xs text-gray-600 mt-1 italic">
                        {t.refund_reason}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {/* Actions buttons here */}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
