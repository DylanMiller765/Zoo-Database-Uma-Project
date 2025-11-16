import apiClient from '@/lib/api';

export interface GiftShopSaleItem {
  item_id: number;
  quantity: number;
  unit_price: number;
}

export interface CreateGiftShopSaleRequest {
  gift_shop_id: number;
  customer_id?: number;
  employee_id: number;
  total_amount: number;
  payment_method: 'cash' | 'credit' | 'debit';
  items: GiftShopSaleItem[];
}

export const giftShopSaleService = {
  async create(data: CreateGiftShopSaleRequest): Promise<any> {
    const response = await apiClient.post('/gift-shop-sales', data);
    return response.data;
  },

  async getById(id: number): Promise<any> {
    const response = await apiClient.get(`/gift-shop-sales/${id}`);
    return response.data;
  },
};
