import apiClient from '@/lib/api';
import { Ticket, CreateTicketData } from '@/types';

export const ticketService = {
  async getAll(): Promise<Ticket[]> {
    const response = await apiClient.get<Ticket[]>('/tickets');
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

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/tickets/${id}`);
  },
};
