import { Router } from "express";
import WeeklyReportController from "./controllers/WeeklyReport";
import { checkLogin } from "@/middleware/auth";
import { checkPermission } from "@/middleware/permissions";
import { AppModel } from "@prisma/client";

const routes = Router();

// Create weekly report
routes.post("/", checkLogin, checkPermission(AppModel.WeeklyReport, "create"), WeeklyReportController.create as any);

// Get all weekly reports
routes.get("/", checkLogin, checkPermission(AppModel.WeeklyReport, "view"), WeeklyReportController.getAll as any);

// Get paginated weekly reports
routes.get("/paginate", checkLogin, checkPermission(AppModel.WeeklyReport, "view"), WeeklyReportController.paginate as any);

// Search weekly reports
routes.get("/search", checkLogin, checkPermission(AppModel.WeeklyReport, "view"), WeeklyReportController.search as any);

// Get weekly report statistics
routes.get("/statistics", checkLogin, checkPermission(AppModel.WeeklyReport, "view"), WeeklyReportController.getStatistics as any);

// Get reports by week and year
routes.get("/week-year", checkLogin, checkPermission(AppModel.WeeklyReport, "view"), WeeklyReportController.getByWeekYear as any);

// Get reports by student
routes.get("/student/:studentId", checkLogin, checkPermission(AppModel.WeeklyReport, "view"), WeeklyReportController.getByStudent as any);

// Get student performance summary
routes.get("/student/:studentId/performance", checkLogin, checkPermission(AppModel.WeeklyReport, "view"), WeeklyReportController.getStudentPerformanceSummary as any);

// Get reports by subject
routes.get("/subject/:subjectId", checkLogin, checkPermission(AppModel.WeeklyReport, "view"), WeeklyReportController.getBySubject as any);

// Get class performance summary
routes.get("/class/:classId/performance", checkLogin, checkPermission(AppModel.WeeklyReport, "view"), WeeklyReportController.getClassPerformanceSummary as any);

// Get reports by student and subject
routes.get("/student/:studentId/subject/:subjectId", checkLogin, checkPermission(AppModel.WeeklyReport, "view"), WeeklyReportController.getByStudentSubject as any);

// Get weekly report by ID
routes.get("/:id", checkLogin, checkPermission(AppModel.WeeklyReport, "view"), WeeklyReportController.getById as any);

// Update weekly report
routes.put("/:id", checkLogin, checkPermission(AppModel.WeeklyReport, "update"), WeeklyReportController.update as any);

// Delete weekly report
routes.delete("/:id", checkLogin, checkPermission(AppModel.WeeklyReport, "delete"), WeeklyReportController.delete as any);

// Delete multiple weekly reports
routes.delete("/", checkLogin, checkPermission(AppModel.WeeklyReport, "delete"), WeeklyReportController.deleteMany as any);

export default routes;
