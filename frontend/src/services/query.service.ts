import apiClient from '@/lib/api';

export const queryService = {
  async getAnimalsByHabitat(): Promise<any[]> {
    const response = await apiClient.get<any[]>('/queries/animals-by-habitat');
    return response.data;
  },

  async getEmployeeAssignments(): Promise<any[]> {
    const response = await apiClient.get<any[]>('/queries/employee-assignments');
    return response.data;
  },

  async getRevenueAnalysis(): Promise<any[]> {
    const response = await apiClient.get<any[]>('/queries/revenue-analysis');
    return response.data;
  },

  async getEventAttendance(): Promise<any[]> {
    const response = await apiClient.get<any[]>('/queries/event-attendance');
    return response.data;
  },

  async getVisitorStatistics(startDate?: string, endDate?: string): Promise<{ data: any[]; summary: any }> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiClient.get<{ data: any[]; summary: any }>(
      `/queries/visitor-statistics${params.toString() ? `?${params.toString()}` : ''}`
    );
    return response.data;
  },
};
