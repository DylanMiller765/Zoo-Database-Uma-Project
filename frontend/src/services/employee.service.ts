import apiClient from '@/lib/api';
import { Employee, CreateEmployeeData } from '@/types';

export const employeeService = {
  async getAll(includeDeleted = false): Promise<Employee[]> {
    const response = await apiClient.get<Employee[]>('/employees', {
      params: { includeDeleted: includeDeleted ? 'true' : 'false' }
    });
    return response.data;
  },

  async getById(id: number): Promise<Employee> {
    const response = await apiClient.get<Employee>(`/employees/${id}`);
    return response.data;
  },

  async create(data: CreateEmployeeData): Promise<Employee> {
    const response = await apiClient.post<Employee>('/employees', data);
    return response.data;
  },

  async update(id: number, data: Partial<Employee>): Promise<Employee> {
    const response = await apiClient.put<Employee>(`/employees/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/employees/${id}`);
  },

  async restore(id: number): Promise<Employee> {
    const response = await apiClient.put<Employee>(`/employees/${id}/restore`);
    return response.data;
  },
};
