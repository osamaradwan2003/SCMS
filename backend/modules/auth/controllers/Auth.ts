// user login controller
import { Request, Response } from "express";
import AuthServices from "../services/auth";
import { RequestWithUser } from "@/@types/auth";
export default class AuthController {
  //login
  static async login(req: Request, res: Response) {
    const { username, password } = req.body;
    try {
      const result = await AuthServices.login(username, password);
      res.send(result);
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }
  //logout
  static async logout(_: Request, res: Response) {
    try {
      const result = await AuthServices.logout();
      res.send(result);
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }
  //me
  static async me(req: RequestWithUser, res: Response) {
    try {
      const result = await AuthServices.me(req.user.id);
      res.send({
        ...result,
        token: req.headers.authorization?.split("Bearer ")[1],
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // change password (first login or normal)
  static async changePassword(req: RequestWithUser, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body as { currentPassword: string; newPassword: string };
      const result = await AuthServices.changePassword(req.user.id, currentPassword, newPassword);
      res.send(result);
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // update current user's profile
  static async updateProfile(req: RequestWithUser, res: Response) {
    try {
      const { name, username, email, phone, image } = req.body as {
        name?: string;
        username?: string;
        email?: string;
        phone?: string;
        image?: string;
      };
      const result = await AuthServices.updateProfile(req.user.id, {
        name,
        username,
        email,
        phone,
        image,
      });
      res.send(result);
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }
}
