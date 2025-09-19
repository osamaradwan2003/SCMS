import { Router } from "express";
import DepartmentController from "./controllers/Department";
import { checkLogin } from "@/middleware/auth";
import { checkPermission } from "@/middleware/permissions";
import { AppModel } from "@prisma/client";

const routes = Router();

// Create department
routes.post(
  "/",
  checkLogin,
  checkPermission(AppModel.Department, "create"),
  DepartmentController.create as any
);

// Get all departments
routes.get(
  "/",
  checkLogin,
  checkPermission(AppModel.Department, "view"),
  DepartmentController.getAll as any
);

// Get departments list (for dropdowns)
routes.get(
  "/list",
  checkLogin,
  checkPermission(AppModel.Department, "view"),
  DepartmentController.getList as any
);

// Get departments with managers
routes.get(
  "/with-managers",
  checkLogin,
  checkPermission(AppModel.Department, "view"),
  DepartmentController.getWithManagers as any
);

// Get paginated departments
routes.get(
  "/paginate",
  checkLogin,
  checkPermission(AppModel.Department, "view"),
  DepartmentController.paginate as any
);

// Search departments
routes.get(
  "/search",
  checkLogin,
  checkPermission(AppModel.Department, "view"),
  DepartmentController.search as any
);

// Get department by ID
routes.get(
  "/:id",
  checkLogin,
  checkPermission(AppModel.Department, "view"),
  DepartmentController.getById as any
);

// Get department statistics
routes.get(
  "/:id/stats",
  checkLogin,
  checkPermission(AppModel.Department, "view"),
  DepartmentController.getStats as any
);

// Get department employees
routes.get(
  "/:id/employees",
  checkLogin,
  checkPermission(AppModel.Department, "view"),
  DepartmentController.getEmployees as any
);

// Update department
routes.put(
  "/:id",
  checkLogin,
  checkPermission(AppModel.Department, "update"),
  DepartmentController.update as any
);

// Assign manager to department
routes.patch(
  "/:id/manager",
  checkLogin,
  checkPermission(AppModel.Department, "update"),
  DepartmentController.assignManager as any
);

// Remove manager from department
routes.delete(
  "/:id/manager",
  checkLogin,
  checkPermission(AppModel.Department, "update"),
  DepartmentController.removeManager as any
);

// Delete department
routes.delete(
  "/:id",
  checkLogin,
  checkPermission(AppModel.Department, "delete"),
  DepartmentController.delete as any
);

// Bulk delete departments
routes.delete(
  "/",
  checkLogin,
  checkPermission(AppModel.Department, "delete"),
  DepartmentController.deleteMany as any
);

export default routes;
