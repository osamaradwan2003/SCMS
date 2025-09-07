import { httpClient } from './httpClient';
import type { AxiosResponse } from 'axios';

// Types
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth: string;
  address?: string;
  enrollmentDate: string;
  studentId: string;
  classId: string;
  guardianId?: string;
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
  class?: {
    id: string;
    name: string;
  };
  guardian?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateStudentData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth: string;
  address?: string;
  enrollmentDate: string;
  studentId: string;
  classId: string;
  guardianId?: string;
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
}

export interface UpdateStudentData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth: string;
  address?: string;
  enrollmentDate: string;
  studentId: string;
  classId: string;
  guardianId?: string;
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
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
  status?: string;
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
    if (params?.status) searchParams.append('status', params.status);
    
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

  // Update student status
  updateStatus: (id: string, status: 'active' | 'inactive' | 'graduated' | 'suspended'): Promise<AxiosResponse<Student>> => {
    return httpClient.patch(`/students/${id}/status`, { status });
  },
};
