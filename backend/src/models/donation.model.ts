import { query } from '../config/database';
import { Donation } from '../types/donation.types';

export class DonationModel {
  /**
   * Create a donation
   */
  static async create(donation: Omit<Donation, 'donation_id' | 'donation_date'>): Promise<number> {
    const result = await query<any>(
      `INSERT INTO donations (customer_id, amount, message, payment_method)
       VALUES (?, ?, ?, ?)`,
      [
        donation.customer_id,
        donation.amount,
        donation.message,
        donation.payment_method,
      ]
    );

    return result.insertId;
  }

  /**
   * Get donation by ID
   */
  static async findById(donationId: number): Promise<Donation | null> {
    const [donation] = await query<Donation[]>(
      'SELECT * FROM donations WHERE donation_id = ?',
      [donationId]
    );

    return donation || null;
  }

  /**
   * Get all donations for a customer
   */
  static async findByCustomerId(customerId: number): Promise<Donation[]> {
    return query<Donation[]>(
      'SELECT * FROM donations WHERE customer_id = ? ORDER BY donation_date DESC',
      [customerId]
    );
  }


  /**
   * Get total donations for a customer
   */
  static async getTotalByCustomer(customerId: number): Promise<number> {
    const [result] = await query<any[]>(
      'SELECT SUM(amount) as total FROM donations WHERE customer_id = ?',
      [customerId]
    );

    return result?.total || 0;
  }

  /**
   * Get total donations across all customers (for analytics)
   */
  static async getTotalDonations(): Promise<number> {
    const [result] = await query<any[]>(
      'SELECT SUM(amount) as total FROM donations'
    );

    return result?.total || 0;
  }
}
