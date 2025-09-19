import { prisma } from "@/db/client";
import { AppModel } from "@prisma/client";

async function upsertRole(name: string, description: string, isSystem = true) {
  return prisma.role.upsert({
    where: { name },
    update: { description, isSystem },
    create: { name, description, isSystem },
  });
}

async function upsertRolePermission(
  roleId: string,
  model: AppModel,
  flags: { can_view?: boolean; can_create?: boolean; can_update?: boolean; can_delete?: boolean }
) {
  const { can_view = false, can_create = false, can_update = false, can_delete = false } = flags;
  return prisma.rolePermission.upsert({
    where: { roleId_model: { roleId, model } },
    update: { can_view, can_create, can_update, can_delete },
    create: { roleId, model, can_view, can_create, can_update, can_delete },
  });
}

function everyModel(): AppModel[] {
  return [
    AppModel.User,
    AppModel.Student,
    AppModel.Guardian,
    AppModel.Class,
    AppModel.Subject,
    AppModel.Employee,
    AppModel.EmployeeAttendance,
    AppModel.StuednAttendance,
    AppModel.Payroll,
    AppModel.Bank,
    AppModel.Category,
    AppModel.IncomeType,
    AppModel.ExpenseType,
    AppModel.Transaction,
    AppModel.MessageLog,
    AppModel.Department,
  ];
}

export async function seedRoles() {
  // 1) Create system roles
  const superadmin = await upsertRole("superadmin", "Full system access");
  const admin = await upsertRole("admin", "Administrative access");
  const teacher = await upsertRole("teacher", "Teacher role with teaching-related access");
  const parent = await upsertRole("parent", "Parent role with limited access");
  const student = await upsertRole("student", "Student role with limited access");

  // 2) Seed permissions
  // Superadmin: all permissions on all models
  for (const m of everyModel()) {
    await upsertRolePermission(superadmin.id, m, {
      can_view: true,
      can_create: true,
      can_update: true,
      can_delete: true,
    });
  }

  // Admin: full CRUD on all models (adjust later if needed)
  for (const m of everyModel()) {
    await upsertRolePermission(admin.id, m, {
      can_view: true,
      can_create: true,
      can_update: true,
      can_delete: true,
    });
  }

  // Teacher: common teaching permissions
  // View core academic data
  await upsertRolePermission(teacher.id, AppModel.Class, { can_view: true });
  await upsertRolePermission(teacher.id, AppModel.Subject, { can_view: true });
  await upsertRolePermission(teacher.id, AppModel.Student, { can_view: true });
  // Manage student attendance (create/update)
  await upsertRolePermission(teacher.id, AppModel.StuednAttendance, {
    can_view: true,
    can_create: true,
    can_update: true,
  });
  // Messaging: allow sending (create) and viewing own message logs
  await upsertRolePermission(teacher.id, AppModel.MessageLog, { can_view: true, can_create: true });

  // Parent: view-only on Student and MessageLog
  await upsertRolePermission(parent.id, AppModel.Student, { can_view: true });
  await upsertRolePermission(parent.id, AppModel.MessageLog, { can_view: true });

  // Student: view-only on Subject and Class
  await upsertRolePermission(student.id, AppModel.Subject, { can_view: true });
  await upsertRolePermission(student.id, AppModel.Class, { can_view: true });

  // 3) Attach superadmin role to default admin user if exists
  const defaultAdmin = await prisma.user.findUnique({ where: { username: "admin" } });
  if (defaultAdmin) {
    await prisma.user.update({
      where: { id: defaultAdmin.id },
      data: { roles: { connect: [{ id: superadmin.id }] } },
    });
  }

  // Output summary
  console.log("Seeded roles and permissions successfully.");
}

// Execute when invoked directly via ts-node
seedRoles()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
