import { Response } from "express";
import { RequestWithUser } from "@/@types/auth";
import { BaseController, ResponseHelpers } from "../index";
import { ExampleService } from "./ExampleService";

export class ExampleController extends BaseController {
  protected service = new ExampleService();
  protected entityName = "Example"; // Replace with your entity name

  // Override base methods if you need custom logic
  async create(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      // Custom validation or data transformation
      const data = {
        name: req.body.name,
        email: req.body.email,
        description: req.body.description,
      };

      const result = await this.service.create(data, req.user?.id);
      return this.success(res, `${this.entityName} created successfully`, result, 201);
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  }

  // Custom endpoints specific to this controller
  async findByEmail(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      const { email } = req.params;
      const results = await this.service.findByEmail(email);
      return this.success(res, `${this.entityName}s retrieved successfully`, results);
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  }

  async getActive(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      const results = await this.service.findActive();
      return this.success(res, `Active ${this.entityName}s retrieved successfully`, results);
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  }

  // Bulk operations
  async bulkCreate(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      const { items } = req.body;
      
      if (!Array.isArray(items) || items.length === 0) {
        return this.error(res, "Items array is required", 400);
      }

      const results = [];
      for (const item of items) {
        const result = await this.service.create(item, req.user?.id);
        results.push(result);
      }

      return this.success(res, `${results.length} ${this.entityName}s created successfully`, results, 201);
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  }

  // Static methods for backward compatibility (if needed)
  static async create(req: RequestWithUser, res: Response) {
    const controller = new ExampleController();
    return await controller.create(req, res);
  }

  static async getAll(req: RequestWithUser, res: Response) {
    const controller = new ExampleController();
    return await controller.getAll(req, res);
  }

  static async getById(req: RequestWithUser, res: Response) {
    const controller = new ExampleController();
    return await controller.getById(req, res);
  }

  static async update(req: RequestWithUser, res: Response) {
    const controller = new ExampleController();
    return await controller.update(req, res);
  }

  static async delete(req: RequestWithUser, res: Response) {
    const controller = new ExampleController();
    return await controller.delete(req, res);
  }

  static async paginate(req: RequestWithUser, res: Response) {
    const controller = new ExampleController();
    return await controller.paginate(req, res);
  }

  static async search(req: RequestWithUser, res: Response) {
    const controller = new ExampleController();
    return await controller.search(req, res);
  }

  static async deleteMany(req: RequestWithUser, res: Response) {
    const controller = new ExampleController();
    return await controller.deleteMany(req, res);
  }

  static async findByEmail(req: RequestWithUser, res: Response) {
    const controller = new ExampleController();
    return await controller.findByEmail(req, res);
  }

  static async getActive(req: RequestWithUser, res: Response) {
    const controller = new ExampleController();
    return await controller.getActive(req, res);
  }

  static async bulkCreate(req: RequestWithUser, res: Response) {
    const controller = new ExampleController();
    return await controller.bulkCreate(req, res);
  }
}
