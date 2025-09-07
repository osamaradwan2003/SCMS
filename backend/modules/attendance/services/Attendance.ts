import { prisma } from "@db/client";

export default class AttendanceServices {
  // Student Attendance Services
  static async createStudentAttendance(
    studentId: string,
    date: Date,
    status: string,
    userId: string
  ) {
    // Check if attendance already exists for this student on this date
    const existingAttendance = await prisma.stuednAttendance.findFirst({
      where: {
        studentID: studentId,
        date: {
          gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
        },
      },
    });

    if (existingAttendance) {
      throw new Error("Attendance already recorded for this student on this date");
    }

    const attendance = await prisma.stuednAttendance.create({
      data: {
        studentID: studentId,
        date,
        status,
        userId,
      },
      include: {
        student: {
          include: {
            class: true,
            Guardian: true,
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
    return attendance;
  }

  static async getStudentAttendanceById(id: string) {
    const attendance = await prisma.stuednAttendance.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            class: true,
            Guardian: true,
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
    if (!attendance) throw new Error("Student attendance not found");
    return attendance;
  }

  static async updateStudentAttendance(
    id: string,
    data: {
      status?: string;
      date?: Date;
    }
  ) {
    const attendance = await prisma.stuednAttendance.update({
      where: { id },
      data,
      include: {
        student: {
          include: {
            class: true,
            Guardian: true,
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
    return attendance;
  }

  static async deleteStudentAttendance(id: string) {
    return await prisma.stuednAttendance.delete({
      where: { id },
    });
  }

  static async getStudentAttendanceByStudent(studentId: string) {
    return await prisma.stuednAttendance.findMany({
      where: { studentID: studentId },
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
        date: "desc",
      },
    });
  }

  static async getStudentAttendanceByDateRange(startDate: Date, endDate: Date) {
    return await prisma.stuednAttendance.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        student: {
          include: {
            class: true,
            Guardian: true,
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
        date: "desc",
      },
    });
  }

  // Employee Attendance Services
  static async createEmployeeAttendance(
    employeeId: string,
    date: Date,
    status: string,
    userId: string
  ) {
    // Check if attendance already exists for this employee on this date
    const existingAttendance = await prisma.employeeAttendance.findFirst({
      where: {
        employeeId,
        date: {
          gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
        },
      },
    });

    if (existingAttendance) {
      throw new Error("Attendance already recorded for this employee on this date");
    }

    const attendance = await prisma.employeeAttendance.create({
      data: {
        employeeId,
        date,
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
    return attendance;
  }

  static async getEmployeeAttendanceById(id: string) {
    const attendance = await prisma.employeeAttendance.findUnique({
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
    if (!attendance) throw new Error("Employee attendance not found");
    return attendance;
  }

  static async updateEmployeeAttendance(
    id: string,
    data: {
      status?: string;
      date?: Date;
    }
  ) {
    const attendance = await prisma.employeeAttendance.update({
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
    return attendance;
  }

  static async deleteEmployeeAttendance(id: string) {
    return await prisma.employeeAttendance.delete({
      where: { id },
    });
  }

  static async getEmployeeAttendanceByEmployee(employeeId: string) {
    return await prisma.employeeAttendance.findMany({
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
      orderBy: {
        date: "desc",
      },
    });
  }

  static async getEmployeeAttendanceByDateRange(startDate: Date, endDate: Date) {
    return await prisma.employeeAttendance.findMany({
      where: {
        date: {
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
      orderBy: {
        date: "desc",
      },
    });
  }

  // Bulk attendance operations
  static async createBulkStudentAttendance(
    attendanceData: Array<{
      studentId: string;
      date: Date;
      status: string;
    }>,
    userId: string
  ) {
    const results = [];
    for (const data of attendanceData) {
      try {
        const attendance = await this.createStudentAttendance(
          data.studentId,
          data.date,
          data.status,
          userId
        );
        results.push({ success: true, data: attendance });
      } catch (error: any) {
        results.push({ success: false, error: error.message, studentId: data.studentId });
      }
    }
    return results;
  }

  static async createBulkEmployeeAttendance(
    attendanceData: Array<{
      employeeId: string;
      date: Date;
      status: string;
    }>,
    userId: string
  ) {
    const results = [];
    for (const data of attendanceData) {
      try {
        const attendance = await this.createEmployeeAttendance(
          data.employeeId,
          data.date,
          data.status,
          userId
        );
        results.push({ success: true, data: attendance });
      } catch (error: any) {
        results.push({ success: false, error: error.message, employeeId: data.employeeId });
      }
    }
    return results;
  }

  // Statistics
  static async getStudentAttendanceStatistics(studentId?: string, startDate?: Date, endDate?: Date) {
    const whereClause: any = {};
    
    if (studentId) {
      whereClause.studentID = studentId;
    }
    
    if (startDate && endDate) {
      whereClause.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    const totalRecords = await prisma.stuednAttendance.count({ where: whereClause });
    
    const presentCount = await prisma.stuednAttendance.count({
      where: { ...whereClause, status: "present" },
    });
    
    const absentCount = await prisma.stuednAttendance.count({
      where: { ...whereClause, status: "absent" },
    });

    return {
      totalRecords,
      presentCount,
      absentCount,
      attendanceRate: totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0,
    };
  }

  static async getEmployeeAttendanceStatistics(employeeId?: string, startDate?: Date, endDate?: Date) {
    const whereClause: any = {};
    
    if (employeeId) {
      whereClause.employeeId = employeeId;
    }
    
    if (startDate && endDate) {
      whereClause.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    const totalRecords = await prisma.employeeAttendance.count({ where: whereClause });
    
    const presentCount = await prisma.employeeAttendance.count({
      where: { ...whereClause, status: "present" },
    });
    
    const absentCount = await prisma.employeeAttendance.count({
      where: { ...whereClause, status: "absent" },
    });

    return {
      totalRecords,
      presentCount,
      absentCount,
      attendanceRate: totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0,
    };
  }
}
