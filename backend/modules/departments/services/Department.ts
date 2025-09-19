import { BaseService, ValidationHelpers } from "@/app";
import { prisma } from "@/db/client";

interface DepartmentCreateData {
  name: string;
  description?: string;
  managerId?: string;
}

interface DepartmentUpdateData {
  name?: string;
  description?: string;
  managerId?: string;
}

export default class DepartmentServices extends BaseService<
  any,
  DepartmentCreateData,
  DepartmentUpdateData
> {
  protected modelName = "department";
  protected searchFields = ["name", "description"];
  protected defaultIncludes = {
    manager: {
      select: {
        id: true,
        name: true,
        position: true,
        email: true,
      },
    },
    employees: {
      select: {
        id: true,
        name: true,
        position: true,
        status: true,
      },
    },
    created_by: {
      select: {
        id: true,
        name: true,
        username: true,
      },
    },
  };
  protected defaultOrderBy = { created_at: "desc" };

  protected async validateCreateData(data: DepartmentCreateData): Promise<void> {
    // Use schema-based validation
    await ValidationHelpers.validateModelData(
      data,
      "Department",
      undefined,
      false
    );

    // Additional business logic validation
    if (data.managerId) {
      await this.validateManagerExists(data.managerId);
    }

    // Throw if any validation errors
    ValidationHelpers.throwIfErrors();
  }

  protected async validateUpdateData(
    data: DepartmentUpdateData,
    id?: string
  ): Promise<void> {
    // Use schema-based validation
    await ValidationHelpers.validateModelData(
      data,
      "Department",
      undefined,
      false
    );

    // Additional business logic validation
    if (data.managerId) {
      await this.validateManagerExists(data.managerId);
    }

    // Throw if any validation errors
    ValidationHelpers.throwIfErrors();
  }

  private async validateManagerExists(managerId: string): Promise<void> {
    const manager = await prisma.employee.findUnique({
      where: { id: managerId },
      select: { id: true, status: true },
    });

    if (!manager) {
      ValidationHelpers.addError(
        "managerId",
        "Manager not found",
        "MANAGER_NOT_FOUND",
        managerId
      );
      return;
    }

    if (manager.status !== "active") {
      ValidationHelpers.addError(
        "managerId",
        "Manager must be an active employee",
        "MANAGER_NOT_ACTIVE",
        managerId
      );
    }
  }

  protected async beforeCreate(data: DepartmentCreateData): Promise<void> {
    // Any pre-creation logic
  }

  protected async afterCreate(
    entity: any,
    data: DepartmentCreateData
  ): Promise<void> {
    // Update manager's department reference if needed
    if (data.managerId) {
      await prisma.employee.update({
        where: { id: data.managerId },
        data: { departmentId: entity.id },
      });
    }
  }

  protected async beforeUpdate(
    data: DepartmentUpdateData,
    id?: string
  ): Promise<void> {
    // Any pre-update logic
  }

  protected async afterUpdate(
    entity: any,
    data: DepartmentUpdateData,
    id?: string
  ): Promise<void> {
    // Update manager's department reference if changed
    if (data.managerId !== undefined) {
      // Remove old manager's department reference
      await prisma.employee.updateMany({
        where: { departmentId: entity.id, managerId: null },
        data: { departmentId: null },
      });

      // Set new manager's department reference
      if (data.managerId) {
        await prisma.employee.update({
          where: { id: data.managerId },
          data: { departmentId: entity.id },
        });
      }
    }
  }

  protected async beforeDelete(id: string): Promise<void> {
    // Check if department has employees
    const department = await prisma.department.findUnique({
      where: { id },
      include: { employees: true },
    });

    if (!department) {
      ValidationHelpers.addError(
        "id",
        "Department not found",
        "DEPARTMENT_NOT_FOUND",
        id
      );
      return;
    }

    if (department.employees.length > 0) {
      ValidationHelpers.addError(
        "id",
        "Cannot delete department with assigned employees",
        "DEPARTMENT_HAS_EMPLOYEES",
        id
      );
    }

    // Throw if any validation errors
    ValidationHelpers.throwIfErrors();
  }

  // Override findAll to support custom options
  async findAll(options?: any): Promise<any[]> {
    if (options) {
      return await prisma.department.findMany({
        ...options,
        orderBy: this.defaultOrderBy,
      });
    }
    return await super.findAll();
  }

  // Custom methods specific to Department
  async getDepartmentStats(id: string) {
    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        employees: {
          select: {
            id: true,
            status: true,
            salary: true,
          },
        },
        _count: {
          select: {
            employees: true,
          },
        },
      },
    });

    if (!department) {
      throw new Error("Department not found");
    }

    const activeEmployees = department.employees.filter(
      (emp) => emp.status === "active"
    ).length;
    const totalSalary = department.employees.reduce(
      (sum, emp) => sum + emp.salary,
      0
    );

    return {
      totalEmployees: department._count.employees,
      activeEmployees,
      inactiveEmployees: department._count.employees - activeEmployees,
      totalSalaryBudget: totalSalary,
    };
  }

  async getEmployeesByDepartment(departmentId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const employees = await prisma.employee.findMany({
      where: { departmentId },
      include: {
        subjects: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { name: "asc" },
    });

    const total = await prisma.employee.count({
      where: { departmentId },
    });

    return {
      data: employees,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
