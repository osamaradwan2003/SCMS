import { prisma } from "@db/client";

export default class SubjectServices {
  // Create subject
  static async createSubject(
    name: string,
    userId: string
  ) {
    const existingSubject = await prisma.subject.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });

    if (existingSubject) {
      throw new Error("Subject with this name already exists");
    }

    const subject = await prisma.subject.create({
      data: {
        name,
        userId,
      },
      include: {
        classes: {
          select: {
            id: true,
            name: true,
          },
        },
        reports: {
          select: {
            id: true,
            week: true,
            score: true,
            student: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          take: 5,
          orderBy: {
            created_at: "desc",
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
    return subject;
  }

  // Find subject by ID
  static async findById(id: string) {
    const subject = await prisma.subject.findUnique({
      where: { id },
      include: {
        classes: {
          include: {
            students: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        reports: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                class: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: {
            created_at: "desc",
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
    if (!subject) throw new Error("Subject not found");
    return subject;
  }

  // Get all subjects
  static async getAllSubjects() {
    return await prisma.subject.findMany({
      include: {
        classes: {
          select: {
            id: true,
            name: true,
          },
        },
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        _count: {
          select: {
            classes: true,
            reports: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  // Update subject
  static async updateSubject(
    id: string,
    data: {
      name?: string;
    }
  ) {
    if (data.name) {
      const existingSubject = await prisma.subject.findFirst({
        where: { 
          name: { equals: data.name, mode: "insensitive" },
          NOT: { id },
        },
      });

      if (existingSubject) {
        throw new Error("Subject with this name already exists");
      }
    }

    const subject = await prisma.subject.update({
      where: { id },
      data,
      include: {
        classes: {
          select: {
            id: true,
            name: true,
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
    return subject;
  }

  // Delete subject
  static async deleteSubject(id: string) {
    // Check if subject has reports
    const subject = await prisma.subject.findUnique({
      where: { id },
      include: {
        reports: true,
        classes: true,
      },
    });

    if (!subject) throw new Error("Subject not found");
    
    if (subject.reports.length > 0) {
      throw new Error("Cannot delete subject with existing reports");
    }

    // Disconnect from classes first
    await prisma.subject.update({
      where: { id },
      data: {
        classes: {
          set: [],
        },
      },
    });

    return await prisma.subject.delete({
      where: { id },
    });
  }

  // Paginate subjects
  static async paginate(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const subjects = await prisma.subject.findMany({
      skip,
      take: limit,
      include: {
        classes: {
          select: {
            id: true,
            name: true,
          },
        },
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        _count: {
          select: {
            classes: true,
            reports: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const total = await prisma.subject.count();
    const totalPages = Math.ceil(total / limit);

    return {
      data: subjects,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // Search subjects
  static async search(search: string, page: number = 1, limit?: number) {
    const whereClause = {
      name: {
        contains: search,
        mode: "insensitive" as const,
      },
    };

    const subjects = await prisma.subject.findMany({
      where: whereClause,
      include: {
        classes: {
          select: {
            id: true,
            name: true,
          },
        },
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        _count: {
          select: {
            classes: true,
            reports: true,
          },
        },
      },
      skip: limit ? (page - 1) * limit : 0,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
    });

    return subjects;
  }

  // Count searched subjects
  static async countSearched(search: string) {
    return await prisma.subject.count({
      where: {
        name: {
          contains: search,
          mode: "insensitive" as const,
        },
      },
    });
  }

  // Paginate searched subjects
  static async paginateSearched(page: number, limit: number, search: string) {
    const subjects = await this.search(search, page, limit);
    const total = await this.countSearched(search);
    const totalPages = Math.ceil(total / limit);

    return {
      data: subjects,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // Delete many subjects
  static async deleteMany(ids: string[]) {
    // Check if any subjects have reports
    const subjectsWithReports = await prisma.subject.findMany({
      where: {
        id: { in: ids },
      },
      include: {
        reports: true,
      },
    });

    const subjectsWithReportsList = subjectsWithReports.filter(
      (subject) => subject.reports.length > 0
    );

    if (subjectsWithReportsList.length > 0) {
      throw new Error(
        `Cannot delete subjects with existing reports: ${subjectsWithReportsList
          .map((s) => s.name)
          .join(", ")}`
      );
    }

    // Disconnect from classes first
    for (const id of ids) {
      await prisma.subject.update({
        where: { id },
        data: {
          classes: {
            set: [],
          },
        },
      });
    }

    return await prisma.subject.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  // Get subjects with counts
  static async getSubjectsWithCounts() {
    return await prisma.subject.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            classes: true,
            reports: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  // Get subjects by class
  static async getByClass(classId: string) {
    return await prisma.subject.findMany({
      where: {
        classes: {
          some: {
            id: classId,
          },
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
      },
      orderBy: {
        name: "asc",
      },
    });
  }
}
