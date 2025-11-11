export interface EventRegistration {
  registration_id: number;
  event_id: number;
  customer_id: number;
  registration_date: string;
  number_of_participants: number;
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'cancelled';
  deleted_at?: string | null;
}
