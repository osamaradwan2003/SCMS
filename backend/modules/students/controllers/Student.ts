import { Response } from "express";
import StudentServices from "../services/Student";
import { RequestWithUser } from "@/@types/auth";
import { BaseController } from "../../../app";

export default class StudentController extends BaseController {
  protected service = new StudentServices();
  protected entityName = "Student";

  // Override create method to handle date conversion and field mapping
  async create(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      const data = {
        name: req.body.name,
        dob: new Date(req.body.dob),
        phone: req.body.phone || null,
        image: req.body.image || null,
        gender: req.body.gender || null,
        address: req.body.address,
        docs: req.body.docs || null,
        classId: req.body.classId || null,
        guardianId: req.body.guardianId,
        subscriptionsId: req.body.subscriptionsId,
      };

      const student = await this.service.create(data, req.user?.id);
      return this.success(res, "Student created successfully", student, 201);
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  }

  // Override update method to handle date conversion
  async update(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = {
        ...req.body,
        dob: req.body.dob ? new Date(req.body.dob) : undefined,
      };

      const student = await this.service.update(id, data);
      return this.success(res, "Student updated successfully", student);
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  }

  // Custom methods for student-specific operations
  async getByClass(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      const { classId } = req.params;
      const students = await this.service.getByClass(classId);
      return this.success(res, "Students retrieved successfully", students);
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  }

  async getByGuardian(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      const { guardianId } = req.params;
      const students = await this.service.getByGuardian(guardianId);
      return this.success(res, "Students retrieved successfully", students);
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  }

  // Static methods for backward compatibility
  static async create(req: RequestWithUser, res: Response) {
    const controller = new StudentController();
    return await controller.create(req, res);
  }

  static async getAll(req: RequestWithUser, res: Response) {
    const controller = new StudentController();
    return await controller.getAll(req, res);
  }

  static async getById(req: RequestWithUser, res: Response) {
    const controller = new StudentController();
    return await controller.getById(req, res);
  }

  static async update(req: RequestWithUser, res: Response) {
    const controller = new StudentController();
    return await controller.update(req, res);
  }

  static async delete(req: RequestWithUser, res: Response) {
    const controller = new StudentController();
    return await controller.delete(req, res);
  }

  static async paginate(req: RequestWithUser, res: Response) {
    const controller = new StudentController();
    return await controller.paginate(req, res);
  }

  static async search(req: RequestWithUser, res: Response) {
    const controller = new StudentController();
    return await controller.search(req, res);
  }

  static async deleteMany(req: RequestWithUser, res: Response) {
    const controller = new StudentController();
    return await controller.deleteMany(req, res);
  }

  static async getByClass(req: RequestWithUser, res: Response) {
    const controller = new StudentController();
    return await controller.getByClass(req, res);
  }

  static async getByGuardian(req: RequestWithUser, res: Response) {
    const controller = new StudentController();
    return await controller.getByGuardian(req, res);
  }
}
