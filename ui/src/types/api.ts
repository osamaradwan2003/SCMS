// Common API response types
export interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiSingleResponse<T> {
  data: T;
}

// Query parameters for API requests
export interface QueryParams {
  page?: number;
  limit?: number;
  q?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: string | number | undefined;
}

// Student type
export interface Student {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  guardianId?: string;
  classId?: string;
  created_at: string;
  updated_at: string;
}

// Employee type
export interface Employee {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  salary?: number;
  hireDate?: string;
  created_at: string;
  updated_at: string;
}

// Class type
export interface Class {
  id: string;
  name: string;
  students?: Student[];
  subjects?: Subject[];
  teachers?: Employee[];
  created_by?: {
    id: string;
    name: string;
    username: string;
  };
  userId?: string;
  created_at: string;
  updated_at: string;
}

// Class form data types
export interface CreateClassData {
  name: string;
}

export interface UpdateClassData {
  name?: string;
}

// Subject type
export interface Subject {
  id: string;
  name: string;
  reports?: WeeklyReport[];
  classes?: Class[];
  created_by?: {
    id: string;
    name: string;
    username: string;
  };
  userId?: string;
  created_at: string;
  updated_at: string;
}

// Subject form data types
export interface CreateSubjectData {
  name: string;
}

export interface UpdateSubjectData {
  name?: string;
}

// Guardian type
export interface Guardian {
  id: string;
  name: string;
  phone: string;
  relationDegree: string;
  Student?: Student[];
  created_by?: {
    id: string;
    name: string;
    username: string;
  };
  userId?: string;
  created_at: string;
  updated_at: string;
}

// Guardian form data types
export interface CreateGuardianData {
  name: string;
  phone: string;
  relationDegree: string;
}

export interface UpdateGuardianData {
  name?: string;
  phone?: string;
  relationDegree?: string;
}

// Attendance type
export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: string;
  notes?: string;
  student?: Student;
  created_at: string;
  updated_at: string;
}

// Message type
export interface Message {
  id: string;
  title: string;
  content: string;
  type: string;
  recipientId?: string;
  senderId?: string;
  isRead: boolean;
  created_at: string;
  updated_at: string;
}

// Weekly Report type
export interface WeeklyReport {
  id: string;
  studentId: string;
  week: string;
  score: number;
  notes?: string;
  subjectId?: string;
  student?: Student;
  subject?: Subject;
  created_at: string;
  updated_at: string;
}

// Payroll type
export interface Payroll {
  id: string;
  employeeId: string;
  month: string;
  basicSalary: number;
  allowances?: number;
  deductions?: number;
  netSalary: number;
  status: string;
  employee?: Employee;
  created_at: string;
  updated_at: string;
}

// Income Type
export interface IncomeType {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Expense Type
export interface ExpenseType {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Subscription type
export interface Subscription {
  id: string;
  studentId: string;
  planName: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: string;
  student?: Student;
  created_at: string;
  updated_at: string;
}

// Transaction type
export interface Transaction {
  id: string;
  amount: number;
  type: string;
  description?: string;
  date: string;
  categoryId?: string;
  bankId?: string;
  created_at: string;
  updated_at: string;
}

// Bank type
export interface Bank {
  id: string;
  name: string;
  accountNumber: string;
  balance: number;
  status: string;
  created_at: string;
  updated_at: string;
}

// Category type
export interface Category {
  id: string;
  name: string;
  description?: string;
  type: string;
  created_at: string;
  updated_at: string;
}

// Option type for select components
export interface SelectOption {
  value: string;
  label: string;
}
