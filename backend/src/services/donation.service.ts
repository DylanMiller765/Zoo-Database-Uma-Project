import { DonationModel } from '../models/donation.model';
import { CreateDonationRequest } from '../types/donation.types';

export class DonationService {
  /**
   * Create a standalone donation (not part of an order)
   */
  static async createStandaloneDonation(customerId: number, donationData: CreateDonationRequest) {
    if (donationData.amount <= 0) {
      throw new Error('Donation amount must be greater than 0');
    }

    const donationId = await DonationModel.create({
      customer_id: customerId,
      amount: donationData.amount,
      message: donationData.message,
    });

    return {
      success: true,
      donation_id: donationId,
      message: 'Thank you for your donation!',
    };
  }

  /**
   * Get all donations for a customer
   */
  static async getCustomerDonations(customerId: number) {
    return DonationModel.findByCustomerId(customerId);
  }

  /**
   * Get total donations for a customer
   */
  static async getCustomerTotal(customerId: number) {
    const total = await DonationModel.getTotalByCustomer(customerId);
    return { total };
  }

  /**
   * Get donation by ID
   */
  static async getDonation(donationId: number) {
    const donation = await DonationModel.findById(donationId);

    if (!donation) {
      throw new Error('Donation not found');
    }

    return donation;
  }
}
