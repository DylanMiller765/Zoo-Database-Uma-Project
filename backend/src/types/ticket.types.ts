export interface Ticket {
  ticket_id: number;
  customer_id?: number | null;
  purchase_date: string;
  visit_date: string;
  ticket_type: 'adult' | 'child' | 'senior' | 'student';
  price: number;
  payment_method?: 'cash' | 'credit' | 'debit' | 'online';
  deleted_at?: string | null;
}
