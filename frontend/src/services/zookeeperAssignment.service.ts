import apiClient from '@/lib/api';
import { ZookeeperAssignmentWithDetails } from '@/types';

export const zookeeperAssignmentService = {
  async getByKeeperId(keeperId: number): Promise<ZookeeperAssignmentWithDetails[]> {
    const response = await apiClient.get<ZookeeperAssignmentWithDetails[]>(`/zookeeper-assignments/keeper/${keeperId}`);
    return response.data;
  },

  async getAll(): Promise<ZookeeperAssignmentWithDetails[]> {
    const response = await apiClient.get<ZookeeperAssignmentWithDetails[]>('/zookeeper-assignments');
    return response.data;
  },
};
