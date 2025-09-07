// Export all API modules
export * from "./auth";
export * from "./httpClient";
export * from "./subjects";
export * from "./students";
export * from "./classes";
export * from "./guardians";
export * from "./employees";
export * from "./banks";
export * from "./transactions";

// Re-export commonly used types
export type { AxiosResponse } from "axios";

// Common types used across multiple APIs
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

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}
