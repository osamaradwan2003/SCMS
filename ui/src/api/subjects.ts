import { httpClient } from './httpClient';
import type { AxiosResponse } from 'axios';

// Types
export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  credits: number;
  classId: string;
  class?: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateSubjectData {
  name: string;
  code: string;
  description?: string;
  credits: number;
  classId: string;
}

export interface UpdateSubjectData {
  name: string;
  code: string;
  description?: string;
  credits: number;
  classId: string;
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
export const subjectsApi = {
  // Get all subjects with pagination
  getAll: (params?: SearchParams): Promise<AxiosResponse<PaginatedResponse<Subject>>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.q) searchParams.append('q', params.q);
    
    return httpClient.get(`/subjects/paginate?${searchParams}`);
  },

  // Search subjects
  search: (params: SearchParams): Promise<AxiosResponse<PaginatedResponse<Subject>>> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.q) searchParams.append('q', params.q);
    
    return httpClient.get(`/subjects/search?${searchParams}`);
  },

  // Get subject by ID
  getById: (id: string): Promise<AxiosResponse<Subject>> => {
    return httpClient.get(`/subjects/${id}`);
  },

  // Create new subject
  create: (data: CreateSubjectData): Promise<AxiosResponse<Subject>> => {
    return httpClient.post('/subjects', data);
  },

  // Update subject
  update: (id: string, data: UpdateSubjectData): Promise<AxiosResponse<Subject>> => {
    return httpClient.put(`/subjects/${id}`, data);
  },

  // Delete subject
  delete: (id: string): Promise<AxiosResponse<void>> => {
    return httpClient.delete(`/subjects/${id}`);
  },

  // Bulk delete subjects
  bulkDelete: (ids: string[]): Promise<AxiosResponse<void>> => {
    return httpClient.delete('/subjects/bulk', { data: { ids } });
  },
};
