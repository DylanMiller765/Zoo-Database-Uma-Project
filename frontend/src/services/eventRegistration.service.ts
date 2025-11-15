import apiClient from '@/lib/api';

export interface CreateEventRegistrationRequest {
  event_id: number;
  customer_id?: number;
  number_of_participants: number;
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'cancelled';
}

export const eventRegistrationService = {
  async create(data: CreateEventRegistrationRequest): Promise<any> {
    const response = await apiClient.post('/event-registrations', data);
    return response.data;
  },

  async getById(id: number): Promise<any> {
    const response = await apiClient.get(`/event-registrations/${id}`);
    return response.data;
  },
};
