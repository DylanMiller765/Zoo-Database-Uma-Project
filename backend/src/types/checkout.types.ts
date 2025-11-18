// Simplified checkout types - processes client-side cart items

export interface CheckoutCartItem {
  item_type: 'ticket' | 'event' | 'cafe_item' | 'gift_shop_item' | 'donation' | 'membership';
  item_id?: number;
  name: string;
  quantity: number;
  unit_price: number;
  metadata?: {
    visit_date?: string;
    ticket_type?: 'adult' | 'child' | 'senior';
    event_id?: number;
    participants?: number;
    cafe_id?: number;
    gift_shop_id?: number;
    donation_message?: string;
    membership_type?: 'individual';
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    auto_renew?: boolean;
  };
}

export interface CheckoutRequest {
  items: CheckoutCartItem[];
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
    memberships: number;
  };
  total_amount: number;
  message: string;
}
