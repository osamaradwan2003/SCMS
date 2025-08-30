import { comparePassword, generateToken } from "@utils/index";
import UserServices from "./User";

export default class AuthServices {
  //login user
  static async login(username: string, password: string) {
    const user = await UserServices.findByUsername(username);
    if (!user) throw new Error("User not found");
    if (!comparePassword(password, user.password))
      throw new Error("Invalid password");
    const token = generateToken({ id: user.id });
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        image: user.image,
      },
      message: "Login successful",
      success: true,
    };
  }
  //return user by token
  static async me(userID: any) {
    const user = await UserServices.findById(userID);
    if (!user) throw new Error("User not found");
    return {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        image: user.image,
      },
      message: "loged in",
      success: true,
    };
  }
  //logout
  static async logout() {
    return {
      message: "Logout successful",
    };
  }
}
