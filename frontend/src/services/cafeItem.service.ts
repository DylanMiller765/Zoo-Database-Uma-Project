import apiClient from '@/lib/api';
import { CafeItem, CreateCafeItemData } from '@/types';

export const cafeItemService = {
  async getAll(includeDeleted: boolean = false): Promise<CafeItem[]> {
    const res = await apiClient.get<CafeItem[]>(`/cafe-items${includeDeleted ? '?includeDeleted=true' : ''}`);
    return res.data;
  },

  async getPublic(): Promise<CafeItem[]> {
    const res = await apiClient.get<CafeItem[]>('/cafe-items/public'); // Public endpoint should only return non-deleted items
    return res.data;
  },

  async getById(id: number): Promise<CafeItem> {
    const res = await apiClient.get<CafeItem>(`/cafe-items/${id}`);
    return res.data;
  },

  async getByCafe(cafeId: number): Promise<CafeItem[]> {
    const res = await apiClient.get<CafeItem[]>(`/cafe-items/cafe/${cafeId}`);
    return res.data;
  },

  async create(data: CreateCafeItemData): Promise<CafeItem> {
    const res = await apiClient.post<CafeItem>('/cafe-items', data);
    return res.data;
  },

  async update(id: number, data: Partial<CreateCafeItemData>): Promise<CafeItem> {
    const res = await apiClient.put<CafeItem>(`/cafe-items/${id}`, data);
    return res.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/cafe-items/${id}`);
  },
};