import apiClient from '@/lib/api';
import { GiftShopItem, CreateGiftShopItemData } from '@/types';

export const giftShopItemService = {
  async getAll(): Promise<GiftShopItem[]> {
    const res = await apiClient.get<GiftShopItem[]>('/gift-shop-items');
    return res.data;
  },

  async getPublic(): Promise<GiftShopItem[]> {
    const res = await apiClient.get<GiftShopItem[]>('/gift-shop-items/public');
    return res.data;
    },

  async getById(id: number): Promise<GiftShopItem> {
    const res = await apiClient.get<GiftShopItem>(`/gift-shop-items/${id}`);
    return res.data;
  },

  async create(data: CreateGiftShopItemData): Promise<GiftShopItem> {
    const res = await apiClient.post<GiftShopItem>('/gift-shop-items', data);
    return res.data;
  },

  async update(id: number, data: Partial<CreateGiftShopItemData>): Promise<GiftShopItem> {
    const res = await apiClient.put<GiftShopItem>(`/gift-shop-items/${id}`, data);
    return res.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/gift-shop-items/${id}`);
  },
};