import { Request, Response } from "express";
import { RequestWithUser } from "@/@types/auth";
import { BaseService, PaginationResult } from "./BaseService";
import { ValidationError, ValidationErrorDetail } from "./ValidationHelpers";
import fs from "fs";
import { type UploadedFile } from "express-fileupload";

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
  validationErrors?: ValidationErrorDetail[];
}

export interface PaginatedApiResponse<T = any> extends ApiResponse<T[]> {
  total: number;
  totalPages: number;
  currentPage: number;
}

export abstract class BaseController<
  T = any,
  CreateData = any,
  UpdateData = any
> {
  protected abstract service: BaseService<T, CreateData, UpdateData>;
  protected abstract entityName: string;

  // Success response helper
  protected success(
    res: Response,
    message: string,
    data?: any,
    statusCode: number = 200
  ): Response {
    const response: ApiResponse = { message };
    if (data !== undefined) {
      response.data = data;
    }
    return res.status(statusCode).json(response);
  }

  // Error response helper
  protected error(
    res: Response,
    message: string,
    statusCode: number = 400,
    validationErrors?: ValidationErrorDetail[]
  ): Response {
    const response: ApiResponse = { message, error: message };
    if (validationErrors && validationErrors.length > 0) {
      response.validationErrors = validationErrors;
    }
    return res.status(statusCode).json(response);
  }

  // Validation error response helper
  protected validationError(
    res: Response,
    validationError: ValidationError,
    statusCode: number = 422
  ): Response {
    return res.status(statusCode).json({
      message: "Validation failed",
      error: "Validation failed",
      validationErrors: validationError.errors
    });
  }

  // Paginated response helper
  protected paginatedSuccess(
    res: Response,
    message: string,
    result: PaginationResult<T>,
    statusCode: number = 200
  ): Response {
    const response: PaginatedApiResponse<T> = {
      message,
      data: result.data,
      total: result.total,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
    };
    return res.status(statusCode).json(response);
  }

  // Validation helpers
  protected validateRequiredFields(body: any, fields: string[]): string | null {
    for (const field of fields) {
      if (!body[field]) {
        return `${field} is required`;
      }
    }
    return null;
  }

  protected parseQueryParams(req: Request) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.q as string;

    return { page, limit, search };
  }

  // Standard CRUD operations
  async create(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      const data = await this.service.create(req.body, req.user?.id);
      return this.success(
        res,
        `${this.entityName} created successfully`,
        data,
        201
      );
    } catch (error: any) {
      if (error instanceof ValidationError) {
        return this.validationError(res, error);
      }
      return this.error(res, error.message, 400);
    }
  }

  async getAll(_: RequestWithUser, res: Response): Promise<Response> {
    try {
      const data = await this.service.findAll();
      return this.success(
        res,
        `${this.entityName}s retrieved successfully`,
        data
      );
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  }

  async getById(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = await this.service.findById(id);
      return this.success(
        res,
        `${this.entityName} retrieved successfully`,
        data
      );
    } catch (error: any) {
      return this.error(res, error.message, 404);
    }
  }

  async update(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = await this.service.update(id, req.body);
      return this.success(res, `${this.entityName} updated successfully`, data);
    } catch (error: any) {
      if (error instanceof ValidationError) {
        return this.validationError(res, error);
      }
      return this.error(res, error.message, 400);
    }
  }

  async delete(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      return this.success(res, `${this.entityName} deleted successfully`);
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  }

  async deleteMany(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      const { ids } = req.body;

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return this.error(
          res,
          `Array of ${this.entityName} IDs is required`,
          400
        );
      }

      const result = await this.service.deleteMany(ids);
      return this.success(
        res,
        `${result.count} ${this.entityName}s deleted successfully`,
        {
          deletedCount: result.count,
        }
      );
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  }

  // Pagination
  async paginate(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      const { page, limit } = this.parseQueryParams(req);
      const result = await this.service.paginate(page, limit);
      return this.paginatedSuccess(
        res,
        `${this.entityName}s retrieved successfully`,
        result
      );
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  }

  // Search
  async search(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      const { page, limit, search } = this.parseQueryParams(req);

      if (!search) {
        return this.error(res, "Search query is required", 400);
      }

      const result = await this.service.paginateSearch(search, page, limit);
      return this.paginatedSuccess(
        res,
        "Search results retrieved successfully",
        result
      );
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  }

  // Count
  async count(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      const total = await this.service.count();
      return this.success(
        res,
        `${this.entityName} count retrieved successfully`,
        { total }
      );
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  }

  // Check if exists
  async exists(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const exists = await this.service.exists(id);
      return this.success(res, `${this.entityName} existence checked`, {
        exists,
      });
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  }

  uploadFile(file: UploadedFile): string {
    try {
      if (!file) {
        throw "No file uploaded";
      }
      const [filename, fileExtention] = file.name.split(".");
      const newFilename = `${Date.now()}${filename}.${fileExtention}`;
      if (!fs.existsSync(`uploads/${fileExtention}`)) {
        fs.mkdirSync(`uploads/${fileExtention}`);
      }
      file.mv(`uploads/${fileExtention}/${newFilename}`, (err) => {
        if (err) {
          throw err.message;
        }
      });
      return `uploads/${fileExtention}/${newFilename}`;
    } catch (error: any) {
      throw error.message;
    }
  }
}
