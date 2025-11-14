export type OrderStatus = 'pending' | 'completed' | 'cancelled';
export type PaymentMethodType = 'credit' | 'debit' | 'online';

export interface CustomerOrder {
  order_id: number;
  customer_id: number;
  order_date: Date;
  total_amount: number;
  payment_method: PaymentMethodType;
  payment_method_id?: number;
  status: OrderStatus;
}

export interface OrderItem {
  item_type: string;
  item_id?: number;
  name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  metadata?: any;
}

export interface OrderDetails extends CustomerOrder {
  items: OrderItem[];
  customer_name?: string;
  customer_email?: string;
}

export interface CheckoutRequest {
  payment_method: PaymentMethodType;
  save_payment_method?: boolean;
  payment_data?: {
    cardNumber: string;
    cardholderName: string;
    expiryMonth: number;
    expiryYear: number;
    cvv: string;
    billingAddress: string;
    billingCity: string;
    billingState: string;
    billingZip: string;
  };
}

export interface CheckoutResponse {
  success: boolean;
  order_id: number;
  total_amount: number;
  message: string;
}
