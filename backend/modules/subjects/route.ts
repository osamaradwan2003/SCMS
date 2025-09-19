import { Router } from "express";
import SubjectController from "./controllers/Subject";
import { checkLogin } from "@/middleware/auth";
import { checkPermission } from "@/middleware/permissions";
import { AppModel } from "@prisma/client";

const routes = Router();

// Create subject
routes.post("/", checkLogin, checkPermission(AppModel.Subject, "create"), SubjectController.create as any);

// Get all subjects
routes.get("/", checkLogin, checkPermission(AppModel.Subject, "view"), SubjectController.getAll as any);

// Get paginated subjects
routes.get("/paginate", checkLogin, checkPermission(AppModel.Subject, "view"), SubjectController.paginate as any);

// Search subjects
routes.get("/search", checkLogin, checkPermission(AppModel.Subject, "view"), SubjectController.search as any);

// Get subjects with counts
routes.get("/counts", checkLogin, checkPermission(AppModel.Subject, "view"), SubjectController.getWithCounts as any);

// Get subjects by class
routes.get("/class/:classId", checkLogin, checkPermission(AppModel.Subject, "view"), SubjectController.getByClass as any);

// Get subject by ID
routes.get("/:id", checkLogin, checkPermission(AppModel.Subject, "view"), SubjectController.getById as any);

// Update subject
routes.put("/:id", checkLogin, checkPermission(AppModel.Subject, "update"), SubjectController.update as any);

// Delete subject
routes.delete("/:id", checkLogin, checkPermission(AppModel.Subject, "delete"), SubjectController.delete as any);

// Delete multiple subjects
routes.delete("/", checkLogin, checkPermission(AppModel.Subject, "delete"), SubjectController.deleteMany as any);

export default routes;
