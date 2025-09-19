import { NextFunction, Response } from "express";
import { prisma } from "@/db/client";
import { RequestWithUser } from "@/@types/auth";
import { AppModel } from "@prisma/client";

export type PermissionAction = "view" | "create" | "update" | "delete";

function combinePermissions(
  roleAgg: { can_view: boolean; can_create: boolean; can_update: boolean; can_delete: boolean },
  override?: { can_view: boolean; can_create: boolean; can_update: boolean; can_delete: boolean }
) {
  if (!override) return roleAgg;
  return {
    can_view: override.can_view ?? roleAgg.can_view,
    can_create: override.can_create ?? roleAgg.can_create,
    can_update: override.can_update ?? roleAgg.can_update,
    can_delete: override.can_delete ?? roleAgg.can_delete,
  };
}

export function checkPermission(model: AppModel, action: PermissionAction) {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id) {
        res.status(401).send({ message: "Unauthorized" });
        return;
      }

      const userId = req.user.id;

      // Load roles with RolePermission for the given model and potential UserPermission override
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          roles: {
            select: {
              rolePermissions: {
                where: { model },
                select: { can_view: true, can_create: true, can_update: true, can_delete: true },
              },
            },
          },
          userPermissions: {
            where: { model },
            select: { can_view: true, can_create: true, can_update: true, can_delete: true },
          },
        },
      });

      if (!user) {
        res.status(401).send({ message: "Unauthorized" });
        return;
      }

      // Aggregate role permissions (OR logic across roles)
      let agg = { can_view: false, can_create: false, can_update: false, can_delete: false };
      for (const r of user.roles) {
        const rp = r.rolePermissions?.[0];
        if (!rp) continue;
        agg.can_view ||= rp.can_view;
        agg.can_create ||= rp.can_create;
        agg.can_update ||= rp.can_update;
        agg.can_delete ||= rp.can_delete;
      }

      // Apply user override if exists (override fields take precedence when provided)
      const override = user.userPermissions?.[0];
      const eff = combinePermissions(agg, override);

      const allowed =
        (action === "view" && eff.can_view) ||
        (action === "create" && eff.can_create) ||
        (action === "update" && eff.can_update) ||
        (action === "delete" && eff.can_delete);

      if (!allowed) {
        res.status(403).send({ message: "Forbidden: insufficient permissions" });
        return;
      }

      next();
      return;
    } catch (err) {
      res.status(500).send({ message: "Permission check failed", error: (err as Error).message });
      return;
    }
  };
}
