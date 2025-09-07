import { Response } from "express";
import EmployeeServices from "../services/Employee";
import { RequestWithUser } from "@/@types/auth";

export default class EmployeeController {
  // Create employee
  static async create(req: RequestWithUser, res: Response) {
    const { name, role, is_teacher, joinDate, salary, classId } = req.body;
    
    if (!name || !role || joinDate === undefined || salary === undefined) {
      return res.status(400).send({
        message: "Name, role, join date, and salary are required",
      });
    }

    try {
      const employee = await EmployeeServices.createEmployee(
        name,
        role,
        is_teacher || false,
        new Date(joinDate),
        parseFloat(salary),
        classId || null,
        req.user.id
      );
      res.status(201).send({
        message: "Employee created successfully",
        data: employee,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get all employees
  static async getAll(req: RequestWithUser, res: Response) {
    try {
      const employees = await EmployeeServices.getAllEmployees();
      res.send({
        message: "Employees retrieved successfully",
        data: employees,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get employee by ID
  static async getById(req: RequestWithUser, res: Response) {
    const { id } = req.params;

    try {
      const employee = await EmployeeServices.findById(id);
      res.send({
        message: "Employee retrieved successfully",
        data: employee,
      });
    } catch (error: any) {
      res.status(404).send({ message: error.message });
    }
  }

  // Update employee
  static async update(req: RequestWithUser, res: Response) {
    const { id } = req.params;
    const { name, role, is_teacher, joinDate, salary, classId } = req.body;

    try {
      const employee = await EmployeeServices.updateEmployee(id, {
        name,
        role,
        is_teacher,
        joinDate: joinDate ? new Date(joinDate) : undefined,
        salary: salary ? parseFloat(salary) : undefined,
        classId,
      });
      res.send({
        message: "Employee updated successfully",
        data: employee,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Delete employee
  static async delete(req: RequestWithUser, res: Response) {
    const { id } = req.params;

    try {
      await EmployeeServices.deleteEmployee(id);
      res.send({
        message: "Employee deleted successfully",
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get paginated employees
  static async paginate(req: RequestWithUser, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
      const result = await EmployeeServices.paginate(page, limit);
      res.send({
        message: "Employees retrieved successfully",
        ...result,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Search employees
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
      const result = await EmployeeServices.paginateSearched(
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

  // Delete multiple employees
  static async deleteMany(req: RequestWithUser, res: Response) {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send({
        message: "Array of employee IDs is required",
      });
    }

    try {
      const result = await EmployeeServices.deleteMany(ids);
      res.send({
        message: `${result.count} employees deleted successfully`,
        deletedCount: result.count,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get teachers only
  static async getTeachers(req: RequestWithUser, res: Response) {
    try {
      const teachers = await EmployeeServices.getTeachers();
      res.send({
        message: "Teachers retrieved successfully",
        data: teachers,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get employees by role
  static async getByRole(req: RequestWithUser, res: Response) {
    const { role } = req.params;

    try {
      const employees = await EmployeeServices.getByRole(role);
      res.send({
        message: "Employees retrieved successfully",
        data: employees,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get employee statistics
  static async getStatistics(req: RequestWithUser, res: Response) {
    try {
      const statistics = await EmployeeServices.getStatistics();
      res.send({
        message: "Employee statistics retrieved successfully",
        data: statistics,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }
}
