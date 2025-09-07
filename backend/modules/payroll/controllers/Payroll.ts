import { Response } from "express";
import PayrollServices from "../services/Payroll";
import { RequestWithUser } from "@/@types/auth";

export default class PayrollController {
  // Create payroll
  static async create(req: RequestWithUser, res: Response) {
    const { employeeId, amount, month, status } = req.body;
    
    if (!employeeId || amount === undefined || !month) {
      return res.status(400).send({
        message: "Employee ID, amount, and month are required",
      });
    }

    try {
      const payroll = await PayrollServices.createPayroll(
        employeeId,
        parseFloat(amount),
        new Date(month),
        status || 'pending',
        req.user.id
      );
      res.status(201).send({
        message: "Payroll created successfully",
        data: payroll,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get all payrolls
  static async getAll(req: RequestWithUser, res: Response) {
    try {
      const payrolls = await PayrollServices.getAllPayrolls();
      res.send({
        message: "Payrolls retrieved successfully",
        data: payrolls,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get payroll by ID
  static async getById(req: RequestWithUser, res: Response) {
    const { id } = req.params;

    try {
      const payroll = await PayrollServices.findById(id);
      res.send({
        message: "Payroll retrieved successfully",
        data: payroll,
      });
    } catch (error: any) {
      res.status(404).send({ message: error.message });
    }
  }

  // Update payroll
  static async update(req: RequestWithUser, res: Response) {
    const { id } = req.params;
    const { amount, month, status } = req.body;

    try {
      const payroll = await PayrollServices.updatePayroll(id, {
        amount: amount ? parseFloat(amount) : undefined,
        month: month ? new Date(month) : undefined,
        status,
      });
      res.send({
        message: "Payroll updated successfully",
        data: payroll,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Delete payroll
  static async delete(req: RequestWithUser, res: Response) {
    const { id } = req.params;

    try {
      await PayrollServices.deletePayroll(id);
      res.send({
        message: "Payroll deleted successfully",
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get paginated payrolls
  static async paginate(req: RequestWithUser, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
      const result = await PayrollServices.paginate(page, limit);
      res.send({
        message: "Payrolls retrieved successfully",
        ...result,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Search payrolls
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
      const result = await PayrollServices.paginateSearched(
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

  // Get payrolls by employee
  static async getByEmployee(req: RequestWithUser, res: Response) {
    const { employeeId } = req.params;

    try {
      const payrolls = await PayrollServices.getByEmployee(employeeId);
      res.send({
        message: "Employee payrolls retrieved successfully",
        data: payrolls,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get payrolls by date range
  static async getByMonthYear(req: RequestWithUser, res: Response) {
    const { startMonth, startYear, endMonth, endYear } = req.query;

    if (!startMonth || !startYear || !endMonth || !endYear) {
      return res.status(400).send({
        message: "Start month, start year, end month, and end year are required",
      });
    }

    try {
      const payrolls = await PayrollServices.getByDateRange(
        parseInt(startMonth as string),
        parseInt(startYear as string),
        parseInt(endMonth as string),
        parseInt(endYear as string)
      );
      res.send({
        message: "Payrolls retrieved successfully",
        data: payrolls,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get payrolls by date range (alternative endpoint)
  static async getByDateRange(req: RequestWithUser, res: Response) {
    const { startMonth, startYear, endMonth, endYear } = req.query;

    if (!startMonth || !startYear || !endMonth || !endYear) {
      return res.status(400).send({
        message: "Start month, start year, end month, and end year are required",
      });
    }

    try {
      const payrolls = await PayrollServices.getByDateRange(
        parseInt(startMonth as string),
        parseInt(startYear as string),
        parseInt(endMonth as string),
        parseInt(endYear as string)
      );
      res.send({
        message: "Payrolls retrieved successfully",
        data: payrolls,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Delete multiple payrolls
  static async deleteMany(req: RequestWithUser, res: Response) {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send({
        message: "Array of payroll IDs is required",
      });
    }

    try {
      const result = await PayrollServices.deleteMany(ids);
      res.send({
        message: `${result.count} payrolls deleted successfully`,
        deletedCount: result.count,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get payroll statistics
  static async getStatistics(req: RequestWithUser, res: Response) {
    const { month, year } = req.query;

    try {
      const statistics = await PayrollServices.getStatistics(
        month ? parseInt(month as string) : undefined,
        year ? parseInt(year as string) : undefined
      );
      res.send({
        message: "Payroll statistics retrieved successfully",
        data: statistics,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get monthly payroll summary
  static async getMonthlyPayrollSummary(req: RequestWithUser, res: Response) {
    const { year } = req.query;

    if (!year) {
      return res.status(400).send({
        message: "Year is required",
      });
    }

    try {
      const summary = await PayrollServices.getMonthlyPayrollSummary(
        parseInt(year as string)
      );
      res.send({
        message: "Monthly payroll summary retrieved successfully",
        data: summary,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get employee payroll summary
  static async getEmployeePayrollSummary(req: RequestWithUser, res: Response) {
    const { employeeId } = req.params;

    try {
      const summary = await PayrollServices.getEmployeePayrollSummary(employeeId);
      res.send({
        message: "Employee payroll summary retrieved successfully",
        data: summary,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }
}
