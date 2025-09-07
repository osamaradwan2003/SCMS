import { prisma } from "@db/client";

export default class EmployeeServices {
  // Create employee
  static async createEmployee(
    name: string,
    role: string,
    is_teacher: boolean,
    joinDate: Date,
    salary: number,
    classId: string | null,
    userId: string
  ) {
    const employee = await prisma.employee.create({
      data: {
        name,
        role,
        is_teacher,
        joinDate,
        salary,
        classId,
        userId,
      },
      include: {
        Class: true,
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
      },
    });
    return employee;
  }

  // Find employee by ID
  static async findById(id: string) {
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        Class: true,
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
      },
    });
    if (!employee) throw new Error("Employee not found");
    return employee;
  }

  // Get all employees
  static async getAllEmployees() {
    return await prisma.employee.findMany({
      include: {
        Class: true,
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
      role?: string;
      is_teacher?: boolean;
      joinDate?: Date;
      salary?: number;
      classId?: string | null;
    }
  ) {
    const employee = await prisma.employee.update({
      where: { id },
      data,
      include: {
        Class: true,
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
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
        Class: true,
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
    const whereClause = {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          role: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    };

    const employees = await prisma.employee.findMany({
      where: whereClause,
      include: {
        Class: true,
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
    return await prisma.employee.count({
      where: {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            role: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        ],
      },
    });
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
      where: { is_teacher: true },
      include: {
        Class: true,
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
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
        role: {
          contains: role,
          mode: "insensitive",
        },
      },
      include: {
        Class: true,
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
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
      where: { is_teacher: true },
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
}
