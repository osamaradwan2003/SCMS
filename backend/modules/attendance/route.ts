import { Router } from "express";
import AttendanceController from "./controllers/Attendance";

const routes = Router();

// Student Attendance Routes
routes.post("/students", AttendanceController.createStudentAttendance as any);
routes.get("/students/:id", AttendanceController.getStudentAttendanceById as any);
routes.put("/students/:id", AttendanceController.updateStudentAttendance as any);
routes.delete("/students/:id", AttendanceController.deleteStudentAttendance as any);
routes.get("/students/by-student/:studentId", AttendanceController.getStudentAttendanceByStudent as any);
routes.get("/students/date-range", AttendanceController.getStudentAttendanceByDateRange as any);
routes.post("/students/bulk", AttendanceController.createBulkStudentAttendance as any);
routes.get("/students/statistics", AttendanceController.getStudentAttendanceStatistics as any);

// Employee Attendance Routes
routes.post("/employees", AttendanceController.createEmployeeAttendance as any);
routes.get("/employees/:id", AttendanceController.getEmployeeAttendanceById as any);
routes.put("/employees/:id", AttendanceController.updateEmployeeAttendance as any);
routes.delete("/employees/:id", AttendanceController.deleteEmployeeAttendance as any);
routes.get("/employees/by-employee/:employeeId", AttendanceController.getEmployeeAttendanceByEmployee as any);
routes.get("/employees/date-range", AttendanceController.getEmployeeAttendanceByDateRange as any);
routes.post("/employees/bulk", AttendanceController.createBulkEmployeeAttendance as any);
routes.get("/employees/statistics", AttendanceController.getEmployeeAttendanceStatistics as any);

export default routes;
