import apiClient from '@/lib/api';
import { Animal, CreateAnimalData, ApiResponse } from '@/types';

export const animalService = {
  async getAll(include_deleted: boolean = false): Promise<Animal[]> {
    const params = new URLSearchParams();
    if (include_deleted) {
      params.append('include_deleted', 'true');
    }
    const response = await apiClient.get<Animal[]>('/animals', { params });
    return response.data;
  },

  async getById(id: number, include_deleted: boolean = false): Promise<Animal> {
    const params = new URLSearchParams();
    if (include_deleted) {
      params.append('include_deleted', 'true');
    }
    const response = await apiClient.get<Animal>(`/animals/${id}`, { params });
    return response.data;
  },

  async create(data: CreateAnimalData): Promise<Animal> {
    const response = await apiClient.post<Animal>('/animals', data);
    return response.data;
  },

  async update(id: number, data: Partial<Animal>): Promise<Animal> {
    const response = await apiClient.put<Animal>(`/animals/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/animals/${id}`);
  },
};
