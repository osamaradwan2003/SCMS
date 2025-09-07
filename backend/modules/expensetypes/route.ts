import { Router } from "express";
import ExpenseTypeController from "./controllers/ExpenseType";

const routes = Router();

// Create expense type
routes.post("/", ExpenseTypeController.create as any);

// Get all expense types
routes.get("/", ExpenseTypeController.getAll as any);

// Get paginated expense types
routes.get("/paginate", ExpenseTypeController.paginate as any);

// Search expense types
routes.get("/search", ExpenseTypeController.search as any);

// Get expense type statistics
routes.get("/statistics", ExpenseTypeController.getStatistics as any);

// Get expense types with counts
routes.get("/counts", ExpenseTypeController.getWithCounts as any);

// Get expense type by ID
routes.get("/:id", ExpenseTypeController.getById as any);

// Update expense type
routes.put("/:id", ExpenseTypeController.update as any);

// Delete expense type
routes.delete("/:id", ExpenseTypeController.delete as any);

// Delete multiple expense types
routes.delete("/", ExpenseTypeController.deleteMany as any);

export default routes;
