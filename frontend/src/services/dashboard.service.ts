import apiClient from '@/lib/api';
import { DashboardStats } from '@/types';

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },
};
