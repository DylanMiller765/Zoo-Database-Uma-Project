import apiClient from '@/lib/api';
// Make sure Attraction and AttractionData types are defined in '@/types'
import { Attraction, AttractionData } from '@/types';

export const attractionService = {
  // Function to get all attractions
  async getAll(includeDeleted: boolean = false): Promise<Attraction[]> {
    const response = await apiClient.get<Attraction[]>(`/attractions${includeDeleted ? '?includeDeleted=true' : ''}`);
    return response.data;
  },

  // (Optional) Add other functions for CRUD operations following the same pattern:
  async getById(id: number): Promise<Attraction> {
    const response = await apiClient.get<Attraction>(`/attractions/${id}`);
    return response.data;
  },

  async create(data: AttractionData): Promise<Attraction> {
    const response = await apiClient.post<Attraction>('/attractions', data);
    return response.data;
  },

  async update(id: number, data: Partial<AttractionData>): Promise<Attraction> {
    const response = await apiClient.put<Attraction>(`/attractions/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/attractions/${id}`);
  },
}; // <-- Added closing brace