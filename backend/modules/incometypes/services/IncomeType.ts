import { prisma } from "@db/client";

export default class IncomeTypeServices {
  // Create income type
  static async createIncomeType(
    name: string,
    description: string | null,
    userId: string
  ) {
    const existingIncomeType = await prisma.incomeType.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });

    if (existingIncomeType) {
      throw new Error("Income type with this name already exists");
    }

    const incomeType = await prisma.incomeType.create({
      data: {
        name,
        description,
        userId,
      },
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
            transaction: true,
          },
        },
      },
    });
    return incomeType;
  }

  // Find income type by ID
  static async findById(id: string) {
    const incomeType = await prisma.incomeType.findUnique({
      where: { id },
      include: {
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        transaction: {
          include: {
            bank: true,
            category: true,
          },
        },
        _count: {
          select: {
            transaction: true,
          },
        },
      },
    });
    if (!incomeType) throw new Error("Income type not found");
    return incomeType;
  }

  // Get all income types
  static async getAllIncomeTypes() {
    return await prisma.incomeType.findMany({
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
            transaction: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  // Update income type
  static async updateIncomeType(
    id: string,
    data: {
      name?: string;
      description?: string | null;
    }
  ) {
    if (data.name) {
      const existingIncomeType = await prisma.incomeType.findFirst({
        where: {
          name: { equals: data.name, mode: "insensitive" },
          NOT: { id },
        },
      });

      if (existingIncomeType) {
        throw new Error("Income type with this name already exists");
      }
    }

    const incomeType = await prisma.incomeType.update({
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
        _count: {
          select: {
            transaction: true,
          },
        },
      },
    });
    return incomeType;
  }

  // Delete income type
  static async deleteIncomeType(id: string) {
    // Check if income type has transaction
    const incomeType = await prisma.incomeType.findUnique({
      where: { id },
      include: {
        transaction: true,
      },
    });

    if (!incomeType) throw new Error("Income type not found");

    if (incomeType.transaction.length > 0) {
      throw new Error("Cannot delete income type with existing transaction");
    }

    return await prisma.incomeType.delete({
      where: { id },
    });
  }

  // Paginate income types
  static async paginate(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const incomeTypes = await prisma.incomeType.findMany({
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
            transaction: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const total = await prisma.incomeType.count();
    const totalPages = Math.ceil(total / limit);

    return {
      data: incomeTypes,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // Search income types
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
          description: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    };

    const incomeTypes = await prisma.incomeType.findMany({
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
            transaction: true,
          },
        },
      },
      skip: limit ? (page - 1) * limit : 0,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
    });

    return incomeTypes;
  }

  // Count searched income types
  static async countSearched(search: string) {
    return await prisma.incomeType.count({
      where: {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        ],
      },
    });
  }

  // Paginate searched income types
  static async paginateSearched(page: number, limit: number, search: string) {
    const incomeTypes = await this.search(search, page, limit);
    const total = await this.countSearched(search);
    const totalPages = Math.ceil(total / limit);

    return {
      data: incomeTypes,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // Delete many income types
  static async deleteMany(ids: string[]) {
    // Check if any income types have transaction
    const incomeTypesWithtransaction = await prisma.incomeType.findMany({
      where: {
        id: { in: ids },
      },
      include: {
        transaction: true,
      },
    });

    const incomeTypesWithtransactionList = incomeTypesWithtransaction.filter(
      (incomeType) => incomeType.transaction.length > 0
    );

    if (incomeTypesWithtransactionList.length > 0) {
      throw new Error(
        `Cannot delete income types with existing transaction: ${incomeTypesWithtransactionList
          .map((it) => it.name)
          .join(", ")}`
      );
    }

    return await prisma.incomeType.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  // Get income type statistics
  static async getStatistics() {
    const totalIncomeTypes = await prisma.incomeType.count();

    const totaltransaction = await prisma.transaction.count({
      where: {
        incomeTypeId: { not: null },
      },
    });

    const totalAmount = await prisma.transaction.aggregate({
      where: {
        incomeTypeId: { not: null },
      },
      _sum: {
        amount: true,
      },
    });

    const incomeTypesWithMosttransaction = await prisma.incomeType.findMany({
      include: {
        _count: {
          select: {
            transaction: true,
          },
        },
      },
      orderBy: {
        transaction: {
          _count: "desc",
        },
      },
      take: 5,
    });

    return {
      totalIncomeTypes,
      totaltransaction,
      totalAmount: totalAmount._sum.amount || 0,
      topIncomeTypes: incomeTypesWithMosttransaction,
    };
  }

  // Get income types with counts
  static async getIncomeTypesWithCounts() {
    return await prisma.incomeType.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        _count: {
          select: {
            transaction: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  }
}
