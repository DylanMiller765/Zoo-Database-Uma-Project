import apiClient from '@/lib/api';
import { Customer, CreateCustomerData } from '@/types';

export const customerService = {
  async getAll(includeDeleted = false): Promise<Customer[]> {
    const response = await apiClient.get<Customer[]>('/customers', {
      params: { includeDeleted: includeDeleted ? 'true' : 'false' }
    });
    return response.data;
  },

  async getById(id: number): Promise<Customer> {
    const response = await apiClient.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  async create(data: CreateCustomerData): Promise<Customer> {
    const response = await apiClient.post<Customer>('/customers', data);
    return response.data;
  },

  async update(id: number, data: Partial<Customer>): Promise<Customer> {
    const response = await apiClient.put<Customer>(`/customers/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/customers/${id}`);
  },

  async restore(id: number): Promise<Customer> {
    const response = await apiClient.put<Customer>(`/customers/${id}/restore`);
    return response.data;
  },
};
