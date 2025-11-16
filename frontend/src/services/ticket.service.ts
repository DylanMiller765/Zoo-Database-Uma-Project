import apiClient from '@/lib/api';
import { Ticket, CreateTicketData } from '@/types';

export const ticketService = {
  async getAll(includeDeleted = false): Promise<Ticket[]> {
    const response = await apiClient.get<Ticket[]>('/tickets', {
      params: { includeDeleted: includeDeleted ? 'true' : 'false' }
    });
    return response.data;
  },

  async getById(id: number): Promise<Ticket> {
    const response = await apiClient.get<Ticket>(`/tickets/${id}`);
    return response.data;
  },

  async create(data: CreateTicketData): Promise<Ticket> {
    const response = await apiClient.post<Ticket>('/tickets', data);
    return response.data;
  },

  // Delete and restore methods removed - transactions are final and cannot be deleted
};
