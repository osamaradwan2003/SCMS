import { Response } from "express";
import { RequestWithUser } from "@/@types/auth";
import RoleService from "../services/Role";

export default class RoleController {
  static async create(req: RequestWithUser, res: Response) {
    try {
      const { name, description, isSystem, permissions } = req.body;
      const role = await RoleService.create({
        name,
        description,
        isSystem: Boolean(isSystem),
        permissions: permissions ?? null,
        createdById: req.user.id,
      });
      res.status(201).send({ message: "Role created", data: role });
    } catch (e: any) {
      res.status(400).send({ message: e.message });
    }
  }

  static async getAll(_req: RequestWithUser, res: Response) {
    const roles = await RoleService.getAll();
    res.send({ data: roles });
  }

  static async getById(req: RequestWithUser, res: Response) {
    try {
      const role = await RoleService.getById(req.params.id);
      res.send({ data: role });
    } catch (e: any) {
      res.status(404).send({ message: e.message });
    }
  }

  static async update(req: RequestWithUser, res: Response) {
    try {
      const { name, description, permissions } = req.body;
      const role = await RoleService.update(req.params.id, {
        name,
        description,
        permissions,
      });
      res.send({ message: "Role updated", data: role });
    } catch (e: any) {
      res.status(400).send({ message: e.message });
    }
  }

  static async delete(req: RequestWithUser, res: Response) {
    try {
      await RoleService.delete(req.params.id);
      res.send({ message: "Role deleted" });
    } catch (e: any) {
      res.status(400).send({ message: e.message });
    }
  }

  static async upsertPermissions(req: RequestWithUser, res: Response) {
    try {
      const roleId = req.params.id;
      const { permissions } = req.body as {
        permissions: Array<{
          model: string;
          can_view?: boolean;
          can_create?: boolean;
          can_update?: boolean;
          can_delete?: boolean;
        }>;
      };
      const updated = await RoleService.upsertPermissions(roleId, permissions);
      res.send({ message: "Permissions updated", data: updated });
    } catch (e: any) {
      res.status(400).send({ message: e.message });
    }
  }

  static async getPermissions(req: RequestWithUser, res: Response) {
    try {
      const roleId = req.params.id;
      const perms = await RoleService.getPermissions(roleId);
      res.send({ data: perms });
    } catch (e: any) {
      res.status(400).send({ message: e.message });
    }
  }
}
