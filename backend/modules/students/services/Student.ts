import { prisma } from "@db/client";
import { BaseService, ValidationHelpers, ValidationError } from "../../../app";

interface StudentCreateData {
  name: string;
  dob: Date;
  phone?: string | null;
  image?: string | null;
  gender?: string | null;
  address: string;
  docs?: string | null;
  classId?: string | null;
  guardianId: string;
  subscriptionsId: string;
}

interface StudentUpdateData {
  name?: string;
  dob?: Date;
  phone?: string | null;
  image?: string | null;
  gender?: string | null;
  address?: string;
  docs?: string | null;
  classId?: string | null;
  guardianId?: string;
  subscriptionsId?: string;
}

export default class StudentServices extends BaseService<
  any,
  StudentCreateData,
  StudentUpdateData
> {
  protected modelName = "student";
  protected searchFields = ["name", "phone", "address"];
  protected defaultIncludes = {
    class: true,
    Guardian: true,
    Subscriptions: true,
    created_by: {
      select: {
        id: true,
        name: true,
        username: true,
      },
    },
  };
  protected defaultOrderBy = { created_at: "desc" };

  protected validateCreateData(data: StudentCreateData): void {
    ValidationHelpers.validateRequired(data, [
      "name",
      "address",
      "guardianId",
      "subscriptionsId",
    ]);

    ValidationHelpers.validateLength(data.name, 2, 100, "Name");
    ValidationHelpers.validateLength(data.address, 5, 200, "Address");

    if (data.phone && !ValidationHelpers.validatePhone(data.phone)) {
      throw new ValidationError("Invalid phone number format");
    }

    ValidationHelpers.validateDate(data.dob, "Date of birth");
    ValidationHelpers.validatePastDate(data.dob, "Date of birth");

    if (data.gender) {
      ValidationHelpers.validateEnum(data.gender, ["male", "female"], "Gender");
    }
  }

  protected validateUpdateData(data: StudentUpdateData): void {
    if (data.name) {
      ValidationHelpers.validateLength(data.name, 2, 100, "Name");
    }

    if (data.address) {
      ValidationHelpers.validateLength(data.address, 5, 200, "Address");
    }

    if (data.phone && !ValidationHelpers.validatePhone(data.phone)) {
      throw new ValidationError("Invalid phone number format");
    }

    if (data.dob) {
      ValidationHelpers.validateDate(data.dob, "Date of birth");
      ValidationHelpers.validatePastDate(data.dob, "Date of birth");
    }

    if (data.gender) {
      ValidationHelpers.validateEnum(data.gender, ["male", "female"], "Gender");
    }
  }

  protected async beforeDelete(id: string): Promise<void> {
    // Delete related records first
    await this.prisma.weeklyReport.deleteMany({
      where: { studentId: id },
    });

    await this.prisma.stuednAttendance.deleteMany({
      where: { studentID: id },
    });

    await this.prisma.messageLog.deleteMany({
      where: { studentId: id },
    });
  }

  // Custom methods specific to students
  async getByClass(classId: string) {
    return await this.prisma.student.findMany({
      where: { classId },
      include: this.defaultIncludes,
      orderBy: { name: "asc" },
    });
  }

  async getByGuardian(guardianId: string) {
    return await this.prisma.student.findMany({
      where: { guardianId },
      include: this.defaultIncludes,
      orderBy: { name: "asc" },
    });
  }

  async findByIdWithDetails(id: string) {
    return await this.prisma.student.findUnique({
      where: { id },
      include: {
        ...this.defaultIncludes,
        reports: {
          include: {
            subject: true,
          },
        },
        StuednAttendance: {
          orderBy: {
            date: "desc",
          },
          take: 10,
        },
      },
    });
  }

  // Legacy static methods for backward compatibility
  static async createStudent(
    name: string,
    dob: Date,
    phone: string | null,
    image: string | null,
    gender: string | null,
    address: string,
    docs: string | null,
    classId: string | null,
    guardianId: string,
    subscriptionsId: string,
    userId: string
  ) {
    const instance = new StudentServices();
    return await instance.create(
      {
        name,
        dob,
        phone,
        image,
        gender,
        address,
        docs,
        classId,
        guardianId,
        subscriptionsId,
      },
      userId
    );
  }

  static async findById(id: string) {
    const instance = new StudentServices();
    return await instance.findByIdWithDetails(id);
  }

  static async getAllStudents() {
    const instance = new StudentServices();
    return await instance.findAll();
  }

  static async updateStudent(id: string, data: StudentUpdateData) {
    const instance = new StudentServices();
    return await instance.update(id, data);
  }

  static async deleteStudent(id: string) {
    const instance = new StudentServices();
    await instance.delete(id);
  }

  static async paginate(page: number, limit: number) {
    const instance = new StudentServices();
    return await instance.paginate(page, limit);
  }

  static async search(search: string, page: number = 1, limit?: number) {
    const instance = new StudentServices();
    return await instance.search(search, { page, limit });
  }

  static async countSearched(search: string) {
    const instance = new StudentServices();
    return await instance.searchCount(search);
  }

  static async paginateSearched(page: number, limit: number, search: string) {
    const instance = new StudentServices();
    return await instance.paginateSearch(search, page, limit);
  }

  static async deleteMany(ids: string[]) {
    const instance = new StudentServices();
    return await instance.deleteMany(ids);
  }

  static async getByClass(classId: string) {
    const instance = new StudentServices();
    return await instance.getByClass(classId);
  }

  static async getByGuardian(guardianId: string) {
    const instance = new StudentServices();
    return await instance.getByGuardian(guardianId);
  }
}
