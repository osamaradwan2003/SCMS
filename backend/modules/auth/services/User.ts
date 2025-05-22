import { hashPassword } from "@utils/password";
import { prisma } from "@db/client";

export default class UserServices {
  // create user for db
  static async createUser(
    name: string,
    username: string,
    password: string,
    email: string,
    phone: string
  ) {
    let user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (user) throw new Error("User already exists");
    //create user
    user = await prisma.user.create({
      data: {
        name,
        username,
        password: hashPassword(password),
        email,
        phone,
      },
    });
    //remove password and return user using object destructuring
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  //findby username
  static async findByUsername(username: string) {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) throw new Error("User not found");
    return user;
  }

  //findby id
  static async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) throw new Error("User not found");
    return user;
  }

  findByFilter(filter: any) {
    return prisma.user.findMany({
      where: filter,
    });
  }

  async allUser() {
    //return user without password
    return await prisma.user.findMany({ omit: { password: true } });
  }

  //updaete user
  async updateUser(id: string, data: any) {
    return await prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  //delete user
  async deleteUser(id: string) {
    return await prisma.user.delete({
      where: {
        id,
      },
    });
  }

  //paginate
  async paginate(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const users = await prisma.user.findMany({
      omit: { password: true },
      skip,
      take: limit,
    });
    const total = await prisma.user.count();
    const totalPages = Math.ceil(total / limit);
    return {
      data: users,
      total,
      totalPages,
      currentPage: page,
    };
  }

  //search
  async search(search: string, page: number = 0, limit?: number) {
    return await prisma.user.findMany({
      omit: { password: true },
      where: {
        OR: [
          {
            name: {
              contains: search,
            },
          },
          {
            username: {
              contains: search,
            },
          },
          {
            email: {
              contains: search,
            },
          },
          {
            phone: {
              contains: search,
            },
          },
        ],
      },
      skip: (page - 1) * (limit || 0),
      take: limit,
    });
  }

  //search count searched
  async countSearched(search: string) {
    return await prisma.user.count({
      where: {
        OR: [
          {
            name: {
              contains: search,
            },
          },
          {
            username: {
              contains: search,
            },
          },
          {
            email: {
              contains: search,
            },
          },
          {
            phone: {
              contains: search,
            },
          },
        ],
      },
    });
  }

  //paginate searched
  async paginateSearched(page: number, limit: number, search: string) {
    const skip = (page - 1) * limit;
    const users = this.search(search, page, limit);
    const total = await this.countSearched(search);
    const totalPages = Math.ceil(total / limit);
    return {
      data: users,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // deletemany
  async deleteMany(ids: string[]) {
    return await prisma.user.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
