import { Router } from "express";
import IncomeTypeController from "./controllers/IncomeType";
import { checkLogin } from "@/middleware/auth";
import { checkPermission } from "@/middleware/permissions";
import { AppModel } from "@prisma/client";

const routes = Router();

// Create income type
routes.post("/", checkLogin, checkPermission(AppModel.IncomeType, "create"), IncomeTypeController.create as any);

// Get all income types
routes.get("/", checkLogin, checkPermission(AppModel.IncomeType, "view"), IncomeTypeController.getAll as any);

// Get paginated income types
routes.get("/paginate", checkLogin, checkPermission(AppModel.IncomeType, "view"), IncomeTypeController.paginate as any);

// Search income types
routes.get("/search", checkLogin, checkPermission(AppModel.IncomeType, "view"), IncomeTypeController.search as any);

// Get income type statistics
routes.get("/statistics", checkLogin, checkPermission(AppModel.IncomeType, "view"), IncomeTypeController.getStatistics as any);

// Get income types with counts
routes.get("/counts", checkLogin, checkPermission(AppModel.IncomeType, "view"), IncomeTypeController.getWithCounts as any);

// Get income type by ID
routes.get("/:id", checkLogin, checkPermission(AppModel.IncomeType, "view"), IncomeTypeController.getById as any);

// Update income type
routes.put("/:id", checkLogin, checkPermission(AppModel.IncomeType, "update"), IncomeTypeController.update as any);

// Delete income type
routes.delete("/:id", checkLogin, checkPermission(AppModel.IncomeType, "delete"), IncomeTypeController.delete as any);

// Delete multiple income types
routes.delete("/", checkLogin, checkPermission(AppModel.IncomeType, "delete"), IncomeTypeController.deleteMany as any);

export default routes;
