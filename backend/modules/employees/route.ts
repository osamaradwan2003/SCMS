import { Router } from "express";
import EmployeeController from "./controllers/Employee";

const routes = Router();

// Create employee
routes.post("/", EmployeeController.create as any);

// Get all employees
routes.get("/", EmployeeController.getAll as any);

// Get paginated employees
routes.get("/paginate", EmployeeController.paginate as any);

// Search employees
routes.get("/search", EmployeeController.search as any);

// Get teachers only
routes.get("/teachers", EmployeeController.getTeachers as any);

// Get employee statistics
routes.get("/statistics", EmployeeController.getStatistics as any);

// Get employees by role
routes.get("/role/:role", EmployeeController.getByRole as any);

// Get employee by ID
routes.get("/:id", EmployeeController.getById as any);

// Update employee
routes.put("/:id", EmployeeController.update as any);

// Delete employee
routes.delete("/:id", EmployeeController.delete as any);

// Delete multiple employees
routes.delete("/", EmployeeController.deleteMany as any);

export default routes;
