import { Router } from "express";
import IncomeTypeController from "./controllers/IncomeType";

const routes = Router();

// Create income type
routes.post("/", IncomeTypeController.create as any);

// Get all income types
routes.get("/", IncomeTypeController.getAll as any);

// Get paginated income types
routes.get("/paginate", IncomeTypeController.paginate as any);

// Search income types
routes.get("/search", IncomeTypeController.search as any);

// Get income type statistics
routes.get("/statistics", IncomeTypeController.getStatistics as any);

// Get income types with counts
routes.get("/counts", IncomeTypeController.getWithCounts as any);

// Get income type by ID
routes.get("/:id", IncomeTypeController.getById as any);

// Update income type
routes.put("/:id", IncomeTypeController.update as any);

// Delete income type
routes.delete("/:id", IncomeTypeController.delete as any);

// Delete multiple income types
routes.delete("/", IncomeTypeController.deleteMany as any);

export default routes;
