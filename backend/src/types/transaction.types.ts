export interface UnifiedTransaction {
  id: string;
  type: 'Ticket' | 'Event' | 'Gift Shop' | 'Cafe' | 'Donation';
  date: string;
  total: number;
  customerName: string;
  employeeName?: string;
  details: {
    [key: string]: any;
  };
}
