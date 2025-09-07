import { httpClient } from './httpClient';
import type { AxiosResponse } from 'axios';

// Types
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  position: string;
  department: string;
  hireDate: string;
  salary: number;
  status: 'active' | 'inactive' | 'terminated' | 'on_leave';
  employeeId: string;
  managerId?: string;
  manager?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  subordinates?: {
    id: string;
    firstName: string;
    lastName: string;
  }[];
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeeData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  position: string;
  department: string;
  hireDate: string;
  salary: number;
  status: 'active' | 'inactive' | 'terminated' | 'on_leave';
  employeeId: string;
  managerId?: string;
}

export interface UpdateEmployeeData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  position: string;
  department: string;
  hireDate: string;
  salary: number;
  status: 'active' | 'inactive' | 'terminated' | 'on_leave';
  employeeId: string;
  managerId?: string;
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
  department?: string;
  position?: string;
  status?: string;
  managerId?: string;
}

// API Functions
export const employeesApi = {
  // Get all employees with pagination
  getAll: (params?: SearchParams): Promise<AxiosResponse<PaginatedResponse<Employee>>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.q) searchParams.append('q', params.q);
    if (params?.department) searchParams.append('department', params.department);
    if (params?.position) searchParams.append('position', params.position);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.managerId) searchParams.append('managerId', params.managerId);
    
    return httpClient.get(`/employees/paginate?${searchParams}`);
  },

  // Get simple list for dropdowns
  getList: (): Promise<AxiosResponse<{ id: string; firstName: string; lastName: string; position: string }[]>> => {
    return httpClient.get('/employees');
  },

  // Search employees
  search: (params: SearchParams): Promise<AxiosResponse<PaginatedResponse<Employee>>> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.q) searchParams.append('q', params.q);
    if (params.department) searchParams.append('department', params.department);
    if (params.position) searchParams.append('position', params.position);
    if (params.status) searchParams.append('status', params.status);
    if (params.managerId) searchParams.append('managerId', params.managerId);
    
    return httpClient.get(`/employees/search?${searchParams}`);
  },

  // Get employee by ID
  getById: (id: string): Promise<AxiosResponse<Employee>> => {
    return httpClient.get(`/employees/${id}`);
  },

  // Get employees by department
  getByDepartment: (department: string, params?: SearchParams): Promise<AxiosResponse<PaginatedResponse<Employee>>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    return httpClient.get(`/employees/department/${department}?${searchParams}`);
  },

  // Get managers
  getManagers: (): Promise<AxiosResponse<Employee[]>> => {
    return httpClient.get('/employees/managers');
  },

  // Create new employee
  create: (data: CreateEmployeeData): Promise<AxiosResponse<Employee>> => {
    return httpClient.post('/employees', data);
  },

  // Update employee
  update: (id: string, data: UpdateEmployeeData): Promise<AxiosResponse<Employee>> => {
    return httpClient.put(`/employees/${id}`, data);
  },

  // Delete employee
  delete: (id: string): Promise<AxiosResponse<void>> => {
    return httpClient.delete(`/employees/${id}`);
  },

  // Bulk delete employees
  bulkDelete: (ids: string[]): Promise<AxiosResponse<void>> => {
    return httpClient.delete('/employees/bulk', { data: { ids } });
  },

  // Update employee status
  updateStatus: (id: string, status: 'active' | 'inactive' | 'terminated' | 'on_leave'): Promise<AxiosResponse<Employee>> => {
    return httpClient.patch(`/employees/${id}/status`, { status });
  },

  // Update salary
  updateSalary: (id: string, salary: number): Promise<AxiosResponse<Employee>> => {
    return httpClient.patch(`/employees/${id}/salary`, { salary });
  },

  // Assign manager
  assignManager: (id: string, managerId: string): Promise<AxiosResponse<Employee>> => {
    return httpClient.patch(`/employees/${id}/manager`, { managerId });
  },

  // Remove manager
  removeManager: (id: string): Promise<AxiosResponse<Employee>> => {
    return httpClient.delete(`/employees/${id}/manager`);
  },
};
