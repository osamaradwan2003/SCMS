import { Router } from "express";
import ExpenseTypeController from "./controllers/ExpenseType";
import { checkLogin } from "@/middleware/auth";
import { checkPermission } from "@/middleware/permissions";
import { AppModel } from "@prisma/client";

const routes = Router();

// Create expense type
routes.post("/", checkLogin, checkPermission(AppModel.ExpenseType, "create"), ExpenseTypeController.create as any);

// Get all expense types
routes.get("/", checkLogin, checkPermission(AppModel.ExpenseType, "view"), ExpenseTypeController.getAll as any);

// Get paginated expense types
routes.get("/paginate", checkLogin, checkPermission(AppModel.ExpenseType, "view"), ExpenseTypeController.paginate as any);

// Search expense types
routes.get("/search", checkLogin, checkPermission(AppModel.ExpenseType, "view"), ExpenseTypeController.search as any);

// Get expense type statistics
routes.get("/statistics", checkLogin, checkPermission(AppModel.ExpenseType, "view"), ExpenseTypeController.getStatistics as any);

// Get expense types with counts
routes.get("/counts", checkLogin, checkPermission(AppModel.ExpenseType, "view"), ExpenseTypeController.getWithCounts as any);

// Get expense type by ID
routes.get("/:id", checkLogin, checkPermission(AppModel.ExpenseType, "view"), ExpenseTypeController.getById as any);

// Update expense type
routes.put("/:id", checkLogin, checkPermission(AppModel.ExpenseType, "update"), ExpenseTypeController.update as any);

// Delete expense type
routes.delete("/:id", checkLogin, checkPermission(AppModel.ExpenseType, "delete"), ExpenseTypeController.delete as any);

// Delete multiple expense types
routes.delete("/", checkLogin, checkPermission(AppModel.ExpenseType, "delete"), ExpenseTypeController.deleteMany as any);

export default routes;
