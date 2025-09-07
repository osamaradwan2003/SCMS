import { prisma } from "@db/client";

export default class PayrollServices {
  // Create payroll
  static async createPayroll(
    employeeId: string,
    amount: number,
    month: Date,
    status: string,
    userId: string
  ) {
    // Check if payroll already exists for this employee in this month
    const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    
    const existingPayroll = await prisma.payroll.findFirst({
      where: {
        employeeId,
        month: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    if (existingPayroll) {
      throw new Error("Payroll already exists for this employee in this month");
    }

    const payroll = await prisma.payroll.create({
      data: {
        employeeId,
        amount,
        month,
        status,
        userId,
      },
      include: {
        employee: {
          include: {
            Class: true,
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
    return payroll;
  }

  // Find payroll by ID
  static async findById(id: string) {
    const payroll = await prisma.payroll.findUnique({
      where: { id },
      include: {
        employee: {
          include: {
            Class: true,
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
    if (!payroll) throw new Error("Payroll not found");
    return payroll;
  }

  // Get all payrolls
  static async getAllPayrolls() {
    return await prisma.payroll.findMany({
      include: {
        employee: {
          include: {
            Class: true,
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
      orderBy: [
        { month: "desc" },
        { created_at: "desc" },
      ],
    });
  }

  // Update payroll
  static async updatePayroll(
    id: string,
    data: {
      amount?: number;
      month?: Date;
      status?: string;
    }
  ) {
    // If month is being updated, check for duplicates
    if (data.month !== undefined) {
      const currentPayroll = await prisma.payroll.findUnique({
        where: { id },
      });

      if (!currentPayroll) {
        throw new Error("Payroll not found");
      }

      const newMonth = data.month;
      const startOfMonth = new Date(newMonth.getFullYear(), newMonth.getMonth(), 1);
      const endOfMonth = new Date(newMonth.getFullYear(), newMonth.getMonth() + 1, 0);

      const existingPayroll = await prisma.payroll.findFirst({
        where: {
          employeeId: currentPayroll.employeeId,
          month: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
          NOT: { id },
        },
      });

      if (existingPayroll) {
        throw new Error("Payroll already exists for this employee in this month");
      }
    }

    const payroll = await prisma.payroll.update({
      where: { id },
      data,
      include: {
        employee: {
          include: {
            Class: true,
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
    return payroll;
  }

  // Delete payroll
  static async deletePayroll(id: string) {
    const payroll = await prisma.payroll.findUnique({
      where: { id },
    });

    if (!payroll) throw new Error("Payroll not found");

    return await prisma.payroll.delete({
      where: { id },
    });
  }

  // Paginate payrolls
  static async paginate(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const payrolls = await prisma.payroll.findMany({
      skip,
      take: limit,
      include: {
        employee: {
          include: {
            Class: true,
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
      orderBy: [
        { month: "desc" },
        { created_at: "desc" },
      ],
    });

    const total = await prisma.payroll.count();
    const totalPages = Math.ceil(total / limit);

    return {
      data: payrolls,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // Search payrolls
  static async search(search: string, page: number = 1, limit?: number) {
    const whereClause = {
      OR: [
        {
          employee: {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        },
        {
          status: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    };

    const payrolls = await prisma.payroll.findMany({
      where: whereClause,
      include: {
        employee: {
          include: {
            Class: true,
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
      skip: limit ? (page - 1) * limit : 0,
      take: limit,
      orderBy: [
        { month: "desc" },
        { created_at: "desc" },
      ],
    });

    return payrolls;
  }

  // Count searched payrolls
  static async countSearched(search: string) {
    return await prisma.payroll.count({
      where: {
        OR: [
          {
            employee: {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          },
          {
            status: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        ],
      },
    });
  }

  // Paginate searched payrolls
  static async paginateSearched(page: number, limit: number, search: string) {
    const payrolls = await this.search(search, page, limit);
    const total = await this.countSearched(search);
    const totalPages = Math.ceil(total / limit);

    return {
      data: payrolls,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // Get payrolls by employee
  static async getByEmployee(employeeId: string) {
    return await prisma.payroll.findMany({
      where: { employeeId },
      include: {
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: [
        { month: "desc" },
      ],
    });
  }

  // Get payrolls by month and year
  static async getByMonthYear(month: number, year: number) {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);
    
    return await prisma.payroll.findMany({
      where: {
        month: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      include: {
        employee: {
          include: {
            Class: true,
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
      orderBy: {
        employee: {
          name: "asc",
        },
      },
    });
  }

  // Get payrolls by date range
  static async getByDateRange(startMonth: number, startYear: number, endMonth: number, endYear: number) {
    const startDate = new Date(startYear, startMonth - 1, 1);
    const endDate = new Date(endYear, endMonth, 0);
    
    return await prisma.payroll.findMany({
      where: {
        month: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        employee: {
          include: {
            Class: true,
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
      orderBy: [
        { month: "desc" },
        { created_at: "desc" },
      ],
    });
  }

  // Delete many payrolls
  static async deleteMany(ids: string[]) {
    return await prisma.payroll.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  // Get payroll statistics
  static async getStatistics(month?: number, year?: number) {
    const whereClause: any = {};
    
    if (month !== undefined && year !== undefined) {
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0);
      whereClause.month = {
        gte: startOfMonth,
        lte: endOfMonth,
      };
    } else if (year !== undefined) {
      const startOfYear = new Date(year, 0, 1);
      const endOfYear = new Date(year, 11, 31);
      whereClause.month = {
        gte: startOfYear,
        lte: endOfYear,
      };
    }

    const totalPayrolls = await prisma.payroll.count({ where: whereClause });
    
    const totalAmount = await prisma.payroll.aggregate({
      where: whereClause,
      _sum: {
        amount: true,
      },
    });

    const averageAmount = await prisma.payroll.aggregate({
      where: whereClause,
      _avg: {
        amount: true,
      },
    });

    const maxAmount = await prisma.payroll.aggregate({
      where: whereClause,
      _max: {
        amount: true,
      },
    });

    const minAmount = await prisma.payroll.aggregate({
      where: whereClause,
      _min: {
        amount: true,
      },
    });

    return {
      totalPayrolls,
      totalAmount: totalAmount._sum.amount || 0,
      averageAmount: averageAmount._avg.amount || 0,
      maxAmount: maxAmount._max.amount || 0,
      minAmount: minAmount._min.amount || 0,
    };
  }

  // Get monthly payroll summary
  static async getMonthlyPayrollSummary(year: number) {
    const monthlyData = [];
    
    for (let month = 1; month <= 12; month++) {
      const stats = await this.getStatistics(month, year);
      monthlyData.push({
        month,
        ...stats,
      });
    }

    return monthlyData;
  }

  // Get employee payroll summary
  static async getEmployeePayrollSummary(employeeId: string) {
    const totalAmount = await prisma.payroll.aggregate({
      where: { employeeId },
      _sum: {
        amount: true,
      },
    });

    const totalPayrolls = await prisma.payroll.count({
      where: { employeeId },
    });

    const averageAmount = await prisma.payroll.aggregate({
      where: { employeeId },
      _avg: {
        amount: true,
      },
    });

    const lastPayroll = await prisma.payroll.findFirst({
      where: { employeeId },
      orderBy: [
        { month: "desc" },
      ],
    });

    return {
      totalAmount: totalAmount._sum.amount || 0,
      totalPayrolls,
      averageAmount: averageAmount._avg.amount || 0,
      lastPayroll,
    };
  }
}
