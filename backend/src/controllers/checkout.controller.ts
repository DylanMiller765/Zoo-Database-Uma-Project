import { Request, Response } from 'express';
import { CheckoutService } from '../services/checkout.service';
import { CheckoutRequest } from '../types/checkout.types';

export class CheckoutController {
  /**
   * Process cart checkout
   * POST /api/checkout
   */
  static async processCheckout(req: Request, res: Response) {
    try {
      const customerId = (req as any).user.customer_id;

      if (!customerId) {
        return res.status(403).json({
          success: false,
          message: 'Only customers can checkout',
        });
      }

      const checkoutData: CheckoutRequest = req.body;

      const result = await CheckoutService.processCheckout(customerId, checkoutData);

      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error processing checkout:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to process checkout',
      });
    }
  }
}
