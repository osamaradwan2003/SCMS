import { httpClient } from "./httpClient";
import type { AxiosResponse } from "axios";
import type { UploadFile } from "antd";

// Types
export interface Employee {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  position: string;
  is_teacher?: boolean;
  department: string;
  hireDate: string;
  salary: number;
  status: "active" | "inactive" | "terminated" | "on_leave";
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
  subjects?: {
    id: string;
    name: string;
  }[];
  // Optional media fields
  profile_image?: string;
  docs?: string;
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
  status: "active" | "inactive" | "terminated" | "on_leave";
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
  status: "active" | "inactive" | "terminated" | "on_leave";
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

// Prisma-aligned minimal payload for Employee create
export interface CreateEmployeeSimpleData {
  name: string;
  role: string; // "teacher" | "staff" | "admin" | "data_entry"
  is_teacher?: boolean;
  hireDate: string; // ISO string
  salary: number;
  classId?: string | null;
}

// Form values coming from Antd Upload component
export interface CreateEmployeeFormData {
  name: string;
  role: string;
  is_teacher?: boolean;
  hireDate: string | Date;
  salary: number;
  classId?: string | null;
  position: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: string;
  managerId?: string;
  departmentId?: string;
  profile_image?: { fileList: UploadFile[] };
  docs?: { fileList: UploadFile[] };
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
  getAll: (
    params?: SearchParams
  ): Promise<AxiosResponse<PaginatedResponse<Employee>>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.q) searchParams.append("q", params.q);
    if (params?.department)
      searchParams.append("department", params.department);
    if (params?.position) searchParams.append("position", params.position);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.managerId) searchParams.append("managerId", params.managerId);

    return httpClient.get(`/employees/paginate?${searchParams}`);
  },

  // Get simple list for dropdowns
  getList: (): Promise<
    AxiosResponse<
      { id: string; firstName: string; lastName: string; position: string }[]
    >
  > => {
    return httpClient.get("/employees");
  },

  // Search employees
  search: (
    params: SearchParams
  ): Promise<AxiosResponse<PaginatedResponse<Employee>>> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.q) searchParams.append("q", params.q);
    if (params.department) searchParams.append("department", params.department);
    if (params.position) searchParams.append("position", params.position);
    if (params.status) searchParams.append("status", params.status);
    if (params.managerId) searchParams.append("managerId", params.managerId);

    return httpClient.get(`/employees/search?${searchParams}`);
  },

  // Get employee by ID
  getById: (id: string): Promise<AxiosResponse<Employee>> => {
    return httpClient.get(`/employees/${id}`);
  },

  // Get employees by department
  getByDepartment: (
    department: string,
    params?: SearchParams
  ): Promise<AxiosResponse<PaginatedResponse<Employee>>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    return httpClient.get(
      `/employees/department/${department}?${searchParams}`
    );
  },

  // Get managers
  getManagers: (): Promise<AxiosResponse<Employee[]>> => {
    return httpClient.get("/employees/managers");
  },

  // Create employee (always uses FormData)
  create: (
    data: CreateEmployeeFormData | CreateEmployeeSimpleData
  ): Promise<AxiosResponse<unknown>> => {
    const formData = new FormData();
    const inputData = data as CreateEmployeeFormData;

    // Define all possible fields to loop through
    const fields = {
      name: inputData.name,
      role: inputData.role,
      is_teacher: inputData.is_teacher,
      hireDate: inputData.hireDate,
      position: inputData.position,
      salary: inputData.salary,
      classId: inputData.classId,
      email: inputData.email,
      phone: inputData.phone,
      address: inputData.address,
      status: inputData.status,
      managerId: inputData.managerId,
      departmentId: inputData.departmentId,
    };

    // Loop through all fields and add to FormData if they have values
    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (key === "hireDate") {
          // Handle date conversion
          const dateValue =
            typeof value === "string" ? value : (value as Date).toISOString();
          formData.append(key, dateValue);
        } else {
          // Convert all other values to string
          formData.append(key, String(value));
        }
      }
    });

    // Handle file uploads
    if (inputData.profile_image?.fileList?.length) {
      const f = inputData.profile_image.fileList[0];
      if (f.originFileObj) {
        formData.append("profile_image", f.originFileObj);
      }
    }

    if (inputData.docs?.fileList?.length) {
      inputData.docs.fileList.forEach((f) => {
        if (f.originFileObj) {
          formData.append("docs", f.originFileObj);
        }
      });
    }

    return httpClient.post("/employees", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Update employee
  update: (
    id: string,
    data: UpdateEmployeeData
  ): Promise<AxiosResponse<Employee>> => {
    return httpClient.put(`/employees/${id}`, data);
  },

  // Delete employee
  delete: (id: string): Promise<AxiosResponse<void>> => {
    return httpClient.delete(`/employees/${id}`);
  },

  // Bulk delete employees
  bulkDelete: (ids: string[]): Promise<AxiosResponse<void>> => {
    return httpClient.delete("/employees/bulk", { data: { ids } });
  },

  // Update employee status
  updateStatus: (
    id: string,
    status: "active" | "inactive" | "terminated" | "on_leave"
  ): Promise<AxiosResponse<Employee>> => {
    return httpClient.patch(`/employees/${id}/status`, { status });
  },

  // Update salary
  updateSalary: (
    id: string,
    salary: number
  ): Promise<AxiosResponse<Employee>> => {
    return httpClient.patch(`/employees/${id}/salary`, { salary });
  },

  // Assign manager
  assignManager: (
    id: string,
    managerId: string
  ): Promise<AxiosResponse<Employee>> => {
    return httpClient.patch(`/employees/${id}/manager`, { managerId });
  },

  // Remove manager
  removeManager: (id: string): Promise<AxiosResponse<Employee>> => {
    return httpClient.delete(`/employees/${id}/manager`);
  },
};
