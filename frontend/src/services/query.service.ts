import apiClient from '@/lib/api';

// Parameter types matching backend
export interface AnimalHealthCareParams {
  startDate?: string;
  endDate?: string;
  habitatStatus?: string | string[];
  healthStatus?: string | string[];
  endangerment?: string | string[];
  feedingCompliance?: string;
  includeDeleted?: boolean;
}

export interface EventPerformanceParams {
  startDate: string;
  endDate: string;
  eventStatus?: string;
  minCapacity?: number;
  includeCanceled?: boolean;
  includeDeleted?: boolean;
}

export interface FinancialReportParams {
  startDate?: string;
  endDate?: string;
  sources?: string[];
  grouping?: string;
  includeReturns?: boolean;
  includeCanceled?: boolean;
}

export const queryService = {
  /**
   * Report 1: Animal Health & Care Report
   */
  async getAnimalHealthAndCare(params: AnimalHealthCareParams = {}): Promise<any[]> {
    const searchParams = new URLSearchParams();

    if (params.startDate) searchParams.append('startDate', params.startDate);
    if (params.endDate) searchParams.append('endDate', params.endDate);

    // Handle array parameters
    if (params.habitatStatus) {
      const statuses = Array.isArray(params.habitatStatus) ? params.habitatStatus : [params.habitatStatus];
      statuses.forEach(status => searchParams.append('habitatStatus', status));
    }
    if (params.healthStatus) {
      const statuses = Array.isArray(params.healthStatus) ? params.healthStatus : [params.healthStatus];
      statuses.forEach(status => searchParams.append('healthStatus', status));
    }
    if (params.endangerment) {
      const statuses = Array.isArray(params.endangerment) ? params.endangerment : [params.endangerment];
      statuses.forEach(status => searchParams.append('endangerment', status));
    }

    if (params.feedingCompliance) searchParams.append('feedingCompliance', params.feedingCompliance);
    if (params.includeDeleted !== undefined) searchParams.append('includeDeleted', String(params.includeDeleted));

    const url = `/queries/animal-health-care${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await apiClient.get<any[]>(url);
    return response.data;
  },

  /**
   * Report 2: Event Performance Report
   */
  async getEventPerformance(params: EventPerformanceParams): Promise<any[]> {
    const searchParams = new URLSearchParams();

    searchParams.append('startDate', params.startDate);
    searchParams.append('endDate', params.endDate);
    if (params.eventStatus) searchParams.append('eventStatus', params.eventStatus);
    if (params.minCapacity !== undefined) searchParams.append('minCapacity', String(params.minCapacity));
    if (params.includeCanceled !== undefined) searchParams.append('includeCanceled', String(params.includeCanceled));
    if (params.includeDeleted !== undefined) searchParams.append('includeDeleted', String(params.includeDeleted));

    const response = await apiClient.get<any[]>(`/queries/event-performance?${searchParams.toString()}`);
    return response.data;
  },

  /**
   * Report 3: Financial Report
   */
  async getFinancialReport(params: FinancialReportParams): Promise<any> {
    const searchParams = new URLSearchParams();

    if (params.startDate) searchParams.append('startDate', params.startDate);
    if (params.endDate) searchParams.append('endDate', params.endDate);
    if (params.sources && params.sources.length > 0) {
      searchParams.append('sources', params.sources.join(','));
    }
    if (params.grouping) searchParams.append('grouping', params.grouping);
    if (params.includeReturns !== undefined) searchParams.append('includeReturns', String(params.includeReturns));
    if (params.includeCanceled !== undefined) searchParams.append('includeCanceled', String(params.includeCanceled));

    const response = await apiClient.get<any>(
      `/queries/financial-report?${searchParams.toString()}`
    );
    return response.data;
  },
};
