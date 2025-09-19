import { Response } from "express";
import DepartmentServices from "../services/Department";
import { RequestWithUser } from "@/@types/auth";
import { BaseController, ValidationError } from "@/app";

class DepartmentController extends BaseController {
  protected service = new DepartmentServices();
  protected entityName = "Department";

  // Override create method to handle custom validation
  async create(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      const { name, description, managerId } = req.body;
      const userId = req.user?.id;

      const departmentData = {
        name,
        description,
        managerId,
      };

      const department = await this.service.create(departmentData, userId);
      return this.success(
        res,
        "Department created successfully",
        department,
        201
      );
    } catch (error: any) {
      if (error instanceof ValidationError) {
        return this.validationError(res, error);
      }
      return this.error(res, error?.message || "An error occurred while creating the department");
    }
  }

  // Override update method to handle custom validation
  async update(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { name, description, managerId } = req.body;

      const updateData = {
        name,
        description,
        managerId,
      };

      const department = await this.service.update(id, updateData);
      return this.success(res, "Department updated successfully", department);
    } catch (error: any) {
      if (error instanceof ValidationError) {
        return this.validationError(res, error);
      }
      return this.error(res, error?.message || "An error occurred while updating the department");
    }
  }

  // Get department statistics
  async getStats(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const stats = await this.service.getDepartmentStats(id);
      return this.success(
        res,
        "Department statistics retrieved successfully",
        stats
      );
    } catch (error: any) {
      return this.error(res, error?.message || "An error occurred while retrieving department statistics");
    }
  }

  // Get employees by department
  async getEmployees(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.service.getEmployeesByDepartment(
        id,
        page,
        limit
      );
      return this.success(
        res,
        "Department employees retrieved successfully",
        result
      );
    } catch (error: any) {
      return this.error(res, error?.message || "An error occurred while retrieving department employees");
    }
  }

  // Assign manager to department
  async assignManager(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { managerId } = req.body;

      const department = await this.service.update(id, { managerId });
      return this.success(res, "Manager assigned successfully", department);
    } catch (error: any) {
      if (error instanceof ValidationError) {
        return this.validationError(res, error);
      }
      return this.error(res, error?.message || "An error occurred while assigning manager");
    }
  }

  // Remove manager from department
  async removeManager(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const department = await this.service.update(id, {
        managerId: undefined,
      });
      return this.success(res, "Manager removed successfully", department);
    } catch (error: any) {
      if (error instanceof ValidationError) {
        return this.validationError(res, error);
      }
      return this.error(res, error?.message || "An error occurred while removing manager");
    }
  }

  // Get departments with employee counts (for dropdowns)
  async getList(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      const departments = await this.service.findAll({
        select: {
          id: true,
          name: true,
          description: true,
          _count: {
            select: {
              employees: true,
            },
          },
        },
      });

      return this.success(
        res,
        "Departments list retrieved successfully",
        departments
      );
    } catch (error: any) {
      return this.error(res, error?.message || "An error occurred while retrieving departments list");
    }
  }

  // Get departments with managers (for management view)
  async getWithManagers(
    req: RequestWithUser,
    res: Response
  ): Promise<Response> {
    try {
      const departments = await this.service.findAll({
        include: {
          manager: {
            select: {
              id: true,
              name: true,
              position: true,
              email: true,
            },
          },
          _count: {
            select: {
              employees: true,
            },
          },
        },
      });

      return this.success(
        res,
        "Departments with managers retrieved successfully",
        departments
      );
    } catch (error: any) {
      return this.error(res, error?.message || "An error occurred while retrieving departments with managers");
    }
  }
}

// Create controller instance for route binding
const departmentController = new DepartmentController();

// Bind methods to preserve 'this' context
export default {
  create: departmentController.create.bind(departmentController),
  update: departmentController.update.bind(departmentController),
  getAll: departmentController.getAll.bind(departmentController),
  getById: departmentController.getById.bind(departmentController),
  delete: departmentController.delete.bind(departmentController),
  deleteMany: departmentController.deleteMany.bind(departmentController),
  paginate: departmentController.paginate.bind(departmentController),
  search: departmentController.search.bind(departmentController),
  count: departmentController.count.bind(departmentController),
  exists: departmentController.exists.bind(departmentController),
  getStats: departmentController.getStats.bind(departmentController),
  getEmployees: departmentController.getEmployees.bind(departmentController),
  assignManager: departmentController.assignManager.bind(departmentController),
  removeManager: departmentController.removeManager.bind(departmentController),
  getList: departmentController.getList.bind(departmentController),
  getWithManagers: departmentController.getWithManagers.bind(departmentController),
};
