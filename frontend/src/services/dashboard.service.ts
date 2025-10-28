import apiClient from '@/lib/api';
import { DashboardStats } from '@/types';

export interface RecentActivity {
  type: string;
  title: string;
  description: string;
  timestamp: string;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },

  async getRecentActivity(): Promise<RecentActivity[]> {
    const response = await apiClient.get<RecentActivity[]>('/dashboard/recent-activity');
    return response.data;
  },
};
