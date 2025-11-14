import { query } from '../config/database';
import { Cart, CartItem, AddToCartRequest } from '../types/cart.types';

export class CartModel {
  /**
   * Get or create a cart for a customer
   */
  static async getOrCreateCart(customerId: number): Promise<Cart> {
    // Check if cart exists
    const [existingCart] = await query<Cart[]>(
      'SELECT * FROM shopping_carts WHERE customer_id = ?',
      [customerId]
    );

    if (existingCart) {
      return existingCart;
    }

    // Create new cart
    const result = await query<any>(
      'INSERT INTO shopping_carts (customer_id) VALUES (?)',
      [customerId]
    );

    return {
      cart_id: result.insertId,
      customer_id: customerId,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  /**
   * Get cart with all items
   */
  static async getCartWithItems(customerId: number): Promise<Cart | null> {
    const cart = await this.getOrCreateCart(customerId);

    const items = await query<CartItem[]>(
      `SELECT
        ci.*,
        CASE
          WHEN ci.item_type = 'ticket' THEN CONCAT(ci.metadata->>'$.ticket_type', ' Ticket')
          WHEN ci.item_type = 'event' THEN e.name
          WHEN ci.item_type = 'cafe_item' THEN cafe_i.name
          WHEN ci.item_type = 'gift_shop_item' THEN gs_i.name
          WHEN ci.item_type = 'donation' THEN 'Conservation Donation'
        END as name,
        CASE
          WHEN ci.item_type = 'event' THEN e.description
          WHEN ci.item_type = 'cafe_item' THEN cafe_i.description
          WHEN ci.item_type = 'gift_shop_item' THEN gs_i.description
        END as description
      FROM cart_items ci
      LEFT JOIN events e ON ci.item_type = 'event' AND ci.item_id = e.event_id
      LEFT JOIN cafe_items cafe_i ON ci.item_type = 'cafe_item' AND ci.item_id = cafe_i.item_id
      LEFT JOIN gift_shop_items gs_i ON ci.item_type = 'gift_shop_item' AND ci.item_id = gs_i.item_id
      WHERE ci.cart_id = ?
      ORDER BY ci.added_at DESC`,
      [cart.cart_id]
    );

    return {
      ...cart,
      items,
    };
  }

  /**
   * Add item to cart
   */
  static async addItem(cartId: number, item: AddToCartRequest): Promise<CartItem> {
    const result = await query<any>(
      `INSERT INTO cart_items (cart_id, item_type, item_id, quantity, unit_price, metadata)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        cartId,
        item.item_type,
        item.item_id || null,
        item.quantity,
        item.unit_price,
        item.metadata ? JSON.stringify(item.metadata) : null,
      ]
    );

    const [newItem] = await query<CartItem[]>(
      'SELECT * FROM cart_items WHERE cart_item_id = ?',
      [result.insertId]
    );

    return newItem;
  }

  /**
   * Update cart item quantity
   */
  static async updateItemQuantity(cartItemId: number, quantity: number): Promise<void> {
    await query(
      'UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?',
      [quantity, cartItemId]
    );
  }

  /**
   * Remove item from cart
   */
  static async removeItem(cartItemId: number): Promise<void> {
    await query('DELETE FROM cart_items WHERE cart_item_id = ?', [cartItemId]);
  }

  /**
   * Clear all items from cart
   */
  static async clearCart(cartId: number): Promise<void> {
    await query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
  }

  /**
   * Get cart items count
   */
  static async getItemCount(cartId: number): Promise<number> {
    const [result] = await query<any[]>(
      'SELECT SUM(quantity) as total FROM cart_items WHERE cart_id = ?',
      [cartId]
    );

    return result?.total || 0;
  }

  /**
   * Verify cart item belongs to customer
   */
  static async verifyCartItemOwnership(cartItemId: number, customerId: number): Promise<boolean> {
    const [result] = await query<any[]>(
      `SELECT ci.cart_item_id
       FROM cart_items ci
       JOIN shopping_carts sc ON ci.cart_id = sc.cart_id
       WHERE ci.cart_item_id = ? AND sc.customer_id = ?`,
      [cartItemId, customerId]
    );

    return !!result;
  }
}
