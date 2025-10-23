export interface CafeSaleItem {
  item_id: number;
  quantity: number;
  line_total: number;
}

export interface CafeSale {
  sale_id?: number;
  cafe_id: number;
  transaction_id: string;
  customer_id?: number;
  employee_id: number;
  sale_timestamp?: string;
  items: CafeSaleItem[];
}
