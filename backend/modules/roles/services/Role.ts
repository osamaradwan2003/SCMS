import { prisma } from "@/db/client";
import { AppModel, Prisma } from "@prisma/client";

type CreateRoleInput = {
  name: string;
  description?: string;
  isSystem?: boolean;
  permissions?: Prisma.JsonValue | null;
  createdById?: string;
};

type UpdateRoleInput = {
  name?: string;
  description?: string;
  permissions?: Prisma.JsonValue | null;
};

export default class RoleService {
  static async create(input: CreateRoleInput) {
    const { name, description, isSystem = false, permissions = null, createdById } = input;
    return prisma.role.create({
      data: {
        name,
        description,
        isSystem,
        permissions: permissions === null ? Prisma.JsonNull : (permissions as Prisma.InputJsonValue),
        ...(createdById ? { userId: createdById } : {}),
      },
    });
  }

  static async getAll() {
    return prisma.role.findMany({
      orderBy: { name: "asc" },
      include: {
        created_by: { select: { id: true, name: true, username: true } },
        _count: { select: { users: true, rolePermissions: true } },
      },
    });
  }

  static async getById(id: string) {
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        created_by: { select: { id: true, name: true, username: true } },
        rolePermissions: true,
      },
    });
    if (!role) throw new Error("Role not found");
    return role;
  }

  static async update(id: string, data: UpdateRoleInput) {
    const current = await prisma.role.findUnique({ where: { id } });
    if (!current) throw new Error("Role not found");
    if (current.isSystem && data.name && data.name !== current.name) {
      throw new Error("Cannot rename a system role");
    }
    const updateData: any = { ...data };
    if (data.permissions !== undefined) {
      updateData.permissions = data.permissions === null ? Prisma.JsonNull : (data.permissions as Prisma.InputJsonValue);
    }
    return prisma.role.update({ where: { id }, data: updateData });
  }

  static async delete(id: string) {
    const current = await prisma.role.findUnique({ where: { id } });
    if (!current) throw new Error("Role not found");
    if (current.isSystem) throw new Error("Cannot delete a system role");

    // Delete role permissions
    await prisma.rolePermission.deleteMany({ where: { roleId: id } });

    return prisma.role.delete({ where: { id } });
  }

  static async upsertPermissions(
    roleId: string,
    permissions: Array<{
      model: string;
      can_view?: boolean;
      can_create?: boolean;
      can_update?: boolean;
      can_delete?: boolean;
    }>
  ) {
    // Validate role exists
    const role = await prisma.role.findUnique({ where: { id: roleId } });
    if (!role) throw new Error("Role not found");

    const results = [] as any[];
    for (const p of permissions) {
      const model = p.model as keyof typeof AppModel;
      if (!(model in AppModel)) continue;
      const appModel = AppModel[model];
      const rec = await prisma.rolePermission.upsert({
        where: { roleId_model: { roleId, model: appModel } },
        update: {
          can_view: Boolean(p.can_view),
          can_create: Boolean(p.can_create),
          can_update: Boolean(p.can_update),
          can_delete: Boolean(p.can_delete),
        },
        create: {
          roleId,
          model: appModel,
          can_view: Boolean(p.can_view),
          can_create: Boolean(p.can_create),
          can_update: Boolean(p.can_update),
          can_delete: Boolean(p.can_delete),
        },
      });
      results.push(rec);
    }
    return results;
  }

  static async getPermissions(roleId: string) {
    return prisma.rolePermission.findMany({ where: { roleId } });
  }
}
