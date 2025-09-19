import type { AppModel, PermissionAction, User } from "@/@types/user";

export type EffectivePermissions = Record<
  AppModel,
  {
    can_view: boolean;
    can_create: boolean;
    can_update: boolean;
    can_delete: boolean;
  }
>;

const defaultPerm = {
  can_view: false,
  can_create: false,
  can_update: false,
  can_delete: false,
};

function orPerm(
  a: typeof defaultPerm,
  b: Partial<typeof defaultPerm> | undefined
) {
  if (!b) return a;
  return {
    can_view: a.can_view || !!b.can_view,
    can_create: a.can_create || !!b.can_create,
    can_update: a.can_update || !!b.can_update,
    can_delete: a.can_delete || !!b.can_delete,
  };
}

function applyOverride(
  base: typeof defaultPerm,
  ov?: Partial<typeof defaultPerm>
) {
  if (!ov) return base;
  return {
    can_view: ov.can_view ?? base.can_view,
    can_create: ov.can_create ?? base.can_create,
    can_update: ov.can_update ?? base.can_update,
    can_delete: ov.can_delete ?? base.can_delete,
  };
}

function groupByModel<
  T extends {
    model: AppModel;
    can_view?: boolean;
    can_create?: boolean;
    can_update?: boolean;
    can_delete?: boolean;
  }
>(perms: T[] | undefined) {
  const map = new Map<AppModel, Partial<typeof defaultPerm>>();
  if (!perms) return map;
  for (const p of perms) {
    const current = map.get(p.model) || {};
    map.set(p.model, {
      can_view: p.can_view ?? current.can_view,
      can_create: p.can_create ?? current.can_create,
      can_update: p.can_update ?? current.can_update,
      can_delete: p.can_delete ?? current.can_delete,
    });
  }
  return map;
}

export function computeEffectivePermissions(
  user?: User
): EffectivePermissions | null {
  if (!user) return null;

  // Superadmin override: full access to all models
  const isSuperadmin =
    (user.roles && user.roles.some((r) => r.name?.toLowerCase() === "superadmin")) ||
    (typeof user.role === "string" && user.role.toLowerCase() === "superadmin");

  const models: AppModel[] = [
    "User",
    "Student",
    "Guardian",
    "Class",
    "Subject",
    "Employee",
    "EmployeeAttendance",
    "StuednAttendance",
    "Payroll",
    "Bank",
    "Category",
    "IncomeType",
    "ExpenseType",
    "Transaction",
    "MessageLog",
    "Department",
    "Subscriptions",
    "WeeklyReport",
  ];

  if (isSuperadmin) {
    const eff = {} as EffectivePermissions;
    for (const m of models)
      eff[m] = {
        can_view: true,
        can_create: true,
        can_update: true,
        can_delete: true,
      };
    return eff;
  }

  // Aggregate role permissions (OR across roles)
  const rolePerms = (user.roles || []).flatMap((r) => r.rolePermissions || []);
  const roleByModel = groupByModel(rolePerms);

  // User overrides (if any)
  const overrideByModel = groupByModel(user.userPermissions);

  const effective = {} as EffectivePermissions;
  for (const m of models) {
    const base = orPerm({ ...defaultPerm }, roleByModel.get(m));
    effective[m] = applyOverride(base, overrideByModel.get(m));
  }
  return effective;
}

export function hasPermission(
  user: User | undefined,
  model: AppModel,
  action: PermissionAction
) {
  const eff = computeEffectivePermissions(user);
  if (!eff) return false;
  const p = eff[model] ?? defaultPerm;
  switch (action) {
    case "view":
      return p.can_view;
    case "create":
      return p.can_create;
    case "update":
      return p.can_update;
    case "delete":
      return p.can_delete;
    default:
      return false;
  }
}
