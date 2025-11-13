import apiClient from '@/lib/api';
import { FeedingSchedule, CreateFeedingScheduleData, UpdateFeedingScheduleData } from '@/types';

export const feedingScheduleService = {
  async getAll(): Promise<FeedingSchedule[]> {
    const response = await apiClient.get<FeedingSchedule[]>('/feeding-schedules');
    return response.data;
  },

  async getByAnimalId(animalId: number): Promise<FeedingSchedule[]> {
    const response = await apiClient.get<FeedingSchedule[]>(`/feeding-schedules/animal/${animalId}`);
    return response.data;
  },

  async getById(id: number): Promise<FeedingSchedule> {
    const response = await apiClient.get<FeedingSchedule>(`/feeding-schedules/${id}`);
    return response.data;
  },

  async create(data: CreateFeedingScheduleData): Promise<FeedingSchedule> {
    const response = await apiClient.post<FeedingSchedule>('/feeding-schedules', data);
    return response.data;
  },

  async update(id: number, data: UpdateFeedingScheduleData): Promise<FeedingSchedule> {
    const response = await apiClient.put<FeedingSchedule>(`/feeding-schedules/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/feeding-schedules/${id}`);
  },
};
