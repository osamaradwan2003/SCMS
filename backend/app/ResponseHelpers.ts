import { Response } from "express";
import { ValidationErrorDetail } from "./ValidationHelpers";

export interface StandardResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  validationErrors?: ValidationErrorDetail[];
  timestamp: string;
}

export interface PaginatedResponse<T = any> extends StandardResponse<T[]> {
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class ResponseHelpers {
  // Success responses
  static success<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode: number = 200
  ): Response {
    const response: StandardResponse<T> = {
      success: true,
      message,
      timestamp: new Date().toISOString(),
    };

    if (data !== undefined) {
      response.data = data;
    }

    return res.status(statusCode).json(response);
  }

  // Error responses
  static error(
    res: Response,
    message: string,
    statusCode: number = 400,
    error?: string,
    validationErrors?: ValidationErrorDetail[]
  ): Response {
    const response: StandardResponse = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    };

    if (error) {
      response.error = error;
    }

    if (validationErrors && validationErrors.length > 0) {
      response.validationErrors = validationErrors;
    }

    return res.status(statusCode).json(response);
  }

  // Paginated responses
  static paginated<T>(
    res: Response,
    message: string,
    data: T[],
    total: number,
    currentPage: number,
    limit: number,
    statusCode: number = 200
  ): Response {
    const totalPages = Math.ceil(total / limit);
    
    const response: PaginatedResponse<T> = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
      pagination: {
        total,
        totalPages,
        currentPage,
        limit,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
      },
    };

    return res.status(statusCode).json(response);
  }

  // Created response
  static created<T>(res: Response, message: string, data?: T): Response {
    return this.success(res, message, data, 201);
  }

  // No content response
  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  // Not found response
  static notFound(res: Response, message: string = "Resource not found"): Response {
    return this.error(res, message, 404);
  }

  // Unauthorized response
  static unauthorized(res: Response, message: string = "Unauthorized"): Response {
    return this.error(res, message, 401);
  }

  // Forbidden response
  static forbidden(res: Response, message: string = "Forbidden"): Response {
    return this.error(res, message, 403);
  }

  // Validation error response
  static validationError(
    res: Response, 
    message: string, 
    validationErrors?: ValidationErrorDetail[]
  ): Response {
    return this.error(res, message, 422, message, validationErrors);
  }

  // Internal server error response
  static internalError(res: Response, message: string = "Internal server error"): Response {
    return this.error(res, message, 500);
  }

  // Conflict response
  static conflict(res: Response, message: string): Response {
    return this.error(res, message, 409);
  }

  // Too many requests response
  static tooManyRequests(res: Response, message: string = "Too many requests"): Response {
    return this.error(res, message, 429);
  }
}
