import { Request, Response } from 'express';
import { DonationService } from '../services/donation.service';
import { CreateDonationRequest } from '../types/donation.types';

export class DonationController {
  /**
   * Create standalone donation
   * POST /api/donations
   */
  static async createDonation(req: Request, res: Response) {
    try {
      const customerId = (req as any).user.customer_id;

      if (!customerId) {
        return res.status(403).json({
          success: false,
          message: 'Only customers can make donations',
        });
      }

      const donationData: CreateDonationRequest = req.body;

      const result = await DonationService.createStandaloneDonation(customerId, donationData);

      res.status(201).json(result);
    } catch (error: any) {
      console.error('Error creating donation:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create donation',
      });
    }
  }

  /**
   * Get customer's donations
   * GET /api/donations
   */
  static async getCustomerDonations(req: Request, res: Response) {
    try {
      const customerId = (req as any).user.customer_id;

      if (!customerId) {
        return res.status(403).json({
          success: false,
          message: 'Only customers can view donations',
        });
      }

      const donations = await DonationService.getCustomerDonations(customerId);

      res.status(200).json({
        success: true,
        data: donations,
      });
    } catch (error: any) {
      console.error('Error getting donations:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get donations',
      });
    }
  }

  /**
   * Get customer's total donations
   * GET /api/donations/total
   */
  static async getCustomerTotal(req: Request, res: Response) {
    try {
      const customerId = (req as any).user.customer_id;

      if (!customerId) {
        return res.status(403).json({
          success: false,
          message: 'Only customers can view donation totals',
        });
      }

      const result = await DonationService.getCustomerTotal(customerId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('Error getting donation total:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get donation total',
      });
    }
  }
}
