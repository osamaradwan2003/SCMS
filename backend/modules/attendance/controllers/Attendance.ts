import { Response } from "express";
import AttendanceServices from "../services/Attendance";
import { RequestWithUser } from "@/@types/auth";

export default class AttendanceController {
  // Student Attendance Controllers
  static async createStudentAttendance(req: RequestWithUser, res: Response) {
    const { studentId, date, status } = req.body;
    
    if (!studentId || !date || !status) {
      return res.status(400).send({
        message: "Student ID, date, and status are required",
      });
    }

    try {
      const attendance = await AttendanceServices.createStudentAttendance(
        studentId,
        new Date(date),
        status,
        req.user.id
      );
      res.status(201).send({
        message: "Student attendance created successfully",
        data: attendance,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  static async getStudentAttendanceById(req: RequestWithUser, res: Response) {
    const { id } = req.params;

    try {
      const attendance = await AttendanceServices.getStudentAttendanceById(id);
      res.send({
        message: "Student attendance retrieved successfully",
        data: attendance,
      });
    } catch (error: any) {
      res.status(404).send({ message: error.message });
    }
  }

  static async updateStudentAttendance(req: RequestWithUser, res: Response) {
    const { id } = req.params;
    const { status, date } = req.body;

    try {
      const attendance = await AttendanceServices.updateStudentAttendance(id, {
        status,
        date: date ? new Date(date) : undefined,
      });
      res.send({
        message: "Student attendance updated successfully",
        data: attendance,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  static async deleteStudentAttendance(req: RequestWithUser, res: Response) {
    const { id } = req.params;

    try {
      await AttendanceServices.deleteStudentAttendance(id);
      res.send({
        message: "Student attendance deleted successfully",
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  static async getStudentAttendanceByStudent(req: RequestWithUser, res: Response) {
    const { studentId } = req.params;

    try {
      const attendance = await AttendanceServices.getStudentAttendanceByStudent(studentId);
      res.send({
        message: "Student attendance retrieved successfully",
        data: attendance,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  static async getStudentAttendanceByDateRange(req: RequestWithUser, res: Response) {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).send({
        message: "Start date and end date are required",
      });
    }

    try {
      const attendance = await AttendanceServices.getStudentAttendanceByDateRange(
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.send({
        message: "Student attendance retrieved successfully",
        data: attendance,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Employee Attendance Controllers
  static async createEmployeeAttendance(req: RequestWithUser, res: Response) {
    const { employeeId, date, status } = req.body;
    
    if (!employeeId || !date || !status) {
      return res.status(400).send({
        message: "Employee ID, date, and status are required",
      });
    }

    try {
      const attendance = await AttendanceServices.createEmployeeAttendance(
        employeeId,
        new Date(date),
        status,
        req.user.id
      );
      res.status(201).send({
        message: "Employee attendance created successfully",
        data: attendance,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  static async getEmployeeAttendanceById(req: RequestWithUser, res: Response) {
    const { id } = req.params;

    try {
      const attendance = await AttendanceServices.getEmployeeAttendanceById(id);
      res.send({
        message: "Employee attendance retrieved successfully",
        data: attendance,
      });
    } catch (error: any) {
      res.status(404).send({ message: error.message });
    }
  }

  static async updateEmployeeAttendance(req: RequestWithUser, res: Response) {
    const { id } = req.params;
    const { status, date } = req.body;

    try {
      const attendance = await AttendanceServices.updateEmployeeAttendance(id, {
        status,
        date: date ? new Date(date) : undefined,
      });
      res.send({
        message: "Employee attendance updated successfully",
        data: attendance,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  static async deleteEmployeeAttendance(req: RequestWithUser, res: Response) {
    const { id } = req.params;

    try {
      await AttendanceServices.deleteEmployeeAttendance(id);
      res.send({
        message: "Employee attendance deleted successfully",
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  static async getEmployeeAttendanceByEmployee(req: RequestWithUser, res: Response) {
    const { employeeId } = req.params;

    try {
      const attendance = await AttendanceServices.getEmployeeAttendanceByEmployee(employeeId);
      res.send({
        message: "Employee attendance retrieved successfully",
        data: attendance,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  static async getEmployeeAttendanceByDateRange(req: RequestWithUser, res: Response) {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).send({
        message: "Start date and end date are required",
      });
    }

    try {
      const attendance = await AttendanceServices.getEmployeeAttendanceByDateRange(
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.send({
        message: "Employee attendance retrieved successfully",
        data: attendance,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Bulk Operations
  static async createBulkStudentAttendance(req: RequestWithUser, res: Response) {
    const { attendanceData } = req.body;

    if (!attendanceData || !Array.isArray(attendanceData)) {
      return res.status(400).send({
        message: "Attendance data array is required",
      });
    }

    try {
      const results = await AttendanceServices.createBulkStudentAttendance(
        attendanceData.map((data: any) => ({
          ...data,
          date: new Date(data.date),
        })),
        req.user.id
      );
      res.status(201).send({
        message: "Bulk student attendance processed",
        data: results,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  static async createBulkEmployeeAttendance(req: RequestWithUser, res: Response) {
    const { attendanceData } = req.body;

    if (!attendanceData || !Array.isArray(attendanceData)) {
      return res.status(400).send({
        message: "Attendance data array is required",
      });
    }

    try {
      const results = await AttendanceServices.createBulkEmployeeAttendance(
        attendanceData.map((data: any) => ({
          ...data,
          date: new Date(data.date),
        })),
        req.user.id
      );
      res.status(201).send({
        message: "Bulk employee attendance processed",
        data: results,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Statistics
  static async getStudentAttendanceStatistics(req: RequestWithUser, res: Response) {
    const { studentId, startDate, endDate } = req.query;

    try {
      const statistics = await AttendanceServices.getStudentAttendanceStatistics(
        studentId as string,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      res.send({
        message: "Student attendance statistics retrieved successfully",
        data: statistics,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  static async getEmployeeAttendanceStatistics(req: RequestWithUser, res: Response) {
    const { employeeId, startDate, endDate } = req.query;

    try {
      const statistics = await AttendanceServices.getEmployeeAttendanceStatistics(
        employeeId as string,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      res.send({
        message: "Employee attendance statistics retrieved successfully",
        data: statistics,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }
}
