import { Router } from "express";
import WeeklyReportController from "./controllers/WeeklyReport";

const routes = Router();

// Create weekly report
routes.post("/", WeeklyReportController.create as any);

// Get all weekly reports
routes.get("/", WeeklyReportController.getAll as any);

// Get paginated weekly reports
routes.get("/paginate", WeeklyReportController.paginate as any);

// Search weekly reports
routes.get("/search", WeeklyReportController.search as any);

// Get weekly report statistics
routes.get("/statistics", WeeklyReportController.getStatistics as any);

// Get reports by week and year
routes.get("/week-year", WeeklyReportController.getByWeekYear as any);

// Get reports by student
routes.get("/student/:studentId", WeeklyReportController.getByStudent as any);

// Get student performance summary
routes.get("/student/:studentId/performance", WeeklyReportController.getStudentPerformanceSummary as any);

// Get reports by subject
routes.get("/subject/:subjectId", WeeklyReportController.getBySubject as any);

// Get class performance summary
routes.get("/class/:classId/performance", WeeklyReportController.getClassPerformanceSummary as any);

// Get reports by student and subject
routes.get("/student/:studentId/subject/:subjectId", WeeklyReportController.getByStudentSubject as any);

// Get weekly report by ID
routes.get("/:id", WeeklyReportController.getById as any);

// Update weekly report
routes.put("/:id", WeeklyReportController.update as any);

// Delete weekly report
routes.delete("/:id", WeeklyReportController.delete as any);

// Delete multiple weekly reports
routes.delete("/", WeeklyReportController.deleteMany as any);

export default routes;
