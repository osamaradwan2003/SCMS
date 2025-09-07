import { Router } from "express";
import SubjectController from "./controllers/Subject";

const routes = Router();

// Create subject
routes.post("/", SubjectController.create as any);

// Get all subjects
routes.get("/", SubjectController.getAll as any);

// Get paginated subjects
routes.get("/paginate", SubjectController.paginate as any);

// Search subjects
routes.get("/search", SubjectController.search as any);

// Get subjects with counts
routes.get("/counts", SubjectController.getWithCounts as any);

// Get subjects by class
routes.get("/class/:classId", SubjectController.getByClass as any);

// Get subject by ID
routes.get("/:id", SubjectController.getById as any);

// Update subject
routes.put("/:id", SubjectController.update as any);

// Delete subject
routes.delete("/:id", SubjectController.delete as any);

// Delete multiple subjects
routes.delete("/", SubjectController.deleteMany as any);

export default routes;
