import { Response } from "express";
import EmployeeServices from "../services/Employee";
import { RequestWithUser } from "@/@types/auth";
import type { UploadedFile } from "express-fileupload";
import fs from "fs";

export default class EmployeeController {
  // Minimal helper to save uploaded file to disk and return relative path
  private static uploadFile(file: UploadedFile): string {
    if (!file) throw new Error("No file uploaded");
    const parts = file.name.split(".");
    const ext = parts.length > 1 ? parts.pop()! : "bin";
    const base = parts.join(".");
    const newFilename = `${Date.now()}${base}.${ext}`;
    const dir = `uploads/${ext}`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const target = `${dir}/${newFilename}`;
    file.mv(target, (err) => {
      if (err) throw err;
    });
    return target;
  }
  // Create employee
  static async create(req: RequestWithUser, res: Response) {
    const {
      name,
      position,
      hireDate,
      salary,
      is_teacher,
      email,
      phone,
      address,
      status,
      managerId,
      departmentId,
    } = req.body;

    // Convert is_teacher string to boolean
    const isTeacherBoolean = is_teacher === "true" || is_teacher === true;

    console.log(req.body);

    if (!name || !position || hireDate === undefined || salary === undefined) {
      return res.status(400).send({
        message: "Name, position, hire date, and salary are required",
      });
    }

    try {
      // Handle file uploads if present (multipart/form-data)
      let profileImagePath: string | undefined;
      let docsPath: string | undefined;
      if (req.files?.profile_image) {
        const profile = Array.isArray(req.files.profile_image)
          ? req.files.profile_image[0]
          : (req.files.profile_image as UploadedFile);
        profileImagePath = EmployeeController.uploadFile(profile);
      }
      if (req.files?.docs) {
        const doc = Array.isArray(req.files.docs)
          ? req.files.docs[0]
          : (req.files.docs as UploadedFile);
        docsPath = EmployeeController.uploadFile(doc);
      }
      const employee = await EmployeeServices.createEmployee(
        name,
        position,
        new Date(hireDate),
        parseFloat(salary),
        req.user.id,
        {
          email,
          phone,
          address,
          is_teacher: isTeacherBoolean,
          status,
          managerId: managerId || undefined,
          departmentId: departmentId || undefined,
          profile_image: profileImagePath,
          docs: docsPath,
        }
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
    const {
      name,
      position,
      hireDate,
      salary,
      is_teacher,
      email,
      phone,
      address,
      status,
      managerId,
      departmentId,
    } = req.body;

    // Convert is_teacher string to boolean
    const isTeacherBoolean = is_teacher === "true" || is_teacher === true;

    try {
      // Handle file uploads if present
      let profileImagePath: string | undefined;
      let docsPath: string | undefined;
      if (req.files?.profile_image) {
        const profile = Array.isArray(req.files.profile_image)
          ? req.files.profile_image[0]
          : (req.files.profile_image as UploadedFile);
        profileImagePath = EmployeeController.uploadFile(profile);
      }
      if (req.files?.docs) {
        const doc = Array.isArray(req.files.docs)
          ? req.files.docs[0]
          : (req.files.docs as UploadedFile);
        docsPath = EmployeeController.uploadFile(doc);
      }

      const employee = await EmployeeServices.updateEmployee(id, {
        name,
        position,
        hireDate: hireDate ? new Date(hireDate) : undefined,
        salary: salary ? parseFloat(salary) : undefined,
        is_teacher: is_teacher !== undefined ? isTeacherBoolean : undefined,
        email,
        phone,
        address,
        status,
        managerId,
        departmentId,
        ...(profileImagePath ? { profile_image: profileImagePath } : {}),
        ...(docsPath ? { docs: docsPath } : {}),
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
