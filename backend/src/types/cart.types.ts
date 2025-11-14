export type CartItemType = 'ticket' | 'event' | 'cafe_item' | 'gift_shop_item' | 'donation';

export interface CartItem {
  cart_item_id: number;
  cart_id: number;
  item_type: CartItemType;
  item_id?: number;
  quantity: number;
  unit_price: number;
  metadata?: any;
  added_at: Date;
  // Populated fields (from joins)
  name?: string;
  description?: string;
}

export interface Cart {
  cart_id: number;
  customer_id: number;
  created_at: Date;
  updated_at: Date;
  items?: CartItem[];
}

export interface AddToCartRequest {
  item_type: CartItemType;
  item_id?: number;
  quantity: number;
  unit_price: number;
  metadata?: {
    visit_date?: string;
    ticket_type?: string;
    event_date?: string;
    participants?: number;
    donation_message?: string;
  };
}

export interface UpdateCartItemRequest {
  quantity: number;
}
