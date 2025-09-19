import { Router } from "express";
import RoleController from "./controllers/Role";
import { checkLogin } from "@/middleware/auth";
import { superadminOnly } from "@/middleware/superadmin";

const routes = Router();

// Roles CRUD (superadmin only)
routes.post("/", checkLogin, superadminOnly, RoleController.create as any);
routes.get("/", checkLogin, superadminOnly, RoleController.getAll as any);
routes.get("/:id", checkLogin, superadminOnly, RoleController.getById as any);
routes.put("/:id", checkLogin, superadminOnly, RoleController.update as any);
routes.delete("/:id", checkLogin, superadminOnly, RoleController.delete as any);

// Manage role permissions (upsert per model)
routes.post("/:id/permissions", checkLogin, superadminOnly, RoleController.upsertPermissions as any);
routes.get("/:id/permissions", checkLogin, superadminOnly, RoleController.getPermissions as any);

export default routes;
