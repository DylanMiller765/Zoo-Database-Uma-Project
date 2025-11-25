export interface GiftShopSaleItem {
  item_id: number;
  quantity: number;
  unit_price: number;
}

export interface GiftShopSale {
  transaction_id?: number;
  gift_shop_id: number;
  customer_id?: number;
  employee_id: number;
  sale_date?: string;
  total_amount: number;
  payment_method: 'cash' | 'credit' | 'debit';
  status?: 'completed' | 'returned';
  items: GiftShopSaleItem[];
}
