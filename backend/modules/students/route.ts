import { Router } from "express";
import StudentController from "./controllers/Student";

const routes = Router();

// Create student
routes.post("/", StudentController.create as any);

// Get all students
routes.get("/", StudentController.getAll as any);

// Get paginated students
routes.get("/paginate", StudentController.paginate as any);

// Search students
routes.get("/search", StudentController.search as any);

// Get students by class
routes.get("/class/:classId", StudentController.getByClass as any);

// Get students by guardian
routes.get("/guardian/:guardianId", StudentController.getByGuardian as any);

// Get student by ID
routes.get("/:id", StudentController.getById as any);

// Update student
routes.put("/:id", StudentController.update as any);

// Delete student
routes.delete("/:id", StudentController.delete as any);

// Delete multiple students
routes.delete("/", StudentController.deleteMany as any);

export default routes;
