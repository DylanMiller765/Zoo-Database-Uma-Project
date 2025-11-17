export interface UnifiedTransaction {
  id: string;
  type: 'Ticket' | 'Event' | 'Gift Shop' | 'Cafe' | 'Donation';
  date: string;
  total: number;
  customerName: string;
  employeeName?: string;
  refunded_at?: string | null;
  refund_reason?: string | null;
  details: {
    [key: string]: any;
  };
}
