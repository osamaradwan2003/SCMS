import { prisma } from "@db/client";

export default class transactionervices {
  // Create transaction
  static async createtransaction(
    categoryId: string,
    bankId: string,
    incomeTypeId: string | null,
    expenseTypeId: string | null,
    date: Date,
    amount: number,
    note: string | null,
    userId: string
  ) {
    // Validate category and bank exist
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    const bank = await prisma.bank.findUnique({
      where: { id: bankId },
    });

    if (!bank) {
      throw new Error("Bank not found");
    }

    // Update bank balance based on category calculation method
    const newBalance =
      category.calculateMethod === "add"
        ? bank.balance + amount
        : bank.balance - amount;

    if (newBalance < 0) {
      throw new Error("Insufficient bank balance");
    }

    // Create transaction and update bank balance in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the transaction
      const transaction = await tx.transaction.create({
        data: {
          categoryId,
          bankId,
          incomeTypeId,
          expenseTypeId,
          date,
          amount,
          note,
          userId,
        },
        include: {
          category: true,
          bank: true,
          incomeType: true,
          expenseType: true,
          created_by: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
      });

      // Update bank balance
      await tx.bank.update({
        where: { id: bankId },
        data: { balance: newBalance },
      });

      return transaction;
    });

    return result;
  }

  // Find transaction by ID
  static async findById(id: string) {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        category: true,
        bank: true,
        incomeType: true,
        expenseType: true,
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });
    if (!transaction) throw new Error("transaction not found");
    return transaction;
  }

  // Get all transaction
  static async getAlltransaction() {
    return await prisma.transaction.findMany({
      include: {
        category: true,
        bank: true,
        incomeType: true,
        expenseType: true,
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });
  }

  // Update transaction
  static async updatetransaction(
    id: string,
    data: {
      categoryId?: string;
      bankId?: string;
      incomeTypeId?: string | null;
      expenseTypeId?: string | null;
      date?: Date;
      amount?: number;
      note?: string | null;
    }
  ) {
    const existingtransaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        category: true,
        bank: true,
      },
    });

    if (!existingtransaction) {
      throw new Error("transaction not found");
    }

    // If amount, category, or bank is being updated, we need to recalculate balances
    if (data.amount || data.categoryId || data.bankId) {
      return await prisma.$transaction(async (tx) => {
        // Reverse the original transaction effect
        const originalBalance =
          existingtransaction.category.calculateMethod === "add"
            ? existingtransaction.bank.balance - existingtransaction.amount
            : existingtransaction.bank.balance + existingtransaction.amount;

        await tx.bank.update({
          where: { id: existingtransaction.bankId },
          data: { balance: originalBalance },
        });

        // Get new category and bank if they're being changed
        const newCategory = data.categoryId
          ? await tx.category.findUnique({ where: { id: data.categoryId } })
          : existingtransaction.category;

        const newBank = data.bankId
          ? await tx.bank.findUnique({ where: { id: data.bankId } })
          : existingtransaction.bank;

        if (!newCategory || !newBank) {
          throw new Error("Category or Bank not found");
        }

        // Calculate new balance
        const newAmount = data.amount ?? existingtransaction.amount;
        const targetBankBalance = data.bankId
          ? newBank.balance
          : originalBalance;
        const newBalance =
          newCategory.calculateMethod === "add"
            ? targetBankBalance + newAmount
            : targetBankBalance - newAmount;

        if (newBalance < 0) {
          throw new Error("Insufficient bank balance");
        }

        // Update the transaction
        const updatedtransaction = await tx.transaction.update({
          where: { id },
          data,
          include: {
            category: true,
            bank: true,
            incomeType: true,
            expenseType: true,
            created_by: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        });

        // Update the target bank balance
        await tx.bank.update({
          where: { id: data.bankId ?? existingtransaction.bankId },
          data: { balance: newBalance },
        });

        return updatedtransaction;
      });
    }

    // Simple update without balance changes
    return await prisma.transaction.update({
      where: { id },
      data,
      include: {
        category: true,
        bank: true,
        incomeType: true,
        expenseType: true,
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });
  }

  // Delete transaction
  static async deletetransaction(id: string) {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        category: true,
        bank: true,
      },
    });

    if (!transaction) throw new Error("transaction not found");

    return await prisma.$transaction(async (tx) => {
      // Reverse the transaction effect on bank balance
      const newBalance =
        transaction.category.calculateMethod === "add"
          ? transaction.bank.balance - transaction.amount
          : transaction.bank.balance + transaction.amount;

      // Update bank balance
      await tx.bank.update({
        where: { id: transaction.bankId },
        data: { balance: newBalance },
      });

      // Delete the transaction
      return await tx.transaction.delete({
        where: { id },
      });
    });
  }

  // Paginate transaction
  static async paginate(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const transaction = await prisma.transaction.findMany({
      skip,
      take: limit,
      include: {
        category: true,
        bank: true,
        incomeType: true,
        expenseType: true,
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    const total = await prisma.transaction.count();
    const totalPages = Math.ceil(total / limit);

    return {
      data: transaction,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // Search transaction
  static async search(search: string, page: number = 1, limit?: number) {
    const whereClause = {
      OR: [
        {
          note: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          category: {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        },
        {
          bank: {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        },
      ],
    };

    const transaction = await prisma.transaction.findMany({
      where: whereClause,
      include: {
        category: true,
        bank: true,
        incomeType: true,
        expenseType: true,
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
      orderBy: {
        date: "desc",
      },
    });

    return transaction;
  }

  // Count searched transaction
  static async countSearched(search: string) {
    return await prisma.transaction.count({
      where: {
        OR: [
          {
            note: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            category: {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          },
          {
            bank: {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          },
        ],
      },
    });
  }

  // Paginate searched transaction
  static async paginateSearched(page: number, limit: number, search: string) {
    const transaction = await this.search(search, page, limit);
    const total = await this.countSearched(search);
    const totalPages = Math.ceil(total / limit);

    return {
      data: transaction,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // Get transaction by date range
  static async getByDateRange(startDate: Date, endDate: Date) {
    return await prisma.transaction.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
        bank: true,
        incomeType: true,
        expenseType: true,
      },
      orderBy: {
        date: "desc",
      },
    });
  }

  // Get transaction by bank
  static async getByBank(bankId: string) {
    return await prisma.transaction.findMany({
      where: { bankId },
      include: {
        category: true,
        incomeType: true,
        expenseType: true,
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });
  }

  // Get transaction by category
  static async getByCategory(categoryId: string) {
    return await prisma.transaction.findMany({
      where: { categoryId },
      include: {
        bank: true,
        incomeType: true,
        expenseType: true,
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });
  }

  // Get transaction statistics
  static async getStatistics() {
    const totaltransaction = await prisma.transaction.count();

    const totalIncome = await prisma.transaction.aggregate({
      where: {
        category: {
          type: "income",
        },
      },
      _sum: {
        amount: true,
      },
    });

    const totalExpenses = await prisma.transaction.aggregate({
      where: {
        category: {
          type: "expense",
        },
      },
      _sum: {
        amount: true,
      },
    });

    return {
      totaltransaction,
      totalIncome: totalIncome._sum.amount || 0,
      totalExpenses: totalExpenses._sum.amount || 0,
      netAmount:
        (totalIncome._sum.amount || 0) - (totalExpenses._sum.amount || 0),
    };
  }
}
