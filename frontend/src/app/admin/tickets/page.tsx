"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ticketService } from '@/services/ticket.service';
import { Ticket } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Trash2, Ticket as TicketIcon } from 'lucide-react';
import { Modal } from '@/components/ui/modal';

export default function TicketsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadTickets();
    }
  }, [isAuthenticated]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getAll();
      setTickets(data);
    } catch (error) {
      console.error('Failed to load tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (ticket: Ticket) => {
    setTicketToDelete(ticket);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!ticketToDelete?.ticket_id) return;

    try {
      await ticketService.delete(ticketToDelete.ticket_id);
      await loadTickets();
      setIsDeleteModalOpen(false);
      setTicketToDelete(null);
    } catch (error) {
      console.error('Failed to delete ticket:', error);
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.ticket_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.visit_date.includes(searchTerm)
  );

  const getTicketTypeBadge = (type: string): "default" | "secondary" | "success" | "warning" => {
    const variants: Record<string, typeof type> = {
      adult: 'default',
      child: 'secondary',
      senior: 'warning',
      student: 'success',
    };
    return variants[type] as any || 'default';
  };

  const getPaymentMethodBadge = (method?: string): "default" | "secondary" | "success" | "warning" => {
    const variants: Record<string, typeof method> = {
      cash: 'default',
      credit: 'success',
      debit: 'secondary',
      online: 'warning',
    };
    return variants[method || 'cash'] as any || 'default';
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark_spring_green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const totalRevenue = tickets.reduce((sum, ticket) => sum + Number(ticket.price), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <TicketIcon className="h-8 w-8 text-sea_green-600" />
            Ticket Sales
          </h1>
          <p className="text-gray-600 mt-1">View and manage ticket transactions</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold text-sea_green-600">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by ticket type or visit date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="outline" className="text-sm">
          {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Visit Date</TableHead>
              <TableHead>Purchase Date</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.ticket_id}>
                <TableCell className="font-medium">#{ticket.ticket_id}</TableCell>
                <TableCell>
                  <Badge variant={getTicketTypeBadge(ticket.ticket_type)} className="capitalize">
                    {ticket.ticket_type}
                  </Badge>
                </TableCell>
                <TableCell>{ticket.visit_date}</TableCell>
                <TableCell className="text-sm text-gray-600">
                  {new Date(ticket.purchase_date).toLocaleDateString()}
                </TableCell>
                <TableCell className="font-semibold">${Number(ticket.price).toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={getPaymentMethodBadge(ticket.payment_method)} className="capitalize">
                    {ticket.payment_method || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(ticket)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <TicketIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No tickets found</p>
          </div>
        )}
      </div>

      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Ticket"
        description="Are you sure you want to delete this ticket? This action cannot be undone."
      >
        <div className="space-y-4">
          {ticketToDelete && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-gray-900">
                <span className="font-semibold">Ticket #{ticketToDelete.ticket_id}</span> - {ticketToDelete.ticket_type} (${ticketToDelete.price})
              </p>
            </div>
          )}
          <div className="flex items-center gap-3 justify-end">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
