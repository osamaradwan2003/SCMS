import { httpClient } from './httpClient';
import type { AxiosResponse } from 'axios';

// Types
export interface Class {
  id: string;
  name: string;
  code: string;
  description?: string;
  capacity: number;
  currentEnrollment: number;
  academicYear: string;
  semester: string;
  status: 'active' | 'inactive' | 'completed';
  teacherId?: string;
  teacher?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  subjects?: {
    id: string;
    name: string;
    code: string;
  }[];
  students?: {
    id: string;
    firstName: string;
    lastName: string;
    studentId: string;
  }[];
  created_at: string;
  updated_at: string;
}

export interface CreateClassData {
  name: string;
  code: string;
  description?: string;
  capacity: number;
  academicYear: string;
  semester: string;
  status: 'active' | 'inactive' | 'completed';
  teacherId?: string;
}

export interface UpdateClassData {
  name: string;
  code: string;
  description?: string;
  capacity: number;
  academicYear: string;
  semester: string;
  status: 'active' | 'inactive' | 'completed';
  teacherId?: string;
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
  academicYear?: string;
  semester?: string;
  status?: string;
  teacherId?: string;
}

// API Functions
export const classesApi = {
  // Get all classes with pagination
  getAll: (params?: SearchParams): Promise<AxiosResponse<PaginatedResponse<Class>>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.q) searchParams.append('q', params.q);
    if (params?.academicYear) searchParams.append('academicYear', params.academicYear);
    if (params?.semester) searchParams.append('semester', params.semester);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.teacherId) searchParams.append('teacherId', params.teacherId);
    
    return httpClient.get(`/classes/paginate?${searchParams}`);
  },

  // Get simple list for dropdowns
  getList: (): Promise<AxiosResponse<{ id: string; name: string; code: string }[]>> => {
    return httpClient.get('/classes');
  },

  // Search classes
  search: (params: SearchParams): Promise<AxiosResponse<PaginatedResponse<Class>>> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.q) searchParams.append('q', params.q);
    if (params.academicYear) searchParams.append('academicYear', params.academicYear);
    if (params.semester) searchParams.append('semester', params.semester);
    if (params.status) searchParams.append('status', params.status);
    if (params.teacherId) searchParams.append('teacherId', params.teacherId);
    
    return httpClient.get(`/classes/search?${searchParams}`);
  },

  // Get class by ID
  getById: (id: string): Promise<AxiosResponse<Class>> => {
    return httpClient.get(`/classes/${id}`);
  },

  // Create new class
  create: (data: CreateClassData): Promise<AxiosResponse<Class>> => {
    return httpClient.post('/classes', data);
  },

  // Update class
  update: (id: string, data: UpdateClassData): Promise<AxiosResponse<Class>> => {
    return httpClient.put(`/classes/${id}`, data);
  },

  // Delete class
  delete: (id: string): Promise<AxiosResponse<void>> => {
    return httpClient.delete(`/classes/${id}`);
  },

  // Bulk delete classes
  bulkDelete: (ids: string[]): Promise<AxiosResponse<void>> => {
    return httpClient.delete('/classes/bulk', { data: { ids } });
  },

  // Update class status
  updateStatus: (id: string, status: 'active' | 'inactive' | 'completed'): Promise<AxiosResponse<Class>> => {
    return httpClient.patch(`/classes/${id}/status`, { status });
  },

  // Assign teacher to class
  assignTeacher: (id: string, teacherId: string): Promise<AxiosResponse<Class>> => {
    return httpClient.patch(`/classes/${id}/teacher`, { teacherId });
  },

  // Remove teacher from class
  removeTeacher: (id: string): Promise<AxiosResponse<Class>> => {
    return httpClient.delete(`/classes/${id}/teacher`);
  },

  // Get class statistics
  getStats: (id: string): Promise<AxiosResponse<{
    totalStudents: number;
    totalSubjects: number;
    averageGrade: number;
    attendanceRate: number;
  }>> => {
    return httpClient.get(`/classes/${id}/stats`);
  },
};
