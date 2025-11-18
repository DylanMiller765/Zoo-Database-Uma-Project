// Client-side cart types (no database backing)

export type CartItemType = 'ticket' | 'event' | 'cafe_item' | 'gift_shop_item' | 'donation' | 'membership';

export interface CartItem {
  id: string; // Unique ID for client-side tracking
  item_type: CartItemType;
  item_id?: number; // DB record ID (for tickets, events, cafe items, gift shop items)
  name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  metadata?: {
    // Ticket-specific
    visit_date?: string;
    ticket_type?: 'adult' | 'child' | 'senior';

    // Event-specific
    event_id?: number;
    event_date?: string;
    participants?: number;

    // Cafe-specific
    cafe_id?: number;
    cafe_name?: string;

    // Gift shop-specific
    gift_shop_id?: number;
    gift_shop_name?: string;

    // Donation-specific
    donation_message?: string;

    // Membership-specific
    membership_type?: 'individual';
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    auto_renew?: boolean;
  };
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  total: number;
}
