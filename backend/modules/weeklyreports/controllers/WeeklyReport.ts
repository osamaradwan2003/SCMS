import { Response } from "express";
import WeeklyReportServices from "../services/WeeklyReport";
import { RequestWithUser } from "@/@types/auth";

export default class WeeklyReportController {
  // Create weekly report
  static async create(req: RequestWithUser, res: Response) {
    const { studentId, subjectId, week, strengths, weaknesses, score, adherence } = req.body;
    
    if (!studentId || !subjectId || !week || score === undefined) {
      return res.status(400).send({
        message: "Student ID, subject ID, week, and score are required",
      });
    }

    try {
      const report = await WeeklyReportServices.createWeeklyReport(
        studentId,
        subjectId,
        new Date(week),
        strengths || '',
        weaknesses || '',
        parseFloat(score),
        adherence || '',
        req.user.id,
        req.user.id
      );
      res.status(201).send({
        message: "Weekly report created successfully",
        data: report,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get all weekly reports
  static async getAll(req: RequestWithUser, res: Response) {
    try {
      const reports = await WeeklyReportServices.getAllWeeklyReports();
      res.send({
        message: "Weekly reports retrieved successfully",
        data: reports,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get weekly report by ID
  static async getById(req: RequestWithUser, res: Response) {
    const { id } = req.params;

    try {
      const report = await WeeklyReportServices.findById(id);
      res.send({
        message: "Weekly report retrieved successfully",
        data: report,
      });
    } catch (error: any) {
      res.status(404).send({ message: error.message });
    }
  }

  // Update weekly report
  static async update(req: RequestWithUser, res: Response) {
    const { id } = req.params;
    const { score, strengths, weaknesses, adherence, week } = req.body;

    try {
      const report = await WeeklyReportServices.updateWeeklyReport(id, {
        score: score ? parseFloat(score) : undefined,
        strengths,
        weaknesses,
        adherence,
        week: week ? new Date(week) : undefined,
      });
      res.send({
        message: "Weekly report updated successfully",
        data: report,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Delete weekly report
  static async delete(req: RequestWithUser, res: Response) {
    const { id } = req.params;

    try {
      await WeeklyReportServices.deleteWeeklyReport(id);
      res.send({
        message: "Weekly report deleted successfully",
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get paginated weekly reports
  static async paginate(req: RequestWithUser, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
      const result = await WeeklyReportServices.paginate(page, limit);
      res.send({
        message: "Weekly reports retrieved successfully",
        ...result,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Search weekly reports
  static async search(req: RequestWithUser, res: Response) {
    const { q: search } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!search) {
      return res.status(400).send({
        message: "Search query is required",
      });
    }

    try {
      const result = await WeeklyReportServices.paginateSearched(
        page,
        limit,
        search as string
      );
      res.send({
        message: "Search results retrieved successfully",
        ...result,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get reports by student
  static async getByStudent(req: RequestWithUser, res: Response) {
    const { studentId } = req.params;

    try {
      const reports = await WeeklyReportServices.getByStudent(studentId);
      res.send({
        message: "Student reports retrieved successfully",
        data: reports,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get reports by subject
  static async getBySubject(req: RequestWithUser, res: Response) {
    const { subjectId } = req.params;

    try {
      const reports = await WeeklyReportServices.getBySubject(subjectId);
      res.send({
        message: "Subject reports retrieved successfully",
        data: reports,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get reports by week date range
  static async getByWeekYear(req: RequestWithUser, res: Response) {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).send({
        message: "Start date and end date are required",
      });
    }

    try {
      const reports = await WeeklyReportServices.getByWeekRange(
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.send({
        message: "Weekly reports retrieved successfully",
        data: reports,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get reports by student and subject
  static async getByStudentSubject(req: RequestWithUser, res: Response) {
    const { studentId, subjectId } = req.params;

    try {
      const reports = await WeeklyReportServices.getByStudentSubject(studentId, subjectId);
      res.send({
        message: "Student subject reports retrieved successfully",
        data: reports,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Delete multiple weekly reports
  static async deleteMany(req: RequestWithUser, res: Response) {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send({
        message: "Array of report IDs is required",
      });
    }

    try {
      const result = await WeeklyReportServices.deleteMany(ids);
      res.send({
        message: `${result.count} weekly reports deleted successfully`,
        deletedCount: result.count,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get weekly report statistics
  static async getStatistics(req: RequestWithUser, res: Response) {
    const { startDate, endDate, studentId, subjectId } = req.query;

    try {
      const statistics = await WeeklyReportServices.getStatistics(
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined,
        studentId as string,
        subjectId as string
      );
      res.send({
        message: "Weekly report statistics retrieved successfully",
        data: statistics,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get student performance summary
  static async getStudentPerformanceSummary(req: RequestWithUser, res: Response) {
    const { studentId } = req.params;
    const { year } = req.query;

    try {
      const summary = await WeeklyReportServices.getStudentPerformanceSummary(
        studentId,
        year ? parseInt(year as string) : undefined
      );
      res.send({
        message: "Student performance summary retrieved successfully",
        data: summary,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get class performance summary
  static async getClassPerformanceSummary(req: RequestWithUser, res: Response) {
    const { classId } = req.params;
    const { week, year } = req.query;

    try {
      const summary = await WeeklyReportServices.getClassPerformanceSummary(
        classId,
        week ? parseInt(week as string) : undefined,
        year ? parseInt(year as string) : undefined
      );
      res.send({
        message: "Class performance summary retrieved successfully",
        data: summary,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }
}
