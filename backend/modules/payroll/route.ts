import { Router } from "express";
import PayrollController from "./controllers/Payroll";
import { checkLogin } from "@/middleware/auth";
import { checkPermission } from "@/middleware/permissions";
import { AppModel } from "@prisma/client";

const routes = Router();

// Create payroll
routes.post("/", checkLogin, checkPermission(AppModel.Payroll, "create"), PayrollController.create as any);

// Get all payrolls
routes.get("/", checkLogin, checkPermission(AppModel.Payroll, "view"), PayrollController.getAll as any);

// Get paginated payrolls
routes.get("/paginate", checkLogin, checkPermission(AppModel.Payroll, "view"), PayrollController.paginate as any);

// Search payrolls
routes.get("/search", checkLogin, checkPermission(AppModel.Payroll, "view"), PayrollController.search as any);

// Get payroll statistics
routes.get("/statistics", checkLogin, checkPermission(AppModel.Payroll, "view"), PayrollController.getStatistics as any);

// Get monthly payroll summary
routes.get("/monthly-summary", checkLogin, checkPermission(AppModel.Payroll, "view"), PayrollController.getMonthlyPayrollSummary as any);

// Get payrolls by month and year
routes.get("/month-year", checkLogin, checkPermission(AppModel.Payroll, "view"), PayrollController.getByMonthYear as any);

// Get payrolls by date range
routes.get("/date-range", checkLogin, checkPermission(AppModel.Payroll, "view"), PayrollController.getByDateRange as any);

// Get payrolls by employee
routes.get("/employee/:employeeId", checkLogin, checkPermission(AppModel.Payroll, "view"), PayrollController.getByEmployee as any);

// Get employee payroll summary
routes.get("/employee/:employeeId/summary", checkLogin, checkPermission(AppModel.Payroll, "view"), PayrollController.getEmployeePayrollSummary as any);

// Get payroll by ID
routes.get("/:id", checkLogin, checkPermission(AppModel.Payroll, "view"), PayrollController.getById as any);

// Update payroll
routes.put("/:id", checkLogin, checkPermission(AppModel.Payroll, "update"), PayrollController.update as any);

// Delete payroll
routes.delete("/:id", checkLogin, checkPermission(AppModel.Payroll, "delete"), PayrollController.delete as any);

// Delete multiple payrolls
routes.delete("/", checkLogin, checkPermission(AppModel.Payroll, "delete"), PayrollController.deleteMany as any);

export default routes;
