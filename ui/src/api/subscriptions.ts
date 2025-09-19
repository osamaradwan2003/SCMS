import { httpClient } from './httpClient';
import type { AxiosResponse } from 'axios';

// Types
export interface Subscription {
  id: string;
  name: string;
  value: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSubscriptionData {
  name: string;
  value: number;
  notes?: string;
}

export interface UpdateSubscriptionData {
  name?: string;
  value?: number;
  notes?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SearchParams {
  page?: number;
  limit?: number;
  q?: string;
}

// API Functions
export const subscriptionsApi = {
  // Get all subscriptions with pagination
  getAll: (params?: SearchParams): Promise<AxiosResponse<PaginatedResponse<Subscription>>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.q) searchParams.append('q', params.q);
    
    return httpClient.get(`/subscriptions/paginate?${searchParams}`);
  },

  // Get simple list for dropdowns
  getList: (): Promise<AxiosResponse<{ data: Subscription[] }>> => {
    return httpClient.get('/subscriptions');
  },

  // Search subscriptions
  search: (params: SearchParams): Promise<AxiosResponse<PaginatedResponse<Subscription>>> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.q) searchParams.append('q', params.q);
    
    return httpClient.get(`/subscriptions/search?${searchParams}`);
  },

  // Get subscription by ID
  getById: (id: string): Promise<AxiosResponse<Subscription>> => {
    return httpClient.get(`/subscriptions/${id}`);
  },

  // Create new subscription
  create: (data: CreateSubscriptionData): Promise<AxiosResponse<Subscription>> => {
    return httpClient.post('/subscriptions', data);
  },

  // Update subscription
  update: (id: string, data: UpdateSubscriptionData): Promise<AxiosResponse<Subscription>> => {
    return httpClient.put(`/subscriptions/${id}`, data);
  },

  // Delete subscription
  delete: (id: string): Promise<AxiosResponse<void>> => {
    return httpClient.delete(`/subscriptions/${id}`);
  },

  // Bulk delete subscriptions
  bulkDelete: (ids: string[]): Promise<AxiosResponse<void>> => {
    return httpClient.delete('/subscriptions/bulk', { data: { ids } });
  },
};
