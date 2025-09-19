import { httpClient } from './httpClient';
import type { AxiosResponse } from 'axios';

// Types
export interface Student {
  id: string;
  name: string;
  dob: string;
  phone?: string;
  gender?: string;
  address: string;
  image?: string;
  docs?: string;
  classId?: string;
  guardianId: string;
  guradianDegree: string;
  subscriptionsId: string;
  class?: {
    id: string;
    name: string;
  };
  Guardian?: {
    id: string;
    name: string;
  };
  Subscriptions?: {
    id: string;
    name: string;
    value: number;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateStudentData {
  name: string;
  dob: string;
  phone?: string;
  gender?: string;
  address: string;
  image?: string;
  docs?: string;
  classId?: string;
  guardianId: string;
  guradianDegree: string;
  subscriptionsId: string;
}

export interface UpdateStudentData {
  name?: string;
  dob?: string;
  phone?: string;
  gender?: string;
  address?: string;
  image?: string;
  docs?: string;
  classId?: string;
  guardianId?: string;
  guradianDegree?: string;
  subscriptionsId?: string;
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
  classId?: string;
  guardianId?: string;
  subscriptionsId?: string;
}

// API Functions
export const studentsApi = {
  // Get all students with pagination
  getAll: (params?: SearchParams): Promise<AxiosResponse<PaginatedResponse<Student>>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.q) searchParams.append('q', params.q);
    if (params?.classId) searchParams.append('classId', params.classId);
    if (params?.guardianId) searchParams.append('guardianId', params.guardianId);
    if (params?.subscriptionsId) searchParams.append('subscriptionsId', params.subscriptionsId);
    
    return httpClient.get(`/students/paginate?${searchParams}`);
  },

  // Search students
  search: (params: SearchParams): Promise<AxiosResponse<PaginatedResponse<Student>>> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.q) searchParams.append('q', params.q);
    if (params.classId) searchParams.append('classId', params.classId);
    if (params.status) searchParams.append('status', params.status);
    
    return httpClient.get(`/students/search?${searchParams}`);
  },

  // Get student by ID
  getById: (id: string): Promise<AxiosResponse<Student>> => {
    return httpClient.get(`/students/${id}`);
  },

  // Get students by class
  getByClass: (classId: string, params?: SearchParams): Promise<AxiosResponse<PaginatedResponse<Student>>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    return httpClient.get(`/students/class/${classId}?${searchParams}`);
  },

  // Create new student
  create: (data: CreateStudentData): Promise<AxiosResponse<Student>> => {
    return httpClient.post('/students', data);
  },

  // Update student
  update: (id: string, data: UpdateStudentData): Promise<AxiosResponse<Student>> => {
    return httpClient.put(`/students/${id}`, data);
  },

  // Delete student
  delete: (id: string): Promise<AxiosResponse<void>> => {
    return httpClient.delete(`/students/${id}`);
  },

  // Bulk delete students
  bulkDelete: (ids: string[]): Promise<AxiosResponse<void>> => {
    return httpClient.delete('/students/bulk', { data: { ids } });
  },

};
