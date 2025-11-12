import apiClient from '@/lib/api';
import { Habitat, CreateHabitatData } from '@/types';

export const habitatService = {
  async getAll(includeDeleted = false): Promise<Habitat[]> {
    const response = await apiClient.get<Habitat[]>('/habitats', {
      params: { includeDeleted: includeDeleted ? 'true' : 'false' }
    });
    return response.data;
  },

  async getById(id: number): Promise<Habitat> {
    const response = await apiClient.get<Habitat>(`/habitats/${id}`);
    return response.data;
  },

  async create(data: CreateHabitatData): Promise<Habitat> {
    const response = await apiClient.post<Habitat>('/habitats', data);
    return response.data;
  },

  async update(id: number, data: Partial<Habitat>): Promise<Habitat> {
    const response = await apiClient.put<Habitat>(`/habitats/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/habitats/${id}`);
  },

  async restore(id: number): Promise<Habitat> {
    const response = await apiClient.put<Habitat>(`/habitats/${id}/restore`);
    return response.data;
  },
};
