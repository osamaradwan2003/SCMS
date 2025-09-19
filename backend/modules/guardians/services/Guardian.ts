import { BaseService, ValidationHelpers } from "@/app";
import { prisma } from "@/db/client";
import { provisionUserForEntity } from "@/modules/shared/UserProvisioning";

interface GuardianCreateData {
  name: string;
  phone: string;
  email?: string;
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
  protected searchFields = ["name", "phone"];
  protected defaultIncludes = {
    Student: { include: { class: true } },
    created_by: {
      select: {
        id: true,
        name: true,
        username: true,
      },
    },
    accountUser: {
      select: {
        id: true,
        username: true,
        name: true,
      },
    },
  };
  protected defaultOrderBy = { created_at: "desc" };

  protected async validateCreateData(data: GuardianCreateData): Promise<void> {
    // Use schema-based validation
    await ValidationHelpers.validateModelData(
      data,
      "Guardian",
      undefined,
      false
    );

    // Additional custom validations
    ValidationHelpers.validateLength(data.name, 2, 100, "name");

    // Validate phone format and uniqueness
    ValidationHelpers.validatePhone(data.phone, "phone");
    await ValidationHelpers.validateUnique(data.phone, "Guardian", "phone");

    // Validate email if provided
    if (data.email) {
      ValidationHelpers.validateEmail(data.email, "email");
    }

    // Throw if any validation errors
    ValidationHelpers.throwIfErrors();
  }

  // Override create to auto-provision a login user for the guardian
  async create(data: GuardianCreateData, userId?: string): Promise<any> {
    await this.validateCreateData(data);

    // Create account user with role 'parent'
    const { user: accountUser, credentials } = await provisionUserForEntity({
      name: data.name,
      email: data.email,
      phone: data.phone,
      roleName: "parent",
    });

    const createData = {
      ...data,
      accountUserId: accountUser.id,
      ...(userId ? { userId } : {}),
    } as any;

    const record = await prisma.guardian.create({
      data: createData,
      include: this.defaultIncludes,
    });

    return Object.assign({}, record, { meta: { credentials } });
  }

  protected async validateUpdateData(
    data: GuardianUpdateData,
    id?: string
  ): Promise<void> {
    // Use schema-based validation for updates
    await ValidationHelpers.validateModelData(data, "Guardian", id, true);

    // Additional custom validations
    if (data.name) {
      ValidationHelpers.validateLength(data.name, 2, 100, "name");
    }

    if (data.relationDegree) {
      ValidationHelpers.validateLength(
        data.relationDegree,
        2,
        50,
        "relationDegree"
      );
    }

    // Validate phone format and uniqueness if provided
    if (data.phone) {
      ValidationHelpers.validatePhone(data.phone, "phone");
      await ValidationHelpers.validateUnique(
        data.phone,
        "Guardian",
        "phone",
        id
      );
    }

    // Throw if any validation errors
    ValidationHelpers.throwIfErrors();
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
  static async createGuardian(name: string, phone: string, userId: string) {
    const instance = new GuardianServices();
    return await instance.create({ name, phone }, userId);
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
