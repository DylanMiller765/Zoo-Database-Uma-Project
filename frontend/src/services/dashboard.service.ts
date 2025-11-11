import apiClient from '@/lib/api';
import { DashboardStats } from '@/types';

export interface RecentActivity {
  type: string;
  title: string;
  description: string;
  timestamp: string;
}

export interface KeeperAssignment {
  animal_id: number;
  name: string;
  species: string;
  health_status: string;
  habitat_name: string;
  shift: string;
}

export interface VeterinarianAnimal {
  animal_id: number;
  name: string;
  species: string;
  health_status: string;
  medical_notes: string;
  habitat_name: string;
  updated_date: string;
}

export interface PublicStats {
  totalSpecies: number;
  totalHabitats: number;
  annualVisitors: number;
}

export const dashboardService = {
  async getPublicStats(): Promise<PublicStats> {
    const response = await apiClient.get<PublicStats>('/dashboard/public-stats');
    return response.data;
  },

  async getStats(): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },

  async getRecentActivity(): Promise<RecentActivity[]> {
    const response = await apiClient.get<RecentActivity[]>('/dashboard/recent-activity');
    return response.data;
  },

  async getKeeperAssignments(): Promise<KeeperAssignment[]> {
    const response = await apiClient.get<KeeperAssignment[]>('/dashboard/keeper-assignments');
    return response.data;
  },

  async getVeterinarianAnimals(): Promise<VeterinarianAnimal[]> {
    const response = await apiClient.get<VeterinarianAnimal[]>('/dashboard/veterinarian-animals');
    return response.data;
  },
};
