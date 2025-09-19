export type PermissionAction = "view" | "create" | "update" | "delete";

export type AppModel =
  | "User"
  | "Student"
  | "Guardian"
  | "Class"
  | "Subject"
  | "Employee"
  | "EmployeeAttendance"
  | "StuednAttendance"
  | "Payroll"
  | "Bank"
  | "Category"
  | "IncomeType"
  | "ExpenseType"
  | "Transaction"
  | "MessageLog"
  | "Department"
  | "Subscriptions"
  | "WeeklyReport";

export interface RolePermission {
  id: string;
  roleId: string;
  model: AppModel;
  can_view: boolean;
  can_create: boolean;
  can_update: boolean;
  can_delete: boolean;
}

export interface UserPermissionOverride {
  id: string;
  userId: string;
  model: AppModel;
  can_view?: boolean;
  can_create?: boolean;
  can_update?: boolean;
  can_delete?: boolean;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  isSystem?: boolean;
  rolePermissions?: RolePermission[];
  // Deprecated UI shape, keep for backward compatibility
  permisions?: string[];
}

export interface User {
  id: string;
  username: string;
  name: string;
  email?: string;
  image?: string;
  phone?: string;
  roles?: Role[]; // multiple roles supported
  // Deprecated single-role field (kept for backward compatibility in UI)
  role?: Role | string;
  // Optional per-user overrides
  userPermissions?: UserPermissionOverride[];
  // First login and password-change enforcement flags
  firstLogin?: boolean;
  mustChangePassword?: boolean;
}
