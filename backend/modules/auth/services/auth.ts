import { comparePassword, generateToken } from "@utils/index";
import UserServices from "./User";
import { prisma } from "@/db/client";

export default class AuthServices {
  //login user
  static async login(username: string, password: string) {
    const user = await UserServices.findByUsername(username);
    if (!user) throw new Error("User not found");
    if (!comparePassword(password, user.password))
      throw new Error("Invalid password");
    const token = generateToken({ id: user.id });
    // load roles + rolePermissions + userPermissions for UI
    const rich = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        roles: { include: { rolePermissions: true } },
        userPermissions: true,
      },
    });
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        image: user.image,
        mustChangePassword: (user as any).mustChangePassword ?? true,
        firstLogin: (user as any).firstLogin ?? true,
        role: (user as any).role,
        roles: rich?.roles || [],
        userPermissions: rich?.userPermissions || [],
      },
      message: "Login successful",
      success: true,
    };
  }
  // update current user's profile
  static async updateProfile(
    userID: string,
    payload: {
      name?: string;
      username?: string;
      email?: string;
      phone?: string;
      image?: string;
    }
  ) {
    const user = await UserServices.findById(userID);
    if (!user) throw new Error("User not found");

    if (payload.username && payload.username !== user.username) {
      const exists = await prisma.user.findUnique({
        where: { username: payload.username },
      });
      if (exists && exists.id !== userID)
        throw new Error("Username already taken");
    }

    const updated = await prisma.user.update({
      where: { id: userID },
      data: payload,
    });
    const rich = await prisma.user.findUnique({
      where: { id: userID },
      include: {
        roles: { include: { rolePermissions: true } },
        userPermissions: true,
      },
    });
    return {
      user: {
        id: updated.id,
        name: updated.name,
        username: updated.username,
        email: updated.email,
        phone: (updated as any).phone,
        image: updated.image,
        firstLogin: (updated as any).firstLogin,
        mustChangePassword: (updated as any).mustChangePassword,
        role: (updated as any).role,
        roles: rich?.roles || [],
        userPermissions: rich?.userPermissions || [],
      },
      success: true,
      message: "Profile updated successfully",
    };
  }
  //return user by token
  static async me(userID: any) {
    const user = await UserServices.findById(userID);
    const rich = await prisma.user.findUnique({
      where: { id: userID },
      include: {
        roles: { include: { rolePermissions: true } },
        userPermissions: true,
      },
    });
    if (!user) throw new Error("User not found");
    return {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        image: user.image,
        firstLogin: (user as any).firstLogin ?? true,
        role: (user as any).role,
        roles: rich?.roles || [],
        userPermissions: rich?.userPermissions || [],
      },
      message: "loged in",
      success: true,
    };
  }
  // change password (first login or normal)
  static async changePassword(
    userID: string,
    currentPassword: string,
    newPassword: string
  ) {
    const user = await UserServices.findById(userID);
    if (!user) throw new Error("User not found");
    // Verify current password
    if (!comparePassword(currentPassword, user.password)) {
      throw new Error("Invalid current password");
    }
    // Update password and clear mustChangePassword
    const { hashPassword } = await import("@/utils/password");
    await (
      await import("@/db/client")
    ).prisma.user.update({
      where: { id: userID },
      data: {
        password: hashPassword(newPassword),
        firstLogin: false,
      },
    });
    return { success: true, message: "Password changed successfully" };
  }
  //logout
  static async logout() {
    return {
      message: "Logout successful",
    };
  }
}
