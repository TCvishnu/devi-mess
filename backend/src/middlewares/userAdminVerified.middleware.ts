import { NextFunction, Request, Response } from "express";
import { User } from "@prisma/client";

export const userAdminVerified = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as User;

  if (!user.adminVerified) {
    res.status(403).json({ error: "Forbidden: admin verification required." });
    return;
  }

  next();
};
