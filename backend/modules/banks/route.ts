import { Router } from "express";
import BankController from "./controllers/Bank";

const routes = Router();

// Create bank
routes.post("/", BankController.create as any);

// Get all banks
routes.get("/", BankController.getAll as any);

// Get paginated banks
routes.get("/paginate", BankController.paginate as any);

// Search banks
routes.get("/search", BankController.search as any);

// Get bank statistics
routes.get("/statistics", BankController.getStatistics as any);

// Get bank by ID
routes.get("/:id", BankController.getById as any);

// Update bank
routes.put("/:id", BankController.update as any);

// Update bank balance
routes.patch("/:id/balance", BankController.updateBalance as any);

// Delete bank
routes.delete("/:id", BankController.delete as any);

// Delete multiple banks
routes.delete("/", BankController.deleteMany as any);

export default routes;
