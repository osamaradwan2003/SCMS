// checkLogin middleware
import { Response, NextFunction } from "express";
import { verifyToken } from "@utils/index";
import { RequestWithUser } from "@/@types/auth";

export function checkLogin(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["authorization"]?.split("Bearer ")[1];
  if (!token) {
    res.status(401).send({
      message: "Unauthorized",
    });
    return;
  }
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send({
      message: "Unauthorized",
    });
  }
}
