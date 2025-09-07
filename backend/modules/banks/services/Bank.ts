import { prisma } from "@db/client";

export default class BankServices {
  // Create bank
  static async createBank(name: string, balance: number, userId: string) {
    const existingBank = await prisma.bank.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });

    if (existingBank) {
      throw new Error("Bank with this name already exists");
    }

    const bank = await prisma.bank.create({
      data: {
        name,
        balance,
        userId,
      },
      include: {
        transaction: {
          orderBy: {
            date: "desc",
          },
          take: 5,
          include: {
            category: true,
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
    return bank;
  }

  // Find bank by ID
  static async findById(id: string) {
    const bank = await prisma.bank.findUnique({
      where: { id },
      include: {
        transaction: {
          orderBy: {
            date: "desc",
          },
          include: {
            category: true,
            incomeType: true,
            expenseType: true,
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
    if (!bank) throw new Error("Bank not found");
    return bank;
  }

  // Get all banks
  static async getAllBanks() {
    return await prisma.bank.findMany({
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

  // Update bank
  static async updateBank(
    id: string,
    data: {
      name?: string;
      balance?: number;
    }
  ) {
    if (data.name) {
      const existingBank = await prisma.bank.findFirst({
        where: {
          name: { equals: data.name, mode: "insensitive" },
          NOT: { id },
        },
      });

      if (existingBank) {
        throw new Error("Bank with this name already exists");
      }
    }

    const bank = await prisma.bank.update({
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
      },
    });
    return bank;
  }

  // Delete bank
  static async deleteBank(id: string) {
    // Check if bank has transaction
    const bank = await prisma.bank.findUnique({
      where: { id },
      include: {
        transaction: true,
      },
    });

    if (!bank) throw new Error("Bank not found");

    if (bank.transaction.length > 0) {
      throw new Error("Cannot delete bank with existing transaction");
    }

    return await prisma.bank.delete({
      where: { id },
    });
  }

  // Paginate banks
  static async paginate(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const banks = await prisma.bank.findMany({
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

    const total = await prisma.bank.count();
    const totalPages = Math.ceil(total / limit);

    return {
      data: banks,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // Search banks
  static async search(search: string, page: number = 1, limit?: number) {
    const whereClause = {
      name: {
        contains: search,
        mode: "insensitive" as const,
      },
    };

    const banks = await prisma.bank.findMany({
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

    return banks;
  }

  // Count searched banks
  static async countSearched(search: string) {
    return await prisma.bank.count({
      where: {
        name: {
          contains: search,
          mode: "insensitive" as const,
        },
      },
    });
  }

  // Paginate searched banks
  static async paginateSearched(page: number, limit: number, search: string) {
    const banks = await this.search(search, page, limit);
    const total = await this.countSearched(search);
    const totalPages = Math.ceil(total / limit);

    return {
      data: banks,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // Delete many banks
  static async deleteMany(ids: string[]) {
    // Check if any banks have transaction
    const banksWithtransaction = await prisma.bank.findMany({
      where: {
        id: { in: ids },
      },
      include: {
        transaction: true,
      },
    });

    const banksWithtransactionList = banksWithtransaction.filter(
      (bank) => bank.transaction.length > 0
    );

    if (banksWithtransactionList.length > 0) {
      throw new Error(
        `Cannot delete banks with existing transaction: ${banksWithtransactionList
          .map((b) => b.name)
          .join(", ")}`
      );
    }

    return await prisma.bank.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  // Get bank statistics
  static async getStatistics() {
    const totalBanks = await prisma.bank.count();

    const totalBalance = await prisma.bank.aggregate({
      _sum: {
        balance: true,
      },
    });

    const averageBalance = await prisma.bank.aggregate({
      _avg: {
        balance: true,
      },
    });

    return {
      totalBanks,
      totalBalance: totalBalance._sum.balance || 0,
      averageBalance: averageBalance._avg.balance || 0,
    };
  }

  // Update bank balance
  static async updateBalance(
    id: string,
    amount: number,
    operation: "add" | "subtract"
  ) {
    const bank = await prisma.bank.findUnique({
      where: { id },
    });

    if (!bank) throw new Error("Bank not found");

    const newBalance =
      operation === "add" ? bank.balance + amount : bank.balance - amount;

    if (newBalance < 0) {
      throw new Error("Insufficient balance");
    }

    return await prisma.bank.update({
      where: { id },
      data: {
        balance: newBalance,
      },
    });
  }
}
