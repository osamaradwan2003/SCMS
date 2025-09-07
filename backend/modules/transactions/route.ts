import { Router } from "express";
import transactionController from "./controllers/Transaction";

const routes = Router();

// Create transaction
routes.post("/", transactionController.create as any);

// Get all transaction
routes.get("/", transactionController.getAll as any);

// Get paginated transaction
routes.get("/paginate", transactionController.paginate as any);

// Search transaction
routes.get("/search", transactionController.search as any);

// Get transaction statistics
routes.get("/statistics", transactionController.getStatistics as any);

// Get transaction by date range
routes.get("/date-range", transactionController.getByDateRange as any);

// Get transaction by bank
routes.get("/bank/:bankId", transactionController.getByBank as any);

// Get transaction by category
routes.get("/category/:categoryId", transactionController.getByCategory as any);

// Get transaction by ID
routes.get("/:id", transactionController.getById as any);

// Update transaction
routes.put("/:id", transactionController.update as any);

// Delete transaction
routes.delete("/:id", transactionController.delete as any);

export default routes;
