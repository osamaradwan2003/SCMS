import { Router } from "express";
import BankController from "./controllers/Bank";
import { checkLogin } from "@/middleware/auth";
import { checkPermission } from "@/middleware/permissions";
import { AppModel } from "@prisma/client";

const routes = Router();

// Create bank
routes.post("/", checkLogin, checkPermission(AppModel.Bank, "create"), BankController.create as any);

// Get all banks
routes.get("/", checkLogin, checkPermission(AppModel.Bank, "view"), BankController.getAll as any);

// Get paginated banks
routes.get("/paginate", checkLogin, checkPermission(AppModel.Bank, "view"), BankController.paginate as any);

// Search banks
routes.get("/search", checkLogin, checkPermission(AppModel.Bank, "view"), BankController.search as any);

// Get bank statistics
routes.get("/statistics", checkLogin, checkPermission(AppModel.Bank, "view"), BankController.getStatistics as any);

// Get bank by ID
routes.get("/:id", checkLogin, checkPermission(AppModel.Bank, "view"), BankController.getById as any);

// Update bank
routes.put("/:id", checkLogin, checkPermission(AppModel.Bank, "update"), BankController.update as any);

// Update bank balance
routes.patch("/:id/balance", checkLogin, checkPermission(AppModel.Bank, "update"), BankController.updateBalance as any);

// Delete bank
routes.delete("/:id", checkLogin, checkPermission(AppModel.Bank, "delete"), BankController.delete as any);

// Delete multiple banks
routes.delete("/", checkLogin, checkPermission(AppModel.Bank, "delete"), BankController.deleteMany as any);

export default routes;
