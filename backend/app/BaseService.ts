import { PrismaClient } from "@prisma/client";
import { prisma } from "@db/client";

export interface PaginationResult<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface SearchOptions {
  page?: number;
  limit?: number;
  orderBy?: Record<string, any>;
}

export abstract class BaseService<T = any, CreateData = any, UpdateData = any> {
  protected prisma: PrismaClient;
  protected abstract modelName: string;
  protected abstract searchFields: string[];
  protected abstract defaultIncludes?: Record<string, any>;
  protected abstract defaultOrderBy?: Record<string, any>;

  constructor() {
    this.prisma = prisma;
  }

  // Abstract methods that must be implemented by child classes
  protected abstract validateCreateData(data: CreateData): Promise<void> | void;
  protected abstract validateUpdateData(data: UpdateData, id?: string): Promise<void> | void;
  protected abstract beforeDelete?(id: string): Promise<void>;

  // Generic CRUD operations
  async create(data: CreateData, userId?: string): Promise<T> {
    await this.validateCreateData(data);
    
    const createData = userId ? { ...data, userId } : data;
    
    return await (this.prisma as any)[this.modelName].create({
      data: createData,
      include: this.defaultIncludes,
    });
  }

  async findById(id: string): Promise<T> {
    const record = await (this.prisma as any)[this.modelName].findUnique({
      where: { id },
      include: this.defaultIncludes,
    });
    
    if (!record) {
      throw new Error(`${this.modelName} not found`);
    }
    
    return record;
  }

  async findAll(): Promise<T[]> {
    return await (this.prisma as any)[this.modelName].findMany({
      include: this.defaultIncludes,
      orderBy: this.defaultOrderBy || { created_at: "desc" },
    });
  }

  async update(id: string, data: UpdateData): Promise<T> {
    await this.validateUpdateData(data, id);
    
    return await (this.prisma as any)[this.modelName].update({
      where: { id },
      data,
      include: this.defaultIncludes,
    });
  }

  async delete(id: string): Promise<void> {
    // Check if record exists
    await this.findById(id);
    
    // Run custom validation before delete
    if (this.beforeDelete) {
      await this.beforeDelete(id);
    }
    
    await (this.prisma as any)[this.modelName].delete({
      where: { id },
    });
  }

  async deleteMany(ids: string[]): Promise<{ count: number }> {
    // Validate all records exist and can be deleted
    for (const id of ids) {
      if (this.beforeDelete) {
        await this.beforeDelete(id);
      }
    }
    
    return await (this.prisma as any)[this.modelName].deleteMany({
      where: { id: { in: ids } },
    });
  }

  // Pagination
  async paginate(page: number = 1, limit: number = 10): Promise<PaginationResult<T>> {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      (this.prisma as any)[this.modelName].findMany({
        skip,
        take: limit,
        include: this.defaultIncludes,
        orderBy: this.defaultOrderBy || { created_at: "desc" },
      }),
      (this.prisma as any)[this.modelName].count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // Search functionality
  async search(searchTerm: string, options: SearchOptions = {}): Promise<T[]> {
    const { page = 1, limit, orderBy } = options;
    
    const whereClause = {
      OR: this.searchFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive" as const,
        },
      })),
    };

    const queryOptions: any = {
      where: whereClause,
      include: this.defaultIncludes,
      orderBy: orderBy || this.defaultOrderBy || { created_at: "desc" },
    };

    if (limit) {
      queryOptions.skip = (page - 1) * limit;
      queryOptions.take = limit;
    }

    return await (this.prisma as any)[this.modelName].findMany(queryOptions);
  }

  async searchCount(searchTerm: string): Promise<number> {
    const whereClause = {
      OR: this.searchFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive" as const,
        },
      })),
    };

    return await (this.prisma as any)[this.modelName].count({
      where: whereClause,
    });
  }

  async paginateSearch(
    searchTerm: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginationResult<T>> {
    const [data, total] = await Promise.all([
      this.search(searchTerm, { page, limit }),
      this.searchCount(searchTerm),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // Utility methods
  async exists(id: string): Promise<boolean> {
    const record = await (this.prisma as any)[this.modelName].findUnique({
      where: { id },
      select: { id: true },
    });
    return !!record;
  }

  async count(): Promise<number> {
    return await (this.prisma as any)[this.modelName].count();
  }

  // Custom query builder for complex operations
  protected getModel() {
    return (this.prisma as any)[this.modelName];
  }
}
