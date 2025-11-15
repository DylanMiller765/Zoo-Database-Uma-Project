import apiClient from '@/lib/api';

export interface CafeSaleItem {
  item_id: number;
  quantity: number;
  line_total: number;
}

export interface CreateCafeSaleRequest {
  cafe_id: number;
  customer_id?: number;
  employee_id: number;
  items: CafeSaleItem[];
}

export const cafeSaleService = {
  async create(data: CreateCafeSaleRequest): Promise<any> {
    const response = await apiClient.post('/cafe-sales', data);
    return response.data;
  },

  async getByTransactionId(transactionId: string): Promise<any> {
    const response = await apiClient.get(`/cafe-sales/${transactionId}`);
    return response.data;
  },
};
