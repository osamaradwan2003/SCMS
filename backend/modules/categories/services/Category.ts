import { prisma } from "@db/client";

export default class CategoryServices {
  // Create category
  static async createCategory(
    name: string,
    type: string,
    calculateMethod: string,
    userId: string
  ) {
    if (!["income", "expense"].includes(type)) {
      throw new Error("Type must be either 'income' or 'expense'");
    }

    if (!["add", "subtract"].includes(calculateMethod)) {
      throw new Error("Calculate method must be either 'add' or 'subtract'");
    }

    const existingCategory = await prisma.category.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        type,
      },
    });

    if (existingCategory) {
      throw new Error(`${type} category with this name already exists`);
    }

    const category = await prisma.category.create({
      data: {
        name,
        type,
        calculateMethod,
        userId,
      },
      include: {
        transaction: {
          orderBy: {
            date: "desc",
          },
          take: 5,
          include: {
            bank: true,
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
    return category;
  }

  // Find category by ID
  static async findById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        transaction: {
          orderBy: {
            date: "desc",
          },
          include: {
            bank: true,
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
    if (!category) throw new Error("Category not found");
    return category;
  }

  // Get all categories
  static async getAllCategories() {
    return await prisma.category.findMany({
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
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });
  }

  // Get categories by type
  static async getByType(type: string) {
    return await prisma.category.findMany({
      where: { type },
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
        name: "asc",
      },
    });
  }

  // Update category
  static async updateCategory(
    id: string,
    data: {
      name?: string;
      type?: string;
      calculateMethod?: string;
    }
  ) {
    if (data.type && !["income", "expense"].includes(data.type)) {
      throw new Error("Type must be either 'income' or 'expense'");
    }

    if (
      data.calculateMethod &&
      !["add", "subtract"].includes(data.calculateMethod)
    ) {
      throw new Error("Calculate method must be either 'add' or 'subtract'");
    }

    if (data.name || data.type) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          name: { equals: data.name || undefined, mode: "insensitive" },
          type: data.type,
          NOT: { id },
        },
      });

      if (existingCategory) {
        throw new Error(
          `Category with this name already exists in ${
            data.type || "this"
          } type`
        );
      }
    }

    const category = await prisma.category.update({
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
    return category;
  }

  // Delete category
  static async deleteCategory(id: string) {
    // Check if category has transaction
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        transaction: true,
      },
    });

    if (!category) throw new Error("Category not found");

    if (category.transaction.length > 0) {
      throw new Error("Cannot delete category with existing transaction");
    }

    return await prisma.category.delete({
      where: { id },
    });
  }

  // Paginate categories
  static async paginate(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const categories = await prisma.category.findMany({
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
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });

    const total = await prisma.category.count();
    const totalPages = Math.ceil(total / limit);

    return {
      data: categories,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // Search categories
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
          type: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    };

    const categories = await prisma.category.findMany({
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
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });

    return categories;
  }

  // Count searched categories
  static async countSearched(search: string) {
    return await prisma.category.count({
      where: {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            type: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        ],
      },
    });
  }

  // Paginate searched categories
  static async paginateSearched(page: number, limit: number, search: string) {
    const categories = await this.search(search, page, limit);
    const total = await this.countSearched(search);
    const totalPages = Math.ceil(total / limit);

    return {
      data: categories,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // Delete many categories
  static async deleteMany(ids: string[]) {
    // Check if any categories have transaction
    const categoriesWithtransaction = await prisma.category.findMany({
      where: {
        id: { in: ids },
      },
      include: {
        transaction: true,
      },
    });

    const categoriesWithtransactionList = categoriesWithtransaction.filter(
      (category) => category.transaction.length > 0
    );

    if (categoriesWithtransactionList.length > 0) {
      throw new Error(
        `Cannot delete categories with existing transaction: ${categoriesWithtransactionList
          .map((c) => c.name)
          .join(", ")}`
      );
    }

    return await prisma.category.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  // Get category statistics
  static async getStatistics() {
    const totalCategories = await prisma.category.count();
    const incomeCategories = await prisma.category.count({
      where: { type: "income" },
    });
    const expenseCategories = await prisma.category.count({
      where: { type: "expense" },
    });

    return {
      totalCategories,
      incomeCategories,
      expenseCategories,
    };
  }
}
