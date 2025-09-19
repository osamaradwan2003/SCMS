import { prisma } from "@/db/client";
import type { Prisma } from "@prisma/client";
import { provisionUserForEntity } from "@/modules/shared/UserProvisioning";

export default class EmployeeServices {
  // Create employee
  static async createEmployee(
    name: string,
    position: string,
    hireDate: Date,
    salary: number,
    userId: string,
    options?: {
      email?: string;
      phone?: string;
      address?: string;
      is_teacher?: boolean;
      status?: "active" | "inactive" | "terminated" | "on_leave";
      managerId?: string | null;
      departmentId?: string | null;
      profile_image?: string;
      docs?: string;
    }
  ) {
    const {
      email,
      phone,
      address,
      is_teacher,
      status,
      managerId,
      departmentId,
      profile_image,
      docs,
    } = options || {};
    // Provision account user (username from name + random; default password username+123; must change on first login)
    // Use "teacher" role if employee is marked as teacher, otherwise use "employee" role
    const roleName = is_teacher ? "teacher" : "employee";
    const { user: accountUser, credentials } = await provisionUserForEntity({
      name,
      email,
      phone,
      roleName,
    });

    const employee = await prisma.employee.create({
      data: {
        name,
        position,
        hireDate,
        is_teacher,
        salary,
        email,
        phone,
        address,
        status,
        managerId: managerId ?? undefined,
        departmentId: departmentId ?? undefined,
        profile_image,
        docs,
        userId,
        accountUserId: accountUser.id,
      },
      include: {
        attendance: {
          orderBy: {
            date: "desc",
          },
          take: 5,
        },
        payrolls: {
          orderBy: {
            month: "desc",
          },
          take: 5,
        },
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        department: { select: { id: true, name: true } },
        manager: { select: { id: true, name: true } },
      },
    });
    // Attach credentials only for admin caller context; here we return in a meta wrapper for controller to handle
    return Object.assign({}, employee, { meta: { credentials } });
  }

  // Find employee by ID
  static async findById(id: string) {
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        attendance: {
          orderBy: {
            date: "desc",
          },
        },
        payrolls: {
          orderBy: {
            month: "desc",
          },
        },
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        department: { select: { id: true, name: true } },
        manager: { select: { id: true, name: true } },
      },
    });
    if (!employee) throw new Error("Employee not found");
    return employee;
  }

  // Get all employees
  static async getAllEmployees() {
    return await prisma.employee.findMany({
      include: {
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        _count: {
          select: {
            attendance: true,
            payrolls: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  // Update employee
  static async updateEmployee(
    id: string,
    data: {
      name?: string;
      position?: string;
      hireDate?: Date;
      salary?: number;
      email?: string;
      phone?: string;
      address?: string;
      is_teacher?: boolean;
      status?: "active" | "inactive" | "terminated" | "on_leave";
      managerId?: string | null;
      departmentId?: string | null;
      profile_image?: string;
      docs?: string;
    }
  ) {
    // If is_teacher status is being updated, we need to update the user role as well
    if (data.is_teacher !== undefined) {
      const employee = await prisma.employee.findUnique({
        where: { id },
        select: { accountUserId: true, is_teacher: true },
      });

      if (employee && employee.accountUserId && employee.is_teacher !== data.is_teacher) {
        // Remove existing roles
        await prisma.user.update({
          where: { id: employee.accountUserId },
          data: { roles: { set: [] } },
        });

        // Add new role based on teacher status
        const newRoleName = data.is_teacher ? "teacher" : "employee";
        const role = await prisma.role.findUnique({ where: { name: newRoleName } });
        if (role) {
          await prisma.user.update({
            where: { id: employee.accountUserId },
            data: { roles: { connect: { id: role.id } } },
          });
        }
      }
    }

    const employee = await prisma.employee.update({
      where: { id },
      data,
      include: {
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        department: { select: { id: true, name: true } },
        manager: { select: { id: true, name: true } },
      },
    });
    return employee;
  }

  // Delete employee
  static async deleteEmployee(id: string) {
    // Check if employee has attendance or payroll records
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        attendance: true,
        payrolls: true,
      },
    });

    if (!employee) throw new Error("Employee not found");

    // Delete related records first
    await prisma.employeeAttendance.deleteMany({
      where: { employeeId: id },
    });

    await prisma.payroll.deleteMany({
      where: { employeeId: id },
    });

    return await prisma.employee.delete({
      where: { id },
    });
  }

  // Paginate employees
  static async paginate(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const employees = await prisma.employee.findMany({
      skip,
      take: limit,
      include: {
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        _count: {
          select: {
            attendance: true,
            payrolls: true,
          },
        },
        department: { select: { id: true, name: true } },
        manager: { select: { id: true, name: true } },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const total = await prisma.employee.count();
    const totalPages = Math.ceil(total / limit);

    return {
      data: employees,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // Search employees
  static async search(search: string, page: number = 1, limit?: number) {
    const whereClause: Prisma.EmployeeWhereInput = {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          position: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          department: {
            is: {
              name: { contains: search, mode: "insensitive" },
            },
          },
        },
      ],
    };

    const employees = await prisma.employee.findMany({
      where: whereClause,
      include: {
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        _count: {
          select: {
            attendance: true,
            payrolls: true,
          },
        },
        department: { select: { id: true, name: true } },
        manager: { select: { id: true, name: true } },
      },
      skip: limit ? (page - 1) * limit : 0,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
    });

    return employees;
  }

  // Count searched employees
  static async countSearched(search: string) {
    const whereClause: Prisma.EmployeeWhereInput = {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          position: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          department: {
            is: {
              name: { contains: search, mode: "insensitive" },
            },
          },
        },
      ],
    };
    return await prisma.employee.count({ where: whereClause });
  }

  // Paginate searched employees
  static async paginateSearched(page: number, limit: number, search: string) {
    const employees = await this.search(search, page, limit);
    const total = await this.countSearched(search);
    const totalPages = Math.ceil(total / limit);

    return {
      data: employees,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // Delete many employees
  static async deleteMany(ids: string[]) {
    // Delete related records first
    await prisma.employeeAttendance.deleteMany({
      where: { employeeId: { in: ids } },
    });

    await prisma.payroll.deleteMany({
      where: { employeeId: { in: ids } },
    });

    return await prisma.employee.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  // Get teachers only
  static async getTeachers() {
    return await prisma.employee.findMany({
      where: { position: { contains: "teacher", mode: "insensitive" } },
      include: {
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        department: { select: { id: true, name: true } },
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  // Get employees by role
  static async getByRole(role: string) {
    return await prisma.employee.findMany({
      where: {
        position: {
          contains: role,
          mode: "insensitive",
        },
      },
      include: {
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        department: { select: { id: true, name: true } },
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  // Get employee statistics
  static async getStatistics() {
    const totalEmployees = await prisma.employee.count();
    const totalTeachers = await prisma.employee.count({
      where: { position: { contains: "teacher", mode: "insensitive" } },
    });
    const totalStaff = totalEmployees - totalTeachers;

    const averageSalary = await prisma.employee.aggregate({
      _avg: {
        salary: true,
      },
    });

    return {
      totalEmployees,
      totalTeachers,
      totalStaff,
      averageSalary: averageSalary._avg.salary || 0,
    };
  }

  // Helper method to check if an employee is a teacher
  static isTeacher(employee: { position: string }): boolean {
    return employee.position.toLowerCase().includes("teacher");
  }

  // Helper method to check if an employee is a teacher by ID
  static async isTeacherById(employeeId: string): Promise<boolean> {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      select: { position: true },
    });
    return employee ? this.isTeacher(employee) : false;
  }
}
