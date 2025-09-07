import { BaseService, ValidationHelpers, ValidationError } from "../index";

// Define your data interfaces
interface ExampleCreateData {
  name: string;
  email?: string;
  description?: string;
}

interface ExampleUpdateData {
  name?: string;
  email?: string;
  description?: string;
}

export class ExampleService extends BaseService<any, ExampleCreateData, ExampleUpdateData> {
  // Required abstract properties
  protected modelName = "example"; // Replace with your Prisma model name
  protected searchFields = ["name", "email", "description"]; // Fields to search in
  
  // Optional configurations
  protected defaultIncludes = {
    // Define relationships to include by default
    // relatedModel: true,
    // user: {
    //   select: {
    //     id: true,
    //     name: true,
    //   },
    // },
  };
  
  protected defaultOrderBy = { created_at: "desc" };

  // Required validation methods
  protected validateCreateData(data: ExampleCreateData): void {
    // Validate required fields
    ValidationHelpers.validateRequired(data, ["name"]);
    
    // Validate field lengths
    ValidationHelpers.validateLength(data.name, 2, 100, "Name");
    
    // Validate email if provided
    if (data.email && !ValidationHelpers.validateEmail(data.email)) {
      throw new ValidationError("Invalid email format");
    }
    
    // Custom validation logic
    if (data.description) {
      ValidationHelpers.validateLength(data.description, 0, 500, "Description");
    }
  }

  protected validateUpdateData(data: ExampleUpdateData): void {
    // Validate fields only if they are provided
    if (data.name) {
      ValidationHelpers.validateLength(data.name, 2, 100, "Name");
    }
    
    if (data.email && !ValidationHelpers.validateEmail(data.email)) {
      throw new ValidationError("Invalid email format");
    }
    
    if (data.description) {
      ValidationHelpers.validateLength(data.description, 0, 500, "Description");
    }
  }

  // Optional: Custom validation before delete
  protected async beforeDelete(id: string): Promise<void> {
    // Check for related records that would prevent deletion
    // const relatedRecords = await this.prisma.relatedModel.findMany({
    //   where: { exampleId: id },
    // });
    
    // if (relatedRecords.length > 0) {
    //   throw new Error("Cannot delete example with related records");
    // }
  }

  // Custom methods specific to this service
  async findByEmail(email: string) {
    return await this.getModel().findMany({
      where: { email },
      include: this.defaultIncludes,
    });
  }

  async findActive() {
    return await this.getModel().findMany({
      where: { isActive: true },
      include: this.defaultIncludes,
      orderBy: this.defaultOrderBy,
    });
  }

  // Static methods for backward compatibility (if needed)
  static async createExample(data: ExampleCreateData, userId?: string) {
    const instance = new ExampleService();
    return await instance.create(data, userId);
  }

  static async findById(id: string) {
    const instance = new ExampleService();
    return await instance.findById(id);
  }

  static async updateExample(id: string, data: ExampleUpdateData) {
    const instance = new ExampleService();
    return await instance.update(id, data);
  }

  static async deleteExample(id: string) {
    const instance = new ExampleService();
    await instance.delete(id);
  }
}
