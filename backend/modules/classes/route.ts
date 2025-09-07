import { Router } from "express";
import ClassController from "./controllers/Class";

const routes = Router();

// Create class
routes.post("/", ClassController.create as any);

// Get all classes
routes.get("/", ClassController.getAll as any);

// Get paginated classes
routes.get("/paginate", ClassController.paginate as any);

// Search classes
routes.get("/search", ClassController.search as any);

// Get classes with counts
routes.get("/counts", ClassController.getWithCounts as any);

// Get class by ID
routes.get("/:id", ClassController.getById as any);

// Update class
routes.put("/:id", ClassController.update as any);

// Delete class
routes.delete("/:id", ClassController.delete as any);

// Add subjects to class
routes.post("/:id/subjects", ClassController.addSubjects as any);

// Remove subjects from class
routes.delete("/:id/subjects", ClassController.removeSubjects as any);

// Delete multiple classes
routes.delete("/", ClassController.deleteMany as any);

export default routes;
