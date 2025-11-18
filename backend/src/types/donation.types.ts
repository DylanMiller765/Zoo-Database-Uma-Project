export interface Donation {
  donation_id: number;
  customer_id: number;
  amount: number;
  donation_date: Date;
  message?: string;
  payment_method?: 'cash' | 'credit' | 'debit';
}

export interface CreateDonationRequest {
  amount: number;
  message?: string;
}
