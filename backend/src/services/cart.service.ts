import { CartModel } from '../models/cart.model';
import { Cart, AddToCartRequest, UpdateCartItemRequest } from '../types/cart.types';

export class CartService {
  /**
   * Get customer's cart with all items
   */
  static async getCart(customerId: number): Promise<Cart> {
    const cart = await CartModel.getCartWithItems(customerId);

    if (!cart) {
      throw new Error('Failed to get cart');
    }

    return cart;
  }

  /**
   * Add item to cart
   */
  static async addItem(customerId: number, itemData: AddToCartRequest) {
    // Validate item data
    if (itemData.quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    if (itemData.unit_price < 0) {
      throw new Error('Price cannot be negative');
    }

    // Item type specific validations
    if (itemData.item_type !== 'donation' && !itemData.item_id) {
      throw new Error('Item ID is required for non-donation items');
    }

    if (itemData.item_type === 'donation' && itemData.unit_price <= 0) {
      throw new Error('Donation amount must be greater than 0');
    }

    // Get or create cart
    const cart = await CartModel.getOrCreateCart(customerId);

    // Add item to cart
    const cartItem = await CartModel.addItem(cart.cart_id, itemData);

    return cartItem;
  }

  /**
   * Update cart item quantity
   */
  static async updateItem(customerId: number, cartItemId: number, updateData: UpdateCartItemRequest) {
    // Verify ownership
    const isOwner = await CartModel.verifyCartItemOwnership(cartItemId, customerId);
    if (!isOwner) {
      throw new Error('Cart item not found or access denied');
    }

    if (updateData.quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    await CartModel.updateItemQuantity(cartItemId, updateData.quantity);

    return { success: true, message: 'Cart item updated' };
  }

  /**
   * Remove item from cart
   */
  static async removeItem(customerId: number, cartItemId: number) {
    // Verify ownership
    const isOwner = await CartModel.verifyCartItemOwnership(cartItemId, customerId);
    if (!isOwner) {
      throw new Error('Cart item not found or access denied');
    }

    await CartModel.removeItem(cartItemId);

    return { success: true, message: 'Item removed from cart' };
  }

  /**
   * Clear entire cart
   */
  static async clearCart(customerId: number) {
    const cart = await CartModel.getOrCreateCart(customerId);
    await CartModel.clearCart(cart.cart_id);

    return { success: true, message: 'Cart cleared' };
  }

  /**
   * Get cart item count
   */
  static async getItemCount(customerId: number): Promise<number> {
    const cart = await CartModel.getOrCreateCart(customerId);
    return CartModel.getItemCount(cart.cart_id);
  }
}
