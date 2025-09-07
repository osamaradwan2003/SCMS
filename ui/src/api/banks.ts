import { httpClient } from './httpClient';
import type { AxiosResponse } from 'axios';

// Types
export interface Bank {
  id: string;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  swiftCode?: string;
  routingNumber?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface CreateBankData {
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  swiftCode?: string;
  routingNumber?: string;
  status: 'active' | 'inactive';
}

export interface UpdateBankData {
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  swiftCode?: string;
  routingNumber?: string;
  status: 'active' | 'inactive';
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
  status?: string;
}

// API Functions
export const banksApi = {
  // Get all banks with pagination
  getAll: (params?: SearchParams): Promise<AxiosResponse<PaginatedResponse<Bank>>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.q) searchParams.append('q', params.q);
    if (params?.status) searchParams.append('status', params.status);
    
    return httpClient.get(`/banks/paginate?${searchParams}`);
  },

  // Get simple list for dropdowns
  getList: (): Promise<AxiosResponse<{ id: string; name: string; code: string }[]>> => {
    return httpClient.get('/banks');
  },

  // Search banks
  search: (params: SearchParams): Promise<AxiosResponse<PaginatedResponse<Bank>>> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.q) searchParams.append('q', params.q);
    if (params.status) searchParams.append('status', params.status);
    
    return httpClient.get(`/banks/search?${searchParams}`);
  },

  // Get bank by ID
  getById: (id: string): Promise<AxiosResponse<Bank>> => {
    return httpClient.get(`/banks/${id}`);
  },

  // Create new bank
  create: (data: CreateBankData): Promise<AxiosResponse<Bank>> => {
    return httpClient.post('/banks', data);
  },

  // Update bank
  update: (id: string, data: UpdateBankData): Promise<AxiosResponse<Bank>> => {
    return httpClient.put(`/banks/${id}`, data);
  },

  // Delete bank
  delete: (id: string): Promise<AxiosResponse<void>> => {
    return httpClient.delete(`/banks/${id}`);
  },

  // Bulk delete banks
  bulkDelete: (ids: string[]): Promise<AxiosResponse<void>> => {
    return httpClient.delete('/banks/bulk', { data: { ids } });
  },

  // Update bank status
  updateStatus: (id: string, status: 'active' | 'inactive'): Promise<AxiosResponse<Bank>> => {
    return httpClient.patch(`/banks/${id}/status`, { status });
  },
};
