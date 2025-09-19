import { NextFunction, Response } from "express";
import { prisma } from "@/db/client";
import { RequestWithUser } from "@/@types/auth";

// Allow only users who have the 'superadmin' role
export async function superadminOnly(req: RequestWithUser, res: Response, next: NextFunction) {
  try {
    if (!req.user?.id) {
      res.status(401).send({ message: "Unauthorized" });
      return;
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { roles: { select: { name: true } } },
    });
    if (!user) {
      res.status(401).send({ message: "Unauthorized" });
      return;
    }
    const isSuperadmin = user.roles.some((r) => r.name.toLowerCase() === "superadmin");
    if (!isSuperadmin) {
      res.status(403).send({ message: "Forbidden: superadmin only" });
      return;
    }
    next();
  } catch (e) {
    res.status(500).send({ message: "Authorization check failed", error: (e as Error).message });
  }
}
