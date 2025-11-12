import apiClient from '@/lib/api';
import { Animal, CreateAnimalData, ApiResponse } from '@/types';

export const animalService = {
  async getAll(includeDeleted = false): Promise<Animal[]> {
    const response = await apiClient.get<Animal[]>('/animals', {
      params: { includeDeleted: includeDeleted ? 'true' : 'false' }
    });
    return response.data;
  },

  async getById(id: number): Promise<Animal> {
    const response = await apiClient.get<Animal>(`/animals/${id}`);
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

  async restore(id: number): Promise<Animal> {
    const response = await apiClient.put<Animal>(`/animals/${id}/restore`);
    return response.data;
  },
};
