import { prisma } from "@db/client";

export default class ExpenseTypeServices {
  // Create expense type
  static async createExpenseType(
    name: string,
    description: string | null,
    userId: string
  ) {
    const existingExpenseType = await prisma.expenseType.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });

    if (existingExpenseType) {
      throw new Error("Expense type with this name already exists");
    }

    const expenseType = await prisma.expenseType.create({
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
    return expenseType;
  }

  // Find expense type by ID
  static async findById(id: string) {
    const expenseType = await prisma.expenseType.findUnique({
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
    if (!expenseType) throw new Error("Expense type not found");
    return expenseType;
  }

  // Get all expense types
  static async getAllExpenseTypes() {
    return await prisma.expenseType.findMany({
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

  // Update expense type
  static async updateExpenseType(
    id: string,
    data: {
      name?: string;
      description?: string | null;
    }
  ) {
    if (data.name) {
      const existingExpenseType = await prisma.expenseType.findFirst({
        where: {
          name: { equals: data.name, mode: "insensitive" },
          NOT: { id },
        },
      });

      if (existingExpenseType) {
        throw new Error("Expense type with this name already exists");
      }
    }

    const expenseType = await prisma.expenseType.update({
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
    return expenseType;
  }

  // Delete expense type
  static async deleteExpenseType(id: string) {
    // Check if expense type has transaction
    const expenseType = await prisma.expenseType.findUnique({
      where: { id },
      include: {
        transaction: true,
      },
    });

    if (!expenseType) throw new Error("Expense type not found");

    if (expenseType.transaction.length > 0) {
      throw new Error("Cannot delete expense type with existing transaction");
    }

    return await prisma.expenseType.delete({
      where: { id },
    });
  }

  // Paginate expense types
  static async paginate(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const expenseTypes = await prisma.expenseType.findMany({
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

    const total = await prisma.expenseType.count();
    const totalPages = Math.ceil(total / limit);

    return {
      data: expenseTypes,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // Search expense types
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

    const expenseTypes = await prisma.expenseType.findMany({
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

    return expenseTypes;
  }

  // Count searched expense types
  static async countSearched(search: string) {
    return await prisma.expenseType.count({
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

  // Paginate searched expense types
  static async paginateSearched(page: number, limit: number, search: string) {
    const expenseTypes = await this.search(search, page, limit);
    const total = await this.countSearched(search);
    const totalPages = Math.ceil(total / limit);

    return {
      data: expenseTypes,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // Delete many expense types
  static async deleteMany(ids: string[]) {
    // Check if any expense types have transaction
    const expenseTypesWithtransaction = await prisma.expenseType.findMany({
      where: {
        id: { in: ids },
      },
      include: {
        transaction: true,
      },
    });

    const expenseTypesWithtransactionList = expenseTypesWithtransaction.filter(
      (expenseType) => expenseType.transaction.length > 0
    );

    if (expenseTypesWithtransactionList.length > 0) {
      throw new Error(
        `Cannot delete expense types with existing transaction: ${expenseTypesWithtransactionList
          .map((et) => et.name)
          .join(", ")}`
      );
    }

    return await prisma.expenseType.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  // Get expense type statistics
  static async getStatistics() {
    const totalExpenseTypes = await prisma.expenseType.count();

    const totaltransaction = await prisma.transaction.count({
      where: {
        expenseTypeId: { not: null },
      },
    });

    const totalAmount = await prisma.transaction.aggregate({
      where: {
        expenseTypeId: { not: null },
      },
      _sum: {
        amount: true,
      },
    });

    const expenseTypesWithMosttransaction = await prisma.expenseType.findMany({
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
      totalExpenseTypes,
      totaltransaction,
      totalAmount: totalAmount._sum.amount || 0,
      topExpenseTypes: expenseTypesWithMosttransaction,
    };
  }

  // Get expense types with counts
  static async getExpenseTypesWithCounts() {
    return await prisma.expenseType.findMany({
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
