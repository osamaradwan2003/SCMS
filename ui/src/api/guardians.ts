import { httpClient } from './httpClient';
import type { AxiosResponse } from 'axios';
import type { UploadFile } from 'antd';

// Types
export interface Guardian {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  relationDegree: string;
  profile_photo?: string;
  documents?: string;
  students?: {
    id: string;
    name: string;
    studentId: string;
  }[];
  created_at: string;
  updated_at: string;
}

export interface CreateGuardianData {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  relationship: string;
  profile_photo?: File;
  documents?: File;
}

export interface CreateGuardianFormData {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  relationship: string;
  profile_photo?: {
    fileList: UploadFile[];
  };
  documents?: {
    fileList: UploadFile[];
  };
}

export interface UpdateGuardianData {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  relationship?: string;
  profile_photo?: File;
  documents?: File;
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
  relationship?: string;
  emergencyContact?: boolean;
}

// API Functions
export const guardiansApi = {
  // Get all guardians with pagination
  getAll: (params?: SearchParams): Promise<AxiosResponse<PaginatedResponse<Guardian>>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.q) searchParams.append('q', params.q);
    if (params?.relationship) searchParams.append('relationship', params.relationship);
    if (params?.emergencyContact !== undefined) searchParams.append('emergencyContact', params.emergencyContact.toString());
    
    return httpClient.get(`/guardians/paginate?${searchParams}`);
  },

  // Get simple list for dropdowns
  getList: (): Promise<AxiosResponse<{ id: string; firstName: string; lastName: string }[]>> => {
    return httpClient.get('/guardians');
  },

  // Search guardians
  search: (params: SearchParams): Promise<AxiosResponse<PaginatedResponse<Guardian>>> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.q) searchParams.append('q', params.q);
    if (params.relationship) searchParams.append('relationship', params.relationship);
    if (params.emergencyContact !== undefined) searchParams.append('emergencyContact', params.emergencyContact.toString());
    
    return httpClient.get(`/guardians/search?${searchParams}`);
  },

  // Get guardian by ID
  getById: (id: string): Promise<AxiosResponse<Guardian>> => {
    return httpClient.get(`/guardians/${id}`);
  },

  // Create new guardian
  create: (data: CreateGuardianFormData): Promise<AxiosResponse<Guardian>> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('phone', data.phone);
    formData.append('relationship', data.relationship);
    
    if (data.email) formData.append('email', data.email);
    if (data.address) formData.append('address', data.address);
    
    // Handle file uploads from Ant Design Upload component
    if (data.profile_photo && data.profile_photo.fileList && data.profile_photo.fileList.length > 0) {
      const file = data.profile_photo.fileList[0];
      if (file.originFileObj) {
        formData.append('profile_photo', file.originFileObj);
      }
    }
    
    if (data.documents && data.documents.fileList && data.documents.fileList.length > 0) {
      data.documents.fileList.forEach((file: UploadFile) => {
        if (file.originFileObj) {
          formData.append(`documents`, file.originFileObj);
        }
      });
    }

    return httpClient.post('/guardians', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update guardian
  update: (id: string, data: UpdateGuardianData): Promise<AxiosResponse<Guardian>> => {
    const formData = new FormData();
    
    if (data.name) formData.append('name', data.name);
    if (data.phone) formData.append('phone', data.phone);
    if (data.relationship) formData.append('relationship', data.relationship);
    if (data.email) formData.append('email', data.email);
    if (data.address) formData.append('address', data.address);
    if (data.profile_photo) formData.append('profile_photo', data.profile_photo);
    if (data.documents) formData.append('documents', data.documents);

    return httpClient.put(`/guardians/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Upload files to existing guardian
  uploadFiles: (id: string, files: { profile_photo?: File; documents?: File }): Promise<AxiosResponse<Guardian>> => {
    const formData = new FormData();
    
    if (files.profile_photo) formData.append('profile_photo', files.profile_photo);
    if (files.documents) formData.append('documents', files.documents);

    return httpClient.post(`/guardians/${id}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete guardian
  delete: (id: string): Promise<AxiosResponse<void>> => {
    return httpClient.delete(`/guardians/${id}`);
  },

  // Bulk delete guardians
  bulkDelete: (ids: string[]): Promise<AxiosResponse<void>> => {
    return httpClient.delete('/guardians/bulk', { data: { ids } });
  },

  // Link guardian to student
  linkStudent: (guardianId: string, studentId: string): Promise<AxiosResponse<void>> => {
    return httpClient.post(`/guardians/${guardianId}/students`, { studentId });
  },

  // Unlink guardian from student
  unlinkStudent: (guardianId: string, studentId: string): Promise<AxiosResponse<void>> => {
    return httpClient.delete(`/guardians/${guardianId}/students/${studentId}`);
  },

  // Get emergency contacts
  getEmergencyContacts: (): Promise<AxiosResponse<Guardian[]>> => {
    return httpClient.get('/guardians/emergency-contacts');
  },
};
