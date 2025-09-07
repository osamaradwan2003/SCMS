import { httpClient } from "./httpClient";
import type { AxiosResponse } from "axios";

// Types
export interface Transaction {
  id: string;
  type: "income" | "expense" | "transfer";
  amount: number;
  currency: string;
  description?: string;
  category: string;
  date: string;
  status: "pending" | "completed" | "cancelled" | "failed";
  reference?: string;
  bankId?: string;
  fromAccountId?: string;
  toAccountId?: string;
  studentId?: string;
  employeeId?: string;
  bank?: {
    id: string;
    name: string;
    code: string;
  };
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    studentId: string;
  };
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateTransactionData {
  type: "income" | "expense" | "transfer";
  amount: number;
  currency: string;
  description?: string;
  category: string;
  date: string;
  status: "pending" | "completed" | "cancelled" | "failed";
  reference?: string;
  bankId?: string;
  fromAccountId?: string;
  toAccountId?: string;
  studentId?: string;
  employeeId?: string;
}

export interface UpdateTransactionData {
  type: "income" | "expense" | "transfer";
  amount: number;
  currency: string;
  description?: string;
  category: string;
  date: string;
  status: "pending" | "completed" | "cancelled" | "failed";
  reference?: string;
  bankId?: string;
  fromAccountId?: string;
  toAccountId?: string;
  studentId?: string;
  employeeId?: string;
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
  type?: string;
  category?: string;
  status?: string;
  bankId?: string;
  studentId?: string;
  employeeId?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
}

export interface Transactionummary {
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
  TransactionCount: number;
  averageAmount: number;
}

// API Functions
export const TransactionApi = {
  // Get all Transaction with pagination
  getAll: (
    params?: SearchParams
  ): Promise<AxiosResponse<PaginatedResponse<Transaction>>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.q) searchParams.append("q", params.q);
    if (params?.type) searchParams.append("type", params.type);
    if (params?.category) searchParams.append("category", params.category);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.bankId) searchParams.append("bankId", params.bankId);
    if (params?.studentId) searchParams.append("studentId", params.studentId);
    if (params?.employeeId)
      searchParams.append("employeeId", params.employeeId);
    if (params?.dateFrom) searchParams.append("dateFrom", params.dateFrom);
    if (params?.dateTo) searchParams.append("dateTo", params.dateTo);
    if (params?.amountMin)
      searchParams.append("amountMin", params.amountMin.toString());
    if (params?.amountMax)
      searchParams.append("amountMax", params.amountMax.toString());

    return httpClient.get(`/Transaction/paginate?${searchParams}`);
  },

  // Search Transaction
  search: (
    params: SearchParams
  ): Promise<AxiosResponse<PaginatedResponse<Transaction>>> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.q) searchParams.append("q", params.q);
    if (params.type) searchParams.append("type", params.type);
    if (params.category) searchParams.append("category", params.category);
    if (params.status) searchParams.append("status", params.status);
    if (params.bankId) searchParams.append("bankId", params.bankId);
    if (params.studentId) searchParams.append("studentId", params.studentId);
    if (params.employeeId) searchParams.append("employeeId", params.employeeId);
    if (params.dateFrom) searchParams.append("dateFrom", params.dateFrom);
    if (params.dateTo) searchParams.append("dateTo", params.dateTo);
    if (params.amountMin)
      searchParams.append("amountMin", params.amountMin.toString());
    if (params.amountMax)
      searchParams.append("amountMax", params.amountMax.toString());

    return httpClient.get(`/Transaction/search?${searchParams}`);
  },

  // Get Transaction by ID
  getById: (id: string): Promise<AxiosResponse<Transaction>> => {
    return httpClient.get(`/Transaction/${id}`);
  },

  // Get Transaction by student
  getByStudent: (
    studentId: string,
    params?: SearchParams
  ): Promise<AxiosResponse<PaginatedResponse<Transaction>>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    return httpClient.get(`/Transaction/student/${studentId}?${searchParams}`);
  },

  // Get Transaction by employee
  getByEmployee: (
    employeeId: string,
    params?: SearchParams
  ): Promise<AxiosResponse<PaginatedResponse<Transaction>>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    return httpClient.get(
      `/Transaction/employee/${employeeId}?${searchParams}`
    );
  },

  // Create new Transaction
  create: (
    data: CreateTransactionData
  ): Promise<AxiosResponse<Transaction>> => {
    return httpClient.post("/Transaction", data);
  },

  // Update Transaction
  update: (
    id: string,
    data: UpdateTransactionData
  ): Promise<AxiosResponse<Transaction>> => {
    return httpClient.put(`/Transaction/${id}`, data);
  },

  // Delete Transaction
  delete: (id: string): Promise<AxiosResponse<void>> => {
    return httpClient.delete(`/Transaction/${id}`);
  },

  // Bulk delete Transaction
  bulkDelete: (ids: string[]): Promise<AxiosResponse<void>> => {
    return httpClient.delete("/Transaction/bulk", { data: { ids } });
  },

  // Update Transaction status
  updateStatus: (
    id: string,
    status: "pending" | "completed" | "cancelled" | "failed"
  ): Promise<AxiosResponse<Transaction>> => {
    return httpClient.patch(`/Transaction/${id}/status`, { status });
  },

  // Get Transaction summary
  getSummary: (params?: {
    dateFrom?: string;
    dateTo?: string;
    type?: string;
    category?: string;
  }): Promise<AxiosResponse<Transactionummary>> => {
    const searchParams = new URLSearchParams();
    if (params?.dateFrom) searchParams.append("dateFrom", params.dateFrom);
    if (params?.dateTo) searchParams.append("dateTo", params.dateTo);
    if (params?.type) searchParams.append("type", params.type);
    if (params?.category) searchParams.append("category", params.category);

    return httpClient.get(`/Transaction/summary?${searchParams}`);
  },

  // Get categories
  getCategories: (): Promise<AxiosResponse<string[]>> => {
    return httpClient.get("/Transaction/categories");
  },
};
