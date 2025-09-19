import { Router } from "express";
import transactionController from "./controllers/Transaction";
import { checkLogin } from "@/middleware/auth";
import { checkPermission } from "@/middleware/permissions";
import { AppModel } from "@prisma/client";

const routes = Router();

// Create transaction
routes.post("/", checkLogin, checkPermission(AppModel.Transaction, "create"), transactionController.create as any);

// Get all transaction
routes.get("/", checkLogin, checkPermission(AppModel.Transaction, "view"), transactionController.getAll as any);

// Get paginated transaction
routes.get("/paginate", checkLogin, checkPermission(AppModel.Transaction, "view"), transactionController.paginate as any);

// Search transaction
routes.get("/search", checkLogin, checkPermission(AppModel.Transaction, "view"), transactionController.search as any);

// Get transaction statistics
routes.get("/statistics", checkLogin, checkPermission(AppModel.Transaction, "view"), transactionController.getStatistics as any);

// Get transaction by date range
routes.get("/date-range", checkLogin, checkPermission(AppModel.Transaction, "view"), transactionController.getByDateRange as any);

// Get transaction by bank
routes.get("/bank/:bankId", checkLogin, checkPermission(AppModel.Transaction, "view"), transactionController.getByBank as any);

// Get transaction by category
routes.get("/category/:categoryId", checkLogin, checkPermission(AppModel.Transaction, "view"), transactionController.getByCategory as any);

// Get transaction by ID
routes.get("/:id", checkLogin, checkPermission(AppModel.Transaction, "view"), transactionController.getById as any);

// Update transaction
routes.put("/:id", checkLogin, checkPermission(AppModel.Transaction, "update"), transactionController.update as any);

// Delete transaction
routes.delete("/:id", checkLogin, checkPermission(AppModel.Transaction, "delete"), transactionController.delete as any);

export default routes;
