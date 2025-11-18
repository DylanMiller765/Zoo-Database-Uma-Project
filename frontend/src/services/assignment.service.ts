import apiClient from '@/lib/api';

export interface ZookeeperAssignmentWithDetails {
  assignment_id: number;
  keeper_id: number;
  animal_id: number;
  shift: string | null;
  keeper_name: string;
  animal_name: string;
  animal_species: string;
  animal_health_status: string | null;
  last_fed_time: string | null;
}

export interface CreateAssignmentData {
  keeper_id: number;
  animal_id: number;
  shift?: string;
}

export const assignmentService = {
  async getAll(): Promise<ZookeeperAssignmentWithDetails[]> {
    const response = await apiClient.get<ZookeeperAssignmentWithDetails[]>('/zookeeper-assignments');
    return response.data;
  },

  async create(data: CreateAssignmentData): Promise<{ message: string; assignment_id: number }> {
    const response = await apiClient.post<{ message: string; assignment_id: number }>(
      '/zookeeper-assignments',
      data
    );
    return response.data;
  },

  async delete(assignmentId: number): Promise<void> {
    await apiClient.delete(`/zookeeper-assignments/${assignmentId}`);
  },
};
