import api from '@/lib/api';

export interface CreateDonationRequest {
  amount: number;
  message?: string;
}

export interface CreateDonationAdminRequest {
  customer_id: number;
  amount: number;
  message?: string;
}

export const donationService = {
  /**
   * Create standalone donation (customer)
   */
  async createDonation(donation: CreateDonationRequest): Promise<any> {
    const response = await api.post('/donations', donation);
    return response.data;
  },

  /**
   * Create donation for any customer (admin)
   */
  async createDonationAdmin(donation: CreateDonationAdminRequest): Promise<any> {
    const response = await api.post('/donations/admin', donation);
    return response.data;
  },

  /**
   * Get customer donations
   */
  async getCustomerDonations(): Promise<any[]> {
    const response = await api.get('/donations');
    return response.data.data;
  },

  /**
   * Get total donations for customer
   */
  async getCustomerTotal(): Promise<number> {
    const response = await api.get('/donations/total');
    return response.data.data.total;
  },
};
