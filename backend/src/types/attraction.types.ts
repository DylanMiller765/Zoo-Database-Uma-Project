export interface Attraction {
  attraction_id: number;
  name: string;
  location: string;
  human_capacity: number;
  opening_time: string;
  closing_time: string;
  status: 'open' | 'closed' | 'maintenance';
}
