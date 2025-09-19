import { httpClient } from './httpClient';
import type { AxiosResponse } from 'axios';
import type { Employee } from './employees';

// Types
export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  manager?: {
    id: string;
    name: string;
    position: string;
    email?: string;
  };
  employees?: {
    id: string;
    name: string;
    position: string;
    status: string;
  }[];
  _count?: {
    employees: number;
  };
  created_by?: {
    id: string;
    name: string;
    username: string;
  };
  userId?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDepartmentData {
  name: string;
  description?: string;
  managerId?: string;
}

export interface UpdateDepartmentData {
  name?: string;
  description?: string;
  managerId?: string;
}

export interface DepartmentStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  totalSalaryBudget: number;
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
export const departmentsApi = {
  // Get all departments with pagination
  getAll: (params?: SearchParams): Promise<AxiosResponse<PaginatedResponse<Department>>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.q) searchParams.append('q', params.q);
    
    return httpClient.get(`/departments/paginate?${searchParams}`);
  },

  // Get simple list for dropdowns
  getList: (): Promise<AxiosResponse<Department[]>> => {
    return httpClient.get('/departments/list');
  },

  // Get departments with managers
  getWithManagers: (): Promise<AxiosResponse<Department[]>> => {
    return httpClient.get('/departments/with-managers');
  },

  // Search departments
  search: (params: SearchParams): Promise<AxiosResponse<PaginatedResponse<Department>>> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.q) searchParams.append('q', params.q);
    
    return httpClient.get(`/departments/search?${searchParams}`);
  },

  // Get department by ID
  getById: (id: string): Promise<AxiosResponse<Department>> => {
    return httpClient.get(`/departments/${id}`);
  },

  // Get department statistics
  getStats: (id: string): Promise<AxiosResponse<DepartmentStats>> => {
    return httpClient.get(`/departments/${id}/stats`);
  },

  // Get department employees
  getEmployees: (id: string, params?: SearchParams): Promise<AxiosResponse<PaginatedResponse<Employee>>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    return httpClient.get(`/departments/${id}/employees?${searchParams}`);
  },

  // Create new department
  create: (data: CreateDepartmentData): Promise<AxiosResponse<Department>> => {
    return httpClient.post('/departments', data);
  },

  // Update department
  update: (id: string, data: UpdateDepartmentData): Promise<AxiosResponse<Department>> => {
    return httpClient.put(`/departments/${id}`, data);
  },

  // Delete department
  delete: (id: string): Promise<AxiosResponse<void>> => {
    return httpClient.delete(`/departments/${id}`);
  },

  // Bulk delete departments
  bulkDelete: (ids: string[]): Promise<AxiosResponse<void>> => {
    return httpClient.delete('/departments', { data: { ids } });
  },

  // Assign manager to department
  assignManager: (id: string, managerId: string): Promise<AxiosResponse<Department>> => {
    return httpClient.patch(`/departments/${id}/manager`, { managerId });
  },

  // Remove manager from department
  removeManager: (id: string): Promise<AxiosResponse<Department>> => {
    return httpClient.delete(`/departments/${id}/manager`);
  },
};
