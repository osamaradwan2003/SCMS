import { Router } from "express";
import GuardianController from "./controllers/Guardian";

const routes = Router();

// Create guardian
routes.post("/", GuardianController.create as any);

// Get all guardians
routes.get("/", GuardianController.getAll as any);

// Get paginated guardians
routes.get("/paginate", GuardianController.paginate as any);

// Search guardians
routes.get("/search", GuardianController.search as any);

// Get guardian by ID
routes.get("/:id", GuardianController.getById as any);

// Update guardian
routes.put("/:id", GuardianController.update as any);

// Delete guardian
routes.delete("/:id", GuardianController.delete as any);

// Delete multiple guardians
routes.delete("/", GuardianController.deleteMany as any);

// Find guardians by phone
routes.get("/phone/:phone", GuardianController.findByPhone as any);

// Upload files to existing guardian
routes.post("/:id/upload", GuardianController.uploadFiles as any);

export default routes;
