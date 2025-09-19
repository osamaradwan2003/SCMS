import { Router } from "express";
import GuardianController from "./controllers/Guardian";
import { checkLogin } from "@/middleware/auth";
import { checkPermission } from "@/middleware/permissions";
import { AppModel } from "@prisma/client";

const routes = Router();

// Create guardian
routes.post(
  "/",
  checkLogin,
  checkPermission(AppModel.Guardian, "create"),
  GuardianController.create as any
);

// Get all guardians
routes.get(
  "/",
  checkLogin,
  checkPermission(AppModel.Guardian, "view"),
  GuardianController.getAll as any
);

// Get paginated guardians
routes.get(
  "/paginate",
  checkLogin,
  checkPermission(AppModel.Guardian, "view"),
  GuardianController.paginate as any
);

// Search guardians
routes.get(
  "/search",
  checkLogin,
  checkPermission(AppModel.Guardian, "view"),
  GuardianController.search as any
);

// Get guardian by ID
routes.get(
  "/:id",
  checkLogin,
  checkPermission(AppModel.Guardian, "view"),
  GuardianController.getById as any
);

// Update guardian
routes.put(
  "/:id",
  checkLogin,
  checkPermission(AppModel.Guardian, "update"),
  GuardianController.update as any
);

// Delete guardian
routes.delete(
  "/:id",
  checkLogin,
  checkPermission(AppModel.Guardian, "delete"),
  GuardianController.delete as any
);

// Delete multiple guardians
routes.delete(
  "/",
  checkLogin,
  checkPermission(AppModel.Guardian, "delete"),
  GuardianController.deleteMany as any
);

// Find guardians by phone
routes.get(
  "/phone/:phone",
  checkLogin,
  checkPermission(AppModel.Guardian, "view"),
  GuardianController.findByPhone as any
);

// Upload files to existing guardian
routes.post(
  "/:id/upload",
  checkLogin,
  checkPermission(AppModel.Guardian, "update"),
  GuardianController.uploadFiles as any
);

// Update guardian account username/password
routes.post(
  "/:id/account",
  checkLogin,
  checkPermission(AppModel.Guardian, "update"),
  GuardianController.updateAccount as any
);

export default routes;
