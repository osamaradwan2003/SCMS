import { BaseService, ValidationHelpers, ValidationError } from "@/app";

interface GuardianCreateData {
  name: string;
  phone: string;
  relationDegree: string;
  profile_photo?: string;
  documents?: string;
}

interface GuardianUpdateData {
  name?: string;
  phone?: string;
  relationDegree?: string;
  profile_photo?: string;
  documents?: string;
}

export default class GuardianServices extends BaseService<
  any,
  GuardianCreateData,
  GuardianUpdateData
> {
  protected modelName = "guardian";
  protected searchFields = ["name", "phone", "relationDegree"];
  protected defaultIncludes = {
    Student: true,
    created_by: {
      select: {
        id: true,
        name: true,
        username: true,
      },
    },
  };
  protected defaultOrderBy = { created_at: "desc" };

  protected validateCreateData(data: GuardianCreateData): void {
    ValidationHelpers.validateRequired(data, [
      "name",
      "phone",
      "relationDegree",
    ]);

    if (!ValidationHelpers.validatePhone(data.phone)) {
      throw new ValidationError("Invalid phone number format");
    }

    ValidationHelpers.validateLength(data.name, 2, 100, "Name");
    ValidationHelpers.validateLength(
      data.relationDegree,
      2,
      50,
      "Relation degree"
    );
  }

  protected validateUpdateData(data: GuardianUpdateData): void {
    if (data.phone && !ValidationHelpers.validatePhone(data.phone)) {
      throw new ValidationError("Invalid phone number format");
    }

    if (data.name) {
      ValidationHelpers.validateLength(data.name, 2, 100, "Name");
    }

    if (data.relationDegree) {
      ValidationHelpers.validateLength(
        data.relationDegree,
        2,
        50,
        "Relation degree"
      );
    }
  }

  protected async beforeDelete(id: string): Promise<void> {
    const guardian = await this.prisma.guardian.findUnique({
      where: { id },
      include: { Student: true },
    });

    if (!guardian) {
      throw new Error("Guardian not found");
    }

    if (guardian.Student.length > 0) {
      throw new Error("Cannot delete guardian with associated students");
    }
  }

  // Legacy methods for backward compatibility - delegate to base class
  static async createGuardian(
    name: string,
    phone: string,
    relationDegree: string,
    userId: string
  ) {
    const instance = new GuardianServices();
    return await instance.create({ name, phone, relationDegree }, userId);
  }

  static async findById(id: string) {
    const instance = new GuardianServices();
    return await instance.findById(id);
  }

  static async getAllGuardians() {
    const instance = new GuardianServices();
    return await instance.findAll();
  }

  static async updateGuardian(
    id: string,
    data: {
      name?: string;
      phone?: string;
      relationDegree?: string;
    }
  ) {
    const instance = new GuardianServices();
    return await instance.update(id, data);
  }

  static async deleteGuardian(id: string) {
    const instance = new GuardianServices();
    await instance.delete(id);
  }

  static async paginate(page: number, limit: number) {
    const instance = new GuardianServices();
    return await instance.paginate(page, limit);
  }

  static async search(search: string, page: number = 1, limit?: number) {
    const instance = new GuardianServices();
    return await instance.search(search, { page, limit });
  }

  static async countSearched(search: string) {
    const instance = new GuardianServices();
    return await instance.searchCount(search);
  }

  static async paginateSearched(page: number, limit: number, search: string) {
    const instance = new GuardianServices();
    return await instance.paginateSearch(search, page, limit);
  }

  static async deleteMany(ids: string[]) {
    const instance = new GuardianServices();
    return await instance.deleteMany(ids);
  }

  // Custom method for finding by phone
  async findByPhone(phone: string) {
    return await this.prisma.guardian.findMany({
      where: { phone },
      include: this.defaultIncludes,
    });
  }

  static async findByPhone(phone: string) {
    const instance = new GuardianServices();
    return await instance.findByPhone(phone);
  }
}
