import apiClient from '@/lib/api';
import { Event, CreateEventData } from '@/types';

export const eventService = {
  async getAll(): Promise<Event[]> {
    const response = await apiClient.get<Event[]>('/events');
    return response.data;
  },

  async getById(id: number): Promise<Event> {
    const response = await apiClient.get<Event>(`/events/${id}`);
    return response.data;
  },

  async create(data: CreateEventData): Promise<Event> {
    const response = await apiClient.post<Event>('/events', data);
    return response.data;
  },

  async update(id: number, data: Partial<Event>): Promise<Event> {
    const response = await apiClient.put<Event>(`/events/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/events/${id}`);
  },
};
