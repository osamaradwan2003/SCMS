import { prisma } from "@db/client";

export default class WeeklyReportServices {
  // Create weekly report
  static async createWeeklyReport(
    studentId: string,
    subjectId: string,
    week: Date,
    strengths: string,
    weaknesses: string,
    score: number,
    adherence: string,
    createdById: string,
    userId: string
  ) {
    // Check if report already exists for this student, subject, and week
    const startOfWeek = new Date(week);
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(week);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    const existingReport = await prisma.weeklyReport.findFirst({
      where: {
        studentId,
        subjectId,
        week: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
    });

    if (existingReport) {
      throw new Error("Weekly report already exists for this student, subject, and week");
    }

    const report = await prisma.weeklyReport.create({
      data: {
        studentId,
        subjectId,
        week,
        strengths,
        weaknesses,
        score,
        adherence,
        createdById,
        userId,
      },
      include: {
        student: {
          include: {
            Guardian: true,
            class: true,
          },
        },
        subject: true,
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });
    return report;
  }

  // Find weekly report by ID
  static async findById(id: string) {
    const report = await prisma.weeklyReport.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            Guardian: true,
            class: true,
          },
        },
        subject: true,
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });
    if (!report) throw new Error("Weekly report not found");
    return report;
  }

  // Get all weekly reports
  static async getAllWeeklyReports() {
    return await prisma.weeklyReport.findMany({
      include: {
        student: {
          include: {
            Guardian: true,
            class: true,
          },
        },
        subject: true,
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: [
        { week: "desc" },
        { created_at: "desc" },
      ],
    });
  }

  // Update weekly report
  static async updateWeeklyReport(
    id: string,
    data: {
      score?: number;
      strengths?: string;
      weaknesses?: string;
      adherence?: string;
      week?: Date;
    }
  ) {
    // If week is being updated, check for duplicates
    if (data.week !== undefined) {
      const currentReport = await prisma.weeklyReport.findUnique({
        where: { id },
      });

      if (!currentReport) {
        throw new Error("Weekly report not found");
      }

      const newWeek = data.week;
      const startOfWeek = new Date(newWeek);
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(newWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const existingReport = await prisma.weeklyReport.findFirst({
        where: {
          studentId: currentReport.studentId,
          subjectId: currentReport.subjectId,
          week: {
            gte: startOfWeek,
            lte: endOfWeek,
          },
          NOT: { id },
        },
      });

      if (existingReport) {
        throw new Error("Weekly report already exists for this student, subject, and week");
      }
    }

    const report = await prisma.weeklyReport.update({
      where: { id },
      data,
      include: {
        student: {
          include: {
            Guardian: true,
            class: true,
          },
        },
        subject: true,
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });
    return report;
  }

  // Delete weekly report
  static async deleteWeeklyReport(id: string) {
    const report = await prisma.weeklyReport.findUnique({
      where: { id },
    });

    if (!report) throw new Error("Weekly report not found");

    return await prisma.weeklyReport.delete({
      where: { id },
    });
  }

  // Paginate weekly reports
  static async paginate(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const reports = await prisma.weeklyReport.findMany({
      skip,
      take: limit,
      include: {
        student: {
          include: {
            Guardian: true,
            class: true,
          },
        },
        subject: true,
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: [
        { week: "desc" },
        { created_at: "desc" },
      ],
    });

    const total = await prisma.weeklyReport.count();
    const totalPages = Math.ceil(total / limit);

    return {
      data: reports,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // Search weekly reports
  static async search(search: string, page: number = 1, limit?: number) {
    const whereClause = {
      OR: [
        {
          student: {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        },
        {
          subject: {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        },
        {
          strengths: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          weaknesses: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          adherence: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    };

    const reports = await prisma.weeklyReport.findMany({
      where: whereClause,
      include: {
        student: {
          include: {
            Guardian: true,
            class: true,
          },
        },
        subject: true,
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
        { week: "desc" },
        { created_at: "desc" },
      ],
    });

    return reports;
  }

  // Count searched weekly reports
  static async countSearched(search: string) {
    return await prisma.weeklyReport.count({
      where: {
        OR: [
          {
            student: {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          },
          {
            subject: {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          },
          {
            strengths: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            weaknesses: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            adherence: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        ],
      },
    });
  }

  // Paginate searched weekly reports
  static async paginateSearched(page: number, limit: number, search: string) {
    const reports = await this.search(search, page, limit);
    const total = await this.countSearched(search);
    const totalPages = Math.ceil(total / limit);

    return {
      data: reports,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // Get reports by student
  static async getByStudent(studentId: string) {
    return await prisma.weeklyReport.findMany({
      where: { studentId },
      include: {
        subject: true,
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: [
        { week: "desc" },
      ],
    });
  }

  // Get reports by subject
  static async getBySubject(subjectId: string) {
    return await prisma.weeklyReport.findMany({
      where: { subjectId },
      include: {
        student: {
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
      orderBy: [
        { week: "desc" },
      ],
    });
  }

  // Get reports by week and year
  static async getByWeekYear(week: number, year: number) {
    const startOfWeek = new Date(year, 0, 1 + (week - 1) * 7);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    
    return await prisma.weeklyReport.findMany({
      where: {
        week: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
      include: {
        student: {
          include: {
            Guardian: true,
            class: true,
          },
        },
        subject: true,
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: {
        student: {
          name: "asc",
        },
      },
    });
  }

  // Get reports by date range
  static async getByWeekRange(startDate: Date, endDate: Date) {
    return await prisma.weeklyReport.findMany({
      where: {
        week: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        student: {
          include: {
            Guardian: true,
            class: true,
          },
        },
        subject: true,
        created_by: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: [
        { week: "desc" },
        { student: { name: "asc" } },
      ],
    });
  }

  // Get reports by student and subject
  static async getByStudentSubject(studentId: string, subjectId: string) {
    return await prisma.weeklyReport.findMany({
      where: {
        studentId,
        subjectId,
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
      orderBy: [
        { week: "desc" },
      ],
    });
  }

  // Delete many weekly reports
  static async deleteMany(ids: string[]) {
    return await prisma.weeklyReport.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  // Get weekly report statistics
  static async getStatistics(startDate?: Date, endDate?: Date, studentId?: string, subjectId?: string) {
    const whereClause: any = {};
    
    if (startDate || endDate) {
      whereClause.week = {};
      if (startDate) {
        whereClause.week.gte = startDate;
      }
      if (endDate) {
        whereClause.week.lte = endDate;
      }
    }

    if (studentId) {
      whereClause.studentId = studentId;
    }

    if (subjectId) {
      whereClause.subjectId = subjectId;
    }

    const totalReports = await prisma.weeklyReport.count({ where: whereClause });
    
    const averageGrade = await prisma.weeklyReport.aggregate({
      where: whereClause,
      _avg: {
        score: true,
      },
    });

    const maxGrade = await prisma.weeklyReport.aggregate({
      where: whereClause,
      _max: {
        score: true,
      },
    });

    const minGrade = await prisma.weeklyReport.aggregate({
      where: whereClause,
      _min: {
        score: true,
      },
    });

    return {
      totalReports,
      averageScore: averageGrade._avg?.score || 0,
      maxScore: maxGrade._max?.score || 0,
      minScore: minGrade._min?.score || 0,
    };
  }

  // Get student performance summary
  static async getStudentPerformanceSummary(studentId: string, year?: number) {
    const whereClause: any = { studentId };
    
    if (year !== undefined) {
      whereClause.year = year;
    }

    const totalReports = await prisma.weeklyReport.count({ where: whereClause });
    
    const averageGrade = await prisma.weeklyReport.aggregate({
      where: whereClause,
      _avg: {
        score: true,
      },
    });

    const subjectPerformance = await prisma.weeklyReport.groupBy({
      by: ['subjectId'],
      where: whereClause,
      _avg: {
        score: true,
      },
      _count: {
        score: true,
      },
    });

    const subjectDetails = await Promise.all(
      subjectPerformance.map(async (perf) => {
        const subject = await prisma.subject.findUnique({
          where: { id: perf.subjectId },
          select: { id: true, name: true },
        });
        return {
          subject,
          averageScore: perf._avg?.score || 0,
          totalReports: perf._count?.score || 0,
        };
      })
    );

    return {
      totalReports,
      overallAverageScore: averageGrade._avg?.score || 0,
      subjectPerformance: subjectDetails,
    };
  }

  // Get class performance summary
  static async getClassPerformanceSummary(classId: string, week?: number, year?: number) {
    const whereClause: any = {
      student: {
        classId,
      },
    };
    
    if (week !== undefined) {
      whereClause.week = week;
    }
    
    if (year !== undefined) {
      whereClause.year = year;
    }

    const reports = await prisma.weeklyReport.findMany({
      where: whereClause,
      include: {
        student: {
          select: {
            id: true,
            name: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const totalReports = reports.length;

    const averageScore = reports.reduce((sum: number, report: any) => sum + report.score, 0) / totalReports || 0;

    const studentPerformance = reports.reduce((acc: any, report: any) => {
      const studentId = report.student.id;
      if (!acc[studentId]) {
        acc[studentId] = {
          student: report.student,
          totalScore: report.score,
          reportCount: 1,
          averageScore: report.score,
        };
      } else {
        acc[studentId].totalScore += report.score;
        acc[studentId].reportCount += 1;
        acc[studentId].averageScore = acc[studentId].totalScore / acc[studentId].reportCount;
      }
      return acc;
    }, {});

    const studentSummary = Object.values(studentPerformance).map((perf: any) => ({
      student: perf.student,
      averageScore: perf.averageScore,
      totalReports: perf.reportCount,
    }));

    return {
      totalReports,
      classAverageScore: averageScore,
      studentPerformance: studentSummary,
    };
  }
}
