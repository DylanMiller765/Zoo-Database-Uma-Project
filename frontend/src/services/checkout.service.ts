import api from '@/lib/api';
import { CartItem } from '@/types/cart.types';

export interface CheckoutRequest {
  items: Array<{
    item_type: string;
    item_id?: number;
    name: string;
    quantity: number;
    unit_price: number;
    metadata?: any;
  }>;
  payment_method: 'credit' | 'debit';
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
  summary: {
    tickets: number;
    events: number;
    cafe_items: number;
    gift_shop_items: number;
    donations: number;
  };
  total_amount: number;
  message: string;
}

export const checkoutService = {
  /**
   * Process checkout with cart items
   */
  async processCheckout(checkoutData: CheckoutRequest): Promise<CheckoutResponse> {
    const response = await api.post('/checkout', checkoutData);
    return response.data;
  },
};
