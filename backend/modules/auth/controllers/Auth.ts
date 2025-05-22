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
  static async logout(req: Request, res: Response) {
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
}
