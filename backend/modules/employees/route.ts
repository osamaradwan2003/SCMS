import { Router } from "express";
import EmployeeController from "./controllers/Employee";
import { checkLogin } from "@/middleware/auth";
import { checkPermission } from "@/middleware/permissions";
import { AppModel } from "@prisma/client";

const routes = Router();

// Create employee
routes.post("/", checkLogin, checkPermission(AppModel.Employee, "create"), EmployeeController.create as any);

// Get all employees
routes.get("/", checkLogin, checkPermission(AppModel.Employee, "view"), EmployeeController.getAll as any);

// Get paginated employees
routes.get("/paginate", checkLogin, checkPermission(AppModel.Employee, "view"), EmployeeController.paginate as any);

// Search employees
routes.get("/search", checkLogin, checkPermission(AppModel.Employee, "view"), EmployeeController.search as any);

// Get teachers only
routes.get("/teachers", checkLogin, checkPermission(AppModel.Employee, "view"), EmployeeController.getTeachers as any);

// Get employee statistics
routes.get("/statistics", checkLogin, checkPermission(AppModel.Employee, "view"), EmployeeController.getStatistics as any);

// Get employees by role
routes.get("/role/:role", checkLogin, checkPermission(AppModel.Employee, "view"), EmployeeController.getByRole as any);

// Get employee by ID
routes.get("/:id", checkLogin, checkPermission(AppModel.Employee, "view"), EmployeeController.getById as any);

// Update employee
routes.put("/:id", checkLogin, checkPermission(AppModel.Employee, "update"), EmployeeController.update as any);

// Delete employee
routes.delete("/:id", checkLogin, checkPermission(AppModel.Employee, "delete"), EmployeeController.delete as any);

// Delete multiple employees
routes.delete("/", checkLogin, checkPermission(AppModel.Employee, "delete"), EmployeeController.deleteMany as any);

export default routes;
