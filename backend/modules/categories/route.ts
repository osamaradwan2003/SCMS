import { Router } from "express";
import CategoryController from "./controllers/Category";

const routes = Router();

// Create category
routes.post("/", CategoryController.create as any);

// Get all categories
routes.get("/", CategoryController.getAll as any);

// Get paginated categories
routes.get("/paginate", CategoryController.paginate as any);

// Search categories
routes.get("/search", CategoryController.search as any);

// Get category statistics
routes.get("/statistics", CategoryController.getStatistics as any);

// Get categories by type
routes.get("/type/:type", CategoryController.getByType as any);

// Get category by ID
routes.get("/:id", CategoryController.getById as any);

// Update category
routes.put("/:id", CategoryController.update as any);

// Delete category
routes.delete("/:id", CategoryController.delete as any);

// Delete multiple categories
routes.delete("/", CategoryController.deleteMany as any);

export default routes;
