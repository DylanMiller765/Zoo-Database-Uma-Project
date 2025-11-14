"use client";

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import { transactionService } from '@/services/transaction.service';
import { UnifiedTransaction } from '@/types/transaction.types';
import { Button } from '@/components/ui/button';
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
import { Plus, Search, DollarSign } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { TransactionForm } from '@/components/admin/TransactionForm';

export default function TransactionsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState<UnifiedTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialTransactionType, setInitialTransactionType] = useState<string | null>(null);
  const hasOpenedModal = useRef(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (hasOpenedModal.current) return;
    if (searchParams.get('autoOpen') === 'true') {
      const type = searchParams.get('type');
      if (type) {
        setInitialTransactionType(type);
      }
      handleAdd();
      hasOpenedModal.current = true;
    }
  }, [searchParams]);

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

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleFormSuccess = async () => {
    setIsModalOpen(false);
    await loadTransactions();
  };

  const filteredTransactions = transactions
    .filter(t => {
      const matchesSearch = t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.employeeName && t.employeeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
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
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by customer, employee, or ID..."
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
              <TableHead>Employee</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.id}</TableCell>
                <TableCell>
                  <Badge>{t.type}</Badge>
                </TableCell>
                <TableCell>{formatDate(t.date)}</TableCell>
                <TableCell>{t.customerName}</TableCell>
                <TableCell>{t.employeeName || 'N/A'}</TableCell>
                <TableCell>${t.total.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  {/* Actions buttons here */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Transaction"
        description="Manually add a new sale or donation"
        size="lg"
      >
        <TransactionForm
          initialType={initialTransactionType}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
