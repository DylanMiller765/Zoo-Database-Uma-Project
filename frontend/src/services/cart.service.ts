import api from '@/lib/api';

export interface CartItem {
  cart_item_id: number;
  cart_id: number;
  item_type: 'ticket' | 'event' | 'cafe_item' | 'gift_shop_item' | 'donation';
  item_id?: number;
  quantity: number;
  unit_price: number;
  metadata?: any;
  added_at: string;
  name?: string;
  description?: string;
}

export interface Cart {
  cart_id: number;
  customer_id: number;
  created_at: string;
  updated_at: string;
  items?: CartItem[];
}

export interface AddToCartRequest {
  item_type: 'ticket' | 'event' | 'cafe_item' | 'gift_shop_item' | 'donation';
  item_id?: number;
  quantity: number;
  unit_price: number;
  metadata?: {
    visit_date?: string;
    ticket_type?: string;
    event_date?: string;
    participants?: number;
    donation_message?: string;
    cafe_id?: number;
    gift_shop_id?: number;
  };
}

export const cartService = {
  /**
   * Get customer's cart with items
   */
  async getCart(): Promise<Cart> {
    const response = await api.get('/cart');
    return response.data.data;
  },

  /**
   * Get cart item count
   */
  async getItemCount(): Promise<number> {
    const response = await api.get('/cart/count');
    return response.data.count;
  },

  /**
   * Add item to cart
   */
  async addItem(item: AddToCartRequest): Promise<CartItem> {
    const response = await api.post('/cart/items', item);
    return response.data.data;
  },

  /**
   * Update cart item quantity
   */
  async updateItem(cartItemId: number, quantity: number): Promise<void> {
    await api.put(`/cart/items/${cartItemId}`, { quantity });
  },

  /**
   * Remove item from cart
   */
  async removeItem(cartItemId: number): Promise<void> {
    await api.delete(`/cart/items/${cartItemId}`);
  },

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<void> {
    await api.delete('/cart');
  },
};
