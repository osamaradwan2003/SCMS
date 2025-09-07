import { Router } from "express";
import PayrollController from "./controllers/Payroll";

const routes = Router();

// Create payroll
routes.post("/", PayrollController.create as any);

// Get all payrolls
routes.get("/", PayrollController.getAll as any);

// Get paginated payrolls
routes.get("/paginate", PayrollController.paginate as any);

// Search payrolls
routes.get("/search", PayrollController.search as any);

// Get payroll statistics
routes.get("/statistics", PayrollController.getStatistics as any);

// Get monthly payroll summary
routes.get("/monthly-summary", PayrollController.getMonthlyPayrollSummary as any);

// Get payrolls by month and year
routes.get("/month-year", PayrollController.getByMonthYear as any);

// Get payrolls by date range
routes.get("/date-range", PayrollController.getByDateRange as any);

// Get payrolls by employee
routes.get("/employee/:employeeId", PayrollController.getByEmployee as any);

// Get employee payroll summary
routes.get("/employee/:employeeId/summary", PayrollController.getEmployeePayrollSummary as any);

// Get payroll by ID
routes.get("/:id", PayrollController.getById as any);

// Update payroll
routes.put("/:id", PayrollController.update as any);

// Delete payroll
routes.delete("/:id", PayrollController.delete as any);

// Delete multiple payrolls
routes.delete("/", PayrollController.deleteMany as any);

export default routes;
