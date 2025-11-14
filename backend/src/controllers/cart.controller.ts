import { Request, Response } from 'express';
import { CartService } from '../services/cart.service';
import { AddToCartRequest, UpdateCartItemRequest } from '../types/cart.types';

export class CartController {
  /**
   * Get customer's cart
   * GET /api/cart
   */
  static async getCart(req: Request, res: Response) {
    try {
      const customerId = (req as any).user.customer_id;

      if (!customerId) {
        return res.status(403).json({
          success: false,
          message: 'Only customers can access cart',
        });
      }

      const cart = await CartService.getCart(customerId);

      res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error: any) {
      console.error('Error getting cart:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get cart',
      });
    }
  }

  /**
   * Add item to cart
   * POST /api/cart/items
   */
  static async addItem(req: Request, res: Response) {
    try {
      const customerId = (req as any).user.customer_id;

      if (!customerId) {
        return res.status(403).json({
          success: false,
          message: 'Only customers can add items to cart',
        });
      }

      const itemData: AddToCartRequest = req.body;

      const cartItem = await CartService.addItem(customerId, itemData);

      res.status(201).json({
        success: true,
        data: cartItem,
        message: 'Item added to cart',
      });
    } catch (error: any) {
      console.error('Error adding item to cart:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to add item to cart',
      });
    }
  }

  /**
   * Update cart item
   * PUT /api/cart/items/:cart_item_id
   */
  static async updateItem(req: Request, res: Response) {
    try {
      const customerId = (req as any).user.customer_id;

      if (!customerId) {
        return res.status(403).json({
          success: false,
          message: 'Only customers can update cart items',
        });
      }

      const cartItemId = parseInt(req.params.cart_item_id);
      const updateData: UpdateCartItemRequest = req.body;

      const result = await CartService.updateItem(customerId, cartItemId, updateData);

      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error updating cart item:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update cart item',
      });
    }
  }

  /**
   * Remove item from cart
   * DELETE /api/cart/items/:cart_item_id
   */
  static async removeItem(req: Request, res: Response) {
    try {
      const customerId = (req as any).user.customer_id;

      if (!customerId) {
        return res.status(403).json({
          success: false,
          message: 'Only customers can remove cart items',
        });
      }

      const cartItemId = parseInt(req.params.cart_item_id);

      const result = await CartService.removeItem(customerId, cartItemId);

      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error removing cart item:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to remove cart item',
      });
    }
  }

  /**
   * Clear cart
   * DELETE /api/cart
   */
  static async clearCart(req: Request, res: Response) {
    try {
      const customerId = (req as any).user.customer_id;

      if (!customerId) {
        return res.status(403).json({
          success: false,
          message: 'Only customers can clear cart',
        });
      }

      const result = await CartService.clearCart(customerId);

      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to clear cart',
      });
    }
  }

  /**
   * Get cart item count
   * GET /api/cart/count
   */
  static async getItemCount(req: Request, res: Response) {
    try {
      const customerId = (req as any).user.customer_id;

      if (!customerId) {
        return res.status(200).json({
          success: true,
          count: 0,
        });
      }

      const count = await CartService.getItemCount(customerId);

      res.status(200).json({
        success: true,
        count,
      });
    } catch (error: any) {
      console.error('Error getting cart count:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get cart count',
      });
    }
  }
}
