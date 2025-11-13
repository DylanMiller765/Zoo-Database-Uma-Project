import apiClient from '@/lib/api';
import { FeedingLogWithKeeper, CreateFeedingLogData, UpdateFeedingLogData, FeedingLogFilters } from '@/types';

export const feedingLogService = {
  async getAll(filters?: FeedingLogFilters): Promise<FeedingLogWithKeeper[]> {
    const response = await apiClient.get<FeedingLogWithKeeper[]>('/feeding-logs', {
      params: filters
    });
    return response.data;
  },

  async getByAnimalId(animalId: number, limit?: number): Promise<FeedingLogWithKeeper[]> {
    const response = await apiClient.get<FeedingLogWithKeeper[]>(`/feeding-logs/animal/${animalId}`, {
      params: limit ? { limit } : {}
    });
    return response.data;
  },

  async getById(id: number): Promise<FeedingLogWithKeeper> {
    const response = await apiClient.get<FeedingLogWithKeeper>(`/feeding-logs/${id}`);
    return response.data;
  },

  async create(data: CreateFeedingLogData): Promise<FeedingLogWithKeeper> {
    const response = await apiClient.post<FeedingLogWithKeeper>('/feeding-logs', data);
    return response.data;
  },

  async update(id: number, data: UpdateFeedingLogData): Promise<FeedingLogWithKeeper> {
    const response = await apiClient.put<FeedingLogWithKeeper>(`/feeding-logs/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/feeding-logs/${id}`);
  },
};
