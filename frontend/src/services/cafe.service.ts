import apiClient from '@/lib/api';
import { Cafe, CreateCafeData } from '@/types';

export const cafeService = {
  async getAll(includeDeleted = false): Promise<Cafe[]> {
    const response = await apiClient.get<Cafe[]>('/cafes', {
      params: { includeDeleted: includeDeleted ? 'true' : 'false' }
    });
    return response.data;
  },

  async getById(id: number): Promise<Cafe> {
    const response = await apiClient.get<Cafe>(`/cafes/${id}`);
    return response.data;
  },

  async create(data: CreateCafeData): Promise<Cafe> {
    const response = await apiClient.post<Cafe>('/cafes', data);
    return response.data;
  },

  async update(id: number, data: Partial<Cafe>): Promise<Cafe> {
    const response = await apiClient.put<Cafe>(`/cafes/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/cafes/${id}`);
  },

  async restore(id: number): Promise<Cafe> {
    const response = await apiClient.put<Cafe>(`/cafes/${id}/restore`);
    return response.data;
  },
};
