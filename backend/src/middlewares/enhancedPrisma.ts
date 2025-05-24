import { Request, Response, NextFunction } from "express";
import { enhance } from "@zenstackhq/runtime";
import prisma from "../lib/prisma";

export async function zenstackMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    req.db = enhance(prisma, { user: undefined });
    return next();
  }
  req.db = enhance(prisma, { user: req.user });
  next();
}
