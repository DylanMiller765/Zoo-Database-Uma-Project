
export interface Event {
  event_id: number;
  name: string;
  description: string | null;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string | null;
  max_participants: number | null;
  ticket_price: number | null;
  image_url?: string;
  coordinator_id: number | null;
  created_at: string;
  deleted_at?: string | null;
}

export interface EventWithDetails extends Event {
  coordinator_name: string | null;
}

export interface EventRegistration {
  registration_id: number;
  event_id: number;
  customer_id: number | null;
  registration_date: string;
  number_of_participants: number;
  total_amount: number | null;
  payment_status: 'pending' | 'paid' | 'cancelled';
}
