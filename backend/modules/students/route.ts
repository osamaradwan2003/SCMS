import { Router } from "express";
import StudentController from "./controllers/Student";
import { checkLogin } from "@/middleware/auth";
import { checkPermission } from "@/middleware/permissions";
import { AppModel } from "@prisma/client";

const routes = Router();

// Create student
routes.post("/", checkLogin, checkPermission(AppModel.Student, "create"), StudentController.create as any);

// Get all students
routes.get("/", checkLogin, checkPermission(AppModel.Student, "view"), StudentController.getAll as any);

// Get paginated students
routes.get("/paginate", checkLogin, checkPermission(AppModel.Student, "view"), StudentController.paginate as any);

// Search students
routes.get("/search", checkLogin, checkPermission(AppModel.Student, "view"), StudentController.search as any);

// Get students by class
routes.get("/class/:classId", checkLogin, checkPermission(AppModel.Student, "view"), StudentController.getByClass as any);

// Get students by guardian
routes.get("/guardian/:guardianId", checkLogin, checkPermission(AppModel.Student, "view"), StudentController.getByGuardian as any);

// Get student by ID
routes.get("/:id", checkLogin, checkPermission(AppModel.Student, "view"), StudentController.getById as any);

// Update student
routes.put("/:id", checkLogin, checkPermission(AppModel.Student, "update"), StudentController.update as any);

// Delete student
routes.delete("/:id", checkLogin, checkPermission(AppModel.Student, "delete"), StudentController.delete as any);

// Delete multiple students
routes.delete("/", checkLogin, checkPermission(AppModel.Student, "delete"), StudentController.deleteMany as any);

export default routes;
