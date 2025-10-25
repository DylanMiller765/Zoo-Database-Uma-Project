import apiClient from '@/lib/api';
import { GiftShop, CreateGiftShopData } from '@/types';

export const giftShopService = {
  async getAll(): Promise<GiftShop[]> {
    const response = await apiClient.get<GiftShop[]>('/gift-shops');
    return response.data;
  },

  async getById(id: number): Promise<GiftShop> {
    const response = await apiClient.get<GiftShop>(`/gift-shops/${id}`);
    return response.data;
  },

  async create(data: CreateGiftShopData): Promise<GiftShop> {
    const response = await apiClient.post<GiftShop>('/gift-shops', data);
    return response.data;
  },

  async update(id: number, data: Partial<GiftShop>): Promise<GiftShop> {
    const response = await apiClient.put<GiftShop>(`/gift-shops/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/gift-shops/${id}`);
  },
};
