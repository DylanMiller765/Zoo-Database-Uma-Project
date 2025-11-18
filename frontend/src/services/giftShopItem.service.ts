import apiClient from '@/lib/api';
import { GiftShopItem, CreateGiftShopItemData } from '@/types';

export const giftShopItemService = {
  async getAll(includeDeleted: boolean = false): Promise<GiftShopItem[]> {
    const res = await apiClient.get<GiftShopItem[]>(`/gift-shop-items${includeDeleted ? '?includeDeleted=true' : ''}`);
    return res.data;
  },

  async getPublic(): Promise<GiftShopItem[]> {
    const res = await apiClient.get<GiftShopItem[]>('/gift-shop-items/public'); // Public endpoint should only return non-deleted items
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

  async restore(id: number): Promise<GiftShopItem> {
    const res = await apiClient.put<GiftShopItem>(`/gift-shop-items/${id}/restore`);
    return res.data;
  },

  // Stock update for cashiers (only updates quantity_in_stock)
  async updateStock(id: number, quantity_in_stock: number): Promise<GiftShopItem> {
    const res = await apiClient.put<GiftShopItem>(`/gift-shop-items/${id}/stock`, {
      quantity_in_stock,
    });
    return res.data;
  },
};