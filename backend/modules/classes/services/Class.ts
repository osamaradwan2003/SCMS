import { prisma } from "@db/client";

export default class ClassServices {
  // Create class
  static async createClass(
    name: string,
    userId: string
  ) {
    const existingClass = await prisma.class.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });

    if (existingClass) {
      throw new Error("Class with this name already exists");
    }

    const classEntity = await prisma.class.create({
      data: {
        name,
        userId,
      },
      include: {
        students: {
          include: {
            Guardian: true,
          },
        },
        subjects: true,
        teachers: true,
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });
    return classEntity;
  }

  // Find class by ID
  static async findById(id: string) {
    const classEntity = await prisma.class.findUnique({
      where: { id },
      include: {
        students: {
          include: {
            Guardian: true,
            Subscriptions: true,
          },
          orderBy: {
            name: "asc",
          },
        },
        subjects: true,
        teachers: true,
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });
    if (!classEntity) throw new Error("Class not found");
    return classEntity;
  }

  // Get all classes
  static async getAllClasses() {
    return await prisma.class.findMany({
      include: {
        students: {
          select: {
            id: true,
            name: true,
          },
        },
        subjects: {
          select: {
            id: true,
            name: true,
          },
        },
        teachers: {
          select: {
            id: true,
            name: true,
            role: true,
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
            students: true,
            subjects: true,
            teachers: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  // Update class
  static async updateClass(
    id: string,
    data: {
      name?: string;
    }
  ) {
    if (data.name) {
      const existingClass = await prisma.class.findFirst({
        where: { 
          name: { equals: data.name, mode: "insensitive" },
          NOT: { id },
        },
      });

      if (existingClass) {
        throw new Error("Class with this name already exists");
      }
    }

    const classEntity = await prisma.class.update({
      where: { id },
      data,
      include: {
        students: {
          include: {
            Guardian: true,
          },
        },
        subjects: true,
        teachers: true,
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });
    return classEntity;
  }

  // Delete class
  static async deleteClass(id: string) {
    // Check if class has students
    const classEntity = await prisma.class.findUnique({
      where: { id },
      include: {
        students: true,
        teachers: true,
      },
    });

    if (!classEntity) throw new Error("Class not found");
    
    if (classEntity.students.length > 0) {
      throw new Error("Cannot delete class with enrolled students");
    }

    if (classEntity.teachers.length > 0) {
      throw new Error("Cannot delete class with assigned teachers");
    }

    return await prisma.class.delete({
      where: { id },
    });
  }

  // Paginate classes
  static async paginate(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const classes = await prisma.class.findMany({
      skip,
      take: limit,
      include: {
        students: {
          select: {
            id: true,
            name: true,
          },
        },
        subjects: {
          select: {
            id: true,
            name: true,
          },
        },
        teachers: {
          select: {
            id: true,
            name: true,
            role: true,
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
            students: true,
            subjects: true,
            teachers: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const total = await prisma.class.count();
    const totalPages = Math.ceil(total / limit);

    return {
      data: classes,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // Search classes
  static async search(search: string, page: number = 1, limit?: number) {
    const whereClause = {
      name: {
        contains: search,
        mode: "insensitive" as const,
      },
    };

    const classes = await prisma.class.findMany({
      where: whereClause,
      include: {
        students: {
          select: {
            id: true,
            name: true,
          },
        },
        subjects: {
          select: {
            id: true,
            name: true,
          },
        },
        teachers: {
          select: {
            id: true,
            name: true,
            role: true,
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
            students: true,
            subjects: true,
            teachers: true,
          },
        },
      },
      skip: limit ? (page - 1) * limit : 0,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
    });

    return classes;
  }

  // Count searched classes
  static async countSearched(search: string) {
    return await prisma.class.count({
      where: {
        name: {
          contains: search,
          mode: "insensitive" as const,
        },
      },
    });
  }

  // Paginate searched classes
  static async paginateSearched(page: number, limit: number, search: string) {
    const classes = await this.search(search, page, limit);
    const total = await this.countSearched(search);
    const totalPages = Math.ceil(total / limit);

    return {
      data: classes,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // Delete many classes
  static async deleteMany(ids: string[]) {
    // Check if any classes have students or teachers
    const classesWithRelations = await prisma.class.findMany({
      where: {
        id: { in: ids },
      },
      include: {
        students: true,
        teachers: true,
      },
    });

    const classesWithStudents = classesWithRelations.filter(
      (classEntity) => classEntity.students.length > 0
    );

    const classesWithTeachers = classesWithRelations.filter(
      (classEntity) => classEntity.teachers.length > 0
    );

    if (classesWithStudents.length > 0) {
      throw new Error(
        `Cannot delete classes with enrolled students: ${classesWithStudents
          .map((c) => c.name)
          .join(", ")}`
      );
    }

    if (classesWithTeachers.length > 0) {
      throw new Error(
        `Cannot delete classes with assigned teachers: ${classesWithTeachers
          .map((c) => c.name)
          .join(", ")}`
      );
    }

    return await prisma.class.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  // Add subjects to class
  static async addSubjects(classId: string, subjectIds: string[]) {
    const classEntity = await prisma.class.update({
      where: { id: classId },
      data: {
        subjects: {
          connect: subjectIds.map(id => ({ id })),
        },
      },
      include: {
        subjects: true,
      },
    });
    return classEntity;
  }

  // Remove subjects from class
  static async removeSubjects(classId: string, subjectIds: string[]) {
    const classEntity = await prisma.class.update({
      where: { id: classId },
      data: {
        subjects: {
          disconnect: subjectIds.map(id => ({ id })),
        },
      },
      include: {
        subjects: true,
      },
    });
    return classEntity;
  }

  // Get classes with student count
  static async getClassesWithCounts() {
    return await prisma.class.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            students: true,
            subjects: true,
            teachers: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  }
}
