import { Router } from "express";
import AttendanceController from "./controllers/Attendance";
import { checkLogin } from "@/middleware/auth";
import { checkPermission } from "@/middleware/permissions";
import { AppModel } from "@prisma/client";

const routes = Router();

// Student Attendance Routes
routes.post(
  "/students",
  checkLogin,
  checkPermission(AppModel.StuednAttendance, "create"),
  AttendanceController.createStudentAttendance as any
);
routes.get(
  "/students/:id",
  checkLogin,
  checkPermission(AppModel.StuednAttendance, "view"),
  AttendanceController.getStudentAttendanceById as any
);
routes.put(
  "/students/:id",
  checkLogin,
  checkPermission(AppModel.StuednAttendance, "update"),
  AttendanceController.updateStudentAttendance as any
);
routes.delete(
  "/students/:id",
  checkLogin,
  checkPermission(AppModel.StuednAttendance, "delete"),
  AttendanceController.deleteStudentAttendance as any
);
routes.get(
  "/students/by-student/:studentId",
  checkLogin,
  checkPermission(AppModel.StuednAttendance, "view"),
  AttendanceController.getStudentAttendanceByStudent as any
);
routes.get(
  "/students/date-range",
  checkLogin,
  checkPermission(AppModel.StuednAttendance, "view"),
  AttendanceController.getStudentAttendanceByDateRange as any
);
routes.post(
  "/students/bulk",
  checkLogin,
  checkPermission(AppModel.StuednAttendance, "create"),
  AttendanceController.createBulkStudentAttendance as any
);
routes.get(
  "/students/statistics",
  checkLogin,
  checkPermission(AppModel.StuednAttendance, "view"),
  AttendanceController.getStudentAttendanceStatistics as any
);

// Employee Attendance Routes
routes.post(
  "/employees",
  checkLogin,
  checkPermission(AppModel.EmployeeAttendance, "create"),
  AttendanceController.createEmployeeAttendance as any
);
routes.get(
  "/employees/:id",
  checkLogin,
  checkPermission(AppModel.EmployeeAttendance, "view"),
  AttendanceController.getEmployeeAttendanceById as any
);
routes.put(
  "/employees/:id",
  checkLogin,
  checkPermission(AppModel.EmployeeAttendance, "update"),
  AttendanceController.updateEmployeeAttendance as any
);
routes.delete(
  "/employees/:id",
  checkLogin,
  checkPermission(AppModel.EmployeeAttendance, "delete"),
  AttendanceController.deleteEmployeeAttendance as any
);
routes.get(
  "/employees/by-employee/:employeeId",
  checkLogin,
  checkPermission(AppModel.EmployeeAttendance, "view"),
  AttendanceController.getEmployeeAttendanceByEmployee as any
);
routes.get(
  "/employees/date-range",
  checkLogin,
  checkPermission(AppModel.EmployeeAttendance, "view"),
  AttendanceController.getEmployeeAttendanceByDateRange as any
);
routes.post(
  "/employees/bulk",
  checkLogin,
  checkPermission(AppModel.EmployeeAttendance, "create"),
  AttendanceController.createBulkEmployeeAttendance as any
);
routes.get(
  "/employees/statistics",
  checkLogin,
  checkPermission(AppModel.EmployeeAttendance, "view"),
  AttendanceController.getEmployeeAttendanceStatistics as any
);

export default routes;
