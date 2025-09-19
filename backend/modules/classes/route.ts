import { Router } from "express";
import ClassController from "./controllers/Class";
import { checkLogin } from "@/middleware/auth";
import { checkPermission } from "@/middleware/permissions";
import { AppModel } from "@prisma/client";

const routes = Router();

// Create class
routes.post("/", checkLogin, checkPermission(AppModel.Class, "create"), ClassController.create as any);

// Get all classes
routes.get("/", checkLogin, checkPermission(AppModel.Class, "view"), ClassController.getAll as any);

// Get paginated classes
routes.get("/paginate", checkLogin, checkPermission(AppModel.Class, "view"), ClassController.paginate as any);

// Search classes
routes.get("/search", checkLogin, checkPermission(AppModel.Class, "view"), ClassController.search as any);

// Get classes with counts
routes.get("/counts", checkLogin, checkPermission(AppModel.Class, "view"), ClassController.getWithCounts as any);

// Get class by ID
routes.get("/:id", checkLogin, checkPermission(AppModel.Class, "view"), ClassController.getById as any);

// Update class
routes.put("/:id", checkLogin, checkPermission(AppModel.Class, "update"), ClassController.update as any);

// Delete class
routes.delete("/:id", checkLogin, checkPermission(AppModel.Class, "delete"), ClassController.delete as any);

// Add subjects to class
routes.post("/:id/subjects", checkLogin, checkPermission(AppModel.Class, "update"), ClassController.addSubjects as any);

// Remove subjects from class
routes.delete("/:id/subjects", checkLogin, checkPermission(AppModel.Class, "update"), ClassController.removeSubjects as any);

// Delete multiple classes
routes.delete("/", checkLogin, checkPermission(AppModel.Class, "delete"), ClassController.deleteMany as any);

export default routes;
