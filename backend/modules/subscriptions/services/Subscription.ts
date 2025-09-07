import { prisma } from "@db/client";

export default class SubscriptionServices {
  // Create subscription
  static async createSubscription(
    name: string,
    value: number,
    notes: string | null,
    userId: string
  ) {
    const existingSubscription = await prisma.subscriptions.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });

    if (existingSubscription) {
      throw new Error("Subscription with this name already exists");
    }

    const subscription = await prisma.subscriptions.create({
      data: {
        name,
        value,
        notes,
        userId,
      },
      include: {
        students: {
          include: {
            Guardian: true,
            class: true,
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
    return subscription;
  }

  // Find subscription by ID
  static async findById(id: string) {
    const subscription = await prisma.subscriptions.findUnique({
      where: { id },
      include: {
        students: {
          include: {
            Guardian: true,
            class: true,
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
    if (!subscription) throw new Error("Subscription not found");
    return subscription;
  }

  // Get all subscriptions
  static async getAllSubscriptions() {
    return await prisma.subscriptions.findMany({
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
            students: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  // Update subscription
  static async updateSubscription(
    id: string,
    data: {
      name?: string;
      value?: number;
      notes?: string | null;
    }
  ) {
    if (data.name) {
      const existingSubscription = await prisma.subscriptions.findFirst({
        where: { 
          name: { equals: data.name, mode: "insensitive" },
          NOT: { id },
        },
      });

      if (existingSubscription) {
        throw new Error("Subscription with this name already exists");
      }
    }

    const subscription = await prisma.subscriptions.update({
      where: { id },
      data,
      include: {
        students: {
          include: {
            Guardian: true,
            class: true,
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
    return subscription;
  }

  // Delete subscription
  static async deleteSubscription(id: string) {
    // Check if subscription has students
    const subscription = await prisma.subscriptions.findUnique({
      where: { id },
      include: {
        students: true,
      },
    });

    if (!subscription) throw new Error("Subscription not found");
    
    if (subscription.students.length > 0) {
      throw new Error("Cannot delete subscription with enrolled students");
    }

    return await prisma.subscriptions.delete({
      where: { id },
    });
  }

  // Paginate subscriptions
  static async paginate(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const subscriptions = await prisma.subscriptions.findMany({
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
            students: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const total = await prisma.subscriptions.count();
    const totalPages = Math.ceil(total / limit);

    return {
      data: subscriptions,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // Search subscriptions
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
          notes: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    };

    const subscriptions = await prisma.subscriptions.findMany({
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
            students: true,
          },
        },
      },
      skip: limit ? (page - 1) * limit : 0,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
    });

    return subscriptions;
  }

  // Count searched subscriptions
  static async countSearched(search: string) {
    return await prisma.subscriptions.count({
      where: {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            notes: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        ],
      },
    });
  }

  // Paginate searched subscriptions
  static async paginateSearched(page: number, limit: number, search: string) {
    const subscriptions = await this.search(search, page, limit);
    const total = await this.countSearched(search);
    const totalPages = Math.ceil(total / limit);

    return {
      data: subscriptions,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // Delete many subscriptions
  static async deleteMany(ids: string[]) {
    // Check if any subscriptions have students
    const subscriptionsWithStudents = await prisma.subscriptions.findMany({
      where: {
        id: { in: ids },
      },
      include: {
        students: true,
      },
    });

    const subscriptionsWithStudentsList = subscriptionsWithStudents.filter(
      (subscription) => subscription.students.length > 0
    );

    if (subscriptionsWithStudentsList.length > 0) {
      throw new Error(
        `Cannot delete subscriptions with enrolled students: ${subscriptionsWithStudentsList
          .map((s) => s.name)
          .join(", ")}`
      );
    }

    return await prisma.subscriptions.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  // Get subscription statistics
  static async getStatistics() {
    const totalSubscriptions = await prisma.subscriptions.count();
    
    const totalRevenue = await prisma.subscriptions.aggregate({
      _sum: {
        value: true,
      },
    });

    const averageValue = await prisma.subscriptions.aggregate({
      _avg: {
        value: true,
      },
    });

    const totalStudents = await prisma.student.count();

    return {
      totalSubscriptions,
      totalRevenue: totalRevenue._sum.value || 0,
      averageValue: averageValue._avg.value || 0,
      totalStudents,
    };
  }

  // Get subscriptions with counts
  static async getSubscriptionsWithCounts() {
    return await prisma.subscriptions.findMany({
      select: {
        id: true,
        name: true,
        value: true,
        _count: {
          select: {
            students: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  }
}
